---
slug: 2019/09/24/json-resume
title: JSON Resumeを使って、さくっと職務経歴書チックなもののAPIなど作ってみる
date: 2019-09-24T10:41:02.386Z
description: JSON Resumeを使って、さくっと職務経歴書チックなもののAPIなど作ってみます
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
