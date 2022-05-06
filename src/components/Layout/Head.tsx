import React from "react";
import { Helmet } from "react-helmet";
import {
  siteTitle,
  description,
  keywords,
  googleSiteVerification,
} from "@/config/index.json";

const Head = () => (
  <Helmet defaultTitle={siteTitle} titleTemplate={`%s | ${siteTitle}`}>
    <meta name="description" content={description} />
    <meta name="keyword" content={keywords} />
    <meta name="theme-color" content="#33b546" />
    <meta name="msapplication-navbutton-color" content="#33b546" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="#33b546" />
    <link rel="shortcut icon" href="/assets/usericon.jpeg" />
    <meta name="google-site-verification" content={googleSiteVerification} />
  </Helmet>
);

export default Head;
