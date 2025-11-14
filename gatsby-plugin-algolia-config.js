// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: ".env",
});

const queries = [
  {
    query: `
      {
        allMarkdownRemark {
          edges {
            node {
              objectID: id
              excerpt
              html
              frontmatter {
                title
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `,
    transformer: ({ data }) =>
      data.allMarkdownRemark.edges.map(
        ({
          node: {
            objectID,
            excerpt,
            html,
            frontmatter: { title, tags },
            fields: { slug },
          },
        }) => {
          // HTMLタグとコードブロックを除去
          const cleanText = html
            .replace(/<code[\s\S]*?<\/code>/g, "") // コードブロック削除
            .replace(/<pre[\s\S]*?<\/pre>/g, "") // preタグ削除
            .replace(/<script\b[\s\S]*?<\/script[\s\S]*?>/gi, "") // scriptタグ削除
            .replace(/<style[\s\S]*?<\/style>/g, "") // styleタグ削除
            // Table of Contentsセクション全体を削除（H2から次のH2まで）
            .replace(
              /<h2[^>]*>[\s\S]*?Table of Contents[\s\S]*?<\/h2>[\s\S]*?(?=<h2|$)/gi,
              ""
            )
            .replace(/<h[1-6][\s\S]*?<\/h[1-6]>/gi, "") // 見出しタグ削除(H1-H6)
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, "") // HTMLタグ削除
            .replace(/\s+/g, " ") // 連続する空白を1つに
            .trim();

          // Algoliaの推奨値: 1レコードあたり10KB以下
          const maxLength = 3000;
          const allText =
            cleanText.length > maxLength
              ? cleanText.substring(0, maxLength)
              : cleanText;

          return {
            objectID,
            title,
            description: excerpt,
            allText,
            tags: tags.join(),
            path: slug,
          };
        }
      ),
  },
];

module.exports = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID || "dummy",
  apiKey: process.env.GATSBY_ALGOLIA_ADMIN_API_KEY || "dummy",
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || "dummy",
  skipIndexing:
    !process.env.GATSBY_ALGOLIA_APP_ID ||
    !process.env.GATSBY_ALGOLIA_ADMIN_API_KEY ||
    process.env.NETLIFY_ENV !== "production",
  queries,
};
