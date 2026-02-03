exports.onCreateNode = require("./gatsby/onCreateNode");

// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.createPages = require("./gatsby/index").createPages;

exports.onCreateWebpackConfig = require("./gatsby/onCreateWebpackConfig");

// eslint-disable-next-line @typescript-eslint/no-var-requires
exports.onPostBuild = require("./gatsby/onPostBuild").onPostBuild;

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;
  const typeDefs = `
    type MarkdownRemarkFrontmatter {
      useAi: Boolean
    }
  `;
  createTypes(typeDefs);
};
