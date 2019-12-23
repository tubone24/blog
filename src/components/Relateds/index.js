import React from 'react';
import { StaticQuery, graphql , Link } from "gatsby";

import RelatedCard from '../RelatedCard';

import './index.scss';

// eslint-disable-next-line react/prop-types
const RelatedPosts = ({ post }) => (
  <StaticQuery
    query={graphql`
      query {
        allMarkdownRemark(
          sort: { fields: frontmatter___date, order: DESC }
        ){
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
        // eslint-disable-next-line array-callback-return
        (edge) => {
          if (edge.node.frontmatter.title === post.frontmatter.title) {
            return false;
          }
          // eslint-disable-next-line no-plusplus
          for (let i = 0; i < edge.node.frontmatter.tags.length; i++) {
            return edge.node.frontmatter.tags[i] === post.frontmatter.tags[i];
          }
        },
      );
      if (!relatedPosts) { return null; }
      return (
        <div className="related-posts" style={{padding: 30, background: 'white',}}>
          <h3 className="related-posts-title">関連記事</h3>
          {relatedPosts.map(relatedPost => (
            <div className="related-post">
              <RelatedCard title={relatedPost.node.frontmatter.title} tags={relatedPost.node.frontmatter.tags} date={relatedPost.node.frontmatter.date} headerImage={relatedPost.node.frontmatter.headerImage} url={relatedPost.node.fields.slug} />
            </div>
          ))}
        </div>
      );
    }}
  />
);

export default RelatedPosts;
