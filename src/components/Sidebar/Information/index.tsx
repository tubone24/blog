import React from "react";
// import Friend from '../Friend';
import Archive from "../Archive";
import { AllPost as AllPostProps } from "../entity";
import WordCloud from "../WordCloud";
import LatestPost, { Post as LatestPostProps } from "../LatestPost";
import "./index.scss";

const Information = ({
  totalCount,
  posts,
  allPosts,
}: {
  totalCount: number;
  posts: LatestPostProps[];
  allPosts: AllPostProps[];
}) => (
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
