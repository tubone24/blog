import React from "react";

import ExternalLink from "../../ExternalLink";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { config } from "../../../../data";

import "./index.scss";

type Friend = {
  href: string;
  title: string;
  key: string;
};

const { friends = [] }: { friends: Friend[] } = config;

const Friend = () => (
  <div className="friend">
    <p>
      <span className="icon-link" />
      &nbsp;Links
    </p>
    {friends.map((friend) => (
      <ExternalLink
        href={friend.href}
        title={friend.title}
        key={friend.title}
        rel="noopener"
      />
    ))}
  </div>
);

export default Friend;
