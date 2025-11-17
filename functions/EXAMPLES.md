# MCP Blog Server - 使用例

## curlでのテスト

### サーバー情報を取得

```bash
curl https://your-site.netlify.app/.netlify/functions/mcp-blog-server
```

### 初期化

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "initialize",
    "params": {
      "protocolVersion": "2024-11-05",
      "capabilities": {},
      "clientInfo": {
        "name": "curl-client",
        "version": "1.0.0"
      }
    }
  }'
```

### すべての記事を取得

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 2,
    "method": "resources/read",
    "params": {
      "uri": "blog://posts"
    }
  }'
```

### タグのリストを取得

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 3,
    "method": "resources/read",
    "params": {
      "uri": "blog://tags"
    }
  }'
```

### 記事を検索

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 4,
    "method": "tools/call",
    "params": {
      "name": "search_posts",
      "arguments": {
        "keyword": "Gatsby"
      }
    }
  }'
```

### タグで記事をフィルタリング

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 5,
    "method": "tools/call",
    "params": {
      "name": "get_posts_by_tag",
      "arguments": {
        "tag": "JavaScript"
      }
    }
  }'
```

### 日付範囲で記事をフィルタリング

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 6,
    "method": "tools/call",
    "params": {
      "name": "get_posts_by_date_range",
      "arguments": {
        "start_date": "2019-01-01",
        "end_date": "2019-12-31"
      }
    }
  }'
```

### リソーステンプレートのリストを取得

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 7,
    "method": "resources/templates/list",
    "params": {}
  }'
```

### ブログテンプレートを取得（ツール）

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 8,
    "method": "tools/call",
    "params": {
      "name": "get_article_template",
      "arguments": {}
    }
  }'
```

### 購読情報を取得（ツール）

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "tools/call",
    "params": {
      "name": "get_subscribe_info",
      "arguments": {}
    }
  }'
```

### リソース更新を購読

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 10,
    "method": "resources/subscribe",
    "params": {
      "uri": "blog://posts"
    }
  }'
```

### 記事分析プロンプトを取得

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 9,
    "method": "prompts/get",
    "params": {
      "name": "analyze_post",
      "arguments": {
        "slug": "2019-09-01-netlify-and-gatsby"
      }
    }
  }'
```

### 最終更新日時を取得（ポーリング用）

```bash
curl -X POST https://your-site.netlify.app/.netlify/functions/mcp-blog-server \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 11,
    "method": "tools/call",
    "params": {
      "name": "get_last_updated",
      "arguments": {
        "resource": "blog://posts"
      }
    }
  }'
```

## JavaScriptでの使用例

```javascript
// MCPクライアントの例
class MCPBlogClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.requestId = 0;
  }

  async request(method, params = {}) {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: ++this.requestId,
        method,
        params
      })
    });

    const result = await response.json();

    if (result.error) {
      throw new Error(result.error.message);
    }

    return result.result;
  }

  async initialize() {
    return this.request('initialize', {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'js-client',
        version: '1.0.0'
      }
    });
  }

  async getAllPosts() {
    return this.request('resources/read', {
      uri: 'blog://posts'
    });
  }

  async getPost(slug) {
    return this.request('resources/read', {
      uri: `blog://posts/${slug}`
    });
  }

  async searchPosts(keyword) {
    return this.request('tools/call', {
      name: 'search_posts',
      arguments: { keyword }
    });
  }

  async getPostsByTag(tag) {
    return this.request('tools/call', {
      name: 'get_posts_by_tag',
      arguments: { tag }
    });
  }

  async analyzePost(slug) {
    return this.request('prompts/get', {
      name: 'analyze_post',
      arguments: { slug }
    });
  }

  async getResourceTemplates() {
    return this.request('resources/templates/list', {});
  }

  async getArticleTemplate() {
    return this.request('tools/call', {
      name: 'get_article_template',
      arguments: {}
    });
  }

  async getSubscribeInfo() {
    return this.request('tools/call', {
      name: 'get_subscribe_info',
      arguments: {}
    });
  }

  async subscribeToResource(uri) {
    return this.request('resources/subscribe', {
      uri: uri
    });
  }

  async unsubscribeFromResource(uri) {
    return this.request('resources/unsubscribe', {
      uri: uri
    });
  }

  async getLastUpdated(resource = 'blog://posts') {
    return this.request('tools/call', {
      name: 'get_last_updated',
      arguments: { resource }
    });
  }

  // ポーリングによる変更検出
  startPolling(resource = 'blog://posts', interval = 60000, onChange) {
    let lastTimestamp = null;

    const checkUpdates = async () => {
      const result = await this.getLastUpdated(resource);
      const currentTimestamp = result.content[0].text ?
        JSON.parse(result.content[0].text).timestamp : null;

      if (lastTimestamp && currentTimestamp && currentTimestamp > lastTimestamp) {
        onChange(resource);
      }

      lastTimestamp = currentTimestamp;
    };

    this.pollingInterval = setInterval(checkUpdates, interval);
    checkUpdates(); // 初回実行
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }
}

// 使用例
const client = new MCPBlogClient(
  'https://your-site.netlify.app/.netlify/functions/mcp-blog-server'
);

async function demo() {
  // 初期化
  await client.initialize();

  // すべての記事を取得
  const posts = await client.getAllPosts();
  console.log('All posts:', posts);

  // 記事を検索
  const searchResults = await client.searchPosts('Gatsby');
  console.log('Search results:', searchResults);

  // タグでフィルタリング
  const jsPost = await client.getPostsByTag('JavaScript');
  console.log('JavaScript posts:', jsPost);

  // ポーリングを開始（60秒ごとにチェック）
  client.startPolling('blog://posts', 60000, async (resource) => {
    console.log(`リソース ${resource} が更新されました！`);
    const updatedPosts = await client.getAllPosts();
    console.log('Updated posts:', updatedPosts);
  });
}

demo();
```

## Python での使用例

```python
import requests
import json

class MCPBlogClient:
    def __init__(self, base_url):
        self.base_url = base_url
        self.request_id = 0

    def request(self, method, params=None):
        if params is None:
            params = {}

        self.request_id += 1
        payload = {
            'jsonrpc': '2.0',
            'id': self.request_id,
            'method': method,
            'params': params
        }

        response = requests.post(
            self.base_url,
            json=payload,
            headers={'Content-Type': 'application/json'}
        )

        result = response.json()

        if 'error' in result:
            raise Exception(result['error']['message'])

        return result['result']

    def initialize(self):
        return self.request('initialize', {
            'protocolVersion': '2024-11-05',
            'capabilities': {},
            'clientInfo': {
                'name': 'python-client',
                'version': '1.0.0'
            }
        })

    def get_all_posts(self):
        return self.request('resources/read', {
            'uri': 'blog://posts'
        })

    def search_posts(self, keyword):
        return self.request('tools/call', {
            'name': 'search_posts',
            'arguments': {'keyword': keyword}
        })

    def get_posts_by_tag(self, tag):
        return self.request('tools/call', {
            'name': 'get_posts_by_tag',
            'arguments': {'tag': tag}
        })

    def get_resource_templates(self):
        return self.request('resources/templates/list', {})

    def get_article_template(self):
        return self.request('tools/call', {
            'name': 'get_article_template',
            'arguments': {}
        })

    def get_subscribe_info(self):
        return self.request('tools/call', {
            'name': 'get_subscribe_info',
            'arguments': {}
        })

    def subscribe_to_resource(self, uri):
        return self.request('resources/subscribe', {
            'uri': uri
        })

    def unsubscribe_from_resource(self, uri):
        return self.request('resources/unsubscribe', {
            'uri': uri
        })

    def get_last_updated(self, resource='blog://posts'):
        return self.request('tools/call', {
            'name': 'get_last_updated',
            'arguments': {'resource': resource}
        })

# 使用例
client = MCPBlogClient(
    'https://your-site.netlify.app/.netlify/functions/mcp-blog-server'
)

# 初期化
client.initialize()

# すべての記事を取得
posts = client.get_all_posts()
print('All posts:', json.dumps(posts, indent=2))

# 記事を検索
search_results = client.search_posts('Gatsby')
print('Search results:', json.dumps(search_results, indent=2))

# 最終更新日時を取得
last_updated = client.get_last_updated('blog://posts')
print('Last updated:', json.dumps(last_updated, indent=2))
```

## Claude Desktop での設定

Claude Desktop の設定ファイル (`claude_desktop_config.json`) に以下を追加:

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

設定後、Claudeで以下のように使用できます:

```text
ブログの記事を検索してください: Gatsby
```

```text
JavaScriptタグの記事を教えてください
```

```text
2019年の記事を要約してください
```
