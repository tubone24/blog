import config from "src/config/index.json";
const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = "https://blog.tubone-project24.xyz",
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_CLIENT_ID,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_CLIENT_SECRET,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  GATSBY_GITHUB_SHA,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === "production";
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;
const siteTitle = config.siteTitle;
const siteShortTitle = config.siteShortTitle;
const siteDescription = config.description;
const siteAuthor = config.author;

module.exports = {
  pathPrefix: "/",
  siteMetadata: {
    title: siteTitle,
    description: siteDescription,
    siteUrl,
    author: siteAuthor,
  },
  plugins: [
    "gatsby-plugin-preact",
    "gatsby-plugin-typegen",
    // Pages Storybook don't create pages-json
    {
      resolve: "gatsby-plugin-exclude",
      options: { paths: ["/*.stories/"] },
    },
    "gatsby-plugin-react-helmet",
    {
      resolve: "gatsby-plugin-react-helmet-canonical-urls",
      options: {
        siteUrl: NETLIFY_SITE_URL,
        noQueryString: true,
      },
    },
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
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{ userAgent: "*" }],
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
              })),
            query: `
              {
                allMarkdownRemark(
                  sort: { order: DESC, fields: [frontmatter___date] },
                  limit: 20,
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
            feed_url: `${siteUrl}/rss.xml`,
            site_url: siteUrl,
            docs: "http://github.com/dylang/node-rss",
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-algolia",
      // eslint-disable-next-line global-require
      options: require("./gatsby-plugin-algolia-config.js"),
    },
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
          {
            resolve: "@raae/gatsby-remark-oembed",
            options: {
              usePrefix: false,
              providers: {
                settings: {
                  hatenablog: {
                    endpoints: [
                      {
                        schemes: ["https://*.hatenablog.com/*"],
                        url: "https://hatenablog.com/oembed",
                      },
                    ],
                  },
                },
              },
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
      resolve: `gatsby-plugin-csp`,
      options: {
        disableOnDev: true,
        reportOnly: false,
        mergeScriptHashes: true,
        mergeStyleHashes: true,
        mergeDefaultDirectives: true,
        directives: {
          "script-src":
            "'self' *.google-analytics.com https://*.twitter.com https://*.instagram.com https://embedr.flickr.com https://embed.redditmedia.com https://*.ad-stir.com https://blog-storybook.netlify.app https://www.youtube.com 'strict-dynamic'",
          "style-src": "'self' 'unsafe-inline'",
          "img-src": "*",
          "frame-ancestors":
            "'self' https://*.google-analytics.com https://*.twitter.com https://www.instagram.com https://embedr.flickr.com https://embed.redditmedia.com https://*.ad-stir.com https://blog-storybook.netlify.app https://www.youtube.com;",
          "report-uri": "/.netlify/functions/csp-report",
        },
      },
    },
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
    {
      resolve: "gatsby-plugin-offline",
      options: {
        workboxConfig: {
          runtimeCaching: [
            {
              urlPattern: /^https?:.*\/page-data\/.*\.json/,
              handler: "NetworkFirst",
            },
          ],
        },
      },
    },
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
          "/sw.js": ["Cache-Control: public, max-age=0, must-revalidate"],
          "/**/*.js": ["Cache-Control: public, max-age=31536000, immutable"],
          "/**/*.css": ["Cache-Control: public, max-age=31536000, immutable"],
        },
      },
    },
  ],
};
