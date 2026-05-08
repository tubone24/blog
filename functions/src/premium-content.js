import { createHmac } from "crypto";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: !!process.env.SENTRY_DSN,
});

const FACILITATOR_URL = "https://x402.org/facilitator";
const NETWORK = "eip155:84532"; // base-sepolia (Phase 1)
const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers":
    "Content-Type, PAYMENT-SIGNATURE, payment-signature",
  "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
};

function buildPaymentRequirements(event) {
  const priceUsd = parseFloat(process.env.PREMIUM_PRICE_USD || "0.05");
  const amount = String(Math.round(priceUsd * 1_000_000)); // USDC 6 decimals
  const origin =
    process.env.SITE_URL ||
    `https://${event.headers?.host || "tubone-project24.xyz"}`;

  return {
    scheme: "exact",
    network: NETWORK,
    maxAmountRequired: amount,
    resource: `${origin}/.netlify/functions/premium-content`,
    description: "Premium article decryption password",
    mimeType: "application/json",
    payTo: process.env.WALLET_ADDRESS,
    maxTimeoutSeconds: 300,
    asset: USDC_BASE_SEPOLIA,
  };
}

function json(statusCode, body, extraHeaders = {}) {
  return {
    statusCode,
    headers: { ...CORS, "Content-Type": "application/json", ...extraHeaders },
    body: JSON.stringify(body),
  };
}

export const handler = async (event) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS };
  }

  if (event.httpMethod !== "POST") {
    return json(405, { error: "Method Not Allowed" });
  }

  const paymentSignatureHeader =
    event.headers["payment-signature"] || event.headers["PAYMENT-SIGNATURE"];

  const requirements = buildPaymentRequirements(event);

  // ── No payment header → return 402 with payment requirements ──────────
  if (!paymentSignatureHeader) {
    const paymentRequired = {
      x402Version: 2,
      accepts: [requirements],
      error: null,
    };
    return json(
      402,
      { error: "Payment required" },
      {
        "PAYMENT-REQUIRED": Buffer.from(
          JSON.stringify(paymentRequired),
        ).toString("base64"),
      },
    );
  }

  // ── Parse PAYMENT-SIGNATURE header ────────────────────────────────────
  let paymentPayload;
  try {
    paymentPayload = JSON.parse(
      Buffer.from(paymentSignatureHeader, "base64").toString("utf8"),
    );
  } catch {
    return json(400, { error: "Invalid PAYMENT-SIGNATURE header" });
  }

  // ── Verify with facilitator ───────────────────────────────────────────
  try {
    const verifyBody = {
      x402Version: 2,
      paymentPayload,
      paymentRequirements: requirements,
    };
    console.log(
      "[premium-content] verify request:",
      JSON.stringify(verifyBody),
    );

    const verifyRes = await fetch(`${FACILITATOR_URL}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(verifyBody),
    });

    const verifyText = await verifyRes.text();
    console.log(
      "[premium-content] verify response:",
      verifyRes.status,
      verifyText,
    );

    let verifyData;
    try {
      verifyData = JSON.parse(verifyText);
    } catch {
      verifyData = {};
    }

    if (!verifyRes.ok || !verifyData.isValid) {
      return json(402, {
        error:
          verifyData.invalidReason ||
          verifyData.error ||
          `Verification failed (${verifyRes.status})`,
        debug: verifyData,
      });
    }
  } catch (e) {
    Sentry.captureException(e);
    console.error("[premium-content] facilitator error:", e);
    return json(502, { error: "Facilitator unreachable", message: String(e) });
  }

  // ── Settle (best-effort; non-blocking on error) ───────────────────────
  fetch(`${FACILITATOR_URL}/settle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      x402Version: 2,
      paymentPayload,
      paymentRequirements: requirements,
    }),
  }).catch((e) => Sentry.captureException(e));

  // ── Deliver password ──────────────────────────────────────────────────
  const slug = event.queryStringParameters?.slug;
  if (!slug) {
    return json(400, { error: "slug is required" });
  }
  if (!process.env.SITE_SECRET) {
    return json(500, { error: "Server misconfigured" });
  }

  const password = createHmac("sha256", process.env.SITE_SECRET)
    .update(String(slug))
    .digest("hex");

  return json(200, { password });
};
