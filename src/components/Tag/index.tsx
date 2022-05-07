import React from "react";
import ReactGA from "react-ga4";
import { Link, withPrefix } from "gatsby";
import * as style from "./index.module.scss";

const Tag = ({
  name,
  count = "",
}: {
  name: string;
  count?: number | string;
}) => (
  <Link
    to={withPrefix(`/tag/${name}`)}
    className={style.headerTag}
    title={name}
    onClick={() =>
      ReactGA.event({ category: "Tag", action: `push Tag ${name}` })
    }
  >
    {name}
    &nbsp;
    {count}
  </Link>
);

export default Tag;
