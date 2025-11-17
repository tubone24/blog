# Blog MCP Server

Netlify Functionsを使用したブログ記事取得用のMCPサーバー

## 概要

このMCPサーバーは、Netlify Functions上で動作し、ブログの記事を取得・検索するための標準化されたインターフェースを提供します。MCP (Model Context Protocol) のリソース、ツール、プロンプトのプリミティブをフル活用しています。

## 技術選定

### Netlify Functions vs Edge Functions

**Netlify Functions を選択した理由:**

✅ **ファイルシステムアクセス**: `src/content/` からMarkdown記事を直接読み込める
✅ **Node.jsエコシステム**: gray-matter等の豊富なパッケージが利用可能
✅ **実行時間**: 最大10秒の実行時間で大量の記事処理に対応
✅ **Streamable HTTP**: Server-Sent Eventsのネイティブサポート

Edge Functionsは低レイテンシですが、Deno環境とファイルシステム制限により、この用途には不向きです。

## アーキテクチャ

```text
┌─────────────────────────────────────┐
│   MCPクライアント (Claude等)         │
└───────────────┬─────────────────────┘
                │ HTTP/JSON-RPC
                ▼
┌─────────────────────────────────────┐
│  Netlify Functions                  │
│  /mcp-blog-server                   │
│                                     │
│  ┌──────────────────────────────┐  │
│  │  JSON-RPC Handler            │  │
│  └──────────────────────────────┘  │
│         │          │          │     │
│         ▼          ▼          ▼     │
│   Resources    Tools     Prompts    │
└───────────────┬─────────────────────┘
                │
                ▼
        ┌──────────────────┐
        │  src/content/    │
        │  (Markdown記事)  │
        └──────────────────┘
```

## 機能

### 1. リソース (Resources)

MCPのリソースは読み取り専用のデータソースです。

- `blog://posts` - すべてのブログ記事のリスト（記事URLを含む）
- `blog://tags` - すべてのタグのリスト

#### リソーステンプレート (Resource Templates)

動的なリソースURIパターン（RFC 6570準拠）:

- `blog://posts/{slug}` - 特定の記事の詳細
- `blog://tags/{tag}` - 特定タグの記事リスト（記事URLを含む）

#### リソースメソッド (Resource Methods)

- `resources/list` - 利用可能なリソースのリスト取得
- `resources/read` - 特定のリソースの読み取り
- `resources/templates/list` - リソーステンプレートのリスト取得
- `resources/subscribe` - リソース更新の購読
- `resources/unsubscribe` - リソース購読の解除

### 2. ツール (Tools)

MCPのツールは、クライアントが実行できるアクションです。すべてのツールは記事URLを含むサマリーを返します。

- `search_posts` - キーワードでブログ記事を検索
- `get_post_by_slug` - スラッグで特定の記事を取得
- `get_posts_by_tag` - タグで記事をフィルタリング
- `get_posts_by_date_range` - 日付範囲で記事をフィルタリング
- `list_all_posts` - すべての記事をリスト（サマリーのみ）
- `get_article_template` - ブログ記事のMarkdownテンプレートを取得
- `get_subscribe_info` - RSS購読情報とソーシャルリンクを取得
- `get_last_updated` - リソースの最終更新日時を取得（ポーリングによる変更検出用）

### 3. プロンプト (Prompts)

MCPのプロンプトは、テンプレート化されたプロンプトです。

- `analyze_post` - 特定の記事を分析するプロンプト（記事URLを含む）
- `summarize_posts` - 複数の記事を要約するプロンプト

## エンドポイント

### GET /mcp-blog-server

サーバー情報を取得します。

**レスポンス例:**

```json
{
  "name": "blog-mcp-server",
  "version": "1.0.0",
  "description": "MCP Blog Server - ブログ記事を取得するためのMCPサーバー",
  "endpoints": {
    "message": "/mcp-blog-server (POST)"
  },
  "resources": ["blog://posts", "blog://tags"],
  "resourceTemplates": [
    {
      "uriTemplate": "blog://posts/{slug}",
      "name": "Individual Blog Post",
      "description": "特定のスラッグを持つブログ記事",
      "mimeType": "application/json"
    },
    {
      "uriTemplate": "blog://tags/{tag}",
      "name": "Posts by Tag",
      "description": "特定のタグでフィルタリングされたブログ記事",
      "mimeType": "application/json"
    }
  ],
  "tools": ["search_posts", "get_post_by_slug", "get_posts_by_tag", "get_posts_by_date_range", "list_all_posts", "get_article_template", "get_subscribe_info"],
  "prompts": ["analyze_post", "summarize_posts"]
}
```

### POST /mcp-blog-server

JSON-RPCメッセージを受け付けます。

**リクエスト例:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "resources/read",
  "params": {
    "uri": "blog://posts"
  }
}
```

**レスポンス例:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "contents": [{
      "uri": "blog://posts",
      "mimeType": "application/json",
      "text": "[...]"
    }]
  }
}
```

## 使用例

### 1. 初期化

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "initialize",
  "params": {
    "protocolVersion": "2024-11-05",
    "capabilities": {},
    "clientInfo": {
      "name": "example-client",
      "version": "1.0.0"
    }
  }
}
```

### 2. リソースのリスト取得

```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "resources/list",
  "params": {}
}
```

### 3. すべての記事を取得

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "resources/read",
  "params": {
    "uri": "blog://posts"
  }
}
```

### 4. 特定の記事を取得

```json
{
  "jsonrpc": "2.0",
  "id": 4,
  "method": "resources/read",
  "params": {
    "uri": "blog://posts/2019-09-01-netlify-and-gatsby"
  }
}
```

### 5. 記事を検索

```json
{
  "jsonrpc": "2.0",
  "id": 5,
  "method": "tools/call",
  "params": {
    "name": "search_posts",
    "arguments": {
      "keyword": "Netlify"
    }
  }
}
```

### 6. タグで記事をフィルタリング

```json
{
  "jsonrpc": "2.0",
  "id": 6,
  "method": "tools/call",
  "params": {
    "name": "get_posts_by_tag",
    "arguments": {
      "tag": "Gatsby"
    }
  }
}
```

### 7. プロンプトを取得

```json
{
  "jsonrpc": "2.0",
  "id": 7,
  "method": "prompts/get",
  "params": {
    "name": "analyze_post",
    "arguments": {
      "slug": "2019-09-01-netlify-and-gatsby"
    }
  }
}
```

### 8. リソーステンプレートのリストを取得

```json
{
  "jsonrpc": "2.0",
  "id": 8,
  "method": "resources/templates/list",
  "params": {}
}
```

### 9. ブログテンプレートを取得（ツール）

```json
{
  "jsonrpc": "2.0",
  "id": 9,
  "method": "tools/call",
  "params": {
    "name": "get_article_template",
    "arguments": {}
  }
}
```

### 10. 購読情報を取得（ツール）

```json
{
  "jsonrpc": "2.0",
  "id": 10,
  "method": "tools/call",
  "params": {
    "name": "get_subscribe_info",
    "arguments": {}
  }
}
```

### 11. リソース更新を購読

```json
{
  "jsonrpc": "2.0",
  "id": 11,
  "method": "resources/subscribe",
  "params": {
    "uri": "blog://posts"
  }
}
```

### 12. リソース購読を解除

```json
{
  "jsonrpc": "2.0",
  "id": 12,
  "method": "resources/unsubscribe",
  "params": {
    "uri": "blog://posts"
  }
}
```

### 13. 最終更新日時を取得（ポーリング用）

```json
{
  "jsonrpc": "2.0",
  "id": 13,
  "method": "tools/call",
  "params": {
    "name": "get_last_updated",
    "arguments": {
      "resource": "blog://posts"
    }
  }
}
```

## リソース更新検出の仕組み

`resources/subscribe`メソッドは購読を登録しますが、Netlify Functionsの制限（ステートレス、タイムアウト10秒）により、リアルタイム通知は実装されていません。

代わりに、**ポーリング方式**でリソースの変更を検出できます：

1. `get_last_updated` ツールで最終更新タイムスタンプを取得
2. 定期的（例: 60秒ごと）に再度タイムスタンプを取得
3. タイムスタンプが変更されていれば、`resources/read` でリソースを再取得

**実装例**:

```javascript
let lastTimestamp = null;

async function checkForUpdates() {
  const result = await client.callTool('get_last_updated', {
    resource: 'blog://posts'
  });

  const currentTimestamp = result.timestamp;

  if (lastTimestamp && currentTimestamp > lastTimestamp) {
    console.log('リソースが更新されました！');
    const posts = await client.readResource('blog://posts');
    // 更新された記事を処理
  }

  lastTimestamp = currentTimestamp;
}

// 60秒ごとにチェック
setInterval(checkForUpdates, 60000);
```

**データの永続化**: 最終更新タイムスタンプは Netlify Blobs に保存されており、関数の再起動後も保持されます。

## デプロイ

### 1. 依存関係のインストール

```bash
# ルートディレクトリ
yarn install

# Functionsディレクトリ
cd functions
yarn install
```

### 2. ローカルでのテスト

```bash
netlify dev
```

### 3. Netlifyへのデプロイ

```bash
# Netlifyにプッシュすると自動デプロイされます
git add .
git commit -m "Add MCP blog server"
git push origin main
```

## MCP設定

Claude Desktopで使用する場合の設定例:

```json
{
  "mcpServers": {
    "blog": {
      "url": "https://your-site.netlify.app/.netlify/functions/mcp-blog-server",
      "transport": "streamableHttp"
    }
  }
}
```

## ファイル構造

```text
functions/
├── package.json           # ES Modules設定
├── README.md             # このファイル
└── src/
    ├── mcp-blog-server.js  # メインエンドポイント
    └── utils/
        └── blog-utils.js   # 記事読み込みユーティリティ
```

## トラブルシューティング

### エラー: "Parse error"

- リクエストボディが有効なJSONか確認してください
- Content-Typeヘッダーが `application/json` であることを確認してください

### エラー: "Post not found"

- スラッグが正しいか確認してください
- `blog://posts` リソースですべての記事を確認してください

### パフォーマンスの最適化

- 記事が多い場合は `list_all_posts` ツールの `limit` パラメータを使用してください
- サマリーのみが必要な場合はリソースの `blog://posts` を使用してください（コンテンツを含まない）

## ライセンス

MIT

## 作者

tubone <tubo.yyyuuu@gmail.com>
