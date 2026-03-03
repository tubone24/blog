import React from "react";
import lozad from "lozad";
import RelatedCard from "@/components/RelatedCard";

import * as style from "./index.module.scss";
import { isBrowser } from "@/utils";

export type AllPost = {
  title: string;
  tags: string[];
  date: string;
  headerImage?: string;
  slug: string;
};

const RelatedPosts = ({
  title,
  tags,
  allPosts = [],
}: {
  title: string;
  tags: readonly (string | undefined)[];
  allPosts: AllPost[];
}) => {
  React.useEffect(() => {
    if (isBrowser()) {
      const observer = lozad(".lozad", {
        rootMargin: "10px 0px",
        threshold: 0.1,
        enableAutoReload: true,
        loaded(el) {
          el.classList.add("loaded");
        },
      });
      observer.observe();
    }
  }, []);

  const relatedPosts = allPosts.filter((post) => {
    if (post.title === title) return false;
    if (post.tags) {
      for (let i = 0; i < post.tags.length; i++) {
        if (tags[i] && post.tags[i] === tags[i]) return true;
      }
    }
    return false;
  });

  if (!relatedPosts || relatedPosts.length === 0) return null;

  return (
    <div className={style.relatedPosts}>
      <h2>
        <span className="icon-newspaper-o" />
        &nbsp;Related Posts
      </h2>
      {relatedPosts.map((post) => (
        <div key={post.slug}>
          <RelatedCard
            title={post.title}
            tags={post.tags}
            date={post.date}
            headerImage={post.headerImage}
            url={post.slug}
          />
        </div>
      ))}
    </div>
  );
};

export default RelatedPosts;
