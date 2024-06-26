import React from "react";
import ReactGA from "react-ga4";

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
      <span className="fa-layers fa-fw fa-1x">
        <span className="icon-rss" />
      </span>
    </a>
  </div>
);

export default Subscription;
