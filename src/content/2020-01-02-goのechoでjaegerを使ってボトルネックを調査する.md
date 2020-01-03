---
slug: 2019/1/2/go-jaeger
title: GoのEchoでJaegerを使ってボトルネックを調査する
date: 2020-01-02T08:07:30.122Z
description: GoのEchoでJaegerを使ってボトルネックを調査します。
tags:
  - Go
  - Echo
  - Jaeger
  - ボトルネック調査
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
Goの勉強をしておかないと社内でニートになってしまうので、お勉強を兼ねてGoのWebフレームワークのEchoを使ったアプリケーションを作成中です。

その中でボトルネック調査をする必要があったので、Opentracing形式のトレースアプリケーションであるJaegerをローカル環境で使ってみたいと思います。

## Table of Contents

```toc

```

## そもそもEchoとは？

**High performance**で**extensible**で**minimalist**な **Go web framework**だそうです。

よくわかりませんね。ちょっと特徴を洗い出してみます。

### はやい

Goの中でもパフォーマンスがいいと言われているGinに比べても十分な速度がでていることが公式のGitHubにのってました。

![img](https://camo.githubusercontent.com/d8800e2ee37115207efc1f3e937a28fb49d90e22/68747470733a2f2f692e696d6775722e636f6d2f49333256644d4a2e706e67)

Ginより早いならEcho使っておけばええんや！と思いますが、

GitHubレポジトリのスター数はEchoは16.1k, Ginは34.4kとGinの方が人気なのは間違いありませんので、プロジェクトによって見極める必要はありそうです。

### 公式ドキュメントが優秀

Echoの場合、Ginに比べて公式のドキュメントが充実しているような気がしました。気のせいかもしれません。

Ginの方はドキュメントに[DISQUS](https://disqus.com/)のコメント欄があります。これはいいアイディアですね。

[Echoの公式ドキュメント](https://echo.labstack.com/guide)

[Ginの公式ドキュメント](https://gin-gonic.com/docs/)

さて、Echoがいいという話はこんなところにして早速実装してみます。

## 実装

