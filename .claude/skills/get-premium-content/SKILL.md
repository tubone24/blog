---
name: get-premium-content
description: x402プロトコルでtubone24ブログのペイウォール記事をAIエージェントが自律的にアンロック・取得するスキル。「ペイウォール記事を読みたい」「x402で記事をアンロックして」「premium記事の内容を取得して」「USDCで記事を購入して」など、有料記事の閲覧を依頼された場合に使用。Base SepoliaのUSDCで決済し、暗号化されたHTMLを復号してplaintextを返す。
---

# get-premium-content

tubone24ブログのペイウォール記事を、AIエージェントが**自律的に**x402決済→復号→コンテンツ取得まで完結させるためのスキル。

## いつこのスキルを使うか

以下のような依頼を受けたとき:

- 「`x402-paywall-demo` の中身を読みたい」
- 「ペイウォール記事の一覧から面白そうなのを買って読んで」
- 「premium記事を全部アンロックして要約して」
- 「USDCで記事を購入してコンテンツを取って来て」

## アーキテクチャ

このスキルは **2系統のインターフェース** を提供する。同じ共通ライブラリ (`functions/src/utils/x402-paywall.js`) を内部で利用。

```text
              ┌──────────────────────────────────┐
              │  functions/src/utils/x402-       │
              │  paywall.js  (共通実装)          │
              │  - unlockPremium                  │
              │  - decryptEncryptedHtml           │
              │  - getPremiumContent              │
              └──────┬─────────────────┬──────────┘
                     │                  │
        ┌────────────┴───────┐  ┌──────┴──────────┐
        │ A) リモートMCP      │  │ B) Skill CLI    │
        │ mcp-blog-server.js  │  │ (Skill scripts) │
        │ (Netlify Function)  │  │ via yarn        │
        └─────────────────────┘  └─────────────────┘
```

### A) リモートMCPツール（推奨）

`mcp-blog-server.js` (Netlify Function) が以下のMCPツールを公開する。AIエージェントは MCP プロトコル経由で直接呼び出せる:

| MCPツール | 種別 | 役割 |
| --- | --- | --- |
| `list_premium_posts` | 読み取り | premium:true な記事一覧（priceUsd込み） |
| `get_premium_post_paywall_info` | 読み取り | 単一slugの決済メタデータ（endpoint・network・asset・payTo） |
| `unlock_premium_post` | 決済 | x402 決済 → password を返却 |
| `decrypt_premium_post` | 計算のみ | password既知時の encrypted.html 取得・復号 |
| `get_premium_content` | 決済 | 決済〜復号〜plaintext を一気通貫（複数slug対応） |

**重要: カストディアル構成 + 必須認証**

リモートMCPに決済機能を置く設計は、Netlify環境変数として `EVM_PRIVATE_KEY` をサーバーに保管する **カストディアル構成**。Base Sepolia（テストネット）専用。**メインネットへの転用は禁止**。

カストディアル決済ツール (`unlock_premium_post` / `get_premium_content`) を呼ぶには、リクエストヘッダ `X-MCP-AUTH` に Netlify env vars の `MCP_PAYWALL_TOKEN` と一致する値を設定すること。トークンが無い／一致しない場合はサーバーが `Unauthorized` で拒否する。

### B) Skill CLI（補助・ローカル実行）

| コマンド | 入力 | 出力 |
| --- | --- | --- |
| `yarn unlock-premium <slug>` | slug | password (hex) |
| `yarn decrypt-premium <slug> <password>` | slug + password | plaintext HTML |
| `yarn get-premium-content <slug>...` | slug 1..N | plaintext HTML 配列（JSON） |

CLI 経由の場合、決済署名は **ローカルプロセス内** で完結し、`.env` の `EVM_PRIVATE_KEY` を使う（サーバーには鍵を渡さない）。

## 前提条件

実行前に必ず確認すること:

1. **Netlify env var `EVM_PRIVATE_KEY`** が設定されている（リモートMCP使用時）。または `.env` に設定されている（CLI使用時）
2. ウォレットに **Base Sepolia の USDC** 残高がある（[USDC Faucet](https://faucet.circle.com/) で取得可能）
3. リモートMCPの場合、`SITE_SECRET` / `WALLET_ADDRESS` / `PREMIUM_PRICE_USD` / `MCP_PAYWALL_TOKEN` も Netlify env vars に設定済みであること
4. リモートMCPからカストディアル決済ツールを呼ぶ際、AIエージェントが `X-MCP-AUTH` ヘッダにトークン値を載せられること（MCPクライアント設定で透過設定する想定）

## 標準フロー

### ステップ1: アンロック対象の特定

リモートMCP `mcp-blog-server` の以下ツールで発見:

- `list_premium_posts` — premium 記事一覧
- `search_posts` — キーワード検索（戻り値の `premium` フラグで判定）
- `get_premium_post_paywall_info` — 単一記事の決済メタデータ

### ステップ2: ユーザー確認（必須）

決済は **実費が発生する不可逆な行為**。実行前に必ず確認:

- アンロック対象のslugとタイトル
- 合計の `priceUsd`（複数記事ならその合計）
- 送金先（`payTo`）
- ネットワーク（Base Sepolia）

ユーザーが明示的に承認するまで `unlock_premium_post` / `get_premium_content` / 関連CLIを実行しないこと。

### ステップ3: 決済とコンテンツ取得

- リモートMCP: `get_premium_content` を `slugs: [...]` で呼ぶ
- CLI: `yarn get-premium-content <slug1> [slug2]...`

各slugに対して内部的に:

1. x402決済（Base Sepolia USDC）→ password取得
2. `https://tubone-project24.xyz/{slug}/encrypted.html` を fetch
3. pagecrypt フォーマット（PBKDF2-SHA256 2M回 → AES-GCM-256）で復号
4. plaintext HTML を返却

### ステップ4: 後処理

- 取得したplaintextは原則 **メモリ上のみで扱い、ファイルに保存しない**
- ユーザーから明示的な保存指示があった場合のみファイル化する

## エラーハンドリング指針

- `EVM_PRIVATE_KEY が未設定` → CLI なら `.env`、リモートMCP なら Netlify env vars への設定を促す
- `Verification failed` / `Insufficient funds` → ウォレット残高をfaucetで補充するよう促す
- `Post not found` / `Post is not premium` → `list_premium_posts` で存在確認するよう案内
- `復号失敗` → `SITE_SECRET` の不一致（運営者側の問題）。ユーザーに連絡を促す

## してはいけないこと

- ユーザー確認なしで決済を実行しない
- 取得したplaintextをchatログ以外（Slack・GitHub Issue・Gist等）に転記しない
- `EVM_PRIVATE_KEY` をログ・stdoutに出力しない
- 同一slugを大量回数呼び出さない（重複決済の防止）
- **メインネットでこのカストディアル構成を再利用しない**（Base Sepoliaテストネット専用）
