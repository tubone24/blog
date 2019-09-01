import React from 'react';
import { StaticQuery, graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { config } from '../../../data';

import Information from './Information';

import './index.scss';

const {
  wordings = [],
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

const Sidebar = ({ totalCount, latestPosts }) => (
  <header className="intro-header site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1">
    <div className="about-me">
      <a href="https://www.gitshowcase.com/tubone24"><img className="avatar" src={iconUrl} alt="tubone" /></a>
      <a href="https://www.gitshowcase.com/tubone24"><h4>tubone</h4></a>
      <p className="mb-1">{wordings[0]}</p>
      <p className="mb-3">{wordings[1]}</p>
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
        href="https://play.google.com/store/apps/developer?id=tubone&hl=ja"
        icon={['fab', 'google-play']}
      />
      <Information totalCount={totalCount} posts={latestPosts} />
    </div>
  </header>
);

Icon.propTypes = {
  href: PropTypes.string.isRequired,
  icon: PropTypes.arrayOf(PropTypes.string).isRequired,
};

Sidebar.propTypes = {
  totalCount: PropTypes.number,
  latestPosts: PropTypes.array, //eslint-disable-line
};

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
    render={data => <Sidebar {...data.all} {...data.limited} />}
  />
);
