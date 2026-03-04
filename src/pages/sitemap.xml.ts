import { getCollection } from "astro:content";
import type { APIContext } from "astro";

const SITE_URL = "https://tubone-project24.xyz";

function xmlEscape(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(_context: APIContext) {
  const posts = await getCollection("blog");

  // ブログ記事のURL一覧
  const postUrls = posts.map((post) => {
    const slug = post.slug;
    const lastmod =
      post.data.date instanceof Date
        ? post.data.date.toISOString().split("T")[0]
        : new Date(post.data.date).toISOString().split("T")[0];
    return {
      loc: `${SITE_URL}/${xmlEscape(slug)}/`,
      lastmod,
      priority: "0.8",
      changefreq: "monthly",
    };
  });

  // タグの収集
  const tagSet = new Set<string>();
  posts.forEach((post) => {
    post.data.tags?.forEach((tag) => {
      if (tag) tagSet.add(tag);
    });
  });
  const tagUrls = Array.from(tagSet).map((tag) => ({
    loc: `${SITE_URL}/tag/${encodeURIComponent(tag)}/`,
    lastmod: undefined,
    priority: "0.5",
    changefreq: "weekly",
  }));

  // 年別ページ
  const yearSet = new Set<string>();
  posts.forEach((post) => {
    const year = new Date(post.data.date).getFullYear().toString();
    yearSet.add(year);
  });
  const yearUrls = Array.from(yearSet).map((year) => ({
    loc: `${SITE_URL}/${year}/`,
    lastmod: undefined,
    priority: "0.4",
    changefreq: "monthly",
  }));

  // 年月別ページ
  const yearMonthSet = new Set<string>();
  posts.forEach((post) => {
    const d = new Date(post.data.date);
    const year = d.getFullYear().toString();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    yearMonthSet.add(`${year}/${month}`);
  });
  const yearMonthUrls = Array.from(yearMonthSet).map((ym) => ({
    loc: `${SITE_URL}/${ym}/`,
    lastmod: undefined,
    priority: "0.4",
    changefreq: "monthly",
  }));

  // 静的ページ
  const staticUrls = [
    {
      loc: `${SITE_URL}/`,
      lastmod: undefined,
      priority: "1.0",
      changefreq: "daily",
    },
    {
      loc: `${SITE_URL}/about/`,
      lastmod: undefined,
      priority: "0.6",
      changefreq: "monthly",
    },
    {
      loc: `${SITE_URL}/tags/`,
      lastmod: undefined,
      priority: "0.6",
      changefreq: "weekly",
    },
    {
      loc: `${SITE_URL}/privacy-policies/`,
      lastmod: undefined,
      priority: "0.3",
      changefreq: "yearly",
    },
  ];

  const allUrls = [
    ...staticUrls,
    ...postUrls,
    ...tagUrls,
    ...yearUrls,
    ...yearMonthUrls,
  ];

  const urlEntries = allUrls
    .map((entry) => {
      const lastmodTag = entry.lastmod
        ? `\n    <lastmod>${entry.lastmod}</lastmod>`
        : "";
      return `  <url>
    <loc>${entry.loc}</loc>${lastmodTag}
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
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
