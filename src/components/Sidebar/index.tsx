import React from "react";
import { StaticQuery, graphql } from "gatsby";
import ReactGA from "react-ga4";
import lozad from "lozad";

import Information from "./Information";
import { Post as LatestPostProps } from "./LatestPost";
import { AllPost } from "./entity";
import SearchBox from "@/components/SearchBox";
import Subscription from "./Subscription";
import TagCloud from "./TagCloud";
import * as style from "./index.module.scss";
import { isBrowser } from "@/utils";

const Icon = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: string;
  title: string;
}) => (
  <a
    target="_blank"
    href={href}
    title={title}
    rel="external nofollow noopener noreferrer"
    className={style.customIcon}
  >
    <span className={style.faLayers + " fa-fw fa-2x"}>
      <span className={icon} />
      &nbsp;
    </span>
  </a>
);

export type StaticQueryAllPost = {
  readonly node: {
    readonly frontmatter: GatsbyTypes.Maybe<
      Pick<GatsbyTypes.MarkdownRemarkFrontmatter, "date" | "tags">
    >;
  };
};

export type StaticQueryLatestPost = {
  readonly node: GatsbyTypes.cardDataFragment;
};

export const Sidebar = ({
  latestPosts,
  totalCount,
  allPosts,
}: {
  allPosts: ReadonlyArray<StaticQueryAllPost>;
  totalCount: number;
  latestPosts: ReadonlyArray<StaticQueryLatestPost>;
}) => {
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
  const lp = latestPosts.map(
    (p) =>
      ({
        node: {
          frontmatter: {
            url: p.node.frontmatter?.url || "",
            title: p.node.frontmatter?.title || "",
            slug: p.node.frontmatter?.url,
          },
          fields: { slug: p.node.fields?.slug || "" },
        },
      }) as LatestPostProps,
  );
  const ap = allPosts.map(
    (p) =>
      ({
        node: {
          frontmatter: {
            date: p.node.frontmatter?.date || "",
            tags: p.node.frontmatter?.tags || [],
          },
        },
      }) as AllPost,
  );
  return (
    <header
      className={
        style.introHeader +
        " site-heading text-center col-xl-2 col-lg-3 col-xs-12 order-lg-1"
      }
    >
      <div className={style.aboutMe}>
        <a href="https://portfolio.tubone-project24.xyz/">
          <picture>
            <source
              className={style.avatar}
              srcSet="/assets/avater.webp"
              type="image/webp"
              onClick={() =>
                ReactGA.event({
                  category: "User",
                  action: "push tubone Avatar",
                })
              }
            />
            <img
              className={style.avatar}
              src="/assets/avater.png"
              alt="tubone"
              decoding="async"
              onClick={() =>
                ReactGA.event({
                  category: "User",
                  action: "push tubone Avatar",
                })
              }
            />
          </picture>
        </a>
        <a
          href="https://portfolio.tubone-project24.xyz/"
          onClick={() =>
            ReactGA.event({
              category: "User",
              action: "push tubone Avatar Str",
            })
          }
        >
          <h2>tubone</h2>
        </a>
        <p className={style.soliloquy}>It&apos;s my life</p>
        <Icon
          href="https://github.com/tubone24"
          icon="icon-github"
          title="tubone24 github"
        />
        <Icon
          href="https://soundcloud.com/user-453736300"
          icon="icon-soundcloud"
          title="tubone24 SoundCloud"
        />
        <Icon
          href="https://twitter.com/tubone24"
          icon="icon-twitter"
          title="tubone24 twitter"
        />
        <Icon
          href="https://500px.com/tubone24"
          icon="icon-500px"
          title="tubone24 500px"
        />
        <Information posts={lp} totalCount={totalCount} allPosts={ap} />
        <SearchBox />
        <hr />
        <Subscription />
        <hr />
        <TagCloud allPosts={ap} />
      </div>
    </header>
  );
};

Sidebar.defaultProps = {
  totalCount: 0,
  latestPosts: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <StaticQuery
    query={graphql`
      fragment cardData on MarkdownRemark {
        fields {
          slug
        }
        frontmatter {
          title
          url: slug
          date
        }
      }

      query SidebarQuery {
        all: allMarkdownRemark {
          totalCount
          allPosts: edges {
            node {
              frontmatter {
                date
                tags
              }
            }
          }
        }

        limited: allMarkdownRemark(
          sort: { frontmatter: { date: DESC } }
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
