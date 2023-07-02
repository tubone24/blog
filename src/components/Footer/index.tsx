import React from "react";
import { Link, withPrefix } from "gatsby";
import ExternalLink from "@/components/ExternalLink";
import config from "@/config/index.json";

import * as style from "./index.module.scss";

const Footer = () => (
  <footer className={"footer " + style.footer}>
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <p data-testid="architecture">
            The source code for this blog is maintained on &nbsp;
            <b>
              <ExternalLink
                href="https://github.com/tubone24/blog"
                title="GitHub."
              />
            </b>
          </p>
          <p className={style.copyright} data-testid="copyright">
            Copyright&nbsp;
            <ExternalLink
              href="https://portfolio.tubone-project24.xyz/"
              title="&copy;tubone24"
            />
            &nbsp;
            <b>
              <Link to={withPrefix("/")}>{config.siteTitle}</Link>
              &nbsp;
            </b>
            2017-{new Date().getFullYear()}
            &nbsp;&nbsp;
            <Link to={withPrefix("/privacy-policies")}>Privacy Policies</Link>
            &nbsp;&nbsp;&nbsp;
            <a href="/sitemap-index.xml" title="sitemap">
              Sitemap
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
