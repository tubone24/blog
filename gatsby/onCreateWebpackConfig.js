module.exports = ({ plugins, actions, stage, getConfig }) => {
  if (stage === "build-javascript") {
    const config = getConfig();
    const miniCssExtractPlugin = config.plugins.find(
      (plugin) => plugin.constructor.name === "MiniCssExtractPlugin"
    );
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true;
    }
    actions.replaceWebpackConfig(config);
  }
  actions.setWebpackConfig({
    plugins: [
      plugins.contextReplacement(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${["javascript", "bash"].join("|")})$`)
      ),
    ],
  });
};
