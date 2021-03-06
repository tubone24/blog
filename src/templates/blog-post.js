/* eslint-disable react/destructuring-assignment */

// Components
import React, { Component } from 'react';
import { graphql } from 'gatsby';

import 'gitalk/dist/gitalk.css';

import { parseDate } from '../api';

import Sidebar from '../components/Sidebar';
import Content from '../components/Content';
import SEO from '../components/SEO';

import Header from '../components/Header';
// import TableOfContent from '../components/TableOfContent';
import ShareBox from '../components/ShareBox';
import TimeToRead from '../components/TimeToRead';

// Styles
import './blog-post.scss';
import RelatedPosts from '../components/Relateds';

// const bgWhite = { padding: '10px 30px', background: 'white' };

// Prevent webpack window problem
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
  }

  componentDidMount() {
    const { frontmatter, id: graphqlId } = this.data.content.edges[0].node;
    const { title, id } = frontmatter;
    const clientId = process.env.GATSBY_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GATSBY_GITHUB_CLIENT_SECRET;
    const GitTalkInstance = new Gitalk({
      clientID: clientId,
      clientSecret,
      title,
      id: id || graphqlId,
    });
    GitTalkInstance.render('gitalk-container');
  }

  render() {
    const { node } = this.data.content.edges[0];

    const {
      frontmatter, fields, excerpt,
    } = node;

    const { slug } = fields;

    const {
      date, headerImage, title, tags,
    } = frontmatter;

    const shareURL = `https://blog.tubone-project24.xyz/${slug}`;
    return (
      <div className="row post order-2">
        <Header
          img={headerImage || 'https://i.imgur.com/M795H8A.jpg'}
          title={title}
          authorName="tubone"
          authorImage="https://blog.tubone-project24.xyz/assets/avater.png"
          subTitle={parseDate(date)}
        />
        <Sidebar />
        <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-10 content">
          <TimeToRead words={this.props.pageContext.words} minutes={this.props.pageContext.minutes} />
          <Content post={this.props.pageContext.repHtml} />
          <div id="gitalk-container" />
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
          image={headerImage || 'https://i.imgur.com/4r1DViT.png'}
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
