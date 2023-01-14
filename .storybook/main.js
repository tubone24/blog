const path = require("path")
module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    '@storybook/addon-actions',
    '@storybook/addon-knobs',
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-controls',
    '@storybook/addon-interactions',
    "@storybook/addon-viewport",
    "@storybook/addon-storysource",
  ],
  "staticDirs": ["../static"],
  "framework": "@storybook/react",
  webpackFinal: async (config) => {
    // https://github.com/gatsbyjs/gatsby/discussions/36293
    config.externals = ["react-dom/client"]
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/]
    // Use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
    config.module.rules[0].use[0].options.plugins.push([
        require.resolve("babel-plugin-remove-graphql-queries"),
      {
        stage: config.mode === `development` ? "develop-html" : "build-html",
        staticQueryDir: "page-data/sq/d",
      },
    ])

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
  features: {
    interactionsDebugger: true,
  },
  core: {
    builder: "@storybook/builder-webpack5"
  },
}
