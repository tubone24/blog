import React from "react";

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
      <meta
        httpEquiv="Content-Security-Policy"
        content="default-src 'self'; img-src *; media-src *; script-src 'self' 'nonce-ZsQmvvc24RF0Q3OGhq' 'https://www.google-analytics.com' 'https://ssl.google-analytics.com' 'https://platform.twitter.com' 'https://www.instagram.com' 'https://embedr.flickr.com' 'https://embed.redditmedia.com' 'https://ad.ad-stir.com' 'https://blog-storybook.netlify.app';"
      />
      <meta name="p:domain_verify" content="2accdaac3153e1b438ab307ac5c4b855" />
      <link rel="prefetch" href="/fonts/icomoon.woff2?s0mo8f" />
      <link rel="preconnect dns-prefetch" href="//i.imgur.com" />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <script src="/adstir.js" />
      <script
        src="https://js.ad-stir.com/js/adstir.js"
        nonce="ZsQmvvc24RF0Q3OGhq"
      />
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
