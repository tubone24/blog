const {
  NODE_ENV,
  URL: NETLIFY_SITE_URL = 'https://blog.tubone-project24.xyz',
  DEPLOY_PRIME_URL: NETLIFY_DEPLOY_URL = NETLIFY_SITE_URL,
  CONTEXT: NETLIFY_ENV = NODE_ENV,
} = process.env;
const isNetlifyProduction = NETLIFY_ENV === 'production';
const siteUrl = isNetlifyProduction ? NETLIFY_SITE_URL : NETLIFY_DEPLOY_URL;
module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'tubone BOYAKI',
    description: 'tubone BOYAKI',
    siteUrl,
    author: 'tubone',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-react-helmet-canonical-urls',
      options: {
        siteUrl: NETLIFY_SITE_URL,
        noQueryString: true,
      },
    },
    'gatsby-plugin-sass',
    {
      resolve: 'gatsby-plugin-minify-classnames',
      options: {
        develop: false,
      },
    },
    // 'gatsby-plugin-catch-links',
    // {
    //   resolve: 'gatsby-plugin-zopfli',
    //   options: {
    //     extensions: ['css', 'html', 'js', 'svg'],
    //   },
    // },
    {
      resolve: 'gatsby-remark-copy-linked-files',
    },
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyzer',
      options: {
        openAnalyzer: false,
      },
    },
    {
      resolve: 'gatsby-source-filesystem',
      options: {
        path: `${__dirname}/src/content`,
        name: 'pages',
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        resolveEnv: () => NETLIFY_ENV,
        env: {
          production: {
            policy: [{ userAgent: '*' }],
          },
          'branch-deploy': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
          'deploy-preview': {
            policy: [{ userAgent: '*', disallow: ['/'] }],
            sitemap: null,
            host: null,
          },
        },
      },
    },
    {
      resolve: 'gatsby-plugin-feed',
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
            serialize: ({ query: { site, allMarkdownRemark } }) => allMarkdownRemark.edges.map((edge) => ({
              ...edge.node.frontmatter,
              description: edge.node.excerpt.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(/\s+/g, '').replace(/#x.*;/, '').replace(/&/, ''),
              date: edge.node.frontmatter.date,
              url: `${site.siteMetadata.siteUrl}/${edge.node.fields.slug}`,
              guid: site.siteMetadata.siteUrl + edge.node.fields.slug,
            //   custom_elements: [{
            //     'content:encoded': edge.node.html.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').replace(/\s+/g, '').replace(/#x.*;/, '').replace(/&/, '')
            //       .substr(0, 150),
            //   }],
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
                        date
                      }
                    }
                  }
                }
              }
            `,
            output: '/rss.xml',
            title: 'tubone\'s Boyaki',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-algolia',
      // eslint-disable-next-line global-require
      options: require('./gatsby-plugin-algolia-config.js'),
    },
    // 'gatsby-plugin-sharp',
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          //'gatsby-remark-graphviz',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-embed-youtube',
          'gatsby-remark-responsive-iframe',
          'gatsby-plugin-twitter',
          'gatsby-remark-slideshare',
          //'gatsby-remark-mermaid',
          'gatsby-remark-reading-time',
          {
            resolve: 'gatsby-remark-table-of-contents',
            options: {
              exclude: 'Table of Contents',
              tight: false,
              fromHeading: 2,
              toHeading: 4,
            },
          },
          // {
          //   resolve: 'gatsby-remark-images',
          //   options: {
          //     withWebp: true,
          //     quality: 80,
          //   },
          // },
          {
            resolve: 'gatsby-remark-audio',
            options: {
              preload: 'auto',
              loop: false,
              controls: true,
              muted: false,
              autoplay: false,
            },
          },
          {
            resolve: 'gatsby-remark-video',
            options: {
              width: 'auto',
              height: 'auto',
              preload: 'auto',
              muted: true,
              autoplay: true,
              playsinline: true,
              controls: true,
              loop: true,
            },
          },
          'gatsby-remark-numbered-footnotes',
          {
            resolve: 'gatsby-plugin-sentry',
            options: {
              dsn: 'https://097c36a02dd64e139ba2952e8882046d@sentry.io/1730608',
              environment: process.env.NODE_ENV,
              enabled: (() => ['production', 'stage'].indexOf(process.env.NODE_ENV) !== -1)(),
            },
          },
          {
            resolve: 'gatsby-remark-embed-soundcloud',
            options: {
              width: '80%', // default is "100%"
              height: 200, // default is 300
              color: '#6cff8c', // default is #ff5500
              autoplay: false, // default is false
            },
          },
          // {
          //   resolve: '@weknow/gatsby-remark-codepen',
          //   options: {
          //     theme: 'dark',
          //     height: 400,
          //   },
          // },
          // {
          //   resolve: 'gatsby-remark-embed-gist',
          //   options: {
          //     username: 'tubone24',
          //     includeDefaultCss: true,
          //   },
          // },
          'gatsby-remark-embed-spotify',
          {
            resolve: 'gatsby-remark-prismjs',
            options: {
              classPrefix: 'language-',
              inlineCodeMarker: null,
              aliases: {},
              showLineNumbers: true,
              noInlineHighlight: false,
            },
          },
          {
            resolve: 'gatsby-remark-external-links',
            options: {
              rel: 'noopener noreferrer',
            },
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-layout',
      options: {
        component: require.resolve('./src/components/Layout/layout.js'),
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
    },
    {
      resolve: 'gatsby-plugin-lodash',
      options: {
        disabledFeatures: ['shorthands', 'cloning'],
      },
    },
    {
      resolve: 'gatsby-plugin-nprogress',
      options: {
        color: '#1bd77f',
      },
    },
    'gatsby-plugin-optimize-svgs',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'tubone BOYAKI',
        short_name: 'tuboneBOYAKI',
        description: 'Boyaki makes a new world',
        lang: 'ja',
        start_url: '/',
        background_color: '#ededed',
        theme_color: '#33b546',
        display: 'minimal-ui',
        icons: [
          {
            src: '/favicons/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicons/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
    },
    {
      resolve: 'gatsby-plugin-minify',
      options: {
        caseSensitive: false,
        collapseBooleanAttributes: true,
        useShortDoctype: false,
        removeEmptyElements: false,
        removeComments: true,
        removeAttributeQuotes: true,
        minifyCSS: true,
        minifyJS: true,
      },
    }, // put this after gatsby-plugin-manifest
    'gatsby-plugin-cdn-files',
    {
      resolve: 'gatsby-plugin-offline',
      options: {
        precachePages: ['/about/', 'tags/*'],
      },
    },
    'gatsby-plugin-netlify', // make sure to put last in the array
  ],
};
