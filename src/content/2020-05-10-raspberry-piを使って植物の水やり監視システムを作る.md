---
slug: 2020/05/10/plant-check
title: Raspberry PIを使って植物の水やり監視システムを作る
date: 2020-05-10T06:29:01.182Z
description: Raspberry PIを使って植物の水やり監視システムを作る
tags:
  - 電子工作
  - Raspberry PI
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
Raspberry PIを使って家のガジュマルを枯らさないようにします。

## Table of Contents

```toc

```

## ガジュマル

我が家には**ガジュマル**が観葉植物としています。

![img](https://i.imgur.com/mDq4FWO.jpg)

ガジュマルには日光がある程度必要なので窓際に置いているのですが、水やりを忘れがちです。

何度も枯らしかけたので、Raspberry PIを使って水やり管理をできるようにします。

ついでに余っていた温度計やフォトレジスタも組み込んで観葉植物の管理システムを作ってみようかと思います。


## Raspberry PI Zero WH

今回は余っていたRaspberry PI Zero WHを使います。

性能はそこまでよくないですが、低電力でコンパクトなのでこういった用途には向いていると思います。

![img](https://i.imgur.com/GmYDK0C.jpg)

中身はこんな感じです。

インターフェースはHDMI(ちっさいの)とUSB Microと電源供給用のUSB Micro、ディスク代わりのMicroSD、カメラモジュールです。

不要だと思いつつも余っていたのでヒートシンクをつけてます。

![img](https://i.imgur.com/k4R1znI.jpg)

## 土壌センサー

土壌センサーはAmazonで購入しました。

<https://www.amazon.co.jp/gp/product/B0116IYDES/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1>

5個入りで￥550でした。安い。

![img](https://i.imgur.com/amaoydT.jpg)

## DHT11

温度と湿度は**DHT11**を使います。電子工作の有名どころですね。

![img](https://i.imgur.com/JvjiUuD.jpg)

## フォトレジスタ

フォトレジスタとは光が当たると抵抗が下がるやつです。

![img](https://i.imgur.com/kSjQyey.jpg)
