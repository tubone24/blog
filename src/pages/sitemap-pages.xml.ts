import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_URL, formatDate } from "../utils/sitemap";

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  // 新しい順にソート
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const latestPostDate = formatDate(sorted[0].data.date);

  const urls: string[] = [];

  // ホームページ（lastmod = 最新記事日）
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${latestPostDate}</lastmod>
  </url>`);

  // About ページ
  urls.push(`  <url>
    <loc>${SITE_URL}/about/</loc>
    <lastmod>${latestPostDate}</lastmod>
  </url>`);

  // ページネーションはnoindex設定のためサイトマップから除外

  // privacy-policies（lastmod なし）
  urls.push(`  <url>
    <loc>${SITE_URL}/privacy-policies/</loc>
  </url>`);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
