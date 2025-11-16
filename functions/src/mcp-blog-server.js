import {
  getAllPosts,
  getPostBySlug,
  getPostsByTag,
  getAllTags,
  getPostsByDateRange,
  searchPosts,
  createPostSummary
} from './utils/blog-utils.js';

// MCPサーバーのメタデータ
const SERVER_INFO = {
  name: 'blog-mcp-server',
  version: '1.0.0',
  protocolVersion: '2024-11-05',
  capabilities: {
    resources: {},
    tools: {},
    prompts: {}
  }
};

// リソースの定義
const RESOURCES = {
  'blog://posts': {
    uri: 'blog://posts',
    name: 'All Blog Posts',
    description: 'すべてのブログ記事のリスト',
    mimeType: 'application/json'
  },
  'blog://tags': {
    uri: 'blog://tags',
    name: 'All Tags',
    description: 'すべてのタグのリスト',
    mimeType: 'application/json'
  }
};

// ツールの定義
const TOOLS = {
  search_posts: {
    name: 'search_posts',
    description: 'キーワードでブログ記事を検索します',
    inputSchema: {
      type: 'object',
      properties: {
        keyword: {
          type: 'string',
          description: '検索キーワード'
        }
      },
      required: ['keyword']
    }
  },
  get_post_by_slug: {
    name: 'get_post_by_slug',
    description: 'スラッグで特定のブログ記事を取得します',
    inputSchema: {
      type: 'object',
      properties: {
        slug: {
          type: 'string',
          description: '記事のスラッグ'
        }
      },
      required: ['slug']
    }
  },
  get_posts_by_tag: {
    name: 'get_posts_by_tag',
    description: 'タグでブログ記事をフィルタリングします',
    inputSchema: {
      type: 'object',
      properties: {
        tag: {
          type: 'string',
          description: 'タグ名'
        }
      },
      required: ['tag']
    }
  },
  get_posts_by_date_range: {
    name: 'get_posts_by_date_range',
    description: '日付範囲でブログ記事をフィルタリングします',
    inputSchema: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: '開始日 (ISO 8601形式: YYYY-MM-DD)',
          format: 'date'
        },
        end_date: {
          type: 'string',
          description: '終了日 (ISO 8601形式: YYYY-MM-DD)',
          format: 'date'
        }
      },
      required: ['start_date', 'end_date']
    }
  },
  list_all_posts: {
    name: 'list_all_posts',
    description: 'すべてのブログ記事をリストします（サマリーのみ、コンテンツなし）',
    inputSchema: {
      type: 'object',
      properties: {
        limit: {
          type: 'number',
          description: '取得する記事数の上限（デフォルト: 100）',
          default: 100
        }
      }
    }
  }
};

// プロンプトの定義
const PROMPTS = {
  analyze_post: {
    name: 'analyze_post',
    description: 'ブログ記事を分析するためのプロンプト',
    arguments: [
      {
        name: 'slug',
        description: '分析する記事のスラッグ',
        required: true
      }
    ]
  },
  summarize_posts: {
    name: 'summarize_posts',
    description: '複数のブログ記事を要約するためのプロンプト',
    arguments: [
      {
        name: 'tag',
        description: '要約する記事のタグ（オプション）',
        required: false
      },
      {
        name: 'limit',
        description: '要約する記事数（デフォルト: 10）',
        required: false
      }
    ]
  }
};

/**
 * リソースハンドラー
 */
function handleResourcesRequest(method, params) {
  switch (method) {
    case 'resources/list':
      return {
        resources: Object.values(RESOURCES)
      };

    case 'resources/read': {
      const uri = params.uri;

      if (uri === 'blog://posts') {
        const posts = getAllPosts();
        const summaries = posts.map(createPostSummary);
        return {
          contents: [{
            uri: uri,
            mimeType: 'application/json',
            text: JSON.stringify(summaries, null, 2)
          }]
        };
      }

      if (uri === 'blog://tags') {
        const tags = getAllTags();
        return {
          contents: [{
            uri: uri,
            mimeType: 'application/json',
            text: JSON.stringify(tags, null, 2)
          }]
        };
      }

      // blog://posts/{slug} の処理
      if (uri.startsWith('blog://posts/')) {
        const slug = uri.replace('blog://posts/', '');
        const post = getPostBySlug(slug);

        if (!post) {
          throw new Error(`Post not found: ${slug}`);
        }

        return {
          contents: [{
            uri: uri,
            mimeType: 'application/json',
            text: JSON.stringify(post, null, 2)
          }]
        };
      }

      // blog://tags/{tag} の処理
      if (uri.startsWith('blog://tags/')) {
        const tag = decodeURIComponent(uri.replace('blog://tags/', ''));
        const posts = getPostsByTag(tag);
        const summaries = posts.map(createPostSummary);

        return {
          contents: [{
            uri: uri,
            mimeType: 'application/json',
            text: JSON.stringify(summaries, null, 2)
          }]
        };
      }

      throw new Error(`Unknown resource URI: ${uri}`);
    }

    default:
      throw new Error(`Unknown resources method: ${method}`);
  }
}

/**
 * ツールハンドラー
 */
function handleToolsRequest(method, params) {
  switch (method) {
    case 'tools/list':
      return {
        tools: Object.values(TOOLS)
      };

    case 'tools/call': {
      const { name, arguments: args } = params;

      switch (name) {
        case 'search_posts': {
          const results = searchPosts(args.keyword);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(results.map(createPostSummary), null, 2)
            }]
          };
        }

        case 'get_post_by_slug': {
          const post = getPostBySlug(args.slug);
          if (!post) {
            throw new Error(`Post not found: ${args.slug}`);
          }
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(post, null, 2)
            }]
          };
        }

        case 'get_posts_by_tag': {
          const posts = getPostsByTag(args.tag);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(posts.map(createPostSummary), null, 2)
            }]
          };
        }

        case 'get_posts_by_date_range': {
          const posts = getPostsByDateRange(args.start_date, args.end_date);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(posts.map(createPostSummary), null, 2)
            }]
          };
        }

        case 'list_all_posts': {
          const limit = args.limit || 100;
          const posts = getAllPosts().slice(0, limit);
          return {
            content: [{
              type: 'text',
              text: JSON.stringify(posts.map(createPostSummary), null, 2)
            }]
          };
        }

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    }

    default:
      throw new Error(`Unknown tools method: ${method}`);
  }
}

/**
 * プロンプトハンドラー
 */
function handlePromptsRequest(method, params) {
  switch (method) {
    case 'prompts/list':
      return {
        prompts: Object.values(PROMPTS)
      };

    case 'prompts/get': {
      const { name, arguments: args } = params;

      switch (name) {
        case 'analyze_post': {
          const post = getPostBySlug(args.slug);
          if (!post) {
            throw new Error(`Post not found: ${args.slug}`);
          }

          return {
            description: `ブログ記事「${post.title}」を分析します`,
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `以下のブログ記事を分析してください：\n\nタイトル: ${post.title}\n日付: ${post.date}\nタグ: ${post.tags.join(', ')}\n\n内容:\n${post.content}`
                }
              }
            ]
          };
        }

        case 'summarize_posts': {
          const limit = parseInt(args.limit) || 10;
          let posts;

          if (args.tag) {
            posts = getPostsByTag(args.tag).slice(0, limit);
          } else {
            posts = getAllPosts().slice(0, limit);
          }

          const postSummaries = posts.map(p =>
            `- ${p.title} (${p.date}) - ${p.description}`
          ).join('\n');

          return {
            description: args.tag
              ? `タグ「${args.tag}」の記事を要約します`
              : '最近のブログ記事を要約します',
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `以下のブログ記事を要約してください：\n\n${postSummaries}`
                }
              }
            ]
          };
        }

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    }

    default:
      throw new Error(`Unknown prompts method: ${method}`);
  }
}

/**
 * JSON-RPCリクエストハンドラー
 */
function handleJsonRpcRequest(request) {
  const { jsonrpc, id, method, params } = request;

  if (jsonrpc !== '2.0') {
    throw new Error('Invalid JSON-RPC version');
  }

  try {
    let result;

    // Initialize
    if (method === 'initialize') {
      result = {
        protocolVersion: SERVER_INFO.protocolVersion,
        capabilities: SERVER_INFO.capabilities,
        serverInfo: {
          name: SERVER_INFO.name,
          version: SERVER_INFO.version
        }
      };
    }
    // Resources
    else if (method.startsWith('resources/')) {
      result = handleResourcesRequest(method, params);
    }
    // Tools
    else if (method.startsWith('tools/')) {
      result = handleToolsRequest(method, params);
    }
    // Prompts
    else if (method.startsWith('prompts/')) {
      result = handlePromptsRequest(method, params);
    }
    // Ping (keep-alive)
    else if (method === 'ping') {
      result = {};
    }
    else {
      throw new Error(`Unknown method: ${method}`);
    }

    return {
      jsonrpc: '2.0',
      id: id,
      result: result
    };
  } catch (error) {
    return {
      jsonrpc: '2.0',
      id: id,
      error: {
        code: -32603,
        message: error.message
      }
    };
  }
}

/**
 * Netlify Function Handler
 */
export const handler = async (event, context) => {
  // CORSヘッダー
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // OPTIONSリクエスト（CORS preflight）
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  // GETリクエスト（サーバー情報）
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        name: SERVER_INFO.name,
        version: SERVER_INFO.version,
        description: 'MCP Blog Server - ブログ記事を取得するためのMCPサーバー',
        endpoints: {
          message: '/mcp-blog-server (POST)',
          sse: '/mcp-blog-server/sse (GET)'
        },
        resources: Object.keys(RESOURCES),
        tools: Object.keys(TOOLS),
        prompts: Object.keys(PROMPTS)
      }, null, 2)
    };
  }

  // POSTリクエスト（JSON-RPC）
  if (event.httpMethod === 'POST') {
    try {
      const request = JSON.parse(event.body);
      const response = handleJsonRpcRequest(request);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(response)
      };
    } catch (error) {
      console.error('Error handling request:', error);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: null,
          error: {
            code: -32700,
            message: 'Parse error'
          }
        })
      };
    }
  }

  // その他のメソッド
  return {
    statusCode: 405,
    headers,
    body: JSON.stringify({
      error: 'Method not allowed'
    })
  };
};
