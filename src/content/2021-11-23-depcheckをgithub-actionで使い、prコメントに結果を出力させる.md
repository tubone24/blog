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

JavaScriptやTypeScriptでのシステム開発に必要不可欠なNode Package Manager、いわゆるnpmはしばしばライブラリサイズが大きくなりがちなことが問題になります。

![img](https://i.imgur.com/yxDDBOX.jpg)

もちろんこちらの問題は様々な議論が尽くされているわけですし、今更どうこう言うつもりはないです。

`youtube:https://www.youtube.com/embed/SHIci8-6_g`

上記問題を解決する方法はいろいろあると思いますが、私のような末端開発者にはとりあえず使ってないライブラリを削除する、くらいしかできないのでそれらを加速させる方法を考えていきましょう。

## depcheck

[depcheck](https://github.com/depcheck/depcheck)とはnpmでパッケージ管理されたプロジェクトについて、各ライブラリの依存関係がどのように使用されているか、どの依存関係が使われていないか、package.jsonからどの依存関係が欠落しているかを確認するためのツールです。

プロジェクトルートでnpxを使って

```
npx depcheck
```

で実行することで簡単に結果を得ることができます。例えば[こちらのレポジトリ](https://github.com/tubone24/portfolio)で実行すると

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




























