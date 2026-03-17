import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrismPlus from "rehype-prism-plus";
import rehypeMermaid from "@beoe/rehype-mermaid";
import remarkDirective from "remark-directive";
import remarkGithubCard from "./src/lib/remark-github-card.mjs";
import remarkToc from "remark-toc";
import remarkEmbedderModule from "@remark-embedder/core";
import oembedTransformerModule from "@remark-embedder/transformer-oembed";
import rehypeGatsbyCodeMeta from "./src/lib/rehype-gatsby-code-meta.mjs";
import rehypeShellPrompt from "./src/lib/rehype-shell-prompt.mjs";
import rehypeLazyImages from "./src/lib/rehype-lazy-images.mjs";
import rehypeImageDimensions from "./src/lib/rehype-image-dimensions.mjs";
import rehypePictureImages from "./src/lib/rehype-picture-images.mjs";
import rehypeAltBadge from "./src/lib/rehype-alt-badge.mjs";
import netlifyHeaders from "./src/lib/astro-netlify-headers.mjs";
import imageVariantFallback from "./src/lib/vite-image-fallback.mjs";

const remarkEmbedder = remarkEmbedderModule.default || remarkEmbedderModule;
const oembedTransformer =
  oembedTransformerModule.default || oembedTransformerModule;

const retryableOembedTransformer = {
  name: "retryable-oembed",
  shouldTransform(url) {
    return oembedTransformer.shouldTransform(url);
  },
  async getHTML(url, config) {
    const maxRetries = 3;
    let lastError;
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await oembedTransformer.getHTML(url, config);
      } catch (error) {
        lastError = error;
        if (attempt < maxRetries - 1) {
          const delay = Math.pow(2, attempt) * 1000;
          console.warn(
            `remark-embedder: retry ${attempt + 1}/${maxRetries} for ${url} in ${delay}ms`,
          );
          await new Promise((r) => setTimeout(r, delay));
        }
      }
    }
    throw lastError;
  },
};

export default defineConfig({
  site: "https://tubone-project24.xyz",
  publicDir: "static",
  legacy: {
    collections: true,
  },
  integrations: [react(), netlifyHeaders()],
  vite: {
    plugins: [imageVariantFallback()],
    css: {
      preprocessorOptions: {
        scss: {},
      },
      modules: {
        localsConvention: "camelCaseOnly",
      },
    },
    ssr: {
      noExternal: ["autocomplete.js"],
    },
    optimizeDeps: {
      include: ["algoliasearch/lite", "autocomplete.js"],
      exclude: ["gatsby", "gatsby-paginate", "react-helmet-async"],
    },
  },
  markdown: {
    remarkPlugins: [
      remarkDirective,
      remarkGithubCard,
      [
        remarkEmbedder,
        {
          transformers: [retryableOembedTransformer],
          handleError({ error, url }) {
            console.error(
              `remark-embedder: all retries failed for ${url}: ${error.message}`,
            );
            return `<a href="${url}">${url}</a>`;
          },
        },
      ],
      [remarkToc, { heading: "Table of Contents|toc|TOC|目次", maxDepth: 3 }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [
        rehypeAutolinkHeadings,
        {
          behavior: "prepend",
          properties: {
            className: ["anchor-link"],
            ariaHidden: true,
            tabIndex: -1,
          },
          content: {
            type: "element",
            tagName: "span",
            properties: { className: ["anchor-icon"] },
            children: [{ type: "text", value: "#" }],
          },
        },
      ],
      [
        rehypeExternalLinks,
        { target: "_blank", rel: ["noopener", "noreferrer"] },
      ],
      rehypeMermaid,
      rehypeGatsbyCodeMeta,
      [rehypePrismPlus, { ignoreMissing: true }],
      rehypeShellPrompt,
      rehypeLazyImages,
      rehypeImageDimensions,
      rehypePictureImages,
      rehypeAltBadge,
    ],
    syntaxHighlight: false,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  trailingSlash: "always",
  output: "static",
});
