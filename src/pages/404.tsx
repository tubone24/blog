import React from "react";

import { Link, graphql } from "gatsby";
import * as style from "./404.module.scss";

export type GetAllPageQuery = { data: GatsbyTypes.getAllPagesQuery };

const NotFoundPage = ({ data }: GetAllPageQuery) => (
  <div className="container">
    <div className="row">
      <div className={style.notFound + " col"}>
        <h1>404 Not Found...</h1>
        <h2>Anything else...?</h2>
        <ul>
          {data.allSitePage.edges.map((page) => (
            <li key={page.node.path}>
              <Link to={page.node.path} key={page.node.path}>
                {page.node.path}
              </Link>
            </li>
          ))}
        </ul>
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
