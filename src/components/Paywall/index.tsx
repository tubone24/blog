import React, { useState } from "react";

type UnlockState = "locked" | "connecting" | "paying" | "error";

interface PaywallProps {
  slug: string;
  priceUsd?: number;
}

const FUNCTION_URL = "/.netlify/functions/premium-content";
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

async function buildPaymentSignature(
  accept: {
    payTo: string;
    maxAmountRequired?: string;
    amount?: string;
    maxTimeoutSeconds?: number;
    asset: string;
  },
  from: string,
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const validBefore = now + (accept.maxTimeoutSeconds ?? 300);

  const nonceBytes = crypto.getRandomValues(new Uint8Array(32));
  const nonce =
    "0x" +
    Array.from(nonceBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  const authorization = {
    from,
    to: accept.payTo,
    value: accept.maxAmountRequired ?? accept.amount ?? "0",
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
      name: "USD Coin",
      version: "2",
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

  return btoa(
    JSON.stringify({
      x402Version: 2,
      scheme: "exact",
      network: `eip155:${NETWORK_CHAIN_ID}`,
      payload: { signature, authorization },
    }),
  );
}

async function fetchWithX402(url: string): Promise<{ password: string }> {
  // Initial request — no payment header
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

  // Parse x402 v2 PAYMENT-REQUIRED header
  const b64 = res1.headers.get("payment-required");
  if (!b64) {
    throw new Error(
      "サーバーから支払い情報が取得できませんでした (PAYMENT-REQUIRED ヘッダーなし)",
    );
  }

  let requirements: {
    accepts?: {
      payTo: string;
      maxAmountRequired?: string;
      amount?: string;
      maxTimeoutSeconds?: number;
      asset: string;
    }[];
  };
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

  // Request wallet access
  const accounts = (await window.ethereum.request({
    method: "eth_requestAccounts",
  })) as string[];
  const from = accounts[0];

  // Sign the payment authorization
  const paymentSignature = await buildPaymentSignature(accept, from);

  // Retry with payment signature
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
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(msg);
      setState("error");
    }
  }

  return (
    <div
      className="paywall-container"
      style={{
        background:
          "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: "12px",
        padding: "2rem",
        margin: "2rem 0",
        color: "#fff",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
      <h3 style={{ color: "#e2e8f0", marginBottom: "0.5rem" }}>
        プレミアムコンテンツ
      </h3>
      <p
        style={{ color: "#94a3b8", marginBottom: "1.5rem", fontSize: "0.9rem" }}
      >
        この記事の続きを読むには x402 プロトコルによる支払いが必要です。
      </p>

      <div
        style={{
          background: "rgba(255,255,255,0.05)",
          borderRadius: "8px",
          padding: "1rem",
          marginBottom: "1.5rem",
          display: "inline-block",
        }}
      >
        <div
          style={{ color: "#f1fa8c", fontSize: "1.5rem", fontWeight: "bold" }}
        >
          ${priceUsd.toFixed(2)} USDC
        </div>
        <div style={{ color: "#94a3b8", fontSize: "0.75rem" }}>
          Base Sepolia テストネット
        </div>
      </div>

      {state === "locked" && (
        <div>
          <button
            className="btn btn-primary"
            onClick={handleUnlock}
            style={{ minWidth: "180px", fontWeight: "bold" }}
          >
            {hasMetaMask ? "🔓 記事をアンロックする" : "🔓 Unlock Full Article"}
          </button>
          {!hasMetaMask && (
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.75rem",
                marginTop: "0.75rem",
              }}
            >
              ブラウザで読む場合は MetaMask が必要です。
              <br />
              AI エージェントは x402 プロトコルで自動決済できます。
            </p>
          )}
        </div>
      )}

      {state === "connecting" && (
        <div>
          <div
            className="spinner-border text-primary"
            role="status"
            style={{ width: "1.5rem", height: "1.5rem" }}
          >
            <span className="visually-hidden">Connecting...</span>
          </div>
          <p
            style={{
              color: "#94a3b8",
              marginTop: "0.75rem",
              fontSize: "0.875rem",
            }}
          >
            ウォレットに接続中...
          </p>
        </div>
      )}

      {state === "paying" && (
        <div>
          <div
            className="spinner-border text-warning"
            role="status"
            style={{ width: "1.5rem", height: "1.5rem" }}
          >
            <span className="visually-hidden">Processing...</span>
          </div>
          <p
            style={{
              color: "#94a3b8",
              marginTop: "0.75rem",
              fontSize: "0.875rem",
            }}
          >
            MetaMask で署名を確認してください...
          </p>
        </div>
      )}

      {state === "error" && (
        <div>
          <div
            className="alert"
            style={{
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.4)",
              borderRadius: "8px",
              color: "#fca5a5",
              padding: "0.75rem 1rem",
              marginBottom: "1rem",
              fontSize: "0.875rem",
            }}
          >
            ⚠️ {errorMsg}
          </div>
          <button
            className="btn btn-outline-light btn-sm"
            onClick={() => setState("locked")}
          >
            再試行
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: "1.5rem",
          paddingTop: "1rem",
          borderTop: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <p style={{ color: "#475569", fontSize: "0.7rem", margin: 0 }}>
          Powered by{" "}
          <a
            href="https://x402.org"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#60a5fa" }}
          >
            x402 protocol
          </a>{" "}
          — HTTP 402 Payment Required
        </p>
      </div>
    </div>
  );
}
