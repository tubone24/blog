import React from "react";
import ReactGA from "react-ga4";

import "./index.scss";

const NavItem = ({ url, name }: { url: string; name: string }) => (
  <a
    className="nav-btn btn btn-link"
    href={url}
    onClick={() => {
      ReactGA.event({
        category: "User",
        action: `Click nav-menu: ${name}`,
      });
      window.location.href = url;
    }}
  >
    {name}
  </a>
);

export default NavItem;
