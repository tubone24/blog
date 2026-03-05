import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_URL, formatDate } from "../utils/sitemap";

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  // 全記事中の最新日付を取得
  const latestDate = posts.reduce((latest, post) => {
    const d = new Date(post.data.date);
    return d > latest ? d : latest;
  }, new Date(0));

  const lastmod = formatDate(latestDate);

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-posts.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-pages.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>
</sitemapindex>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
