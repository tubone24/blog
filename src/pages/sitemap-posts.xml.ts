import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import { SITE_URL, xmlEscape, formatDate } from "../utils/sitemap";

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  // 新しい順にソート
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  const urlEntries = sorted
    .map((post) => {
      const lastmod = formatDate(post.data.date);
      return `  <url>
    <loc>${SITE_URL}/${xmlEscape(post.slug)}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
