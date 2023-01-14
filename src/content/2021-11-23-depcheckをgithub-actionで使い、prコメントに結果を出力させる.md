---
slug: 2021/11/21/depcheck
title: depcheckをGitHub Actionで使い、PRコメントに結果を出力させる
date: 2021-11-21T11:16:54.648Z
description: depcheckを使うと、package.jsonで定義されたライブラリがコードで使われているかどうかを確認することができます。確認の結果は、以下の例のように、GitHub Actions の実行時に PR コメントでユーザーに通知することができます。
tags:
  - JavaScript
  - depcheck
  - GitHub
headerImage: https://i.imgur.com/x0HzZEF.png
templateKey: blog-post
---
package.jsonはNodeのつらいところ。

## Table of Contents

```toc

```

## はじめに

JavaScriptやTypeScriptでのシステム開発に必要不可欠なNode.js Package Manager、いわゆるnpmはしばしばライブラリサイズが大きくなりがちなことが問題になります。

![img](https://i.imgur.com/yxDDBOX.jpg)

もちろんこちらの問題はさまざまな議論が尽くされているわけですし、今更どうこう言うつもりはないです。

https://youtu.be/SHIci8-6_gs

上記問題を解決する方法はいろいろあると思いますが、私のような末端開発者にはとりあえず使ってないライブラリを削除する、くらいしかできないのでそれらを加速させる方法を考えていきましょう。

## depcheck

[depcheck](https://github.com/depcheck/depcheck)とはnpmでパッケージ管理されたプロジェクトについて、各ライブラリの依存関係がどのように使用されているか、どの依存関係が使われていないか、package.jsonからどの依存関係が欠落しているかを確認するためのツールです。

プロジェクトルートでnpxを使って、

```
npx depcheck
```

で実行することで簡単に結果を得ることができます。例えば[こちらのレポジトリ](https://github.com/tubone24/portfolio)で実行すると、

```
> npx depcheck
npx: installed 120 in 12.136s

Unused dependencies
* @fortawesome/free-regular-svg-icons
* @fortawesome/free-solid-svg-icons
* react-error-overlay
* react-flickr-hero
* sharp
* tween
Unused devDependencies
* @storybook/addon-a11y
* @storybook/addon-controls
* @storybook/addon-docs
* @storybook/addon-essentials
* @storybook/addon-info
* @storybook/addon-knobs
* @storybook/addon-links
* @storybook/addon-storyshots
* @types/aws-lambda
* @types/jest
* @types/node
* @types/react-fontawesome
* @types/storybook__addon-info
* babel-preset-gatsby
* babel-preset-react-app
* greenkeeper-lockfile
* identity-obj-proxy
* netlify-cli
* netlify-lambda
* react-test-renderer
* stylelint-config-idiomatic-order
* stylelint-config-prettier
* stylelint-config-recommended
* stylelint-config-styled-components
* stylelint-processor-styled-components
* ts-dedent
* ts-jest
* tslint-react
Missing dependencies
* build-url: .\src\components\flickrHero.tsx
* @fortawesome/fontawesome-common-types: .\src\components\socialIcons.tsx
* axios: .\functions\src\contact.js
* @babel/preset-react: .\.storybook\main.js
* @babel/preset-env: .\.storybook\main.js
* @babel/plugin-proposal-class-properties: .\.storybook\main.js
* babel-plugin-remove-graphql-queries: .\.storybook\main.js
```

このようにpackage.jsonで定義されているにも関わらずコード上で使われてないライブラリ、もしくはコード上で見つかったけどpackage.jsonに定義されてないライブラリを一覧化できます。

## これをGitHub Actionsに組み込みたい

やはり、PRを出したときに自動でdepcheckが走るといいですよね。

そしてその結果を通知してくれたらさらにうれしいですよね。

そこで、GitHub Actionsを作りました。

<https://github.com/marketplace/actions/depcheck-action-with-pr>

使い方は簡単でお手元のGitHub Actionsでまず、Pull RequestをトリガーにしたYAMLを作ります。

このとき、入力としてGitHub TokenとPRコメントのURLが必要になりますが、これらはGitHub Actionsの環境変数として取得できます。

どちらもGitHub Actionsの環境変数として取得できます。


- GITHUB_TOKEN
  - これはsecrets.GITHUB_TOKENとして取得できます。
- PR_COMMENT_URL
  - PRイベントの際に、github.event.pull_request.comments_urlから取得できます。


```yaml
on:
  pull_request:
    branches:
      - master
      
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - name: "depcheck"
        uses: tubone24/depcheck_action@v1.0.0
        with:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          PR_COMMENT_URL: ${{ github.event.pull_request.comments_url }}
```

のようにuseすればいいだけ。

そうすれば、PRコメントとして結果が出力されます。

![img](https://i.imgur.com/x0HzZEF.png)

- Unused dependenciesセクションは、package.jsonのdependenciesで定義されたライブラリが、.js、.ts、.jsx、.tsx、.coffee、.sass、.SCSS、.vueの各ファイルで使用されていないことを示しています。
- Unused devDpendenciesセクションは、package.jsonのdevDependenciesで定義されたライブラリが各ファイルに存在しないことを示しています。
- Missingセクションは、コードで使用されているライブラリがpackage.jsonに存在していないことを示しています。CDNからインポートされたライブラリや、グローバルに宣言されたライブラリを使用している可能性があります。

## まとめ

自分が欲してたものなのでサクッと作ってみたが、めんどくさかったので[GitHub ActionsはDockerで作ってしまった](https://docs.github.com/ja/actions/creating-actions/creating-a-docker-container-action)ので、主にスピード面で課題があります。

一応、base imageを作って高速化はしてますが、Full JavaScriptで作って、もっと丁寧に作ってもよかったと大後悔。






