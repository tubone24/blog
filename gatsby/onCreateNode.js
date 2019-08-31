const { createFilePath } = require('gatsby-source-filesystem');

module.exports = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    let { slug = '' } = node.frontmatter;

    if (slug === null || slug.trim() === '') {
      slug = createFilePath({ node, getNode, basePath: 'pages' });
    }

    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};
