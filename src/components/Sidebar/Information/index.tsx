import React from "react";
import Archive from "../Archive";
import type { AllPost as AllPostProps } from "../entity";
import WordCloud from "../WordCloud";
import LatestPost from "../LatestPost";
import type { Post as LatestPostProps } from "../LatestPost";

const Information = ({
  totalCount,
  posts = [],
  allPosts,
}: {
  totalCount: number;
  posts: LatestPostProps[];
  allPosts: AllPostProps[];
}) => (
  <div className="d-none d-lg-block my-2">
    <LatestPost posts={posts} totalCount={totalCount} />
    <Archive allPosts={allPosts} />
    <WordCloud />
  </div>
);

export default Information;
