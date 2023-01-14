import React from "react";
import Link from "gatsby-link";
import lozad from "lozad";

import { isBrowser } from "@/utils";

import Card from "@/components/Card";
import Sidebar from "@/components/Sidebar";
import ShareBox from "@/components/ShareBox";

import * as style from "./index.module.scss";
import SEO from "@/components/SEO";

import config from "@/config/index.json";

const NavLinkText = ({
  text,
  disabled = false,
}: {
  text: string;
  disabled?: boolean;
}) => {
  if (disabled) {
    return (
      <div
        className={style.navlink + " " + style.disableLink}
        aria-disabled={true}
      >
        {text}
      </div>
    );
  } else {
    return <div className={style.navlink + " " + style.activeLink}>{text}</div>;
  }
};

const NavLink = ({
  test,
  url,
  text,
}: {
  test: boolean;
  url: string;
  text: string;
}) => {
  if (!test) {
    return <NavLinkText text={text} disabled={true} />;
  }

  return (
    <Link to={`${url}`}>
      <NavLinkText text={text} disabled={false} />
    </Link>
  );
};

const PageNum = ({ page, all }: { page: number; all: number }) => (
  <div className={style.pagenum}>
    {page}/{all}
  </div>
);

type PageContext = {
  group: ReadonlyArray<GatsbyTypes.MarkdownRemarkEdge>;
  index: number;
  first: boolean;
  last: boolean;
  pathPrefix: string;
  pageCount: number;
};

const Page = ({
  pageContext,
  location,
}: {
  pageContext: PageContext;
  location: Location;
}) => {
  const { group, index, first, last, pathPrefix, pageCount } = pageContext;

  React.useEffect(() => {
    if (isBrowser()) {
      const observer = lozad(".lozad", {
        loaded(el) {
          el.classList.add("loaded");
        },
      });
      observer.observe();
    }
  }, []);

  const previousUrl = index - 1 === 1 ? "/" : `/${pathPrefix}/${index - 1}`;
  const nextUrl = `/${pathPrefix}/${index + 1}`;

  return (
    <>
      <div className={style.rowHomepage + " row homepage"}>
        <Sidebar />
        <main className="col-xl-6 col-lg-7 col-md-12 col-xs-12 order-2">
          {group.map(({ node }, num) => (
            <Card
              {...node.frontmatter}
              title={node.frontmatter?.title || ""}
              date={node.frontmatter?.date || ""}
              headerImage={node.frontmatter?.headerImage || ""}
              description={node.frontmatter?.description || ""}
              tags={node.frontmatter?.tags || []}
              url={
                node.frontmatter?.slug
                  ? node.frontmatter.slug
                  : node.fields?.slug || ""
              }
              key={node.fields?.slug}
              index={num}
            />
          ))}

          <div className={style.rowPager + " row pager"}>
            <div>
              <NavLink test={!first} url={previousUrl} text="Previous" />
            </div>
            <div>
              <PageNum page={index} all={pageCount} />
            </div>
            <div>
              <NavLink test={!last} url={nextUrl} text="Next" />
            </div>
          </div>
        </main>
        <div className="col-xl-2 col-lg-1 order-3" />
      </div>
      <ShareBox
        url={config.siteUrl + String(location.pathname)}
        hasCommentBox={false}
      />
      <SEO
        title={config.siteTitle}
        url={config.siteUrl}
        siteTitleAlt={config.siteTitle}
        isPost={false}
        description={config.description}
        tag=""
        image={config.defaultImage}
      />
    </>
  );
};

export default Page;
