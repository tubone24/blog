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
              objectID: id
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
          objectID,
          excerpt,
          html,
          frontmatter: { title, tags },
          fields: { slug },
        },
      }) => ({
        objectID,
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
  skipIndexing: process.env.NETLIFY_ENV !== 'production',
  queries,
};
