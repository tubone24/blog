import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import type { APIContext } from "astro";
import config from "../config/index.json";

export async function GET(context: APIContext) {
  const posts = await getCollection("blog");
  const sorted = posts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  return rss({
    title: config.siteTitle,
    description: config.description,
    site: context.site || config.siteUrl,
    items: sorted.slice(0, 100).map((post) => {
      const slug = post.slug;
      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description || "",
        link: `/${slug}/`,
      };
    }),
    customData: "<language>ja</language>",
  });
}
