---
slug: 2020/05/03/stylegan2-anime
title: StyleGANとStyleGAN2を使って美少女キャラを無限増殖させる
date: 2020-05-03T09:48:45.329Z
description: StyleGANとStyleGAN2を使って美少女キャラを無限増殖させるというお話です。
tags:
  - 機械学習
  - StyleGAN
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
Jetson Nanoを買ってから機械学習熱が再来したので頑張ります。

## Table of Contents

```toc

```

## GANの革命児 StyleGAN

GAN(Generative Adversarial Networks)とは日本語では**敵対的生成ネットワーク**と呼ばれるフレームワークで、存在しないそれっぽい画像を生成する方法などで注目されています。

詳しい仕組みについては専門家にゆだねるとしてフェイク画像を生成する**Generator**とそれがフェイクかどうか判断する**Discriminator**の2種類が互いに勝負しあうことで画像生成の精度を高くしていく、という感じです。

いらすとやでイメージを作ってみました。

![img](https://i.imgur.com/SVZB0Wi.png)

実は昔(今から2年前)録画サーバで全アニメを録画していたので、その動画ファイルから64×64のアニメ顔画像データ58000件を抽出し、それを使ってGAN(正確には**DCGAN **)でアニメ顔を生成する活動に取り組んだことがあります。

DCGANについても詳細は専門家に任せます。[これ](https://arxiv.org/pdf/1511.06434.pdf)が論文です。端的に言えばGANの学習の不安定さを**畳み込み層**や**Batch Normalization**、tanh、 Leaky ReLUなどのReLU以外の**活性化関数**を採用したりして学習の安定化を図ってます。

当時はChainerの[Example](https://github.com/chainer/chainer/tree/master/examples/dcgan)を改造して学習から推論をやりましたがあまりうまくいきませんでした。

その時の結果がこちらです。

`youtube:https://www.youtube.com/embed/FhBeuX4cYoE`

うーん大したことありませんね。というより家のPC程度のGPUでは限界がありそうなことが分かったので美少女キャラを大量生成してハーレムを作る計画はかないませんでしたが、GANの基礎やアニメ顔の抜き出し方、OpenCVの使い方など学ぶことは多かったような気がします。

さて、あきらめていた美少女無限増殖ですが、最近Jetson Nanoを買ったのでまたGANに挑戦しようと思いました。

さて、最近GANなんて触っていなかったので気が付かなかったのですが、[**StyleGAN**](https://arxiv.org/pdf/1812.04948.pdf)というのが盛り上がっている（いた？）と知ります。

![img](https://i.imgur.com/9mP8aH2.jpg)

この美女のポートレート、どこかの女優さんかと思いきやStyleGANで生成されたらしいです。いわれてみれば後ろ髪が不自然な気もしますが、これはわかりませんね。すごい。

StyleGANを作ったのはあの**NVIDIA**、つまりGPUお化けが作ったGANで、GPUのパワーをふんだんに使ったモデルです。

StyleGAN詳しいことは専門家に任せるとして、こいつがすごいのはそのGPUパワーを生かした画像生成にあります。

人やものが映った画像には特徴がいくつかありますが顔の向きや顔の輪郭など大きな特徴から目の色、肌の色のようなテクスチャ、髪の毛のなびき方などみみっちい特徴まで様々です。

GANは画像生成の際、ノイズを入力とするのですがStyleGANはノイズからStyleという画像の制御情報のようなものを作り、Styleを

ということはJetsonでやりたい！という気持ちになってきたので早速やってみます。
















































