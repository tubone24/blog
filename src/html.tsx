import React from "react";
import config from "@/config/index.json";

// test-coveralls
const HTML = ({
  htmlAttributes = {},
  headComponents = null,
  bodyAttributes = {},
  preBodyComponents = null,
  body = "",
  postBodyComponents = null,
}: {
  htmlAttributes?: React.HTMLAttributes<HTMLHtmlElement>;
  headComponents?: JSX.Element | null;
  bodyAttributes?: React.HTMLAttributes<HTMLBodyElement>;
  preBodyComponents?: JSX.Element | null;
  body?: string;
  postBodyComponents?: JSX.Element | null;
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
      <meta name="p:domain_verify" content={config.domain_verify} />
      <link rel="prefetch" href="/fonts/icomoon.woff2?s0mo8f" />
      <link rel="preconnect dns-prefetch" href="//i.imgur.com" />
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
    </body>
  </html>
);

export default HTML;
