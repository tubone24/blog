import React from "react";
import ReactGA from "react-ga4";
import lozad from "lozad";

import Information from "./Information";
import type { Post as LatestPostProps } from "./LatestPost";
import type { AllPost } from "./entity";
import SearchBox from "@/components/SearchBox";
import Subscription from "./Subscription";
import TagCloud from "./TagCloud";
import * as style from "./index.module.scss";
import { isBrowser } from "@/utils";
import { GitHubIcon, XIcon, InstagramIcon } from "@/icons/BrandIcons";

const Icon = ({
  href,
  icon,
  title,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
}) => (
  <a
    target="_blank"
    href={href}
    title={title}
    rel="external nofollow noopener noreferrer"
    className={style.customIcon}
  >
    {icon}
  </a>
);

export type SidebarLatestPost = {
  title: string;
  slug: string;
  date: string;
  url?: string;
};

export type SidebarAllPost = {
  date: string;
  tags: string[];
};

export const Sidebar = ({
  latestPosts = [],
  totalCount = 0,
  allPosts = [],
}: {
  allPosts: SidebarAllPost[];
  totalCount: number;
  latestPosts: SidebarLatestPost[];
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
            url: p.url || p.slug || "",
            title: p.title || "",
            slug: p.url || p.slug,
          },
          fields: { slug: p.slug || "" },
        },
      }) as LatestPostProps,
  );
  const ap = allPosts.map(
    (p) =>
      ({
        node: {
          frontmatter: {
            date: p.date || "",
            tags: p.tags || [],
          },
        },
      }) as AllPost,
  );
  return (
    <header
      className={
        style.introHeader +
        " site-heading text-center col-xl-2 col-lg-3 col-12 order-lg-1"
      }
    >
      <div className={style.aboutMe}>
        <a
          href="https://portfolio.tubone-project24.xyz/"
          onClick={() =>
            ReactGA.event({
              category: "User",
              action: "push tubone Avatar",
            })
          }
        >
          <picture>
            <source
              className={style.avatar}
              srcSet="/assets/avater.webp"
              type="image/webp"
            />
            <img
              className={style.avatar}
              src="/assets/avater.png"
              alt="tubone"
              decoding="async"
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
          icon={<GitHubIcon size={28} />}
          title="tubone24 github"
        />
        <Icon
          href="https://x.com/tubone24"
          icon={<XIcon size={28} />}
          title="tubone24 X"
        />
        <Icon
          href="https://www.instagram.com/mugimugi.cutedog/"
          icon={<InstagramIcon size={28} />}
          title="mugimugi.cutedog Instagram"
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

export default Sidebar;
