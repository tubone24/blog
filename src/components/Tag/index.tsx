import React from "react";
import ReactGA from "react-ga";
import { Link, withPrefix } from "gatsby";
import "./index.scss";

const Tag = ({ name, count }: { name: string; count: number }) => (
  <Link
    to={withPrefix(`/tag/${name}`)}
    className="header-tag"
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

Tag.defaultProps = {
  count: "",
};

export default Tag;
