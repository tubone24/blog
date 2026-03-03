import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    description: z.string().optional().default(""),
    tags: z.array(z.string()).optional().default([]),
    headerImage: z.string().optional().default(""),
    templateKey: z.string().optional(),
    useAi: z.boolean().optional().default(false),
  }),
});

export const collections = { blog };
