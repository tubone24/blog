import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const blog = defineCollection({
  // 記事の URL は frontmatter の slug がそのまま決めているので、
  // Content Layer の id にもそれを使って従来の URL を維持する
  loader: glob({
    pattern: "**/*.md",
    base: "./src/content/blog",
    generateId: ({ data, entry }) =>
      typeof data.slug === "string" && data.slug.length > 0
        ? data.slug
        : entry.replace(/\.md$/, ""),
  }),
  schema: z.object({
    slug: z.string(),
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    headerImage: z.string().optional().default(""),
    updatedDate: z.coerce.date().optional(),
    faq: z
      .array(
        z.object({
          question: z.string(),
          answer: z.string(),
        }),
      )
      .optional()
      .default([]),
    templateKey: z.string().optional(),
    useAi: z.boolean().optional().default(false),
    noindex: z.boolean().optional().default(false),
    premium: z.boolean().optional().default(false),
    priceUsd: z.number().optional().default(0.05),
  }),
});

export const collections = { blog };
