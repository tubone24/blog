import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_URL, formatDate } from "../utils/sitemap";

const POSTS_PER_PAGE = 10;

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  // 新しい順にソート
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const totalPages = Math.ceil(sorted.length / POSTS_PER_PAGE);
  const latestPostDate = formatDate(sorted[0].data.date);

  const urls: string[] = [];

  // ホームページ（lastmod = 最新記事日）
  urls.push(`  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${latestPostDate}</lastmod>
  </url>`);

  // ページネーション（/pages/2/ 〜 /pages/N/）
  for (let page = 2; page <= totalPages; page++) {
    const start = (page - 1) * POSTS_PER_PAGE;
    const pagePosts = sorted.slice(start, start + POSTS_PER_PAGE);
    const pageLastmod =
      pagePosts.length > 0
        ? formatDate(pagePosts[0].data.date)
        : latestPostDate;
    urls.push(`  <url>
    <loc>${SITE_URL}/pages/${page}/</loc>
    <lastmod>${pageLastmod}</lastmod>
  </url>`);
  }

  // about, privacy-policies（lastmod なし）
  urls.push(`  <url>
    <loc>${SITE_URL}/about/</loc>
  </url>`);
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
