/* eslint-disable react/destructuring-assignment */
/* eslint react/prop-types: 0 */

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

import { config } from '../../data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// Styles
import './blog-post.scss';
import RelatedPosts from "../components/Relateds";

const {
  url, name, iconUrl, gitalk,
} = config;

// const bgWhite = { padding: '10px 30px', background: 'white' };
const destrop = 'd203b64dc';
const nestedaaP = '1288ab3';

// Prevent webpack window problem
const isBrowser = typeof window !== 'undefined';
const Gitalk = isBrowser ? require('gitalk') : undefined;

const jaaCli = 'cfb4c0c580';
const thambAlP = '17f75e6692';
const saAPoak = 'd335bca49f';
const somethingAll = '2a392dae3406cb';

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;
  }

  componentDidMount() {
    const { frontmatter, id: graphqlId } = this.data.content.edges[0].node;
    const { title, id } = frontmatter;
    const GitTalkInstance = new Gitalk({
      ...gitalk,
      clientID: saAPoak + jaaCli,
      clientSecret: thambAlP + destrop + nestedaaP + somethingAll,
      title,
      id: id || graphqlId,
    });
    GitTalkInstance.render('gitalk-container');
  }

  render() {
    const { node } = this.data.content.edges[0];

    const {
      html, frontmatter, fields, excerpt,
    } = node;

    const { slug, readingTime } = fields;

    const { minutes, words } = readingTime;

    const { date, headerImage, title } = frontmatter;

    const shareURL = `${url}/${slug}`;

    return (
      <div className="row post order-2">
        <Header
          img={headerImage || 'https://i.imgur.com/M795H8A.jpg'}
          title={title}
          authorName={name}
          authorImage={iconUrl}
          subTitle={parseDate(date)}
        />
        <Sidebar />
        <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-10 content">
          <div
            className="countdown"
            style={{
              padding: 5,
              background: '#97ff85',
            }}
          ><FontAwesomeIcon icon={['fa', 'clock']} />この記事は<b>{words}文字</b>で<b>約{Math.round(minutes * 10) / 10}分</b>で読めます
          </div>
          <Content post={html} />

          <div id="gitalk-container" />
          <RelatedPosts post={node} />
        </div>

        <ShareBox url={shareURL} />˚

        <SEO
          title={title}
          url={shareURL}
          siteTitleAlt="tubone BOYAKI"
          isPost
          description={excerpt}
          image={headerImage || 'https://i.imgur.com/StLyXdu.png'}
        />
      </div>
    );
  }
}

export const pageQuery = graphql`
  fragment post on MarkdownRemark {
    fields {
      slug
      readingTime {
          minutes
          words
      }
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
          html
          excerpt
          ...post
        }
      }
    }
  }
`;

export default BlogPost;
