// eslint-disable-next-line @typescript-eslint/no-var-requires
require("dotenv").config({
  path: ".env",
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
    transformer: ({ data }) =>
      data.allMarkdownRemark.edges.map(
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
          allText: html
            .replace(/<code[\s, \S]*?<\/code>/g, "")
            .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, ""),
          tags: tags.join(),
          path: slug,
        })
      ),
  },
];

module.exports = {
  appId: process.env.GATSBY_ALGOLIA_APP_ID || "dummy",
  apiKey: process.env.GATSBY_ALGOLIA_ADMIN_API_KEY || "dummy",
  indexName: process.env.GATSBY_ALGOLIA_INDEX_NAME || "dummy",
  skipIndexing:
    !process.env.GATSBY_ALGOLIA_APP_ID ||
    !process.env.GATSBY_ALGOLIA_ADMIN_API_KEY ||
    process.env.NETLIFY_ENV !== "production",
  queries,
};
