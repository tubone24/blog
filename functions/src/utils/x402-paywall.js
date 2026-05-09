// x402 ペイウォール決済 + pagecrypt 復号 の共通ライブラリ。
//
// 利用先:
//   - functions/src/mcp-blog-server.js (リモートMCPサーバー)
//   - .claude/skills/get-premium-content/scripts/lib.ts (Skill CLI)
//
// 重要な前提:
//   このモジュールが Netlify Function 上で動作する場合、process.env.EVM_PRIVATE_KEY を
//   サーバー側で保持する **カストディアル構成** になる。Base Sepolia (テストネット) 専用。
//   メインネットへの転用は禁止。
import { wrapFetchWithPayment } from "@x402/fetch";
import { x402Client } from "@x402/core/client";
import { registerExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";
import { webcrypto } from "node:crypto";

export const DEFAULT_BLOG_BASE_URL =
  process.env.BLOG_BASE_URL || "https://tubone-project24.xyz";

// pagecrypt v5.x の暗号化レイアウト (node_modules/pagecrypt/core.js より)
const PAGECRYPT_SALT_BYTES = 32;
const PAGECRYPT_IV_BYTES = 16;
const PAGECRYPT_PBKDF2_ITERATIONS = 2_000_000;

/**
 * 環境変数 EVM_PRIVATE_KEY を読み込み、x402決済対応の fetch を返す。
 * @returns {typeof fetch}
 */
function buildFetchWithPayment() {
  const privateKey = process.env.EVM_PRIVATE_KEY;
  if (!privateKey) {
    throw new Error(
      "EVM_PRIVATE_KEY が未設定です。Base Sepolia の USDC を保有する EOA の秘密鍵を設定してください",
    );
  }
  const signer = privateKeyToAccount(/** @type {`0x${string}`} */ (privateKey));
  const client = new x402Client();
  registerExactEvmScheme(client, { signer });
  return wrapFetchWithPayment(fetch, client);
}

/**
 * 指定slugのペイウォール記事を x402 で決済し、復号 password を取得する。
 *
 * 注意: premium-content.js は slug を **querystring** で受け取る (body ではない)。
 *
 * @param {string} slug
 * @param {{ blogBaseUrl?: string }} [config]
 * @returns {Promise<{ slug: string, password: string }>}
 */
export async function unlockPremium(slug, config = {}) {
  if (!slug) throw new Error("slug is required");

  const baseUrl = config.blogBaseUrl ?? DEFAULT_BLOG_BASE_URL;
  const endpoint = `${baseUrl}/.netlify/functions/premium-content?slug=${encodeURIComponent(
    slug,
  )}`;

  const fetchWithPayment = buildFetchWithPayment();
  const response = await fetchWithPayment(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{}",
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(
      `x402 決済失敗 (slug=${slug}, status=${response.status}): ${
        errorBody.error ?? "unknown error"
      }`,
    );
  }

  const data = await response.json();
  if (!data.password) {
    throw new Error(
      `Server response did not include password for slug=${slug}`,
    );
  }

  return { slug, password: data.password };
}

/**
 * encrypted.html を取得し pagecrypt フォーマットを復号する。
 *
 * フォーマット:
 *   <pre class="hidden">{base64}</pre>
 *   base64 -> salt(32) || iv(16) || ciphertext(AES-GCM)
 *   key = PBKDF2-SHA256(password, salt, 2_000_000) -> AES-GCM-256
 *
 * @param {string} slug
 * @param {string} password
 * @param {{ blogBaseUrl?: string }} [config]
 * @returns {Promise<{ slug: string, password: string, encryptedUrl: string, contentHtml: string }>}
 */
export async function decryptEncryptedHtml(slug, password, config = {}) {
  const baseUrl = config.blogBaseUrl ?? DEFAULT_BLOG_BASE_URL;
  const encryptedUrl = `${baseUrl}/${slug}/encrypted.html`;

  const res = await fetch(encryptedUrl);
  if (!res.ok) {
    throw new Error(
      `encrypted.html の取得失敗 (slug=${slug}, status=${res.status})`,
    );
  }
  const html = await res.text();

  const match = html.match(/<pre class="hidden">([^<]+)<\/pre>/);
  if (!match) {
    throw new Error(
      `encrypted.html のペイロード抽出失敗 (slug=${slug}). pagecrypt のバージョンが変わった可能性があります`,
    );
  }
  const payload = new Uint8Array(Buffer.from(match[1].trim(), "base64"));
  if (payload.length <= PAGECRYPT_SALT_BYTES + PAGECRYPT_IV_BYTES) {
    throw new Error(`encrypted payload が短すぎます (slug=${slug})`);
  }

  const salt = payload.slice(0, PAGECRYPT_SALT_BYTES);
  const iv = payload.slice(
    PAGECRYPT_SALT_BYTES,
    PAGECRYPT_SALT_BYTES + PAGECRYPT_IV_BYTES,
  );
  const ciphertext = payload.slice(PAGECRYPT_SALT_BYTES + PAGECRYPT_IV_BYTES);

  const baseKey = await webcrypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  const aesKey = await webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: PAGECRYPT_PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );

  let plaintextBuf;
  try {
    plaintextBuf = await webcrypto.subtle.decrypt(
      { name: "AES-GCM", iv },
      aesKey,
      ciphertext,
    );
  } catch {
    throw new Error(
      `復号失敗 (slug=${slug}). password が不正、または SITE_SECRET 不一致の可能性`,
    );
  }

  return {
    slug,
    password,
    encryptedUrl,
    contentHtml: new TextDecoder().decode(plaintextBuf),
  };
}

/**
 * 単一slugを決済〜復号まで一気通貫で処理する。
 *
 * @param {string} slug
 * @param {{ blogBaseUrl?: string }} [config]
 * @returns {Promise<{ slug: string, password: string, encryptedUrl: string, contentHtml: string }>}
 */
export async function getPremiumContent(slug, config = {}) {
  const { password } = await unlockPremium(slug, config);
  return decryptEncryptedHtml(slug, password, config);
}
