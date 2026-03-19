import React from "react";
import { Calendar } from "lucide-react";

import * as style from "./index.module.scss";
import ReactGA from "react-ga4";
import dayjs from "dayjs";
import type { AllPost } from "../entity";

const Archive = ({ allPosts }: { allPosts: AllPost[] }) => {
  const yearList = Array.from(
    new Set(
      allPosts.map((data) => dayjs(data.node.frontmatter.date).format("YYYY")),
    ),
  ).sort((a, b) => (a < b ? 1 : -1));
  return (
    <div className={style.archive} data-testid="Archive">
      <div className={style.sectionHeader}>
        <Calendar
          size={16}
          aria-hidden="true"
          style={{ verticalAlign: "-0.125em" }}
        />
        &nbsp;Archives
      </div>
      {yearList.map((year) => (
        <a
          key={year}
          href={`/${year}/`}
          title={`Articles written in ${year}`}
          onClick={() =>
            ReactGA.event({
              category: "Archive",
              action: `push Archive ${year}`,
            })
          }
        >
          {year}
        </a>
      ))}
    </div>
  );
};

export default Archive;
