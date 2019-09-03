import React from 'react';

import PropTypes from 'prop-types';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';
import SearchBox from '../../SearchBox';

// eslint-disable-next-line react/prop-types
const Information = ({ posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <LatestPost posts={posts} />
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
