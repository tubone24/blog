import React from "react";
import { graphql } from "gatsby";
import Card from "@/components/Card";
import SEO from "@/components/SEO";
import Sidebar from "@/components/Sidebar";
import * as style from "./tag.module.scss";

const TagPage = ({
  data,
  pageContext,
}: {
  data: GatsbyTypes.tagQueryQuery;
  pageContext: { tag: string };
}) => {
  const { edges } = data.allMarkdownRemark;
  const { tag } = pageContext;
  return (
    <div className="container">
      <div className={style.tagRow + " row"}>
        <Sidebar />

        <div className="col order-2">
          <div className={style.tagTitle + " col-12"}>
            {edges.length}
            &nbsp;Articles in&nbsp;
            {tag}
          </div>
          {edges.map(({ node }, index) => (
            <Card
              {...node.frontmatter}
              key={node.id}
              title={node.frontmatter?.title || ""}
              date={node.frontmatter?.date || ""}
              url={node.frontmatter?.url || ""}
              headerImage={node.frontmatter?.headerImage || ""}
              description={node.frontmatter?.description || ""}
              tags={node.frontmatter?.tags || []}
              index={index}
            />
          ))}
        </div>

        <div className="col-xl-2 col-lg-1 order-3" />
      </div>

      <SEO
        title={tag}
        url={`https://tubone-project24.xyz/tag/${tag}`}
        siteTitleAlt="tubone BOYAKI"
        isPost={false}
        description={tag}
        tag=""
        image="https://i.imgur.com/StLyXdu.png"
        noindex={true}
      />
    </div>
  );
};

export default TagPage;

export const pageQuery = graphql`
  query tagQuery($tag: [String!]) {
    allMarkdownRemark(
      sort: { frontmatter: { date: DESC } }
      filter: { frontmatter: { tags: { in: $tag } } }
    ) {
      edges {
        node {
          id
          frontmatter {
            id
            url: slug
            title
            date
            tags
            headerImage
            description
          }
        }
      }
    }
  }
`;
