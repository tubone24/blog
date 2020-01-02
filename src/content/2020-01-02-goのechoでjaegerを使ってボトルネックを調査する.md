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
Goの勉強をしておかないと社内でニートになってしまうので、GoのWebフレームワークのEchoを使ったアプリケーションを作成中です。

その中でボトルネック調査をする必要があったので、Opentracing形式のトレースアプリケーションであるJaegerをローカル環境で使ってみたいと思います。

## Table of Contents

```toc

```

## Echoとは？

**High performance**で**extensible**で**minimalist**な **Go web framework**だそうです。

よくわかりませんね。まぁ公式のGitHubを見るに、

### はやい

![img](https://camo.githubusercontent.com/d8800e2ee37115207efc1f3e937a28fb49d90e22/68747470733a2f2f692e696d6775722e636f6d2f49333256644d4a2e706e67)
