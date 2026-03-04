import { getCollection } from "astro:content";
import type { APIContext } from "astro";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const siteUrl = context.site?.origin || "https://tubone-project24.xyz";

  const postsList = sorted
    .slice(0, 10)
    .map((post) => {
      const slug = post.slug;
      const url = `${siteUrl}/${slug}/`;
      const title = post.data.title;
      const description = post.data.description || "";
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
- Blog: ${siteUrl}
`;

  return new Response(llmsTxtContent, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
