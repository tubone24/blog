import React from 'react';

import PropTypes from 'prop-types';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';
import SearchBox from '../../SearchBox';

const Information = ({ totalCount, posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <LatestPost posts={posts} totalCount={totalCount} />
    <hr />
    <Friend />
    <hr />
    <SearchBox />
  </div>
);

Information.propTypes = {
  totalCount: PropTypes.number.isRequired,
  posts: PropTypes.array,
};

Information.defaultProps = {
  posts: [],
};

export default Information;
