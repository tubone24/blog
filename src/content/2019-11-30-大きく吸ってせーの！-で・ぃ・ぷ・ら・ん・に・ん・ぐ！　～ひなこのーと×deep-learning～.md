---
slug: 2017/07/17/hinako-chainer
title: 大きく吸ってせーの！ で・ぃ・ぷ・ら・ん・に・ん・ぐ！　～ひなこのーと×Deep Learning～
date: 2017-07-17T07:58:03.868Z
description: ひなこのーと×Deep Learningで天下を取りたい
tags:
  - Python
  - Chainer
  - ひなこのーと
  - Deep Learing
  - OpenCV
  - 機械学習
  - CNN
  - 分類
headerImage: 'https://i.imgur.com/1tudTrI.png'
templateKey: blog-post
---
# くいなちゃんのかわいさで僕は満足です。

どうも。ひなこのーと、よかったです。かわいかったです。でも、ひなこのーとを見ているとき、いろんな人からこんなことを言われました。

## ひなこのーとって、エロいごちうさじゃね？

はぁああああああん！？

可愛いという共通点は認めるし、ごちうさは女神の生まれ変わりだと思っているが、ひなこのーとはごちうさとは違うすばらしさがある！ということで、Deep Learningを使って以下のことをやってみたいと思います。

1. [きんいろDeepLearning](http://showyou.hatenablog.com/entry/2015/05/24/174621)や[ご注文はDeep Learningですか？](http://kivantium.hateblo.jp/entry/2015/02/20/214909)　など、可愛いアニメは必ずDeep Learningの餌食になると思うので、「ひなこのーと」もDeep Learningやってみる。

2. アニメひなこのーとの可愛い動画を読み込ませて、主要キャラの分類モデルを作成し、イラストを読み込ませて判定する。

3. できあがったモデルでごちうさの画像を読み込ませて、ひなこのーとのキャラに分類されないことを確認する。

## 前提条件

- Python2.7(Anaconda3で仮想環境作成)
- Windows 7
- CPUオンリー

## ちょっとした考察

本当にひなこのーとと、ごちうさは似ているのか、雰囲気だけではないか、よく考えて欲しい。

### ひなこのーと

![img](https://i.imgur.com/dIY5jEJ.jpg)

### ごちうさ

![img](https://i.imgur.com/E6l9miS.jpg)

## 「ひなこのーと」もDeep Learningやってみる

### 下準備

Deep Learningの難しいところは、とにかく大量のトレーニングデータが必要になるところであります。

途方に暮れていたところ、すばらしいスクリプトがあったので使わせて頂きます。

[Python、OpenCVで顔の検出（アニメ）](https://torina.top/detail/331/)

こちらのスクリプトをそのまま使ってひなこのーとの1～12話から顔という顔を切り抜こう！

その際、[OpenCVによるアニメ顔検出ならlbpcascade_animeface.xml](http://ultraist.hatenablog.com/entry/20110718/1310965532)のすばらしい設定ファイルを活用します。

このXMLは後々使いますので、その際また。

そして、切り抜いた顔をそれぞれのキャラごとにフォルダに移します。（手作業）

こんな感じ。 50×50の可愛い画像がたくさん！

データセットはそれぞれ

- ひなこ 1164枚
- くいな 678枚
- まゆき 563枚
- ゆあ 541枚
- ちあき 536枚
- その他 5493枚

です。少ない。。。

