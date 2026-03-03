import React from "react";

import Tag from "@/components/Tag";
import { AllPost } from "../entity";

const TagCloud = ({ allPosts }: { allPosts: AllPost[] }) => {
  const mapping: { [key: string]: number } = {};

  allPosts.forEach(({ node }) => {
    node.frontmatter.tags.forEach((name) => {
      if (mapping[name]) {
        mapping[name] += 1;
      } else {
        mapping[name] = 1;
      }
    });
  });

  const tags = Array.from(Object.keys(mapping)).sort(
    (b, a) => mapping[a] - mapping[b],
  );
  const limitTags = tags.slice(0, 20);
  return (
    <div className="d-none d-lg-block information my-2">
      <a href="/tags" title="Tags">
        <p>
          <span className="icon-tags" />
          &nbsp;{limitTags.length} / {tags.length} Tags
        </p>
      </a>
      {limitTags.map((item) => (
        <Tag name={item} key={item} count={mapping[item]} />
      ))}
    </div>
  );
};

export default TagCloud;
