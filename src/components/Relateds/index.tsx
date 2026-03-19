import React from "react";
import { Newspaper } from "lucide-react";
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

const MAX_RELATED = 6;

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

  const currentTags = new Set(tags.filter(Boolean) as string[]);

  const scored = allPosts
    .filter((post) => post.title !== title)
    .map((post) => {
      let score = 0;
      if (post.tags) {
        for (const t of post.tags) {
          if (currentTags.has(t)) score++;
        }
      }
      return { post, score };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RELATED);

  if (scored.length === 0) return null;

  return (
    <div className={style.relatedPosts}>
      <h2>
        <Newspaper
          size={18}
          aria-hidden="true"
          style={{ verticalAlign: "-0.125em" }}
        />
        &nbsp;Related Posts
      </h2>
      {scored.map(({ post }) => (
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
