import React from 'react';
import {StaticQuery, graphql} from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Tag from '../../../components/Tag';

// eslint-disable-next-line react/prop-types
const TagCloud = ({data}) => {
  const {allMarkdownRemark} = data;
  const mapping = {};

  allMarkdownRemark.edges.forEach(({node}) => {
    const {tags} = node.frontmatter;
    tags.forEach((name) => {
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
    <div className="d-none d-lg-block information my-2">
      <p><FontAwesomeIcon icon={['fas', 'tags']} />&nbsp;Tags</p>
      {tags.map(item => (
        <Tag name={item} key={item} count={mapping[item]}/>
      ))}
    </div>
  );
};

export default props => (
  <StaticQuery
    query={graphql`
      query {
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
    `}
    render={data => <TagCloud data={data} {...props} />}
  />
)
