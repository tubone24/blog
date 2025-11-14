const path = require("path")

module.exports = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: [
    "@storybook/addon-links",
    "@storybook/addon-a11y",
    "@storybook/addon-webpack5-compiler-swc",
    "@chromatic-com/storybook",
    "@storybook/addon-docs"
  ],

  staticDirs: ["../static"],

  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {},
    },
  },

  docs: {},

  webpackFinal: async (config) => {
    // Add alias for @ to src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      // Mock Gatsby modules to avoid import issues in Storybook
      // Use Storybook-specific mock (ESM format without jest.fn())
      'gatsby': path.resolve(__dirname, './__mocks__/gatsby.js'),
      // Fix @storybook/test module resolution issue in Storybook 10.x
      // Force using the browser-compatible .mjs version instead of the Node.js .js version
      '@storybook/test': path.resolve(__dirname, '../node_modules/@storybook/test/dist/index.mjs'),
    };

    // Provide process polyfill for browser environment
    const webpack = require('webpack');
    config.plugins.push(
      new webpack.ProvidePlugin({
        process: 'process/browser',
      })
    );

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

    return config
  },

  typescript: {
    reactDocgen: false
  }
}
