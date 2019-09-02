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
    'gatsby-plugin-sass',
    'gatsby-plugin-catch-links',
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        baseUrl: 'tubone-project24.xyz',
        hostingWPCOM: false,
        protocol: 'https',
        useACF: false,
        auth: {},
        verboseOutput: false,
        includedRoutes: [
          '**/posts',
        ],
      },
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
      resolve: 'gatsby-plugin-emotion',
      options: {
        // Accepts all options defined by `babel-plugin-emotion` plugin.
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
    },
    {
      resolve: 'gatsby-plugin-typography',
      options: {
        pathToConfigModule: 'src/utils/typography',
      },
    },
    {
      resolve: 'gatsby-transformer-remark',
      options: {
        plugins: [
          'gatsby-remark-autolink-headers',
          'gatsby-remark-copy-linked-files',
          'gatsby-remark-embed-youtube',
          'gatsby-remark-responsive-iframe',
          'gatsby-plugin-twitter',
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
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'tubone BOYAKI',
        short_name: 'tuboneBOYAKI',
        start_url: '/',
        background_color: '#ededed',
        theme_color: '#384f7c',
        display: 'standalone',
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
    'gatsby-plugin-offline', // put this after gatsby-plugin-manifest
    'gatsby-plugin-netlify', // make sure to put last in the array
  ],
};
