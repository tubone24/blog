import React from "react";
import { Newspaper } from "lucide-react";
import ReactGA from "react-ga4";
import * as style from "./index.module.scss";

export type Post = {
  node: {
    frontmatter: {
      url: string;
      slug: string;
      title: string;
    };
    fields: {
      slug: string;
    };
  };
};

const LatestPost = ({
  posts,
  totalCount,
}: {
  posts: Post[];
  totalCount: number;
}) => (
  <div className={style.latestPost}>
    <div className={style.sectionHeader} data-testid="latestArticleCount">
      <Newspaper size={16} aria-hidden="true" />
      &nbsp;Recent posts <span className={style.count}>6 / {totalCount}</span>
    </div>
    {posts.map(({ node }) => (
      <a
        href={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
        key={node.frontmatter.url || node.frontmatter.slug || node.fields.slug}
        onClick={() =>
          ReactGA.event({
            category: "User",
            action: `Click latest-post item: ${node.fields.slug}`,
          })
        }
      >
        {node.frontmatter.title}
      </a>
    ))}
  </div>
);

export default LatestPost;
