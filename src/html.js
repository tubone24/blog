/* eslint-disable react/no-danger */
import React from 'react';

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) => (
  <html {...htmlAttributes} lang="ja">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta httpEquiv="content-language" content="ja" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      <meta name="p:domain_verify" content="2accdaac3153e1b438ab307ac5c4b855" />
      {/*<link rel="preconnect" href="https://ajax.aspnetcdn.com/" crossOrigin />*/}
      {/*<link*/}
      {/*  rel="stylesheet"*/}
      {/*  href="https://ajax.aspnetcdn.com/ajax/bootstrap/4.5.2/css/bootstrap.min.css" integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z" crossOrigin="anonymous"*/}
      {/*/>*/}
      <link
        rel="stylesheet"
        href="/vendors/css/bootstrap.min.css"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin />
      <link rel="dns-prefetch" href="https://fonts.gstatic.com/" />
      <link rel="dns-prefetch" href="https://i.imgur.com/" />
      <link rel="dns-prefetch" href="https://raw.githubusercontent.com/" />
      <link rel="dns-prefetch" href="https://sentry.io/" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com/" />
      <link rel="dns-prefetch" href="https://cdn.subscribers.com/" />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
      {/*<script src="https://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossOrigin="anonymous" />*/}
      {/*<script src="https://ajax.aspnetcdn.com/ajax/bootstrap/4.5.2/bootstrap.min.js" integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV" crossOrigin="anonymous" />*/}
      <script src="/vendors/js/jquery-3.5.1.slim.min.js" />
      <script src="/vendors/js/bootstrap.min.js" />
      <script src="/vendors/js/lazysizes.min.js" async="" />
    </body>
  </html>
);
HTML.defaultProps = {
  body: '',
  htmlAttributes: {},
  headComponents: null,
  bodyAttributes: {},
  preBodyComponents: null,
  postBodyComponents: null,
};

export default HTML;
