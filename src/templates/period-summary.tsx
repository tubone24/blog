import React from "react";
import { graphql, Link, withPrefix } from "gatsby";
import SEO from "@/components/SEO";
import Sidebar from "@/components/Sidebar";

import * as style from "./period-summary.module.scss";

import config from "@/config/index.json";

const PeriodSummary = ({
  data,
  pageContext,
}: {
  data: GatsbyTypes.PeriodQueryQuery;
  pageContext: { displayMonth: string; displayYear: string };
}) => {
  const { displayMonth, displayYear } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  let title;
  let url;
  if (displayMonth == null) {
    title = `${displayYear}年の記事 (${totalCount}件)`;
    url = `https://tubone-project24.xyz/${displayYear}/`;
  } else {
    title = `${displayYear}年${displayMonth}月の記事 (${totalCount}件)`;
    url = `https://tubone-project24.xyz/${displayYear}/${displayMonth}`;
  }
  return (
    <div className="container">
      <div className={style.row + " row"}>
        <Sidebar />

        <div className={style.period + " col order-2"}>
          <h2>{title}</h2>
          <ul>
            {edges.map(({ node }) => {
              const frontmatter = node.frontmatter;
              return (
                <li key={frontmatter?.url}>
                  {frontmatter?.yyyymmdd}&nbsp;&nbsp;
                  <Link
                    to={withPrefix(frontmatter?.url || "/")}
                    title={frontmatter?.title}
                  >
                    {frontmatter?.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="col-xl-2 col-lg-1 order-3" />
      </div>

      <SEO
        title={title}
        url={url}
        siteTitleAlt={config.siteTitle}
        isPost={false}
        description={title}
        tag=""
        image="https://i.imgur.com/StLyXdu.png"
      />
    </div>
  );
};

export default PeriodSummary;

export const pageQuery = graphql`
  query PeriodQuery($periodStartDate: Date, $periodEndDate: Date) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: {
        frontmatter: { date: { gte: $periodStartDate, lt: $periodEndDate } }
      }
    ) {
      totalCount
      edges {
        node {
          id
          frontmatter {
            id
            url: slug
            title
            date
            yyyymmdd: date(formatString: "YYYY-MM-DD")
            tags
            headerImage
            description
          }
        }
      }
    }
  }
`;
