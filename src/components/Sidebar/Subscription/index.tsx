import React from "react";
import ReactGA from "react-ga4";
import { Rss } from "lucide-react";

import * as style from "./index.module.scss";

const Subscription = () => (
  <div className="subscription">
    <a
      href="/rss.xml"
      className={style.subrss + " btn"}
      role="button"
      onClick={() =>
        ReactGA.event({ category: "User", action: "push RSS Button" })
      }
    >
      SUBSCRIBE RSS&nbsp;
      <Rss size={14} aria-hidden="true" />
    </a>
  </div>
);

export default Subscription;
