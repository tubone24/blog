import React, { useState } from "react";

type UnlockState = "locked" | "connecting" | "paying" | "error";

interface PaywallProps {
  slug: string;
  priceUsd?: number;
}

const FUNCTION_URL = "/.netlify/functions/premium-content";

// Blog design tokens
const colors = {
  primary: "#1bd77f",
  primaryDark: "#15a863",
  primaryDeeper: "#288378",
  iconBg: "#034378",
  surface: "#f0f7f1",
  bg: "#d5ffd7",
  text: "#212529",
  textSecondary: "#555",
  textMuted: "#767676",
  border: "#d7d7d7",
  pink: "#ff7e79",
  pinkDark: "#ff4d46",
  pinkLight: "#ffe8e7",
  white: "#fff",
} as const;

function toErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "object" && e !== null) {
    const obj = e as Record<string, unknown>;
    if (obj.code === 4001) return "署名をキャンセルしました";
    if (typeof obj.message === "string" && obj.message) return obj.message;
  }
  if (typeof e === "string") return e;
  return "予期しないエラーが発生しました";
}

const NETWORK_CHAIN_ID = 84532; // base-sepolia

declare global {
  interface Window {
    ethereum?: {
      request: (args: {
        method: string;
        params?: unknown[];
      }) => Promise<unknown>;
    };
  }
}

interface AcceptRequirement {
  scheme: string;
  network: string;
  asset: string;
  amount?: string;
  maxAmountRequired?: string;
  payTo: string;
  maxTimeoutSeconds?: number;
  extra?: { name?: string; version?: string };
  resource?: string;
  description?: string;
  mimeType?: string;
}

async function buildPaymentSignature(
  accept: AcceptRequirement,
  from: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const validBefore = now + (accept.maxTimeoutSeconds ?? 300);
  const value = accept.amount ?? accept.maxAmountRequired ?? "0";
  const domainName = accept.extra?.name ?? "USD Coin";
  const domainVersion = accept.extra?.version ?? "2";

  const nonceBytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce =
    "0x" +
    Array.from(nonceBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const authorization = {
    from,
    to: accept.payTo,
    value,
    validAfter: "0",
    validBefore: String(validBefore),
    nonce,
  };

  const typedData = JSON.stringify({
    types: {
      EIP712Domain: [
        { name: "name", type: "string" },
        { name: "version", type: "string" },
        { name: "chainId", type: "uint256" },
        { name: "verifyingContract", type: "address" },
      ],
      TransferWithAuthorization: [
        { name: "from", type: "address" },
        { name: "to", type: "address" },
        { name: "value", type: "uint256" },
        { name: "validAfter", type: "uint256" },
        { name: "validBefore", type: "uint256" },
        { name: "nonce", type: "bytes32" },
      ],
    },
    domain: {
      name: domainName,
      version: domainVersion,
      chainId: NETWORK_CHAIN_ID,
      verifyingContract: accept.asset,
    },
    primaryType: "TransferWithAuthorization",
    message: authorization,
  });

  const signature = (await window.ethereum!.request({
    method: "eth_signTypedData_v4",
    params: [from, typedData],
  })) as string;

  const paymentPayload = {
    x402Version: 2,
    resource: {
      url: accept.resource ?? "",
      description: accept.description ?? "",
      mimeType: accept.mimeType ?? "application/json",
    },
    accepted: {
      scheme: accept.scheme,
      network: accept.network,
      asset: accept.asset,
      amount: value,
      payTo: accept.payTo,
      maxTimeoutSeconds: accept.maxTimeoutSeconds ?? 300,
      extra: accept.extra ?? { name: domainName, version: domainVersion },
    },
    payload: { signature, authorization },
  };

  return btoa(JSON.stringify(paymentPayload));
}

async function fetchWithX402(url: string): Promise<{ password: string }> {
  const res1 = await fetch(url, { method: "POST" });

  if (res1.ok) {
    return res1.json();
  }

  if (res1.status !== 402) {
    let msg = `HTTP ${res1.status}`;
    try {
      const body = await res1.json();
      if (body.error) msg = body.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  const b64 = res1.headers.get("payment-required");
  if (!b64) {
    throw new Error(
      "サーバーから支払い情報が取得できませんでした (PAYMENT-REQUIRED ヘッダーなし)",
    );
  }

  let requirements: { accepts?: AcceptRequirement[] };
  try {
    requirements = JSON.parse(atob(b64));
  } catch {
    throw new Error("支払い情報の解析に失敗しました");
  }

  const accept = requirements.accepts?.[0];
  if (!accept) {
    throw new Error("対応する支払い方法がありません");
  }

  if (!window.ethereum) {
    throw new Error(
      "MetaMask などの Web3 ウォレットが必要です。インストール後に再試行してください。",
    );
  }

  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  const from = accounts[0];

  const paymentSignature = await buildPaymentSignature(accept, from);

  const res2 = await fetch(url, {
    method: "POST",
    headers: { "PAYMENT-SIGNATURE": paymentSignature },
  });

  if (!res2.ok) {
    let msg = `決済失敗 (HTTP ${res2.status})`;
    try {
      const body = await res2.json();
      if (body.error) msg = body.error;
    } catch {
      // ignore
    }
    throw new Error(msg);
  }

  return res2.json();
}

// Lock SVG icon matching blog's teal palette
function LockIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 24 24"
      fill="none"
      stroke={colors.primaryDeeper}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", margin: "0 auto 0.75rem" }}
      aria-hidden="true"
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

export default function Paywall({ slug, priceUsd = 0.05 }: PaywallProps) {
  const [state, setState] = useState<UnlockState>("locked");
  const [errorMsg, setErrorMsg] = useState("");

  const hasMetaMask = typeof window !== "undefined" && !!window.ethereum;

  async function handleUnlock() {
    setState("connecting");
    setErrorMsg("");
    try {
      const url = `${FUNCTION_URL}?slug=${encodeURIComponent(slug)}`;
      setState("paying");
      const { password } = await fetchWithX402(url);
      window.location.href = `/${slug}/encrypted.html#${password}`;
    } catch (e) {
      const msg = toErrorMessage(e);
      setErrorMsg(msg);
      setState("error");
    }
  }

  return (
    <div
      style={{
        background: colors.white,
        borderRadius: "12px",
        border: `1px solid ${colors.border}`,
        borderTop: `4px solid ${colors.primary}`,
        padding: "1.75rem 2rem",
        margin: "2rem 0",
        color: colors.text,
        textAlign: "center",
      }}
    >
      <LockIcon />

      <p
        style={{
          color: colors.iconBg,
          fontSize: "1.15rem",
          fontWeight: 700,
          marginBottom: "0.5rem",
          marginTop: 0,
        }}
      >
        プレミアムコンテンツ
      </p>

      <p
        style={{
          color: colors.textSecondary,
          fontSize: "0.875rem",
          marginBottom: "1.25rem",
          lineHeight: 1.6,
        }}
      >
        この続きを読むには x402 プロトコルによる支払いが必要です。
      </p>

      {/* Price badge */}
      <div
        style={{
          display: "inline-flex",
          flexDirection: "column",
          alignItems: "center",
          background: colors.surface,
          border: `1px solid ${colors.primary}`,
          borderRadius: "8px",
          padding: "0.6rem 1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <span
          style={{
            color: colors.primaryDeeper,
            fontSize: "1.4rem",
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          ${priceUsd.toFixed(2)} USDC
        </span>
        <span
          style={{
            color: colors.textMuted,
            fontSize: "0.7rem",
            marginTop: "2px",
          }}
        >
          Base Sepolia テストネット
        </span>
      </div>

      {/* Locked state */}
      {state === "locked" && (
        <div>
          <button
            onClick={handleUnlock}
            style={{
              display: "inline-block",
              minWidth: "180px",
              padding: "0.55rem 1.5rem",
              background: colors.primary,
              color: colors.white,
              border: "none",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = colors.primaryDark)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = colors.primary)
            }
          >
            記事をアンロックする
          </button>
          {!hasMetaMask && (
            <p
              style={{
                color: colors.textMuted,
                fontSize: "0.75rem",
                marginTop: "0.75rem",
                marginBottom: 0,
              }}
            >
              ブラウザで読む場合は MetaMask が必要です。
              <br />
              AI エージェントは x402 プロトコルで自動決済できます。
            </p>
          )}
        </div>
      )}

      {/* Connecting / paying state */}
      {(state === "connecting" || state === "paying") && (
        <div>
          <div
            className="spinner-border"
            role="status"
            style={{
              width: "1.5rem",
              height: "1.5rem",
              color: colors.primary,
            }}
          >
            <span className="visually-hidden">処理中...</span>
          </div>
          <p
            style={{
              color: colors.textSecondary,
              marginTop: "0.75rem",
              marginBottom: 0,
              fontSize: "0.875rem",
            }}
          >
            {state === "connecting"
              ? "ウォレットに接続中..."
              : "MetaMask で署名を確認してください..."}
          </p>
        </div>
      )}

      {/* Error state */}
      {state === "error" && (
        <div>
          <div
            style={{
              background: colors.pinkLight,
              border: `1px solid ${colors.pink}`,
              borderRadius: "8px",
              color: colors.pinkDark,
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
              textAlign: "left",
            }}
          >
            {errorMsg}
          </div>
          <button
            onClick={() => setState("locked")}
            style={{
              padding: "0.4rem 1.25rem",
              background: "transparent",
              color: colors.primaryDeeper,
              border: `1px solid ${colors.primaryDeeper}`,
              borderRadius: "6px",
              fontSize: "0.875rem",
              cursor: "pointer",
            }}
          >
            再試行
          </button>
        </div>
      )}

      {/* Footer */}
      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: `1px solid ${colors.border}`,
        }}
      >
        <p style={{ color: colors.textMuted, fontSize: "0.7rem", margin: 0 }}>
          Powered by{" "}
          <a
            href="https://x402.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: colors.primaryDeeper }}
          >
            x402 protocol
          </a>{" "}
          — HTTP 402 Payment Required
        </p>
      </div>
    </div>
  );
}
