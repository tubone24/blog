---
slug: 2019/10/15/gas-webscreenshot
title: >-
  Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとAzure DevOps Build
  Pipelineで調理して定期的にWebページのスクリーンショットを撮る
date: 2019-10-14T22:22:26.996Z
description: >-
  Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとAzure DevOps Build
  Pipelineで調理して定期的にWebページのスクリーンショットを撮る
tags:
  - GAS
  - API FLASH
  - SlackAPI
  - Clasp
  - Azure DevOps Build Pipeline
  - Jest
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# タイトル長い

くっそ長いタイトルで恐縮ですが、Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとAzure DevOps Build Pipelineで調理して定期的にWebページのスクリーンショットを撮っていきたいと思います。

## Google Apps Script(GAS)とは？

Google Driveをご存じでしょうか？

スプレッドシートやらプレゼンテーションと呼ばれる某ExcelやPowerPointの基本機能がWeb画面で扱えるアレです。

Google Apps Scriptはそれのマクロだと思っていただけるとイメージがつきやすいかと思います。

ExcelやPowerPointだとVBAがマクロ言語ですが、Google Apps ScriptはJavaScriptが言語です。

さすがGoogle公式言語。

またGoogle Apps Scriptのことを省略してGASとか言ったりするそうです。

ｶﾞｽｶﾞｽ

GAS専用のマクロ用関数がある程度用意されてるのでマクロを組むのも簡単ですし、時間で関数をキックするトリガー機能もあるので、簡単なFaaS（Function as a Service）として
利用することもできます。

今回は後者の使い方が中心となります。

## JavaScriptはJavaScriptなんだけどさ
