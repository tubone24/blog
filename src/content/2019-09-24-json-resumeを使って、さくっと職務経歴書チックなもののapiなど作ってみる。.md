---
slug: 2019/09/24/json-resume
title: JSON Resume + API With GitHubを使って、さくっと職務経歴書チックなもののAPIなど作ってみる
date: 2019-09-24T10:41:02.386Z
description: JSON Resume + API With GitHubを使って、さくっと職務経歴書チックなもののAPIなど作ってみます
tags:
  - JSON Resume
  - GitHub Pages
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# JSON Resumeを使ってさくさくっとそれっぽい職務経歴書を作ってみます

[JSON resume](https://jsonresume.org/)というものがあるようです。

今回はこちらを使って職務経歴を返すAPIを[API with GitHub](https://apiwithgithub.com/)で作りつつ、Resumeを作りたいと思います。

## JSON Resumeとは？
JSON Resumeとは、JSON形式で職務経歴を記載するオープンソースのスキーマー定義です。

OSSプロジェクトですので、[こちら](https://github.com/jsonresume/resume-schema)からIssueやPRを出すことができます。足りないスキーマがあれば積極的にコントリビュートしてみては？

今回は[APIs With GitHubとJSON-Resumeでサクッとプロフィールを返すAPIをつくる](https://qiita.com/kai_kou/items/779bdcdfc7ea5def3dfc)を参考にまずJSON ResumeのAPIを作ろうと思います。

## API With GitHubの設定

API With GitHubはGitHubのJSONファイルの編集画面と、rawgithubusercontent.comを使ってJSONファイルをHTTPで返却するLINKを作成するお手軽Webサービスです。

固定値のJSONを返すだけならこいつでサクサク作っちゃえばええやん。さっそく使っていきます。

[API With GitHub](https://apiwithgithub.com/)にアクセスするとGitHubアカウントとの連携を求められるので同意してしまいます。

そうすると、Repositoryを作る画面に進みますので迷わず新しいレポジトリを作ります。

![Img](https://i.imgur.com/6Lti5I8.png)

あとは普通にレポジトリを新規作成する手順で作っていきます。

![Img](https://i.imgur.com/d4nmRXZ.png)

Make APIボタンを押すと・・・。

![Img](https://i.imgur.com/W3Paou3.png)

新規JSONファイルを作る画面に進みます。

![Img](https://i.imgur.com/vzhzqiI.png)
