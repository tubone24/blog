import React from "react";

import { Link, graphql } from "gatsby";

const NotFoundPage = ({ data }: { data: GatsbyTypes.getAllPagesQuery }) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <h1>404 Not Found...</h1>
        <h2>Anything else...?</h2>
        {data.allSitePage.edges.map((page) => (
          <Link to={page.node.path} key={page.node.path}>
            <li>{page.node.path}</li>
          </Link>
        ))}
      </div>
    </div>
  </div>
);

export const pageQuery = graphql`
  query getAllPages {
    allSitePage {
      edges {
        node {
          path
        }
      }
    }
  }
`;

export default NotFoundPage;
