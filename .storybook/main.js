const path = require("path")
const webpack = require("webpack")

module.exports = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],

  "addons": ["@storybook/addon-links", '@storybook/addon-a11y', "@storybook/addon-docs"],

  "staticDirs": ["../static"],

  "framework": {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    }
  },
  
  typescript: {
    check: false,
    reactDocgen: 'react-docgen-typescript',
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) => (prop.parent ? !/node_modules/.test(prop.parent.fileName) : true),
    },
  },

  webpackFinal: async (config) => {
    // Remove externals that cause issues
    config.externals = []
    
    // Add ProvidePlugin to make React and process available globally
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
        process: 'process/browser',
      })
    )
    
    // Find the JavaScript/TypeScript rule
    const jsRule = config.module.rules.find(rule => {
      if (rule.test instanceof RegExp) {
        return rule.test.test('.js') || rule.test.test('.jsx') || rule.test.test('.ts') || rule.test.test('.tsx')
      }
      return false
    })

    if (jsRule) {
      // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
      jsRule.exclude = [/node_modules\/(?!(gatsby)\/)/]
      
      // Find babel-loader
      if (jsRule.use && Array.isArray(jsRule.use)) {
        const babelLoader = jsRule.use.find(loader => 
          loader.loader && loader.loader.includes('babel-loader')
        )
        if (babelLoader && babelLoader.options) {
          // Initialize plugins array if it doesn't exist
          if (!babelLoader.options.plugins) {
            babelLoader.options.plugins = []
          }
          // Use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
          babelLoader.options.plugins.push([
            require.resolve("babel-plugin-remove-graphql-queries"),
            {
              stage: config.mode === `development` ? "develop-html" : "build-html",
              staticQueryDir: "page-data/sq/d",
            },
          ])
        }
      }
    }

    config.module.rules.push({
      test: /\.module\.scss$/,
      use: [
        {
          loader: "style-loader",
          options: {
            modules: {
              // for use CSS module in Storybook, namedExport is true.
              namedExport: true,
            },
          },
        },
        {
          loader: "css-loader",
          options: {
            importLoaders: 1,
            modules: {
              // for use CSS module in Storybook, namedExport is true.
              namedExport: true,
            }
          },
        },
        "sass-loader",
      ],
      include: path.resolve(__dirname, '../'),
    })
    config.module.rules.push({
      test: /\.scss$/,
      use: [
        "style-loader",
        {
          loader: "css-loader",
          options: {
            modules: {
              auto: true,
            }
          }
        },
        "sass-loader",
      ],
      include: path.resolve(__dirname, '../'),
      exclude: /\.module\.scss$/
    })

    // Add TypeScript support for stories
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            presets: [
              require.resolve('@babel/preset-env'),
              require.resolve('@babel/preset-react'),
              require.resolve('@babel/preset-typescript'),
            ],
            plugins: [
              require.resolve("babel-plugin-remove-graphql-queries"),
            ],
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    })

    // Add polyfills for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      os: require.resolve('os-browserify'),
      tty: require.resolve('tty-browserify'),
      path: require.resolve('path-browserify'),
      fs: false,
    }

    // Webpack 5 no longer polyfills Node.js core modules automatically.
    // We need to configure aliases for Gatsby.
    config.resolve.alias = {
      ...config.resolve.alias,
      // Mock Gatsby's global loader
      "gatsby/cache-dir/gatsby-browser-entry": require.resolve("./gatsby-mocks.js"),
      "gatsby/cache-dir/public-page-renderer": require.resolve("./gatsby-mocks.js"),
      "gatsby/cache-dir/page-renderer": require.resolve("./gatsby-mocks.js"),
      "gatsby/cache-dir/query-result-store": require.resolve("./gatsby-mocks.js"),
      "gatsby/cache-dir/slice": require.resolve("./gatsby-mocks.js"),
      "gatsby/cache-dir/static-query": require.resolve("./gatsby-mocks.js"),
      "gatsby": require.resolve("./gatsby-mocks.js"),
    }

    return config
  },

  features: {
    interactionsDebugger: true,
  }
}
