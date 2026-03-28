import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import config from "../config/index.json";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog");
  return posts.map((post) => ({
    params: { slug: post.slug },
    props: { post },
  }));
};

function yamlQuote(value: string): string {
  if (
    /[:#[{}&*!|>'"%@`,\n\]]/.test(value) ||
    value.startsWith(" ") ||
    value.endsWith(" ")
  ) {
    return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
  }
  return value;
}

export const GET: APIRoute = ({ props }) => {
  const { post } = props as {
    post: { slug: string; body?: string; data: Record<string, unknown> };
  };
  const data = post.data;

  const lines: string[] = ["---"];
  lines.push(`title: ${yamlQuote(String(data.title || ""))}`);
  lines.push(`date: ${(data.date as Date).toISOString()}`);

  if (data.description) {
    lines.push(`description: ${yamlQuote(String(data.description))}`);
  }

  if (Array.isArray(data.tags) && data.tags.length > 0) {
    lines.push("tags:");
    for (const tag of data.tags) {
      lines.push(`  - ${tag}`);
    }
  }

  if (data.headerImage) {
    lines.push(`headerImage: ${yamlQuote(String(data.headerImage))}`);
  }

  lines.push(`url: ${config.siteUrl}/${post.slug}/`);
  lines.push(`author: ${config.author}`);
  lines.push("---");

  // 画像の相対パスを絶対URLに変換
  const body = (post.body || "").replace(
    /(!?\[[^\]]*\]\()(\/)([^)]+\))/g,
    `$1${config.siteUrl}/$3`,
  );

  const markdown = lines.join("\n") + "\n\n" + body;

  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
    },
  });
};
