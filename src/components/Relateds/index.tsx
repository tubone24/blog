import React from "react";
import { StaticQuery, graphql } from "gatsby";
import lozad from "lozad";
import RelatedCard from "../RelatedCard";

import "./index.scss";
import { isBrowser } from "../../api";

type Post = {
  frontmatter: {
    title: string;
    tags: string[];
  };
};

const RelatedPosts = ({ post }: { post: Post }) => {
  React.useEffect(() => {
    if (isBrowser()) {
      const observer = lozad(".lozad", {
        rootMargin: "10px 0px",
        threshold: 0.1,
        enableAutoReload: true,
        loaded(el) {
          el.classList.add("loaded");
        },
      });
      observer.observe();
    }
  }, []);

  return (
    <StaticQuery<GatsbyTypes.Query>
      query={graphql`
        query {
          allMarkdownRemark(sort: { fields: frontmatter___date, order: DESC }) {
            edges {
              node {
                excerpt
                frontmatter {
                  title
                  headerImage
                  date
                  tags
                }
                fields {
                  slug
                }
              }
            }
          }
        }
      `}
      render={(data) => {
        const relatedPosts = data.allMarkdownRemark.edges.filter(
          // eslint-disable-next-line array-callback-return,consistent-return
          (edge) => {
            if (edge.node.frontmatter?.title === post.frontmatter.title) {
              return false;
            }
            if (edge.node.frontmatter?.tags) {
              for (let i = 0; i < edge.node.frontmatter.tags.length; i++) {
                return (
                  edge.node.frontmatter.tags[i] === post.frontmatter.tags[i]
                );
              }
            }
          }
        );
        if (!relatedPosts) {
          return null;
        }
        return (
          <div className="related-posts">
            <h2 className="related-posts-title">
              <span className="icon-newspaper-o" />
              &nbsp;Related Posts
            </h2>
            {relatedPosts.map((relatedPost) => (
              <div className="related-post">
                <RelatedCard
                  title={relatedPost.node.frontmatter?.title || ""}
                  tags={relatedPost.node.frontmatter?.tags}
                  date={relatedPost.node.frontmatter?.date || ""}
                  headerImage={relatedPost.node.frontmatter?.headerImage}
                  url={relatedPost.node.fields?.slug || ""}
                />
              </div>
            ))}
          </div>
        );
      }}
    />
  );
};

export default RelatedPosts;
