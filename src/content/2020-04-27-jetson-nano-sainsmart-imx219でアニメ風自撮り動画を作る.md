---
slug: 2020/04/27/anime-face
title: Jetson nano + SainSmart IMX219でアニメ風自撮り動画を作る
date: 2020-04-27T04:28:55.121Z
description: Jetson nanoでアニメ風自撮り動画を作る
tags:
  - 機械学習
  - Jetson nano
  - SainSmart IMX219
headerImage: https://i.imgur.com/lPOtTYa.png
templateKey: blog-post
---
[ディープラーニングで自撮り画像をアニメ画像に画風変換する方法](https://qiita.com/karaage0703/items/221f96436c32f6f405c7)を参考にJetson nanoでアニメ風自撮り画像を作ってみましたが、使っているカメラの互換性問題で少し躓いたので、修正してトライしたよ。というお話です。

## Table of Contents

```toc

```

## SainSmart IMX219

Jetson nanoには**Raspberry pi**互換のカメラモジュール V2(MIPI CSI-2)が使えます。

![img](https://i.imgur.com/xrDd4y5.png)

⑨がモジュールのコネクタとなります。

![img](https://i.imgur.com/AZAkt7z.jpg)

私のJetson nanoもケースに入れちゃってよく見えませんですみませんが、カメラモジュールにMIPI CSI-2互換のカメラが刺さってます。

ラズパイ公式のカメラモジュール[Raspberry Pi Camera Module V2 カメラモジュール (Daylight - element14)](https://www.amazon.co.jp/Raspberry-Pi-Camera-%E3%82%AB%E3%83%A1%E3%83%A9%E3%83%A2%E3%82%B8%E3%83%A5%E3%83%BC%E3%83%AB-Daylight/dp/B01ER2SKFS/ref=pd_sim_147_3/356-1113330-6319342?_encoding=UTF8&pd_rd_i=B01ER2SKFS&pd_rd_r=d5c8a63a-264f-4f17-84ad-08b936850946&pd_rd_w=9daOj&pd_rd_wg=c8Sw3&pf_rd_p=eb211d4f-9ce6-46da-bef2-e4b11fe6bb87&pf_rd_r=X2W92DGEJ73ZDBBYKEDF&psc=1&refRID=X2W92DGEJ73ZDBBYKEDF)を使うのが無難かな？と思いましたが、今回はちょっとだけ安かった[SainSmart IMX219 AIカメラモジュールNVIDIA Jetson Nanoボード用8MPセンサー77度FoV](https://www.amazon.co.jp/gp/product/B07SL9P729/ref=ppx_yo_dt_b_asin_title_o06_s01?ie=UTF8&psc=1)を使ってみました。

![img](https://i.imgur.com/gWqd2xb.jpg)

こちら、[ディープラーニングで自撮り画像をアニメ画像に画風変換する方法](https://qiita.com/karaage0703/items/221f96436c32f6f405c7)で紹介されているところから若干コードを工夫する必要がありましたのでご紹介します。

## フレームレート調整

なぜか、ご紹介されているコードのカメラ設定のフレームレート(1/30)だとうまくいかなかったので1/21まで下げます。なんでできないかはわかりません。

Forkして修正しました。 <https://github.com/tubone24/UGATIT/blob/movie/selfie2anime_movie.py>

## 動かす

Forkして修正したコードをJetson nano上にcloneして実行してみます。

clone先以外は本家と同じです。

```
$ git clone https://github.com/tubone24/UGATIT.git
$ cd UGATIT
$ git checkout -b movie origin/movie
$ ./get_haarlike.sh
```

本家で紹介されているUGATIT selfie2anime [pre-trained]のリンクがきれていたので下記Kaggleからダウンロードくださいませ。

[UGATIT selfie2anime [pre-trained]](https://www.kaggle.com/t04glovern/ugatit-selfie2anime-pretrained)

```
$ unzip ugatit-selfie2anime-pretrained.zip
```

準備ができたので実行します。

```
$ python3 selfie2anime_movie.py --light=True -d='jetson_nano_raspi_cam'
```

カメラで私の顔を認識してみたところ、私の顔が可愛くないキャラクターに変換されました。

![img](https://i.imgur.com/lPOtTYa.png)

ちょっともたつきますが、ちゃんとリアルタイムに処理しているようです。

![img](https://i.imgur.com/pFHv6zC.gifv)