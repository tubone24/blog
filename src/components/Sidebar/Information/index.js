import React from 'react';
import Friend from '../Friend';
import LatestPost from '../LatestPost';
import './index.scss';

const Information = ({ totalCount, posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <LatestPost posts={posts} totalCount={totalCount} />
    <hr />
    <Friend />
    <hr />

  </div>
);

Information.defaultProps = {
  posts: [],
};

export default Information;
