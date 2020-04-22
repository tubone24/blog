import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';

import { config } from '../../../data';

import Information from './Information';

import SearchBox from '../SearchBox';

import Subscription from './Subscription';

import './index.scss';
import TagCloud from './TagCloud';

const {
  githubUsername,
  iconUrl,
} = config;

const Icon = ({ href, icon }) => (
  <a
    target="_blank"
    href={href}
    rel="external nofollow noopener noreferrer"
    className="custom-icon"
  >
    <span className="fa-layers fa-fw fa-2x">
      <FontAwesomeIcon icon={icon} />
    </span>
  </a>
);

const Sidebar = ({ latestPosts, totalCount }) => (
  <header className="intro-header site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1">
    <div className="about-me">
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-noninteractive-element-interactions */}
      <a href="https://portfolio.tubone-project24.xyz/"><img className="avatar" src={iconUrl} alt="tubone" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar' })} /></a>
      <a href="https://portfolio.tubone-project24.xyz/" onClick={() => ReactGA.event({ category: 'User', action: 'push tubone Avatar Str' })}><h4>tubone</h4></a>
      <p className="soliloquy"><b>Boyaki</b> makes a new world</p>
      <Icon
        href={`https://github.com/${githubUsername}`}
        icon={['fab', 'github']}
      />
      <Icon
        href="https://soundcloud.com/user-453736300"
        icon={['fab', 'soundcloud']}
      />
      <Icon
        href="https://twitter.com/meitante1conan"
        icon={['fab', 'twitter']}
      />
      <Icon
        href="https://www.slideshare.net/tubone24"
        icon={['fab', 'slideshare']}
      />
      <Icon
        href="https://500px.com/tubone24"
        icon={['fab', '500px']}
      />
      <Information posts={latestPosts} totalCount={totalCount} />
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
