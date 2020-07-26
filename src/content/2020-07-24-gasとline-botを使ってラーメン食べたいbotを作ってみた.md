---
slug: 2020/07/25/gas-bot
title: 4連休を使ってGASとLINE BOTを使ってラーメン食べたいBOTを作ってみた
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

## 無料&サーバレスといえばGAS

さて、GASが今回も出てきました。GAS大好きすぎるマンですね。すみません。

GASとはGoogle Apps Scriptsのことで詳しくは過去ブログ[Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮る
](https://blog.tubone-project24.xyz/2019/10/24/gas-webscreenshot#google-apps-scriptgas%E3%81%A8%E3%81%AF%EF%BC%9F)をご確認いただければと思います。

今回もTypeScript + Claspで開発していき、GitHub Actionsでデプロイまで完了するCI/CDを構築していきたいと思います。

