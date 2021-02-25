import React from 'react';
import { Link, withPrefix } from 'gatsby';
import ReactGA from 'react-ga';

import Heatmap from '../../Heatmap';
import './index.scss';

const LatestPost = ({ posts, totalCount }) => (
  <div className="latest-post">
    <p>
      <span className="icon-newspaper-o" />&nbsp;Recent posts&nbsp;&nbsp;6&nbsp;/&nbsp;
      {totalCount}
    </p>
    <Heatmap minify />
    {posts.map(({ node }) => (
      <Link
        to={withPrefix(node.frontmatter.url || node.frontmatter.slug || node.fields.slug)}
        key={withPrefix(node.frontmatter.url || node.frontmatter.slug || node.fields.slug)}
        href={withPrefix(node.frontmatter.url || node.frontmatter.slug || node.fields.slug)}
        onClick={() => ReactGA.event({
          category: 'User',
          action: `Click latest-post item: ${node.fields.slug}`,
        })}
      >
        {node.frontmatter.title}
      </Link>
    ))}
  </div>
);

export default LatestPost;
