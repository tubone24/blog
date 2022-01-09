import React from "react";
import { Link, withPrefix } from "gatsby";
import ReactGA from "react-ga";
import "./index.scss";

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
  <div className="latest-post">
    <p>
      <span className="icon-newspaper-o" />
      &nbsp;Recent posts&nbsp;&nbsp;6&nbsp;/&nbsp;
      {totalCount}
    </p>
    {posts.map(({ node }) => (
      <Link
        to={withPrefix(
          node.frontmatter.url || node.frontmatter.slug || node.fields.slug
        )}
        key={withPrefix(
          node.frontmatter.url || node.frontmatter.slug || node.fields.slug
        )}
        onClick={() =>
          ReactGA.event({
            category: "User",
            action: `Click latest-post item: ${node.fields.slug}`,
          })
        }
      >
        {node.frontmatter.title}
      </Link>
    ))}
  </div>
);

export default LatestPost;
