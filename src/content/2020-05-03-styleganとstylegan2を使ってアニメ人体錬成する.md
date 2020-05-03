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

## GANの革命児 StyleGANについて

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
(引用: [A Style-Based Generator Architecture for Generative Adversarial Networks](https://arxiv.org/pdf/1812.04948.pdf))

この美女のポートレート、どこかの女優さんかと思いきやStyleGANで生成されたらしいです。いわれてみれば後ろ髪が不自然な気もしますが、これはわかりませんね。すごい。

StyleGANを作ったのはあの**NVIDIA**、つまりGPUお化けが作ったGANで、GPUのパワーをふんだんに使ったモデルです。

StyleGAN詳しいことは専門家に任せるとして、こいつがすごいのはそのGPUパワーを生かした画像生成にあります。

人やものが映った画像には特徴がいくつかありますが顔の向きや顔の輪郭など大きな特徴から目の色、肌の色のようなテクスチャ、髪の毛のなびき方などみみっちい特徴まで様々です。

GANは画像生成の際、ノイズを入力とするのですがStyleGANはノイズから**Style**という画像の制御情報のようなものを作り、Styleを**AdaIN(Adaptive Instance Normalization)**という手法でネットワークの中間で適用していく感じです。

そうすることにより生成画像の特徴をバランスよく適用することができるみたいです。

![img](https://i.imgur.com/7xOURgl.png)

当然、演算量は増えるので莫大な時間とお金(GPU)が必要になります。

「子どもに学習学習っていいたくないですよね...。NVIDIAだからできたこと。(激寒)」

`youtube:https://www.youtube.com/embed/vtKutkRhCZY`

私はNVIDIAではないのでモンスターGPUを大量に購入するお金ないですので今回は学習済みのモデルを借りて実験してみます。

## Making Anime Faces With StyleGAN

美少女キャラ生成用の学習済みモデルってないかなーと探してたら、ありました。

[Making Anime Faces With StyleGAN](https://www.gwern.net/Faces)

**gwern.net**さんありがとうございます！！！！

モデルは[StyleGAN model used for TWDNEv1 sample](https://www.gwern.net/Faces#anime-faces)からダウンロードできます。ありがたくダウンロードしておきましょう。

## StyleGANを使ってみる

ダウンロードしたら早速使ってみます。StyleGANのソース(ライブラリ)はNVIDIAのGitHubに公開されてます。

[NVlabs/stylegan](https://github.com/NVlabs/stylegan)

推論のためにdnnlibを拝借します。

あらかじめ、CUDAとTensorflowGPUを設定しておきます。

設定方法は各自ググってください...

結構バージョンとかで苦戦しますので[こちら](https://qiita.com/chin_self_driving_car/items/f00af2dbd022b65c9068)を参考に設定しましょう。

私の環境は下記です。

key | value
--- | ---
GPU | NVIDIA GeForce RTX 2080
CUDA | 10.0.0
Python | 3.7.3
tensorflow-gpu | 1.14.0
numpy | 1.18.1

**pretrained_example.py**を改造して画像生成用スクリプトは下記のように作りました。

pretrained_example.pyではGoogle Driveからモデルをダウンロードしますが、こちらを変更します。

```python

import os
import pickle
import numpy as np
import PIL.Image
import dnnlib
import dnnlib.tflib as tflib
import config
from datetime import datetime

def main():
    # Initialize TensorFlow.
    tflib.init_tf()

    # ダウンロードしたpickelファイルを指定
    with open("2019-02-26-stylegan-faces-network-02048-016041.pkl", "rb") as f:
        _, _, Gs = pickle.load(f)

    # Print network details.
    Gs.print_layers()

    # Pick latent vector.
    # 潜在変数を作成
    rnd = np.random.RandomState(5)
    latents = rnd.randn(1, Gs.input_shape[1])

    # Generate image.
    fmt = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)
    images = Gs.run(latents, None, truncation_psi=0.7, randomize_noise=True, output_transform=fmt)

    # Save image.
    os.makedirs(config.result_dir, exist_ok=True)
    filename = datetime.now().strftime('%Y%m%d%H%M%S') + '.png'
    png_filename = os.path.join(config.result_dir, filename)
    PIL.Image.fromarray(images[0], 'RGB').save(png_filename)

if __name__ == "__main__":
    main()

```

うまくいけばresultsディレクトリに画像が生成されるはずです。


![img](https://i.imgur.com/ET5Bn63.png)

**あらかわ！**

## AからBに画像を遷移させる

さらにちょっと頑張ってみましょう。

生成した画像Aを少しずつ変化させて画像Bに変化させてみます。

pretrained_example.pyとは異なりあらかじめ潜在変数の作成する画像枚数分ベクトルを生成してn => n+1の変化量をm分割する感じにしました。

```
import os
import pickle
import numpy as np
import PIL.Image
import dnnlib.tflib as tflib
from datetime import datetime
import glob

FILENAME_PREFIX = datetime.now().strftime("%Y%m%d%H%M%S")

def generate_image():
    """Generate GAN Image """
    # Initialize TensorFlow.
    tflib.init_tf()

    # ダウンロードしたpickelファイルを指定
    with open("2019-02-26-stylegan-faces-network-02048-016041.pkl", "rb") as f:
        _, _, Gs = pickle.load(f)
        # Gs = Long-term average of the generator. Yields higher-quality results than the instantaneous snapshot.

    # Print network details.
    Gs.print_layers()

    # Pick latent vector.
    rnd = np.random.RandomState()

    # 生成する画像枚数分、潜在変数を作っておく。ここでは30枚作成
    for i in range(30):
        latents = rnd.randn(1, Gs.input_shape[1])
        if i == 0:
            stacked_latents = latents
        else:
            stacked_latents = np.vstack([stacked_latents, latents])

    # AからBに遷移する画像を生成
    for i in range(len(stacked_latents) - 1):
        # before, afterをそれぞれ作る
        latents_before = stacked_latents[i].reshape(1, -1)
        latents_after = stacked_latents[i + 1].reshape(1, -1)
        for j in range(19 + 1):
            # Aから19分割で少しずつBに潜在変数を変化
            latents = latents_before + (latents_after - latents_before) * j / 19
            fmt = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)
            images = Gs.run(latents, None, truncation_psi=0.7, randomize_noise=True, output_transform=fmt)
            os.makedirs(config.result_dir, exist_ok=True)
            # MP4化したいのでファイルを連番になるように出力
            png_filename = os.path.join(config.result_dir, FILENAME_PREFIX + "-{0:04d}-{1:04d}".format(i, j + 1) + ".png")
            PIL.Image.fromarray(images[0], 'RGB').save(png_filename)


if __name__ == "__main__":
    generate_image()
```

生成した画像をMP4にするとこんな感じになりました！

`youtube:https://www.youtube.com/embed/VAAm-Ne3T6Y`

おおー！すごい！なかなかしっかりしてますね。




































