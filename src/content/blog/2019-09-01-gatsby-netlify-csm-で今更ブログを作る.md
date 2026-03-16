---
slug: 2019/09/01/netlify-and-gatsby
title: Github + Gatsby + Netlify CMS で今更ブログを作る
date: 2019-09-01T07:33:38.830Z
description: "Netlify CMSとGatsbyを使ったブログ構築の手順を解説。GitHubとの連携、CMS管理画面の設定、独自ドメインの適用まで、静的サイトジェネレーターを使ったHeadless CMSブログの作り方を初心者向けにまとめました。"
tags:
  - JavaScript
  - Gatsby
  - Netlify
  - Travis
  - React
  - Headless CMS
headerImage: '/images/blog/dovylqZ.png'
templateKey: blog-post
---

## Table of Contents

```toc

```

## なぜこんなことを・・・

いまさらにはなりますがNetlify CMSを使ってみたくなったのでGatsbyを使ってブログ作ってみました。

## 登場人物

### Netlify

<https://www.netlify.com/>

Netlifyとは静的ホスティングサービスですが、S3とは違いGitHubのpush契機にBuildが走るCI機能などが充実していてこれでOK感ある。なお、[Netlifyのビルド時間をGitHub Actionsで0時間にする方法](/2021/02/13/netlify-github-action/)も後の記事で紹介しています。

Identityという認証も用意されているのでCMSサイトも作れちゃう。

個人的にはNetlity Buttonがデザインよくてかっこいいという印象がもともと強かったです。

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/tubone24/blog)

### 実はすごかった Netlify CMS

<https://www.netlifycms.org/>

NetlifyにGithubへのアクセスキーを持たせることで、CMS上でコンテンツを編集、GithubへのPushを一気にやってしまうことができます。
さらに記事のWorkflowも[GitHub Flow](http://scottchacon.com/2011/08/31/github-flow.html) に乗っけることができるので、CMSで編集しながらにしてレポジトリはぐちゃぐちゃにならない。

これ結構いいアイディア！

### Gatsby

<https://www.gatsbyjs.org/>

便利便利といったものの、一からCMSを作るのはそれなりに骨が折れます。

と思っていたら最近はGatsbyというReactで作られたCMSがありました。すごい。

![Gatsbyのアーキテクチャ図：多数のデータソースからGraphQLで接続しReactで静的ページを生成する仕組み](/images/blog/wVxAzAl.png)

[公式](https://www.gatsbyjs.org/)に載っていた図を見ると数多のDatasourceにGraphQLで接続し、Reactで静的なページを作るという感じ。

MarkdownをGithubにPostすれば完全に求めている感じのことができそう。すごいすごい。

## さっそく作ってみる

### Netlify対応版のGatsby-starterをダウンロードする

[<https://github.com/netlify-templates/gatsby-starter-netlify-cms>
](https://github.com/netlify-templates/gatsby-starter-netlify-cms
)

git cloneしてきます。

とりあえずローカル上で動かしてみます。

```bash{numberLines: 1}
npm install
npm start
```

するとコーヒー屋さん（？）のページが出てきます。

![Gatsby Starterのデフォルト画面：コーヒーショップのテンプレートページ](/images/blog/fRY1Ss4.png)

このままだとコーヒーショップを経営することになるのでゴリゴリReact書いていい感じにしてください。

CMSの要素は残す必要があるため、ComponentsのTemplateを編集するときはMarkdownで定義している要素に過不足なくするようご注意ください。

私が慣れていないだけですが、GraphQLでエラーが出るとエラーがめっちゃ追いにくい・・・。後に[Netlify Formを使った簡易Contact Form](/2019/09/30/netlify-form/)も作ってみました。

### Netlifyのアカウント用意する

無事サイトができたら、Netlifyに挙げていきます。

![NetlifyのGitHub連携画面でデプロイするレポジトリを選択する画面](/images/blog/P0E2109.png)

アカウントを作ってGithubと連携するとDeployするレポジトリを選択できます。

今回は[blog](https://github.com/tubone24/blog/)というレポジトリを作りましたのでそちらを連携させます。

画面に沿って進んでいけば、特に追加の設定なくサイトがDeployできると思います。

Deployできるとデプロイ先のURLが発行されます。

独自ドメインを持っていましたらここで設定してしまえばいいと思います。

参考: [Custom Domains
](https://www.netlify.com/docs/custom-domains/)

![Netlifyの独自ドメイン設定画面](/images/blog/Z07HTMG.png)

### CMSの管理画面を設定する

無事にDeployできましたら、CMSの管理画面を設定します。

![Netlify GeneralのSite Members設定画面](/images/blog/kOuCJAo.png)

General => Site Membersから、アカウントを作成し登録します。

できたら、作ったサイトの管理画面 `/admin` にアクセスします。

設定がうまくいっていればログイン画面からコンテンツの編集画面が開けます。

![Netlify CMSのコンテンツ編集画面のログイン後のダッシュボード](/images/blog/LY84I80.png)

CMSから記事を登録したい(GithubにCMSからPushしたい)時は追加でGitGatewayを設定します。

Githubの[PersonalAccessToken](https://github.com/settings/tokens/new)から作成したAPIキーを設定してあげればよいです。

![NetlifyのGitGateway設定画面でGitHub PersonalAccessTokenを入力する画面](/images/blog/V2Aobi8.png)

## 完成

結構爆速。

他の人のGatsbyを見るとTravisとか使ってCI回している・・。真似しよう・・。CIといえば[GitHub Actionを使って簡単CIを作る](/2019/09/02/github-action/)のも便利です。

![完成したGatsby製ブログのトップページ](/images/blog/mIcrB6K.png)

## 結論

Netlify CMSはすごいぞ！

![完成したGatsby製ブログのトップページ](/images/blog/mIcrB6K.png)
