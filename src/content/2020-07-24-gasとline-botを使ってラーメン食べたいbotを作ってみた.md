---
slug: 2020/07/25/gas-bot
title: 4連休を使ってGASとLINE BOTとFirebaseを使ってラーメン食べたいBOTを作ってみた
date: 2020-07-24T15:49:47.993Z
description: GASとLINE BOTを使ってラーメン食べたいBOTを作ってみた
tags:
  - GAS
  - LINEBOT
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
4連休、StayHomeが叫ばれる中、ラーメンが食べたくなったので、LINEBOTを含めたラーメンソリューションを作ってみました。

## Table of Contents

```toc

```

## StayHomeとは？

StayHomeとは、**COVID-19**の感染拡大を防止するために、「人に会うのを可能な限り避ける」取り組みの中で、みんなお家にいようね！という標語のようなものだ。

残念ながら独身生活もこう長くなってくると、人と接しなくてもストレスなく生きられてしまうので、全然StayHome OKマンな私ですが、ただのんびりDアニメストアでアニメを見ながら、きのこの山を食べて、ゴロゴロしているのも4連休のお休みを作ってくださった神様(政府)に申し訳ないので、ためになることをしようと思いました。

「StayHomeでCOVではなくDEVしよう」

## 縛りプレイ

ただ闇雲に開発するだけでは面白くないので今回も縛りプレイを実施していこうと思います。

- 貧乏なのでオールフリー(無料)
- できる限りサーバレス
- LINEを絡める

特にLINEを絡めた開発をするのには理由がありまして、最近本業の開発で隣のチームがLINEのメッセージレイアウトがどうとか言っているのを聞いていて、ちょっとでも話題に入れるようにしたいという下心があるわけです。

## 全体構成

今回のアプリケーションは**LINEの位置情報から近くのラーメン屋を探す**サービスにしたいと思います。

お友達にヒアリングしてみると、**食べたラーメンを登録したい**、 **食べたラーメンを共有したい**などのご意見があったので**ライフログ**機能もつけます。

### ワイヤーフレーム

![img](https://i.imgur.com/KUqm5Qs.png)

雑ですが作ってみました。位置情報を送ると、近くのラーメン屋を検索してカルーセルで紹介します。

また、ラーメン評価ボタンを付けて、クリックするとFirebaseで作ったフロントに飛んで星をつけることができます。

![img](https://i.imgur.com/ibZirgX.png)

なので、LINEBOTを基軸にサービスを組みますが、今回はバックエンド処理がLINEの[MessagingAPI](https://developers.line.biz/ja/reference/messaging-api/)のWebhookで起動し、返信を返す機能なのでBOT部分はGASのdoPostを使って作ります。

ラーメン登録画面などはさすがにGASで作り切るのはしんどいので、Firebaseを使います。フロント自体はある程度実装経験があるNuxt.jsを使います。

## 無料&サーバレスといえばGAS

さて、GASが今回も出てきました。GAS大好きすぎるマンですね。すみません。

GASとはGoogle Apps Scriptsのことで詳しくは過去ブログ[Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮る
](https://blog.tubone-project24.xyz/2019/10/24/gas-webscreenshot#google-apps-scriptgas%E3%81%A8%E3%81%AF%EF%BC%9F)をご確認いただければと思います。

今回もTypeScript + Claspで開発していき、GitHub Actionsでデプロイまで完了するCI/CDを構築していきたいと思います。

## 詰まったところ

### 近くのラーメン情報の取得方法

LINEのMessagingAPIではユーザが位置情報を送ると、設定したWebhookに対して緯度経度が送られます。

```
{
  "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
  "type": "message",
  "mode": "active",
  "timestamp": 1462629479859,
  "source": {
    "type": "user",
    "userId": "U4af4980629..."
  },
  "message": {
    "id": "325708",
    "type": "location",
    "title": "my location",
    "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
    "latitude": 35.65910807942215,
    "longitude": 139.70372892916203
  }
}
```

<https://developers.line.biz/ja/reference/messaging-api/#wh-location>



