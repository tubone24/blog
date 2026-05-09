// CLI: 1個以上のslugに対して x402 決済 → encrypted.html 復号 → plaintext を一気通貫で取得。
//
// Usage:
//   yarn get-premium-content <slug1> [slug2] [slug3]...
//
// stdout (success):
//   [
//     {"slug": "...", "password": "...", "encryptedUrl": "...", "contentHtml": "..."},
//     ...
//   ]
//
// 各slugを直列に処理。途中で失敗した場合はその時点までの成功分 + error をstderrに出して exit 1。
import { getPremiumContent } from "./lib.js";

async function main(): Promise<void> {
  const slugs = process.argv.slice(2);
  if (slugs.length === 0) {
    console.error(
      "Usage: yarn get-premium-content <slug1> [slug2]...\n" +
        "  例: yarn get-premium-content 2011/01/01/x402-paywall-demo",
    );
    process.exit(1);
  }

  const results: Array<unknown> = [];
  for (const slug of slugs) {
    try {
      const article = await getPremiumContent(slug);
      results.push(article);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      console.error(`[get-premium-content] slug=${slug} で失敗: ${message}`);
      process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
      process.exit(1);
    }
  }

  process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
}

main().catch((err: Error) => {
  console.error(`[get-premium-content] エラー: ${err.message}`);
  process.exit(1);
});
