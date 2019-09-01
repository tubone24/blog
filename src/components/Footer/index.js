import React from 'react';

import ExternalLink from '../ExternalLink';
import { config } from '../../../data';

import './index.scss';
import Search from '../Search';

const searchIndices = [
  { name: 'Posts', hitComp: 'PostHit' },
];

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="row">
        <div className="col-sm-12 text-center">
          <p className="architecture">

            Build with&nbsp;
            <ExternalLink href="https://www.gatsbyjs.org/" title="GatsbyJS"/>
            &nbsp;and&nbsp;
            <ExternalLink
              href="https://reactjs.org/"
              title={`React ${React.version}`}
            />
            .&nbsp;Hosted on&nbsp;
            <ExternalLink href="https://www.netlify.com/" title="Netlify"/>
            <br/>
          </p>
          <p className="copyright">

            Copyright&nbsp;
            <ExternalLink href="https://tubone-project24.xyz" title="&copy;tubone"/>

            &nbsp;
            {config.title}
            {new Date().getFullYear()}

            &nbsp;Theme by
            &nbsp;
            <ExternalLink href="https://github.com/calpa" title="Calpa Liu"/>
          </p>
        </div>
        <div className="col-sm-12 text-center">
          <Search collapse indices={searchIndices} />
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
