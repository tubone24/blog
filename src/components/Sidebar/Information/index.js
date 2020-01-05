import React from 'react';

import PropTypes from 'prop-types';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import Heatmap from '../../Heatmap';
import './index.scss';

const Information = ({ totalCount, posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
      <Heatmap minify={true} />
    <hr />
    <LatestPost posts={posts} totalCount={totalCount} />
    <hr />
    <Friend />
    <hr />

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
