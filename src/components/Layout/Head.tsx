import React from "react";
import { Helmet } from "react-helmet";
import { siteTitle } from "@/config/index.json";

const Head = () => (
  <Helmet defaultTitle={siteTitle} titleTemplate={`%s | ${siteTitle}`}>
    <meta
      name="description"
      content="tubone BOYAKI is the developer blog by tubone who is Japanese IT Developer"
    />
    <meta
      name="keyword"
      content="blog, tubone, IT, Developer, Python, GitHub, Nuxt.js"
    />
    <meta name="theme-color" content="#33b546" />
    <meta name="msapplication-navbutton-color" content="#33b546" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="#33b546" />
    <link rel="shortcut icon" href="/assets/usericon.jpeg" />
    <meta
      name="google-site-verification"
      content="--LalgZ9bPi0TeRovPWh1jMxI1TuCs0dESPlyDtR_EQ"
    />
  </Helmet>
);

export default Head;
