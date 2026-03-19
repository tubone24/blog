import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const SITE_URL = "https://tubone-project24.xyz";

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  const sorted = posts
    .filter((post) => !post.data.noindex)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );

  // 最新30件のURLをIndexNowに通知対象とする
  const recentPosts = sorted.slice(0, 30);

  const urlList = recentPosts
    .map((post) => `    <url><loc>${SITE_URL}/${post.slug}/</loc></url>`)
    .join("\n");

  // 静的ページも含める
  const staticUrls = [
    `    <url><loc>${SITE_URL}/</loc></url>`,
    `    <url><loc>${SITE_URL}/about/</loc></url>`,
  ].join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${urlList}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
