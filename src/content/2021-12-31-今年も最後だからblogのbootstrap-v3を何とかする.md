---
slug: 2021/12/31/blog-bootstrap
title: 今年も最後だからBlogのBootstrap v3を何とかする
date: 2021-12-31T07:09:52.428Z
description: 長らくBlogのスタイルを支えてきたBootstrap v3が技術負債になってしまっていたのでとりあえずBootstrap v5にしたお話。
tags:
  - JavaScript
  - BootStrap
  - 年越し
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
年末ですね。

## Table of Contents

```toc

```

## 今年の汚れ今年のうちに。

ということで、長らく超技術負債となってしまっていたこのブログをなんとかします。

このブログは、Gatsby.jsをGitHub ActionsでビルドしてNetlifyにデプロイして作られているのですが、CSSフレームワークはBootstrap v3.5.1を使って作られていました。

さすがに[2019年にサポート対象外](https://blog.getbootstrap.com/2019/07/24/lts-plan/)となっているフレームワークを使い続けるのはどうかと思っておりましたが、別に動いているしいいかと思い放置していました。

が、しかしさすがに今年の汚れ今年のうちにと思い立ち、思い切って脱Bootstrapを考え、[Tailwind](https://tailwindcss.com/)とか[daisyUI](https://daisyui.com/)とか、[tailwind-bootstrap-grid
](https://tailwind-bootstrap-grid.netlify.app/)とか色々試した結果、めんどくさくなってBootstrap v5に移行することにしました。

## 問題点

BootStrap v3で動いていたこのブログのソースを見てもらえばわかるのですが、Gatsby.jsで動いているブログなのに、Bootstrapは**<script>**タグを使ってCDNライクに使ってました。(CDN配信ではありません。ここらへんも闇です。)
  
Gatsby.jsでは**html.(j|t)sx**というファイルを作ることでHTMLファイルのビルド時に任意のタグを埋め込むことができます。それを**悪用**して次のようにBootstrapのCSSをlinkタグで、jQueryとBootstrapのJSをscriptタグでそれぞれ配信して使っている形となっておりました。

これでは下記の問題が発生する形になり大変問題に感じてました。

  
  

```javascript
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
      <link
        rel="stylesheet"
        href="/vendors/css/bootstrap.min.custom.css"
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
      <script src="/vendors/js/bootstrap.custom.min.js" defer />
    </body>
  </html>
);

export default HTML;
```
















