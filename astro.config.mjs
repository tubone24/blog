import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeExternalLinks from 'rehype-external-links';
import rehypePrismPlus from 'rehype-prism-plus';
import remarkToc from 'remark-toc';
import rehypeLazyImages from './src/lib/rehype-lazy-images.mjs';

export default defineConfig({
  site: 'https://tubone-project24.xyz',
  publicDir: 'static',
  integrations: [
    react(),
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {},
      },
      modules: {
        localsConvention: 'camelCaseOnly',
      },
    },
    ssr: {
      noExternal: ['autocomplete.js'],
    },
    optimizeDeps: {
      include: ['algoliasearch/lite', 'autocomplete.js'],
      exclude: ['gatsby', 'gatsby-paginate', 'react-helmet-async'],
    },
  },
  markdown: {
    remarkPlugins: [
      [remarkToc, { heading: 'Table of Contents|toc|TOC|目次', maxDepth: 3 }],
    ],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, {
        behavior: 'prepend',
        properties: {
          className: ['anchor-link'],
          ariaHidden: true,
          tabIndex: -1,
        },
        content: {
          type: 'element',
          tagName: 'span',
          properties: { className: ['anchor-icon'] },
          children: [{ type: 'text', value: '#' }],
        },
      }],
      [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      [rehypePrismPlus, { ignoreMissing: true }],
      rehypeLazyImages,
    ],
    syntaxHighlight: false,
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  output: 'static',
});
