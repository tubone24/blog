import React from "react";
import { Helmet } from "react-helmet-async";
import config from "@/config/index.json";

const Head = () => (
  <Helmet
    defaultTitle={config.siteTitle}
    titleTemplate={`%s | ${config.siteTitle}`}
  >
    <meta name="description" content={config.description} />
    <meta name="keyword" content={config.keywords} />
    <meta name="theme-color" content="#33b546" />
    <meta name="msapplication-navbutton-color" content="#33b546" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="#33b546" />
    <link rel="shortcut icon" href="/assets/usericon.jpeg" />
    <meta
      name="google-site-verification"
      content={config.googleSiteVerification}
    />
  </Helmet>
);

export default Head;
