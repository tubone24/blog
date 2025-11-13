const config = require("./src/config/index.json");
const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = "https://tubone-project24.xyz",
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
  GATSBY_ALGOLIA_APP_ID,
  GATSBY_ALGOLIA_ADMIN_API_KEY,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_CLIENT_ID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_CLIENT_SECRET,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_SHA,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === "production";
const hasAlgoliaConfig = GATSBY_ALGOLIA_APP_ID && GATSBY_ALGOLIA_ADMIN_API_KEY;
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;
const siteTitle = config.siteTitle;
const siteShortTitle = config.siteShortTitle;
const siteDescription = config.description;
const siteAuthor = config.author;

module.exports = {
  pathPrefix: "/",
  graphqlTypegen: true,
  siteMetadata: {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
    author: siteAuthor,
  },
  plugins: [
    // gatsby-plugin-preact is not compatible with React 18 / Gatsby 5
    // "gatsby-plugin-preact",
    // Pages Storybook don't create pages-json
    {
      resolve: "gatsby-plugin-exclude",
      options: { paths: ["/*.stories/"] },
    },
    "gatsby-plugin-react-helmet-async",
    "gatsby-plugin-sass",
    {
      resolve: "gatsby-plugin-minify-classnames",
      options: {
        enable: isNetlifyProduction,
      },
    },
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true, // Print removed selectors and processed file names
        develop: true, // Enable while using `gatsby develop`
        // tailwind: true, // Enable tailwindcss support
        // ignore: ['/ignored.css', 'prismjs/', 'docsearch.js/'], // Ignore files/folders
        purgeOnly: ["src/styles/global.scss"], // Purge only these files/folders
        purgeCSSOptions: {
          // https://purgecss.com/configuration.html#options
          // safelist: ['safelist'], // Don't remove this selector
        },
        // More options defined here https://purgecss.com/configuration.html#options
      },
    },
    {
      resolve: "gatsby-remark-copy-linked-files",
    },
    {
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      options: {
        analyzerMode: "static",
        reportFilename: "webpack-bundle-analyser/index.html",
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        path: `${__dirname}/src/content`,
        name: "pages",
        ignore: [`${__dirname}/src/__generated__/*.ts`],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: NETLIFY_SITE_URL,
        sitemap: `${NETLIFY_SITE_URL}/sitemap-index.xml`,
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [
              { userAgent: "*", allow: "/" },
              { userAgent: "*", disallow: "/admin" },
              { userAgent: "*", disallow: "/*.netlify.app$" },
              { userAgent: "*", disallow: "/preview/" },
            ],
          },
          "branch-deploy": {
            policy: [{ userAgent: "*", disallow: ["/"] }],
            sitemap: null,
            host: null,
          },
          "deploy-preview": {
            policy: [{ userAgent: "*", disallow: ["/"] }],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    {
      resolve: "gatsby-plugin-feed",
      options: {
        query: `
          {
            site {
              siteMetadata {
                title
                description
                siteUrl
                site_url: siteUrl
              }
            }
          }
        `,
        feeds: [
          {
            // eslint-disable-next-line max-len
            serialize: ({ query: { site, allMarkdownRemark } }) =>
              allMarkdownRemark.edges.map((edge) => ({
                ...edge.node.frontmatter,
                title: edge.node.frontmatter.title,
                date: edge.node.frontmatter.date,
                url: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
                guid: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
                custom_elements: [
                  { "content:encoded": edge.node.html },
                  { author: config.author },
                ],
              })),
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  limit: 50,
                ) {
                  edges {
                    node {
                      excerpt
                      html
                      rawMarkdownBody
                      fields { slug }
                      frontmatter {
                        title
                        date(formatString: "ddd, DD MMM YYYY, h:mm:ss +0900")
                      }
                    }
                  }
                }
              }
            `,
            output: "/rss.xml",
            title: siteTitle,
            description: siteDescription,
            feed_url: `${siteUrl}/rss.xml`,
            site_url: siteUrl,
            docs: "http://github.com/dylang/node-rss",
            language: "ja",
            copyright: `Copyright © ${new Date().getFullYear()} ${
              config.author
            }`,
          },
        ],
      },
    },
    // Conditionally add Algolia plugin only if credentials are available
    ...(hasAlgoliaConfig
      ? [
          {
            resolve: "gatsby-plugin-algolia",
            // eslint-disable-next-line global-require
            options: require("./gatsby-plugin-algolia-config.js"),
          },
        ]
      : []),
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-table-of-contents",
            options: {
              exclude: "Table of Contents",
              tight: false,
              fromHeading: 2,
              toHeading: 4,
            },
          },
          "gatsby-remark-numbered-footnotes",
          "gatsby-remark-prismjs-title",
          {
            resolve: "gatsby-remark-prismjs",
            options: {
              classPrefix: "language-",
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: false,
              noInlineHighlight: false,
            },
          },
          "gatsby-remark-autolink-headers",
          {
            resolve: "gatsby-remark-external-links",
            options: {
              rel: "noopener noreferrer",
            },
          },
          "gatsby-remark-check-links",
        ],
      },
    },
    {
      resolve: "gatsby-plugin-layout",
      options: {
        component: require.resolve("./src/components/Layout/layout.tsx"),
      },
    },
    {
      resolve: "gatsby-plugin-sitemap",
      options: {
        output: "/",
        query: `
          {
            site {
              siteMetadata {
                siteUrl
              }
            }
            allSitePage {
              nodes {
                path
              }
            }
            allMarkdownRemark {
              nodes {
                fields {
                  slug
                }
                frontmatter {
                  date
                }
              }
            }
          }
        `,
        resolvePages: ({ allSitePage, allMarkdownRemark }) => {
          const markdownPages = allMarkdownRemark.nodes.reduce((acc, node) => {
            const path = `/${node.fields.slug}`;
            acc[path] = {
              path,
              lastmod: node.frontmatter.date,
            };
            return acc;
          }, {});

          return allSitePage.nodes.map((page) => ({
            ...page,
            ...(markdownPages[page.path] || {}),
          }));
        },
        serialize: ({ path, lastmod }) => {
          return {
            url: path,
            lastmod,
          };
        },
      },
    },
    {
      resolve: "gatsby-plugin-nprogress",
      options: {
        color: "#1bd77f",
      },
    },
    "gatsby-plugin-optimize-svgs",
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: siteTitle,
        short_name: siteShortTitle,
        description: siteDescription,
        lang: "ja",
        start_url: "/",
        background_color: "#ededed",
        theme_color: "#33b546",
        display: "minimal-ui",
        icons: [
          {
            src: "/favicons/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/favicons/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-minify",
      options: {
        caseSensitive: false,
        collapseBooleanAttributes: true,
        useShortDoctype: true,
        removeEmptyElements: false,
        removeComments: true,
        removeAttributeQuotes: false,
        minifyCSS: true,
        minifyJS: true,
      },
    },
    // Temporarily disabled gatsby-plugin-offline to fix ERR_FAILED issues
    // {
    //   resolve: "gatsby-plugin-offline",
    //   options: {
    //     precachePages: [`/`, `/404.html`],
    //     workboxConfig: {
    //       globPatterns: ["*.html"],
    //       skipWaiting: true,
    //       clientsClaim: true,
    //       runtimeCaching: [
    //         {
    //           urlPattern: /\/$/,
    //           handler: "NetworkFirst",
    //         },
    //         {
    //           urlPattern: /^https?:.*\/page-data\/.*\.json/,
    //           handler: "CacheFirst",
    //         },
    //       ],
    //     },
    //   },
    // },
    {
      resolve: "gatsby-plugin-netlify", // make sure to put last in the array
      options: {
        headers: {
          "/*": ["X-Content-Type-Options: nosniff"],
          "/*.html": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/*.json": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/page-data/*": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/static/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/assets/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/favicons/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/icons/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/fonts/*": ["Cache-Control: public, max-age=31536000, immutable"],
          "/sw.js": [
            "Cache-Control: public, max-age=0, must-revalidate",
            "Content-Type: application/javascript",
          ],
          "llms.txt": [
            "X-Robots-Tag: noindex",
            "Content-Type: text/plain; charset=utf-8",
          ],
          "/**/*.js": ["Cache-Control: public, max-age=31536000, immutable"],
          "/**/*.css": ["Cache-Control: public, max-age=31536000, immutable"],
        },
      },
    },
  ],
};
