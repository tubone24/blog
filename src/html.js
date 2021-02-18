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
      <link
        rel="stylesheet"
        href="/vendors/css/bootstrap.min.custom.css"
      />
      <link rel="prefetch" href="/fonts/icomoon.woff2" />
      <link rel="dns-prefetch" href="//sentry.io" />
      <link
        rel="alternate"
        type="application/rdf+xml"
        title="tubone BOYAKI"
        href="https://blog.tubone-project24.xyz/rss.xml"
      />
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
      <script src="/vendors/js/jquery-3.5.1.slim.custom.min.js" defer />
      {/* <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.slim.min.js" */}
      {/*        integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" */}
      {/*        crossOrigin="anonymous" */}
      {/*        defer /> */}
      <script src="/vendors/js/bootstrap.custom.min.js" defer />
      {/* <script src="/vendors/js/bootstrap-native.js" /> */}
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
