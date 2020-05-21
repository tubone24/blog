import React from 'react';
import { graphql } from 'gatsby';
import SEO from '../components/SEO';
import Sidebar from '../components/Sidebar';

const PeriodSummary = ({ data, pageContext }) => {
  const { displayMonth, displayYear } = pageContext;
  const { edges, totalCount } = data.allMarkdownRemark;
  return (
    <div className="container">
      <div
        className="row"
        style={{
          margin: 15,
        }}
      >
        <Sidebar />

        <div className="col-xl-10 col-lg-7 col-md-12 col-xs-12 order-2">
          <h2>
            {displayYear}年{displayMonth}月の記事 ({totalCount})
          </h2>
          <ul>
            {edges.map(({ node }) => {
              const { title, url, yyyymmdd } = node.frontmatter;
              return (
                <li key={url}>
                  {yyyymmdd}&nbsp;&nbsp;<a href={`/${url}`}>{title}</a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="col-xl-2 col-lg-1 order-3" />
      </div>

      <SEO
        title={`${displayYear}年${displayMonth}月の記事`}
        url={`https://blog.tubone-project24.xyz/${displayYear}/${displayMonth}`}
        siteTitleAlt="tubone BOYAKI"
        isPost={false}
        description={`${displayYear}年${displayMonth}月の記事`}
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
