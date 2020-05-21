import React from 'react';
// import Friend from '../Friend';
import Archive from '../Archive';
import LatestPost from '../LatestPost';
import './index.scss';

const Information = ({ totalCount, posts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <LatestPost posts={posts} totalCount={totalCount} />
    <hr />
    <Archive />
    {/* <Friend /> */}
    <hr />
  </div>
);

Information.defaultProps = {
  posts: [],
};

export default Information;
