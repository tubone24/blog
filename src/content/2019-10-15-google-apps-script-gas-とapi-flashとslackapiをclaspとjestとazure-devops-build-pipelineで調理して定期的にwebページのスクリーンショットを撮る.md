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

さきほど書いたとおり、ほとんどGASはJavaScriptなのですが、ES6な記法ではないので、JavaScriptとは恐れ多くても言えないというのが実状です。

なので上記と合わせ素のGASを使うと下記のような悲しいことがおきます。

- 古くさいJavaScriptを書く
- テストできない
- CIに乗っけられない（手デプロイ）

これは悲しいですね。

## 悲しい世界には美しい花が咲く

と悲しい気持ちになってるところで見つけたのがclaspです。

claspはGoogle謹製のGASデプロイツールなのですが、勇者が
Claspを使ったTypeSciptテンプレートを作ってました。天才かよ。

今回はこちらのテンプレートを借りて開発を進めたいとおもいます。

## API FLASH のサービス層作成

今回のGASの目的は、**WEBページのスクリーンショットを撮る**ということですので、スクリーンショットを簡単に取得する方法としてAPI FLASHを使います、

### API FLASHとは

[API FLASH](https://apiflash.com/)とは、ChromeベースのWebscreenshotAPI提供サービスです。

API FLASH自体はAWS Lambdaを使ってるらしく、スケーラビリティが高いと主張してます。

おそらく、Serverless-chromiumをLambdaで実行しているものと思われます。

Chromeベースのキャプチャリングなので、レンダリングも正確で非対応ページがすくないのもうれしいところです。

さらに、うれしい機能として遅延キャプチャリング機能があり、ページのレンダリングを待ってからキャプチャを撮ることも可能です。
