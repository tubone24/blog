import React from 'react';
import {Link, withPrefix} from 'gatsby';
import ExternalLink from '../ExternalLink';
import { config } from '../../../data';

import './index.scss';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <p className="architecture">
            Build with&nbsp;
            <ExternalLink href="https://www.gatsbyjs.org/" title="GatsbyJS" />
            &nbsp;and&nbsp;
            <ExternalLink
              href="https://reactjs.org/"
              title={`React ${React.version}`}
            />
            .&nbsp;Hosted on&nbsp;
            <ExternalLink href="https://www.netlify.com/" title="Netlify" />
            .&nbsp;Also indexed posts with&nbsp;
            <ExternalLink href="https://www.algolia.com/" title="Algolia" />
          </p>
          <p className="copyright">
            Copyright&nbsp;
            <ExternalLink href="https://portfolio.tubone-project24.xyz/" title="&copy;tubone24" />
            &nbsp;
            <b>{config.title}&nbsp;</b>
            2017-{new Date().getFullYear()}
            &nbsp;&nbsp;
            {/*<ExternalLink href="https://blog.tubone-project24.xyz/privacy-policies" title="Privacy Policies" />*/}
            <Link to={withPrefix("/privacy-policies")} href={withPrefix("/privacy-policies")} title="Privacy Policies">Privacy Policies</Link>
            &nbsp;&nbsp;Here is &nbsp;
            {/*<ExternalLink href="https://blog.tubone-project24.xyz/sitemap.xml" title="Sitemap" />*/}
            <Link to={withPrefix("/sitemap.xml")} href={withPrefix("/sitemap.xml")} title="Privacy Policies">Sitemap</Link>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
