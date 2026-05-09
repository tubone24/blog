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
        │ 【読み取り専用】    │  │ 【決済・取得】  │
        └─────────────────────┘  └─────────────────┘
```

### A) リモートMCPツール（読み取り専用・将来用）

`mcp-blog-server.js` (Netlify Function) が以下のMCPツールを公開する。**決済を伴わない読み取り専用ツールのみ**利用可能。

| MCPツール | 種別 | 役割 |
| --- | --- | --- |
| `list_premium_posts` | 読み取り | premium:true な記事一覧（priceUsd込み） |
| `get_premium_post_paywall_info` | 読み取り | 単一slugの決済メタデータ（endpoint・network・asset・payTo） |
| `decrypt_premium_post` | 計算のみ | password既知時の encrypted.html 取得・復号 |

> **注意:** 決済ツール (`unlock_premium_post` / `get_premium_content`) はMCPサーバー側に `EVM_PRIVATE_KEY` を設置する必要があるため実装不可。決済は必ず Skill CLI（B）で行う。

### B) Skill CLI（決済・コンテンツ取得の主経路）

| コマンド | 入力 | 出力 |
| --- | --- | --- |
| `yarn unlock-premium <slug>` | slug | password (hex) |
| `yarn decrypt-premium <slug> <password>` | slug + password | plaintext HTML |
| `yarn get-premium-content <slug>...` | slug 1..N | plaintext HTML 配列（JSON） |

CLI 経由の場合、決済署名は **ローカルプロセス内** で完結し、`.env` の `EVM_PRIVATE_KEY` を使う（サーバーには鍵を渡さない）。

## 前提条件

実行前に必ず確認すること:

1. **`.env` に `EVM_PRIVATE_KEY`** が設定されている（CLI使用時）
2. ウォレットに **Base Sepolia の USDC** 残高がある（[USDC Faucet](https://faucet.circle.com/) で取得可能）
3. `tsx` が `node_modules/.bin/tsx` に存在する — 存在しない場合は `yarn install` を促す

## 実行上の注意

CLI は Claude Code エージェントから自律実行することを **優先する**。ただし以下の制約がある:

- サンドボックスがデフォルトで `.env` ファイルの読み取りを拒否する → `dangerouslyDisableSandbox: true` で実行すること
- hook がサンドボックス無効化 + `.env` 読み取りの組み合わせを拒否した場合のみ、ユーザーに `!` プレフィックスで実行を依頼する（フォールバック）

```bash
# フォールバック: hook に拒否された場合のみユーザーに依頼
! yarn get-premium-content "<slug>"
```

## 標準フロー

### ステップ1: アンロック対象の特定

**方法A（MCPサーバー接続時）**: `list_premium_posts` / `search_posts` / `get_premium_post_paywall_info` を使用。

**方法B（MCPサーバー未接続時）**: curl プリフライトリクエストで 402 レスポンスから決済情報を取得:

```bash
curl -s -i -X POST "https://tubone-project24.xyz/.netlify/functions/premium-content?slug=<slug>" \
  -H "Content-Type: application/json" -d "{}"
```

レスポンスの `payment-required` ヘッダは Base64 エンコードされた JSON で、デコードすると `payTo` / `amount` / `network` / `asset` が得られる:

```bash
# ヘッダ値をデコード
echo "<base64値>" | base64 -d | python3 -m json.tool
```

### ステップ2: ユーザー確認（必須）

決済は **実費が発生する不可逆な行為**。実行前に必ず確認:

- アンロック対象のslugとタイトル
- 合計の `priceUsd`（複数記事ならその合計）
- 送金先（`payTo`）
- ネットワーク（Base Sepolia）

ユーザーが明示的に承認するまで関連CLIを実行しないこと。

### ステップ3: CLI実行（自律実行を優先）

確認後、`dangerouslyDisableSandbox: true` で CLI を自律実行する:

```bash
yarn get-premium-content "<slug>"
```

hook に拒否された場合のみ、ユーザーに `! yarn get-premium-content "<slug>"` で実行を依頼する（フォールバック）。

各slugに対して内部的に:

1. x402決済（Base Sepolia USDC）→ password取得
2. `https://tubone-project24.xyz/{slug}/encrypted.html` を fetch
3. pagecrypt フォーマット（PBKDF2-SHA256 2M回 → AES-GCM-256）で復号
4. plaintext HTML を返却

出力形式:

```json
[
  {
    "slug": "...",
    "password": "...",
    "encryptedUrl": "https://tubone-project24.xyz/.../encrypted.html",
    "contentHtml": "<!-- 復号されたHTML -->"
  }
]
```

### ステップ4: 後処理

- 取得したplaintextは原則 **メモリ上のみで扱い、ファイルに保存しない**
- ユーザーから明示的な保存指示があった場合のみファイル化する

## エラーハンドリング指針

- `EVM_PRIVATE_KEY が未設定` → `.env` への設定を促す
- `invalid private key` → `.env` の `EVM_PRIVATE_KEY` が `0x` プレフィックス付き64桁の16進数形式であることを確認するよう促す
- `tsx: command not found` → `yarn install` を実行するよう促す
- `Verification failed` / `Insufficient funds` → ウォレット残高をfaucetで補充するよう促す
- `Post not found` / `Post is not premium` → slugが正しいか確認するよう案内
- `復号失敗` → `SITE_SECRET` の不一致（運営者側の問題）。ユーザーに連絡を促す

## してはいけないこと

- ユーザー確認なしで決済を実行しない
- 取得したplaintextをchatログ以外（Slack・GitHub Issue・Gist等）に転記しない
- `EVM_PRIVATE_KEY` をログ・stdoutに出力しない
- 同一slugを大量回数呼び出さない（重複決済の防止）
