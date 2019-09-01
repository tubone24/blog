---
title: Github + Gatsby + Netlify CMS で今更ブログを作る
date: 2019-09-01T07:33:38.830Z
description: 今更にはなりますがNetlify CMSを使ってみたくなったのでGatsbyを使ってブログ作ってみました。
tags:
  - Gatsby
  - Netlify
  - Travis
  - React
headerImage: 'https://i.imgur.com/dovylqZ.png'
templateKey: blog-post
---
## なぜこんなことを・・・。

今更にはなりますがNetlify CMSを使ってみたくなったのでGatsbyを使ってブログ作ってみました。

## 登場人物

### Netlify

[https://www.netlify.com/](https://www.netlify.com/)


#### tubone的な理解

Netlifyとは静的ホスティングサービスですが、S3とは違いGithubのpush契機にBuildが走るCI機能などが充実していてこれでOK感ある。

Identityという認証も用意されているのでCMSサイトも作れちゃう。

個人的にはNetlity Buttonがデザインよくてかっこいいという印象がもともと強かったです。

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tubone24/blog)

#### 実はすごかった Netlify CMS

[https://www.netlifycms.org/](https://www.netlifycms.org/)


NetlifyにGithubへのアクセスキーを持たせることで、CMS上でコンテンツを編集、GithubへのPushを一気にやってしまうことができます。
さらに記事のWorkflowも[Github Flow](http://scottchacon.com/2011/08/31/github-flow.html) に乗っけることができるので、CMSで編集しながらにしてレポジトリはぐちゃぐちゃにならない。

これ結構いいアイディア！

### Gatsby

[https://www.gatsbyjs.org/](https://www.gatsbyjs.org/)

#### tubone的な理解

便利便利といったものの、一からCMSを作るのはそれなりに骨が折れます。

と思っていたら最近はGatsbyというReactで作られた 


