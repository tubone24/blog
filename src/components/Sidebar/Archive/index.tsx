import React from "react";
import { Link, withPrefix } from "gatsby";

import * as style from "./index.module.scss";
import ReactGA from "react-ga4";
import dayjs from "dayjs";
import { AllPost } from "../entity";

const yearLink = ({ year }: { year: string }) => (
  <Link
    to={withPrefix(`/${year}/`)}
    title={`Articles written in ${year}`}
    onClick={() =>
      ReactGA.event({ category: "Archive", action: `push Archive ${year}` })
    }
  >
    {year}
  </Link>
);
const Archive = ({ allPosts }: { allPosts: AllPost[] }) => {
  const yearList = Array.from(
    new Set(
      allPosts.map((data) => dayjs(data.node.frontmatter.date).format("YYYY"))
    )
  ).sort((a, b) => (a < b ? 1 : -1));
  return (
    <div className={style.archive}>
      <p>
        <span className="icon-calendar" />
        &nbsp;Archives
      </p>
      {yearList.map((year) => yearLink({ year }))}
    </div>
  );
};

export default Archive;
