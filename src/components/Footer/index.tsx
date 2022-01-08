import React from "react";
import { Link, withPrefix } from "gatsby";
import ExternalLink from "../ExternalLink";

import "./index.scss";

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <p className="architecture">
            Build with&nbsp;
            <ExternalLink href="https://www.gatsbyjs.org/" title="GatsbyJS" />
            &nbsp;and&nbsp;
            <ExternalLink href="https://preactjs.com/" title="PReact" />
            .&nbsp;Hosted on&nbsp;
            <ExternalLink href="https://www.netlify.com/" title="Netlify" />
            .&nbsp;Also indexed posts with&nbsp;
            <ExternalLink href="https://www.algolia.com/" title="Algolia" />
          </p>
          <p className="copyright">
            Copyright&nbsp;
            <ExternalLink
              href="https://portfolio.tubone-project24.xyz/"
              title="&copy;tubone24"
            />
            &nbsp;
            <b>
              <Link to={withPrefix("/")} title="tubone BOYAKI">
                tubone BOYAKI
              </Link>
              &nbsp;
            </b>
            2017-{new Date().getFullYear()}
            &nbsp;&nbsp;
            <Link to={withPrefix("/privacy-policies")} title="Privacy Policies">
              Privacy Policies
            </Link>
            &nbsp;&nbsp;Here is &nbsp;
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
