import React from 'react';
// import Friend from '../Friend';
import Archive from '../Archive';
import WordCloud from '../WordCloud';
import LatestPost from '../LatestPost';
import './index.scss';

const Information = ({ totalCount, posts, allPosts }) => (
  <div className="d-none d-lg-block information my-2">
    <hr />
    <LatestPost posts={posts} totalCount={totalCount} />
    <hr />
    <Archive allPosts={allPosts} />
    {/* <Friend /> */}
    <hr />
    <WordCloud />
    <hr />
  </div>
);

Information.defaultProps = {
  posts: [],
};

export default Information;
