import React from 'react';

import PropTypes from 'prop-types';

import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';

const Information = ({ totalCount, posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
      <figure><embed src="https://wakatime.com/share/@tubone/5306754c-dfb1-45dc-a9ec-e4a276518529.svg"/></figure>
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
