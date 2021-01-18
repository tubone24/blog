import React from 'react';
import { graphql, Link, withPrefix } from 'gatsby';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';

import './period-summary.scss'

const PeriodSummary = ({ data, pageContext }) => {
  const { displayMonth, displayYear } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  let title;
  let url;
  if (displayMonth == null) {
    title = `${displayYear}年の記事 (${totalCount}件)`;
    url = `https://blog.tubone-project24.xyz/${displayYear}/`;
  } else {
    title = `${displayYear}年${displayMonth}月の記事 (${totalCount}件)`;
    url = `https://blog.tubone-project24.xyz/${displayYear}/${displayMonth}`;
  }
  return (
    <div className="container">
      <div
        className="row"
        style={{
          margin: 15,
        }}
      >
        <Sidebar />

        <div className="col-xl-10 col-lg-7 col-md-12 col-xs-12 order-2 period">
          <h2>
            {title}
          </h2>
          <ul>
            {edges.map(({ node }) => {
              const { title, url, yyyymmdd } = node.frontmatter;
              return (
                <li key={url}>
                  {yyyymmdd}&nbsp;&nbsp;<Link to={withPrefix(url)} href={withPrefix(url)} title={title}>{title}</Link>
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
        siteTitleAlt="tubone BOYAKI"
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
            sort: { order: DESC, fields: frontmatter___date }
            filter: { frontmatter: { date: { gte: $periodStartDate, lt: $periodEndDate } } }
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
