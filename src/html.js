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
      <script src="/vendors/js/jquery.slim.min.js" />
      {/*<script src="/vendors/js/popper.min.js" />*/}
      <script src="/vendors/js/bootstrap.min.js" />
      {/*<link*/}
      {/*  rel="stylesheet"*/}
      {/*  href="/vendors/css/jquery.fancybox.min.css"*/}
      {/*/>*/}
      <link
        rel="stylesheet"
        href="/vendors/css/bootstrap.min.css"
      />
      <link
        rel="stylesheet"
        href="/vendors/css/solarized-light.min.css"
      />
      {/*<script src="/vendors/js/jquery.fancybox.min.js" />*/}
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
