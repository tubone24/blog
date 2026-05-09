// CLI: encrypted.html を取得し pagecrypt フォーマットを復号して plaintext HTML を返す。
//
// Usage:
//   yarn decrypt-premium <slug> <password>
//
// stdout (success):
//   {"slug": "...", "encryptedUrl": "...", "contentHtml": "<plaintext html>"}
import { decryptEncryptedHtml } from "./lib.js";

async function main(): Promise<void> {
  const slug = process.argv[2];
  const password = process.argv[3];
  if (!slug || !password) {
    console.error(
      "Usage: yarn decrypt-premium <slug> <password>\n" +
        "  例: yarn decrypt-premium 2011/01/01/x402-paywall-demo <hex-password>",
    );
    process.exit(1);
  }

  const result = await decryptEncryptedHtml(slug, password);
  process.stdout.write(`${JSON.stringify(result)}\n`);
}

main().catch((err: Error) => {
  console.error(`[decrypt-premium] エラー: ${err.message}`);
  process.exit(1);
});
