import React from 'react';

import { Link } from 'gatsby';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';

const LatestPost = ({ posts, totalCount }) => (
  <div className="latest-post">
    <p>
<FontAwesomeIcon icon={['fas', 'newspaper']} />&nbsp;Recent posts&nbsp;&nbsp;6&nbsp;/&nbsp;
      {totalCount}
    </p>
    {posts.map(({ node }) => (
      <Link
        to={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
        key={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
        href={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
      >
        {node.frontmatter.title}
      </Link>
    ))}
  </div>
);

LatestPost.propTypes = {
  totalCount: PropTypes.number.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default LatestPost;
