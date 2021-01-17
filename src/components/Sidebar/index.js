import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import ReactGA from 'react-ga';

import { config } from '../../../data';

import Information from './Information';

import SearchBox from '../SearchBox';

import Subscription from './Subscription';

import TagCloud from './TagCloud';
import './index.scss';

const {
  githubUsername,
} = config;

const Icon = ({ href, icon, title }) => (
  <a
    target="_blank"
    href={href}
    title={title}
    rel="external nofollow noopener noreferrer"
    className="custom-icon"
  >
    <span className="fa-layers fa-fw fa-2x">
      <span className={icon} style={{'font-size': '200%'}}/>&nbsp;
    </span>
  </a>
);

const Sidebar = ({ latestPosts, totalCount, allPosts }) => (
  <header className="intro-header site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1">
    <div className="about-me">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <a href="https://portfolio.tubone-project24.xyz/">
        <picture>
          <source className="avatar" srcSet="/assets/avater.webp" type="image/webp" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar' })} />
          <img className="avatar" src="/assets/avater.png" alt="tubone" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar' })} />
        </picture>
      </a>
      <a href="https://portfolio.tubone-project24.xyz/" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar Str' })}><h4>tubone</h4></a>
      <p className="soliloquy"><b>Boyaki</b> makes a new world</p>
      <Icon
        href={`https://github.com/${githubUsername}`}
        icon='icon-github'
        title='tubone24 github'
      />
      <Icon
        href="https://soundcloud.com/user-453736300"
        icon='icon-soundcloud'
        title="tubone24 SoundCloud"
      />
      <Icon
        href="https://twitter.com/meitante1conan"
        icon='icon-twitter'
        title="tubone24 twitter"
      />
      <Icon
        href="https://500px.com/tubone24"
        icon='icon-500px'
        title="tubone24 500px"
      />
      <Information posts={latestPosts} totalCount={totalCount} allPosts={allPosts} />
      <SearchBox />
      <hr />
      <Subscription />
      <hr />
      <TagCloud />
    </div>
  </header>
);

Sidebar.defaultProps = {
  totalCount: 0,
  latestPosts: [],
};

export default () => (
  <StaticQuery
    query={graphql`
      fragment cardData on MarkdownRemark {
        fields {
          slug
        }
        frontmatter {
          id
          title
          url: slug
          date
          tags
          description
          headerImage
        }
      }

      query SidebarQuery {
        all: allMarkdownRemark {
          totalCount
          allPosts: edges {
            node {
              ...cardData
            }
          }
        }

        limited: allMarkdownRemark(
          sort: { order: DESC, fields: frontmatter___date }
          limit: 6
        ) {
          latestPosts: edges {
            node {
              ...cardData
            }
          }
        }
      }
    `}
    render={(data) => <Sidebar {...data.all} {...data.limited} />}
  />
);
