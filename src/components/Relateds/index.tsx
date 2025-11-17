import React from "react";
import { StaticQuery, graphql } from "gatsby";
import lozad from "lozad";
import RelatedCard from "@/components/RelatedCard";

import * as style from "./index.module.scss";
import { isBrowser } from "@/utils";

const RelatedPosts = ({
  title,
  tags,
}: {
  title: string;
  tags: readonly (string | undefined)[];
}) => {
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
          allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
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
            if (edge.node.frontmatter?.title === title) {
              return false;
            }
            if (edge.node.frontmatter?.tags) {
              for (let i = 0; i < edge.node.frontmatter.tags.length; i++) {
                return edge.node.frontmatter.tags[i] === tags[i];
              }
            }
          },
        );
        if (!relatedPosts) {
          return null;
        }
        return (
          <div className={style.relatedPosts}>
            <h2>
              <span className="icon-newspaper-o" />
              &nbsp;Related Posts
            </h2>
            {relatedPosts.map((relatedPost) => (
              <div>
                <RelatedCard
                  title={relatedPost.node.frontmatter?.title || ""}
                  tags={relatedPost.node.frontmatter?.tags || []}
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
