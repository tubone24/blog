// Skill CLI 用の薄ラッパー。実装本体は functions/src/utils/x402-paywall.js に集約。
//
// この層が存在する理由:
//   - CLI からは TypeScript の named export で使えると DX が良い
//   - 共通実装は MCP サーバー (Netlify Function) と Skill CLI の両方から参照される
import "dotenv/config";

// @ts-expect-error -- JS module without bundled types
import * as paywall from "../../../../functions/src/utils/x402-paywall.js";

export interface PaywallEndpointConfig {
  blogBaseUrl?: string;
}

export interface UnlockSuccess {
  slug: string;
  password: string;
}

export interface DecryptedArticle {
  slug: string;
  password: string;
  encryptedUrl: string;
  contentHtml: string;
}

export const DEFAULT_BLOG_BASE_URL: string = paywall.DEFAULT_BLOG_BASE_URL;

export const unlockPremium: (
  slug: string,
  config?: PaywallEndpointConfig,
) => Promise<UnlockSuccess> = paywall.unlockPremium;

export const decryptEncryptedHtml: (
  slug: string,
  password: string,
  config?: PaywallEndpointConfig,
) => Promise<DecryptedArticle> = paywall.decryptEncryptedHtml;

export const getPremiumContent: (
  slug: string,
  config?: PaywallEndpointConfig,
) => Promise<DecryptedArticle> = paywall.getPremiumContent;
