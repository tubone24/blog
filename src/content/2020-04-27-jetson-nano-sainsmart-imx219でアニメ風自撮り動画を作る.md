---
slug: 2020/04/27/anime-face
title: Jetson nano + SainSmart IMX219でアニメ風自撮り動画を作る
date: 2020-04-27T04:28:55.121Z
description: Jetson nanoでアニメ風自撮り動画を作る
tags:
  - 機械学習
  - Jetson nano
  - SainSmart IMX219
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
[ディープラーニングで自撮り画像をアニメ画像に画風変換する方法](https://qiita.com/karaage0703/items/221f96436c32f6f405c7)を参考にJetson nanoでアニメ風自撮り画像を作ってみましたが、使っているカメラの互換性問題で少し躓いたので、修正してトライしたよ。というお話です。

## Table of Contents

```toc

```

## SainSmart IMX219

Jetson nanoには**Raspberry pi**互換