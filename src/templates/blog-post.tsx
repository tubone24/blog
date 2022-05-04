import React, { Component } from "react";
import loadable from "@loadable/component";
import { graphql } from "gatsby";

import { parseDate } from "@/utils";

import Sidebar from "@/components/Sidebar";
import Content from "@/components/Content";
import SEO from "@/components/SEO";

import Header from "@/components/Header";
import ShareBox from "@/components/ShareBox";
import TimeToRead from "@/components/TimeToRead";

import * as style from "./blog-post.module.scss";
import RelatedPosts from "@/components/Relateds";
const Gitalk = loadable(
  () => import(/* webpackPrefetch: true */ "@/components/Gitalk")
);

type Props = {
  data: GatsbyTypes.BlogPostQueryQuery;
  pageContext: {
    words: number;
    minutes: number;
    repHtml: string;
  };
};

class BlogPost extends Component<Props> {
  private data: GatsbyTypes.BlogPostQueryQuery;
  constructor(props: Props) {
    super(props);
    this.data = this.props.data;
  }

  render() {
    const { node } = this.data.content.edges[0];

    const { frontmatter, fields, excerpt, id: graphqlId } = node;

    const shareURL = `https://blog.tubone-project24.xyz/${fields?.slug}`;
    return (
      <div className={style.post + " row order-2"}>
        <Header
          img={frontmatter?.headerImage || "https://i.imgur.com/M795H8A.jpg"}
          title={frontmatter?.title}
          authorName="tubone"
          authorImage={true}
          subTitle={parseDate(frontmatter?.date)}
        />
        <Sidebar />
        <main
          className={
            style.content + " col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2"
          }
        >
          <TimeToRead
            words={this.props.pageContext.words}
            minutes={this.props.pageContext.minutes}
          />
          <Content post={this.props.pageContext.repHtml} />
          <Gitalk
            id={frontmatter?.id || graphqlId}
            title={frontmatter?.title || ""}
            clientId={process.env.GATSBY_GITHUB_CLIENT_ID || ""}
            clientSecret={process.env.GATSBY_GITHUB_CLIENT_SECRET || ""}
          />
          <RelatedPosts
            title={frontmatter?.title || ""}
            tags={frontmatter?.tags || []}
          />
        </main>

        <ShareBox url={shareURL} />

        <SEO
          title={frontmatter?.title}
          url={shareURL}
          siteTitleAlt="tubone BOYAKI"
          isPost
          tag={frontmatter?.tags ? frontmatter.tags[0] || "" : ""}
          description={excerpt || ""}
          image={frontmatter?.headerImage || "https://i.imgur.com/4r1DViT.png"}
        />
      </div>
    );
  }
}

export const pageQuery = graphql`
  fragment post on MarkdownRemark {
    fields {
      slug
    }
    frontmatter {
      id
      title
      slug
      date
      headerImage
      tags
    }
  }

  query BlogPostQuery($index: Int) {
    content: allMarkdownRemark(
      sort: { order: DESC, fields: frontmatter___date }
      skip: $index
      limit: 1
    ) {
      edges {
        node {
          id
          excerpt
          ...post
        }
      }
    }
  }
`;

export default BlogPost;
