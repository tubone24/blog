// CLI: 任意slugのペイウォール記事を x402 決済し、復号 password を JSON 出力する。
//
// Usage:
//   yarn unlock-premium <slug>
//
// stdout (success):
//   {"slug": "...", "password": "..."}
import { unlockPremium } from "./lib.js";

async function main(): Promise<void> {
  const slug = process.argv[2];
  if (!slug) {
    console.error(
      "Usage: yarn unlock-premium <slug>\n  例: yarn unlock-premium 2011/01/01/x402-paywall-demo",
    );
    process.exit(1);
  }

  const result = await unlockPremium(slug);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main().catch((err: Error) => {
  console.error(`[unlock-premium] エラー: ${err.message}`);
  process.exit(1);
});
