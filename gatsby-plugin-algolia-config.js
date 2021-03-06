require('dotenv').config({
  path: '.env',
});

const queries = [
  {
    query: `
      {
        allMarkdownRemark {
          edges {
            node {
              excerpt
              html
              frontmatter {
                title
                tags
              }
              fields {
                slug
              }
            }
          }
        }
      }
    `,
    transformer: ({ data }) => data.allMarkdownRemark.edges.map(
      ({
        node: {
          excerpt,
          html,
          frontmatter: { title, tags },
          fields: { slug },
        },
      }) => ({
        title,
        description: excerpt,
        allText: html.replace(/<code[\s, \S]*?<\/code>/g, '').replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '').slice(0, 3000),
        tags: tags.join(),
        path: slug,
      }),
    ),
  },
];

module.exports = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID,
  apiKey: process.env.GATSBY_ALGOLIA_ADMIN_API_KEY,
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME,
  queries,
};
