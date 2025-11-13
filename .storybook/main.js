const path = require("path")

module.exports = {
  stories: [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
    "@storybook/addon-storysource",
  ],
  staticDirs: ["../static"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        useSWC: true,
      },
    },
  },
  docs: {
    autodocs: true,
  },
  webpackFinal: async (config) => {
    // https://github.com/gatsbyjs/gatsby/discussions/36293
    config.externals = ["react-dom/client"]

    // Add alias for @ to src directory
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
    }

    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    // Find the rule that handles JavaScript/TypeScript files
    config.module.rules.forEach((rule) => {
      if (rule.test && String(rule.test).includes('jsx')) {
        // Update exclude to transpile gatsby modules
        rule.exclude = [/node_modules\/(?!(gatsby|@gatsbyjs)\/)/];
      }
    });

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
}
