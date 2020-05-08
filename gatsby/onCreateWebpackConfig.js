module.exports = ({ plugins, actions, stage }) => {
  if (stage === 'build-javascript') {
    actions.setWebpackConfig({
      devtool: false,
    });
  }
  actions.setWebpackConfig({
    plugins: [
      plugins.contextReplacement(
        /highlight\.js\/lib\/languages$/,
        new RegExp(`^./(${['javascript', 'bash'].join('|')})$`),
      ),
    ],
  });
};
