import React, { Component } from "react";
import loadable from "@loadable/component";
import { graphql } from "gatsby";

import { parseDate } from "../api";

import Sidebar from "../components/Sidebar";
import Content from "../components/Content";
import SEO from "../components/SEO";

import Header from "../components/Header";
import ShareBox from "../components/ShareBox";
import TimeToRead from "../components/TimeToRead";
const Gitalk = loadable(
  () => import(/* webpackPrefetch: true */ "../components/Gitalk")
);

// Styles
import "./blog-post.scss";
import RelatedPosts from "../components/Relateds";

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
  }

  render() {
    const { node } = this.data.content.edges[0];

    const { frontmatter, fields, excerpt, id: graphqlId } = node;

    const { slug } = fields;

    const { date, headerImage, title, tags, id } = frontmatter;

    const shareURL = `https://blog.tubone-project24.xyz/${slug}`;
    return (
      <div className="row post order-2">
        <Header
          img={headerImage || "https://i.imgur.com/M795H8A.jpg"}
          title={title}
          authorName="tubone"
          authorImage="https://blog.tubone-project24.xyz/assets/avater.png"
          subTitle={parseDate(date)}
        />
        <Sidebar />
        <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2 content">
          <TimeToRead
            words={this.props.pageContext.words}
            minutes={this.props.pageContext.minutes}
          />
          <Content post={this.props.pageContext.repHtml} />
          <Gitalk
            id={id || graphqlId}
            title={title}
            clientId={process.env.GATSBY_GITHUB_CLIENT_ID}
            clientSecret={process.env.GATSBY_GITHUB_CLIENT_SECRET}
          />
          <RelatedPosts post={node} />
        </div>

        <ShareBox url={shareURL} />

        <SEO
          title={title}
          url={shareURL}
          siteTitleAlt="tubone BOYAKI"
          isPost
          tag={tags[0]}
          description={excerpt}
          image={headerImage || "https://i.imgur.com/4r1DViT.png"}
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
