import express from "express";
import serverless from "serverless-http";
import { paymentMiddleware, x402ResourceServer } from "@x402/express";
import { ExactEvmScheme } from "@x402/evm";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { createHmac } from "crypto";
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.1,
  enabled: !!process.env.SENTRY_DSN,
});

const WALLET_ADDRESS = process.env.WALLET_ADDRESS;
const SITE_SECRET = process.env.SITE_SECRET;
const PRICE_USD = process.env.PREMIUM_PRICE_USD || "0.05";
const NETWORK = "eip155:84532"; // base-sepolia (Phase 1)

if (!WALLET_ADDRESS) {
  console.warn("[premium-content] WALLET_ADDRESS not set");
}

const facilitatorClient = new HTTPFacilitatorClient({
  url: "https://x402.org/facilitator",
});

const resourceServer = new x402ResourceServer(facilitatorClient).register(
  NETWORK,
  new ExactEvmScheme(),
);

const app = express();
app.use(express.json());

// CORS for browser clients
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, PAYMENT-SIGNATURE, payment-signature",
  );
  res.setHeader(
    "Access-Control-Expose-Headers",
    "PAYMENT-REQUIRED, PAYMENT-RESPONSE",
  );
  if (req.method === "OPTIONS") return res.status(204).end();
  next();
});

// x402 payment gate — guards all POST routes
app.use(
  paymentMiddleware(
    {
      // Wildcard: matches any POST path, including /.netlify/functions/premium-content
      "POST *": {
        accepts: [
          {
            scheme: "exact",
            price: `$${PRICE_USD}`,
            network: NETWORK,
            payTo: WALLET_ADDRESS,
          },
        ],
        description: "Premium article decryption password",
        mimeType: "application/json",
      },
    },
    resourceServer,
  ),
);

// Reached only after successful payment verification
app.post("*", (req, res) => {
  return Sentry.startSpan(
    { op: "premium-content", name: "deliver-password" },
    () => {
      const slug = req.query.slug || (req.body && req.body.slug);
      if (!slug) {
        return res.status(400).json({ error: "slug is required" });
      }
      if (!SITE_SECRET) {
        return res.status(500).json({ error: "Server misconfigured" });
      }
      const password = createHmac("sha256", SITE_SECRET)
        .update(String(slug))
        .digest("hex");
      return res.json({ password });
    },
  );
});

export const handler = serverless(app);
