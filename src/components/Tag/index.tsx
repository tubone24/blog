import React from "react";
import ReactGA from "react-ga4";
import * as style from "./index.module.scss";

const Tag = ({
  name,
  count = "",
}: {
  name: string;
  count?: number | string;
}) => (
  <a
    href={`/tag/${name}`}
    className={style.headerTag}
    title={name}
    onClick={() =>
      ReactGA.event({ category: "Tag", action: `push Tag ${name}` })
    }
  >
    {name}
    &nbsp;
    {count}
  </a>
);

export default Tag;
