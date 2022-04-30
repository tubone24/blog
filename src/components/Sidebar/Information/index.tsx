import React from "react";
import Archive from "../Archive";
import { AllPost as AllPostProps } from "../entity";
import WordCloud from "../WordCloud";
import LatestPost, { Post as LatestPostProps } from "../LatestPost";
import "./index.scss";

const Information = ({
  totalCount,
  posts = [],
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
    <hr />
    <WordCloud />
    <hr />
  </div>
);

export default Information;
