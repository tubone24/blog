const fs = require("fs");
const path = require("path");

const query = `
  {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      limit: 10
      filter: { frontmatter: { templateKey: { eq: "blog-post" } } }
    ) {
      nodes {
        frontmatter {
          title
          date
          description
          slug
        }
        fields {
          slug
        }
      }
    }
  }
`;

exports.onPostBuild = async ({ graphql }) => {
  const result = await graphql(query);
  if (result.errors) {
    throw result.errors;
  }

  const posts = result.data.allMarkdownRemark.nodes;

  // llms.txtの内容を生成
  const postsList = posts
    .map((post) => {
      // slugを取得（frontmatterのslugを優先）
      let slug = post.fields.slug;
      if (post.frontmatter.slug) {
        slug = post.frontmatter.slug;
      }
      const url = `https://tubone-project24.xyz/${slug}`;
      const title = post.frontmatter.title;
      const description = post.frontmatter.description || "";
      return `- [${title}](${url}): ${description}`;
    })
    .join("\n");

  const llmsTxtContent = `# tubone BOYAKI

> 技術ブログ by Yu Otsubo (tubone24). AIエージェント開発、AWS/クラウドインフラ、Web技術について執筆。

## 著者について

- GitHub: https://github.com/tubone24
- 技術書著者: 「やさしいMCP入門」「AIエージェント開発/運用入門」他
- 専門分野: AI Agent開発、Webアプリ開発、インフラストラクチャ

## 最新記事

${postsList}

## ライセンス

このコンテンツはクリエイティブ・コモンズ 表示 4.0 国際ライセンスの下で提供されています。

## 連絡先

- GitHub: https://github.com/tubone24
- Blog: https://tubone-project24.xyz
`;

  // public/llms.txt に書き込み
  const outputPath = path.join(process.cwd(), "public", "llms.txt");
  fs.writeFileSync(outputPath, llmsTxtContent, "utf-8");

  console.info("llms.txt generated successfully");
};
