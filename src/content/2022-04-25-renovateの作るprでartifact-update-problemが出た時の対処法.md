---
slug: 2022/04/25/renovate-error
title: Renovateの作るPRでArtifact update problemが出た時の対処法
date: 2022-04-25T14:54:39.263Z
description: ライブラリを定期的にアップデートしてくれる優れもの、Renovateについて変なエラーが出てそれを直した際の直し方を共有。
tags:
  - Renovate
headerImage: https://i.imgur.com/61v14dU.png
templateKey: blog-post
---
エラーは突然に。

## Table of Contents

```toc

```

## Renovate

[Renovate](https://www.whitesourcesoftware.com/free-developer-tools/renovate/)とはプロジェクトが使っているライブラリの依存関係 (Dependency) の更新を自動化するツールです。

さまざまな言語に対応しており、もちろんnpmにも対応してます。

JavaScriptのライブラリ更新は特に追いかけるのが大変なのでこのブログでもRenovateを使ってライブラリの依存関係をできるだけ最新に保つようにしてます。

Renovateがライブラリを更新する際はpackage.jsonやpackage-loc.json、yarn.lockなどの依存グラフを保存しているファイルを直接変更の上、PRの形で更新依頼を作成します。

なので、CIでテストがきちんと回るようにしていたり、PRごとにデプロイが走るような形にしていれば、その成功を持って機械的にmerge(auto merge機能もあります)することができます。便利ですね。

## Artifact update problem

ところが、ある日を境にRenovateが作るPRが軒並みCI Checkに失敗する事象が発生しました。

Renovate artifactと呼ばれるcheckが失敗していてPRコメントには次のようなメッセージが出てました。

![renovate error](https://i.imgur.com/61v14dU.png)

```bash:titile=renovateコメント

Renovate failed to update an artifact related to this branch. You probably do not want to merge this PR as-is.

♻ Renovate will retry this branch, including artifacts, only when one of the following happens:

any of the package files in this branch needs updating, or
the branch becomes conflicted, or
you click the rebase/retry checkbox if found above, or
you rename this PR's title to start with "rebase!" to trigger it manually
The artifact failure details are included below:

File name: package-lock.json


npm notice 
npm notice New minor version of npm available! 8.1.2 -> 8.7.0
npm notice Changelog: <https://github.com/npm/cli/releases/tag/v8.7.0>
npm notice Run `npm install -g npm@8.7.0` to update!
npm notice 
npm ERR! code ERESOLVE
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: gatsby-plugin-netlify@3.14.0
npm ERR! Found: gatsby@4.7.0
npm ERR! node_modules/gatsby
npm ERR!   gatsby@"4.7.0" from the root project
npm ERR!   peer gatsby@"^2.0.0 || ^3.0.0 || ^4.0.0" from gatsby-plugin-algolia@0.26.0
npm ERR!   node_modules/gatsby-plugin-algolia
npm ERR!     gatsby-plugin-algolia@"0.26.0" from the root project
npm ERR!   27 more (gatsby-plugin-cdn-files, gatsby-plugin-feed, ...)
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer gatsby@"^3.0.0" from gatsby-plugin-netlify@3.14.0
npm ERR! node_modules/gatsby-plugin-netlify
npm ERR!   gatsby-plugin-netlify@"3.14.0" from the root project
npm ERR! 
npm ERR! Conflicting peer dependency: gatsby@3.14.6
npm ERR! node_modules/gatsby
npm ERR!   peer gatsby@"^3.0.0" from gatsby-plugin-netlify@3.14.0
npm ERR!   node_modules/gatsby-plugin-netlify
npm ERR!     gatsby-plugin-netlify@"3.14.0" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
npm ERR! 
npm ERR! See /tmp/renovate-cache/others/npm/eresolve-report.txt for a full report.

npm ERR! A complete log of this run can be found in:
npm ERR!     /tmp/renovate-cache/others/npm/_logs/2022-04-24T15_15_32_316Z-debug-0.log
```

こちらについていくつかIssuesとかを確認してみたのですが、これといって参考になるものもなく、どうしようかなと思ってましたがちゃんとPRコメントで何が原因かエラーが出てました。

ちゃんとエラーを見る癖をつけたいものですね。

```bash:title=renovateError
npm ERR! ERESOLVE could not resolve
npm ERR! 
npm ERR! While resolving: gatsby-plugin-netlify@3.14.0
npm ERR! Found: gatsby@4.7.0
npm ERR! node_modules/gatsby
npm ERR!   gatsby@"4.7.0" from the root project
npm ERR!   peer gatsby@"^2.0.0 || ^3.0.0 || ^4.0.0" from gatsby-plugin-algolia@0.26.0
npm ERR!   node_modules/gatsby-plugin-algolia
npm ERR!     gatsby-plugin-algolia@"0.26.0" from the root project
npm ERR!   27 more (gatsby-plugin-cdn-files, gatsby-plugin-feed, ...)
npm ERR! 
npm ERR! Could not resolve dependency:
npm ERR! peer gatsby@"^3.0.0" from gatsby-plugin-netlify@3.14.0
npm ERR! node_modules/gatsby-plugin-netlify
npm ERR!   gatsby-plugin-netlify@"3.14.0" from the root project
npm ERR! 
npm ERR! Conflicting peer dependency: gatsby@3.14.6
npm ERR! node_modules/gatsby
npm ERR!   peer gatsby@"^3.0.0" from gatsby-plugin-netlify@3.14.0
npm ERR!   node_modules/gatsby-plugin-netlify
npm ERR!     gatsby-plugin-netlify@"3.14.0" from the root project
npm ERR! 
npm ERR! Fix the upstream dependency conflict, or retry
npm ERR! this command with --force, or --legacy-peer-deps
npm ERR! to accept an incorrect (and potentially broken) dependency resolution.
```

本ブログで使っているGatsbyのバージョンは4.7.0ですが、プラグインのgatsby-plugin-netlifyが3.14.0のバージョンで、それがgatsbyのv3系に依存しているので依存関係が解決できません！という何ともよくあるエラーでした。

にしても、こちらで組んでいるCIでは特にそんなエラーも出ずに完了しているところを見ると何が原因なんでしょうね...。偉い人教えてください。

あと、Renovate自体がgatsby-plugin-netlifyのバージョンアップのPRを作らなかったのも気になります...わからん。

エラーの原因がわかれば直すのは簡単です。package.jsonを編集して、gatsby-plugin-netlifyのバージョンをgatsby v.4.7.0に対応しているところまで手動で上げれば良いだけです。

その後npm installしてpackage-lock.jsonの依存グラフを直してあげれば完成です。

```json:title=package.json
  "dependencies": {
    "gatsby": "4.7.0",
    "gatsby-plugin-netlify": "4.3.0",
   }
```

これでエラーは解消されました。

## 結論

なんか今回の記事はあっさりとしたものになってしまいましたが、Renovateもこういったエラーを吐くことがあるので、その際は出力されているコンソールログを見て手元で修正する必要がありそうですよ。という共有でした。






















