const fs = require("fs");
const path = require("path");
const algoliasearch = require("algoliasearch");

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

/**
 * Index data to Algolia with error handling
 */
async function indexToAlgolia({ graphql, reporter }) {
  try {
    // Load Algolia configuration
    // eslint-disable-next-line global-require
    const algoliaConfig = require("../gatsby-plugin-algolia-config.js");

    // Skip if indexing is disabled
    if (algoliaConfig.skipIndexing) {
      reporter.info("Algolia indexing is skipped (skipIndexing=true)");
      return;
    }

    reporter.info("Starting Algolia indexing...");

    // Initialize Algolia client
    const client = algoliasearch(algoliaConfig.appId, algoliaConfig.apiKey);
    const index = client.initIndex(algoliaConfig.indexName);

    // Execute all queries and transform data
    const allRecords = [];
    for (const queryConfig of algoliaConfig.queries) {
      const result = await graphql(queryConfig.query);
      if (result.errors) {
        throw result.errors;
      }

      const records = queryConfig.transformer({ data: result.data });
      allRecords.push(...records);
    }

    reporter.info(`Indexing ${allRecords.length} records to Algolia...`);

    // Save objects to Algolia
    await index.replaceAllObjects(allRecords, {
      autoGenerateObjectIDIfNotExist: false,
    });

    reporter.success(
      `Successfully indexed ${allRecords.length} records to Algolia`
    );
  } catch (error) {
    // Check if error is due to Algolia blocking (quota exceeded)
    if (error.message && error.message.includes("application is blocked")) {
      reporter.warn(
        "Algolia indexing failed: Application is blocked (likely quota exceeded). " +
          "Skipping Algolia indexing to allow build to continue."
      );
      reporter.warn(`Error details: ${error.message}`);
    } else {
      // For other errors, log but don't fail the build
      reporter.warn(
        "Algolia indexing failed with an error. " +
          "Skipping Algolia indexing to allow build to continue."
      );
      reporter.warn(`Error details: ${error.message}`);
    }
  }
}

exports.onPostBuild = async ({ graphql, reporter }) => {
  // Index to Algolia (with error handling that won't fail the build)
  await indexToAlgolia({ graphql, reporter });

  // Continue with other post-build tasks
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
