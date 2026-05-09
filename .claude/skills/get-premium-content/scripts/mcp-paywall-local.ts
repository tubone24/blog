// @deprecated 設計方針変更により、このローカルMCPサーバーは廃止されました。
//
// 決済機能はリモートMCPサーバー (functions/src/mcp-blog-server.js) の
// 以下のツールに統合されています:
//   - unlock_premium_post
//   - decrypt_premium_post
//   - get_premium_content
//   - list_premium_posts
//   - get_premium_post_paywall_info
//
// このファイルは安全に削除して構いません:
//   rm .claude/skills/get-premium-content/scripts/mcp-paywall-local.ts
//
// なお、リモートMCP に決済機能を持たせる構成は **カストディアル** であり、
// サーバー側で EVM_PRIVATE_KEY を保持します。Base Sepolia (テストネット) 専用の構成です。
console.error(
  "[mcp-paywall-local] このサーバーは deprecated です。リモートMCP (mcp-blog-server.js) の unlock_premium_post / get_premium_content を使用してください",
);
process.exit(1);
