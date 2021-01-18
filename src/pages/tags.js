import React from 'react';
import { graphql } from 'gatsby';

import Sidebar from '../components/Sidebar';
import Tag from '../components/Tag';
import SEO from '../components/SEO';
import Heatmap from '../components/Heatmap';

// eslint-disable-next-line react/prop-types
const TagPage = ({ data }) => {

  const mapping = {};
  data.allMarkdownRemark.edges.forEach(({ node }) => {
    node.frontmatter.tags.forEach((name) => {
      if (mapping[name]) {
        mapping[name] += 1;
      } else {
        mapping[name] = 1;
      }
    });
  });

  const tags = Array.from(Object.keys(mapping)).sort(
    (b, a) => mapping[a] - mapping[b],
  );

  return (
    <div className="container">
      <div
        className="row"
        style={{
          margin: 15,
        }}
      >
        <Sidebar />

        <div className="col order-2">
          {tags.map((item) => (
            <Tag name={item} key={item} count={mapping[item]} />
          ))}
          <Heatmap />
        </div>

      </div>
      <SEO
        title="Tags"
        url="/tags/"
        siteTitleAlt="tubone BOYAKI"
        isPost={false}
        description="Tags Page"
        tag=""
        image="https://i.imgur.com/M795H8A.jpg"
      />
    </div>
  );
};

export default TagPage;

export const pageQuery = graphql`
  query getAllTags {
    allMarkdownRemark {
      edges {
        node {
          frontmatter {
            tags
          }
        }
      }
    }
  }
`;
