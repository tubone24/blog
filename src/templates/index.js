/* eslint react/prop-types: 0 */
import React from 'react';
import Link from 'gatsby-link';

import Card from '../components/Card';
import Sidebar from '../components/Sidebar';
import ShareBox from '../components/ShareBox';

import './index.scss';
import SEO from '../components/SEO';

const NavLinkText = ({ color, text }) => (
  <div
    className="navlink"
    style={{
      color,
    }}
  >
    {text}
  </div>
);

const NavLink = ({ test, url, text }) => {
  if (!test) {
    return <NavLinkText color="#7d7d7d" text={text} />;
  }

  return (
    <Link to={`${url}`}>
      <NavLinkText color="#66ccff" text={text} />
    </Link>
  );
};

const PageNum = ({ page, all }) => (
  <div
    className="pagenum"
  >
    {page}/{all}
  </div>
);

const Page = ({ pageContext, location }) => {
  const {
    group, index, first, last, pathPrefix, pageCount,
  } = pageContext;

  const previousUrl = index - 1 === 1 ? '' : `/${pathPrefix}/${index - 1}`;
  const nextUrl = `/${pathPrefix}/${index + 1}`;

  return (
    <>
      <div
        className="row homepage"
        style={{
          marginTop: 20,
        }}
      >
        <Sidebar />
        <div className="col-xl-6 col-lg-7 col-md-12 col-xs-12 order-2">
          {group.map(({ node }, index) => (
            // eslint-disable-next-line max-len,react/jsx-props-no-spreading
            <Card {...node.frontmatter} url={node.frontmatter.slug ? node.frontmatter.slug : node.fields.slug} key={node.fields.slug} index={index} />
          ))}

          <div
            className="row"
            style={{
              justifyContent: 'space-around',
              marginBottom: '20px',
            }}
          >
            <div className="previousLink">
              <NavLink test={!first} url={previousUrl} text="Previous" />
            </div>
            <div className="pageNum">
              <PageNum page={index} all={pageCount} />
            </div>
            <div className="nextLink">
              <NavLink test={!last} url={nextUrl} text="Next" />
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-lg-1 order-3" />
      </div>
      <ShareBox url={location.href} hasCommentBox={false} />
      <SEO
        title="tubone BOYAKI"
        url="https://blog.tubone-project24.xyz/"
        siteTitleAlt="tubone BOYAKI"
        isPost={false}
        description="tubone BLOG: Python, Docker, TS and other techs.."
        tag=""
        image="https://i.imgur.com/StLyXdu.png"
      />
    </>
  );
};

export default Page;
