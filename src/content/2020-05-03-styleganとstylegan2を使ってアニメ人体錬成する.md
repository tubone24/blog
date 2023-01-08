---
slug: 2020/05/03/stylegan2-anime
title: StyleGANとStyleGAN2を使って美少女キャラを無限増殖させる
date: 2020-05-03T09:48:45.329Z
description: StyleGANとStyleGAN2を使って美少女キャラを無限増殖させるというお話です。
tags:
  - 機械学習
  - StyleGAN
headerImage: https://i.imgur.com/VfRjfpW.png
templateKey: blog-post
---
Jetson Nanoを買ってから機械学習熱が再来したので頑張ります。

## Table of Contents

```toc

```

## GCGANで美少女キャラ無限増殖

GAN(Generative Adversarial Networks)とは日本語では**敵対的生成ネットワーク**と呼ばれる機械学習フレームワークで、現実には存在しないそれっぽい画像を生成する方法などで採用されています。

GANの詳しい仕組みについては専門家にゆだねるとしてフェイク画像を生成する**Generator**とそれがフェイクかどうか判断する**Discriminator**の2種類が互いに勝負しあうことで画像生成の精度を高くしていく、という感じです。

いらすとやでイメージを作ってみました。

![img](https://i.imgur.com/SVZB0Wi.png)

必死に偽物の言動を本物っぽく言う不審者と、嘘を見破る警察官（探偵）という構図が比喩としては一般的です。

GANについては、実は昔(今から2年前)録画サーバーで全アニメを録画していた頃、その動画ファイルから64×64のアニメ顔画像データ58000件を抽出し、それを使ってGAN(正確には**DCGAN**)でアニメ顔を生成する活動に取り組んだことがあります。

DCGANについても詳細は専門家に任せます。[これ](https://arxiv.org/pdf/1511.06434.pdf)が論文です。

しっかり論文が読みこなせるマンになりたい..。

端的に言えばGANの学習の不安定さを**畳み込み層**や**Batch Normalization**、tanh、 Leaky ReLUなどのReLU以外の**活性化関数**を採用したりして学習の安定化を図ってます。

当時はChainerの[Example](https://github.com/chainer/chainer/tree/master/examples/dcgan)を改造して学習から推論をやりましたがあまりうまくいきませんでした。

その時作ったモデルの結果がこちらです。

https://youtu.be/FhBeuX4cYoE

解像度が64×64なので、うーん大したことありませんね。

というより家のPC程度のGPUでは限界がありそうなことが分かったので美少女キャラを大量生成して薔薇色の生活空間を作る計画はかないませんでした。

しかし、GCGANで美少女無限増殖はGANの基礎やアニメ顔の抜き出し方、OpenCVの使い方など学ぶことは多かったような気がします。

## GANの革命児 StyleGAN

あきらめていた美少女無限増殖ですが、最近[Jetson Nanoを買った](https://blog.tubone-project24.xyz/2020/04/21/jetson-nano)のでせっかくなのでまたGANに挑戦しようと思いました。

さて、最近GANなんて触っていなかったので気が付かなかったのですが、[**StyleGAN**](https://arxiv.org/pdf/1812.04948.pdf)というのが盛り上がっている（いた？）と知ります。

まずは下記の画像を見てください。

![img](https://i.imgur.com/9mP8aH2.jpg)
(<https://en.wikipedia.org/wiki/StyleGAN>)

この美女のポートレート、どこかの女優さんかと思いきやStyleGANで生成されたらしいです。

いわれてみれば後ろ髪が不自然な気もしますが、これはわかりませんね。すごい。

StyleGANを作ったのはあの[**NVIDIA**](https://www.nvidia.com/ja-jp/)、つまりGPU作成お化けが作ったGANで、GPUのパワーをふんだんに使ったネットワークとして知られています。

StyleGANの詳しいことは専門家に任せるとして、さらっとエクストリーム解説頑張ってみたいと思います。

### Progressive Growing

GANで1024x1024などの高解像度画像を生成するのは至難の業です。

高解像度の画像を学習させるとモデルの評価指数多すぎて、Generatorが生み出す画像が**これじゃない...** 感満載な画像ができることが知られてます。

そこでStyleGANは高解像度の画像を生成するために**Progressive Growing**という手法を採用しました。

![img](https://i.imgur.com/bTE91Hx.png)
([Progressive Growing of GANs for Improved Quality, Stability, and Variation](https://arxiv.org/abs/1710.10196))

画像生成プロセスを**一気に高解像度の画像を生成するのではなく低解像度から漸近的(≒徐々に近づける)に高解像度の画像を成長させる**手法になります。

この手法はStyleGANの前身研究の[PGGAN(Progressive Growing of GANs)](https://arxiv.org/abs/1710.10196)の成果物です。

### スタイル変換 Style Transfer

もう1つの特徴はスタイル変換([Style Transfer](https://www.cv-foundation.org/openaccess/content_cvpr_2016/papers/Gatys_Image_Style_Transfer_CVPR_2016_paper.pdf))と呼ばれる技術を使っていることです。

![img](https://i.imgur.com/9EAE63P.png)
([Image Style Transfer Using Convolutional Neural Networks](https://www.cv-foundation.org/openaccess/content_cvpr_2016/papers/Gatys_Image_Style_Transfer_CVPR_2016_paper.pdf))

上の画像は[Image Style Transfer Using Convolutional Neural Networks](https://www.cv-foundation.org/openaccess/content_cvpr_2016/papers/Gatys_Image_Style_Transfer_CVPR_2016_paper.pdf)からの引用ですが特定の画像に画風(Style)情報を差し込むことで任意の画風に変換できる、というものです。

[PRISMA](https://prisma-ai.com/)というサイトで遊んだことのあるほうも多いかと思いますが、まさにあれです。

StyleGANではStyle Transferに[**AdaIN(Adaptive Instance Normalization)**](https://arxiv.org/pdf/1703.06868.pdf)という手法を使ってます。

今までのStyle Transfer(Instance Normalization)は変換したいStyle画像をStyle用ベクトルとして学習し、指定したStyleごとに選択的にモデルに係数とバイアスを設定することで実現してました。

AdaINの手法ではStyleを適用画像、Style画像チャネルごとの平均と標準偏差から導きます。

![img](https://i.imgur.com/z7ZpFko.png)
([Arbitrary Style Transfer in Real-time with Adaptive Instance Normalization](https://arxiv.org/abs/1703.06868))

統計量を用いることで、学習していないStyleについてもそれなりに対応できる、というのがメリットのようです。

### 潜在変数から画像を作らずちゃんとStyleをn本加え入れろ～

さて、長くなってきましたがそろそろ解説終わりです。

StyleGANではPGGANの成果物であるProgressive Growingを継承しつつも画像生成のプロセスが異なります。

![img](https://i.imgur.com/7xOURgl.png)
([A Style-Based Generator Architecture for Generative Adversarial Networks
](https://arxiv.org/pdf/1812.04948.pdf))

StyleGANでは、PGGANとは異なり入力に潜在変数を直接用いません。**const(固定値)のテンソル**を用いています。

その代わり、**ネットワークの各層にAdaINを用いStyleを適用**することで画像に変化を生み出しているのです。

また、単純に潜在変数をAdaINにぶち込んでいるわけでもなく、**MappingNetwork(全結合ニューラルネット)で潜在変数を非線形化**してから用いるなど細やかな気配りもされています。

なぜStyleを各層に適用する形をとるかというと、人やものが映った画像にはさまざまな特徴量があり、GANはそれらの特徴量を学習することで画像生成していますが、実際人が映った画像には顔の向きや顔の輪郭など大きな特徴から目の色、肌の色のようなテクスチャ、肌荒れや髪の毛の巻き方などみみっちい特徴までさまざまです。

一様な特徴量で表すのは限界があるのです。

実はStyleGANはここらへんをしっかり考えていて、Style適用に加え**Mixing Regularization**という複数の潜在変数(ここではStyleベクトル)を各種層で混ぜ込んで適用するという手法で解決してます。

Progressive Growingで申したとおり、各層は低解像度から高解像度へと進むのですがStyleベクトルを低解像度の際に適用した場合と高解像度の際に適用した場合では**低解像度の際に入れたStyleのほうが画像への寄与が大きく**なります。

つまり、顔の向きや顔の輪郭などの大きな特徴は低解像度の際に、目の色など小さな特徴については高解像度の際にStyleとして適用されるのです。

Styleの形で特徴を細かく分割し、Mixing Regularizationでそれぞれの特徴にあった変化を生み出すことができるようになったことがStyleGANのすばらしさと私は理解してます。

## 慣れない解説はもうやらない、本題に戻ります

ごほん！

当然、高解像度のGANは演算量は増えるので莫大な時間とお金(GPU)が必要になります。

「子どもに学習学習っていいたくないですよね...。NVIDIAだからできたこと。(激寒)」

私はNVIDIAではないのでモンスターGPUを大量に購入するお金ないですので今回は学習済みのモデルを借りて実験してみます。

## Making Anime Faces With StyleGAN

美少女キャラ生成用の学習済みモデルってないかなーと探してたら、ありました。

[Making Anime Faces With StyleGAN
](https://www.gwern.net/Faces)

**gwern.net**さんありがとうございます!!!！

モデルは[StyleGAN model used for TWDNEv1 sample](https://www.gwern.net/Faces#anime-faces)からダウンロードできます。

**ありがたくダウンロードしましょう。**

感謝の気持ちで肩たたきけんを進呈します。

![img](https://i.imgur.com/0IEMnPa.png)

## StyleGANを使ってみる

ダウンロードしたら早速使ってみます。StyleGANのソース(ライブラリ)はNVIDIAのGitHubに公開されてます。

[NVlabs/stylegan](https://github.com/NVlabs/stylegan)

学習はしないですが、推論のためにdnnlibを拝借するためソースをローカルにcloneします。

また、事前にCUDAとTensorflowGPUを設定しておきます。

環境差分が大きい話なので設定方法は各自ググってください.......。

結構バージョンとかで苦戦しますので[こちら](https://qiita.com/chin_self_driving_car/items/f00af2dbd022b65c9068)を参考に設定しましょう。

私の環境は下記で行ないました。

key | value
--- | ---
OS | Windows10
GPU | NVIDIA GeForce RTX 2080
CUDA | 10.0.0
Python | 3.7.3
tensorflow-gpu | 1.14.0
numpy | 1.18.1

ソースに同梱されている**pretrained_example.py**はNVIDIAが作ったモデルを用いて推論をしてみるスクリプトですがとりあえず、こちらを改造して画像生成用スクリプトを作ります。

pretrained_example.pyではGoogle DriveからNVIDIA作成のモデルをダウンロードしますが、今回はAnimeFace用のモデルを使いたいので少しコードを変更します。

ちなみにStyleGANのモデルはPickelファイル形式なので普通にPythonでバイナリオープンできます。

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

## AからBに画像を遷移(Transition)させる

さらにちょっと頑張ってみましょう。

生成した画像Aを少しずつ変化させて画像Bに変化させてみます。

StyleGANはこのAからBへの遷移(Transition)も比較的きれいにできることが知られています。

pretrained_example.pyとは異なりあらかじめ潜在変数の作成する画像枚数分ベクトルを生成してn => n+1の変化量をm分割する感じにする必要があります。

こちらは[イラストで学習したStyleGANを試した](https://blog.blacktanktop.me/?post=20191110_animation_stylegan)を参考にしました。

ファイル名は、**generate_anime.py**とします。

```python
import os
import pickle
import numpy as np
import PIL.Image
import dnnlib.tflib as tflib
import config
from datetime import datetime

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
        # before(A), after(B)をそれぞれ作る
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

https://youtu.be/VAAm-Ne3T6Y

おおー！すごい！なかなかしっかりしてますね。512x512の高解像度美少女キャラが無限増殖してます！

StyleGANで美少女無限増殖は成功といってもいいのではないでしょうか!!

## StyleGAN2でも美少女無限増殖

StyleGANで成功をおさめたNVIDIAですがまだ歩みを止めません。StyleGANで出てきた課題を解決するべく、[StyleGAN2](https://arxiv.org/abs/1912.04958)を作りました。

StyleGANとどう変わったかというのはもう難しいので専門の方に任せちゃいますがちらっとだけ解説すると、

StyleGANで課題になった、

- 水滴ノイズ(droplet)
- 歯や目などの小さい特徴が顔の向きと連動しない(不自然モード)

という問題を解消しています。

さて、**StyleGAN2でも美少女キャラ無限増殖したい！**と心の声が聞こえてきますね。

なんとStyleGAN2でも**gwern.net**さんがモデルを公開してくれてます！

[Making Anime Faces With StyleGAN StyleGAN 2](https://www.gwern.net/Faces#stylegan-2)

ありがたくこちらも使わせていただきます。

また、StyleGAN2自体のソース(ライブラリ)はStyleGANと同じくGitHubに公開されています。

[NVlabs/stylegan2](https://github.com/NVlabs/stylegan2)

こちらをCloneして準備完了です。

基本的にはStyleGAN2もStyleGANっぽくコーディングできるだろうと思い、先ほどの**generate_anime.py**を流用します。

```python
import os
import pickle
import numpy as np
import PIL.Image
import dnnlib.tflib as tflib
from datetime import datetime

# number of create StyleGAN image file
IMAGE_NUM = 30
# number of split frame two GAN files for changing image
SPLIT_NUM = 19
# image size
IMG_SIZE = 512
FILENAME_PREFIX = datetime.now().strftime("%Y%m%d%H%M%S")

def generate_image():
    """Generate GAN Image """
    # Initialize TensorFlow.
    tflib.init_tf()

    # 2020-01-11-skylion-stylegan2-animeportraits-networksnapshot-024664.pkl (https://www.gwern.net/Faces#stylegan-2)
    with open("2020-01-11-skylion-stylegan2-animeportraits-networksnapshot-024664.pkl", "rb") as f:
        _, _, Gs = pickle.load(f)
        # Gs = Long-term average of the generator. Yields higher-quality results than the instantaneous snapshot.

    # Print network details.
    Gs.print_layers()

    # Pick latent vector.
    rnd = np.random.RandomState()

    # create latents stacks because of changing several latents vectors.
    for i in range(IMAGE_NUM):
        latents = rnd.randn(1, Gs.input_shape[1])
        if i == 0:
            stacked_latents = latents
        else:
            stacked_latents = np.vstack([stacked_latents, latents])

    for i in range(len(stacked_latents) - 1):
        latents_before = stacked_latents[i].reshape(1, -1)
        latents_after = stacked_latents[i + 1].reshape(1, -1)
        for j in range(SPLIT_NUM + 1):
            latents = latents_before + (latents_after - latents_before) * j / SPLIT_NUM
            fmt = dict(func=tflib.convert_images_to_uint8, nchw_to_nhwc=True)
            images = Gs.run(latents, None, truncation_psi=0.7, randomize_noise=True, output_transform=fmt)
            os.makedirs("results", exist_ok=True)
            png_filename = os.path.join("results", FILENAME_PREFIX + "-{0:04d}-{1:04d}".format(i, j + 1) + ".png")
            PIL.Image.fromarray(images[0], 'RGB').save(png_filename)



if __name__ == "__main__":
    generate_image()

```

1点コードを変更したところとしてはStyleGAN2のdnnlibに**config**がないのでresultsディレクトリの指定は文字列で行ないます。

さあ！実行しますわよー！

### おや!?動かない。

まぁそう簡単にはいきませんね。エラーを吐いて落ちてしまいました。

エラーメッセージ↓

```
Setting up TensorFlow plugin "fused_bias_act.cu": Preprocessing... Failed!
Traceback (most recent call last):
  File "generate_anime.py", line 75, in <module>
    generate_image()
  File "generate_anime.py", line 27, in generate_image
    _, _, Gs = pickle.load(f)
  File "E:\tubone\project\stylegan2\dnnlib\tflib\network.py", line 297, in __setstate__
    self._init_graph()
  File "E:\tubone\project\stylegan2\dnnlib\tflib\network.py", line 154, in _init_graph
    out_expr = self._build_func(*self.input_templates, **build_kwargs)
  File "<string>", line 491, in G_synthesis_stylegan2
  File "<string>", line 455, in layer
  File "<string>", line 99, in modulated_conv2d_layer
  File "<string>", line 68, in apply_bias_act
  File "E:\tubone\project\stylegan2\dnnlib\tflib\ops\fused_bias_act.py", line 68, in fused_bias_act
    return impl_dict[impl](x=x, b=b, axis=axis, act=act, alpha=alpha, gain=gain)
  File "E:\tubone\project\stylegan2\dnnlib\tflib\ops\fused_bias_act.py", line 122, in _fused_bias_act_cuda
    cuda_kernel = _get_plugin().fused_bias_act
  File "E:\tubone\project\stylegan2\dnnlib\tflib\ops\fused_bias_act.py", line 16, in _get_plugin
    return custom_ops.get_plugin(os.path.splitext(__file__)[0] + '.cu')
  File "E:\tubone\project\stylegan2\dnnlib\tflib\custom_ops.py", line 111, in get_plugin
    _run_cmd(_prepare_nvcc_cli('"%s" --preprocess -o "%s" --keep --keep-dir "%s"' % (cuda_file, tmp_file, tmp_dir)))
  File "E:\tubone\project\stylegan2\dnnlib\tflib\custom_ops.py", line 76, in _prepare_nvcc_cli
    raise RuntimeError('Could not find MSVC/GCC/CLANG installation on this computer. Check compiler_bindir_search_path list in "%s".' % __file__)
RuntimeError: Could not find MSVC/GCC/CLANG installation on this computer. Check compiler_bindir_search_path list in "E:\tubone\project\stylegan2\dnnlib\tflib\custom_ops.py".
```

エラーメッセージ抜粋↓

```
RuntimeError: Could not find MSVC/GCC/CLANG installation on this computer. Check compiler_bindir_search_path list in "E:\tubone\project\stylegan2\dnnlib\tflib\custom_ops.py".
```

とのことです。**MSVC/GCC/CLANG**ということは**VCかGCCのコンパイラが必要**とのことです。

**Windows10で実行しているのでVCが必要なんですね。**

エラーを見て何のことかと思いましたが、StyleGAN2の[Requirements](https://github.com/NVlabs/stylegan2#requirements)に普通に書いてありました。

見切り発車もいいところだ..。

```
On Windows, the compilation requires Microsoft Visual Studio to be in PATH. We recommend installing Visual Studio Community Edition and adding into PATH using "C:\Program Files (x86)\Microsoft Visual Studio\2019\Community\VC\Auxiliary\Build\vcvars64.bat".
```

VCでのコンパイルが必要なんですねということはわかったのですが、釈然としません。

なぜならもともとVisual Studio 2019は入れているからです。

パスも通してます。当然VCのコンパイラも含まれているわけで。

もう一度エラーメッセージを見返すと**custom_ops.py**を編集してねとのことなので確認します。

```python
# Copyright (c) 2019, NVIDIA Corporation. All rights reserved.
#
# This work is made available under the Nvidia Source Code License-NC.
# To view a copy of this license, visit
# https://nvlabs.github.io/stylegan2/license.html

"""TensorFlow custom ops builder.
"""

import os
import re
import uuid
import hashlib
import tempfile
import shutil
import tensorflow as tf
from tensorflow.python.client import device_lib # pylint: disable=no-name-in-module

#----------------------------------------------------------------------------
# Global options.

cuda_cache_path = os.path.join(os.path.dirname(__file__), '_cudacache')
cuda_cache_version_tag = 'v1'
do_not_hash_included_headers = False # Speed up compilation by assuming that headers included by the CUDA code never change. Unsafe!
verbose = True # Print status messages to stdout.

compiler_bindir_search_path = [
    'C:/Program Files (x86)/Microsoft Visual Studio/2017/Community/VC/Tools/MSVC/14.14.26428/bin/Hostx64/x64',
    'C:/Program Files (x86)/Microsoft Visual Studio/2019/Community/VC/Tools/MSVC/14.23.28105/bin/Hostx64/x64',
    'C:/Program Files (x86)/Microsoft Visual Studio 14.0/vc/bin',
]

#----------------------------------------------------------------------------
```

なるほど、StyleGAN2で使うVCのコンパイラは**compiler_bindir_search_path**で設定しているんですね。

確かにこちらが実環境とあっていませんでした。

こちらを実環境に合わせて修正します。

また、もう少しStyleGAN2のレポジトリを眺めたら、MSVCのチェックスクリプト**test_nvcc.cu**がGitHubのレポジトリに普通にありました...。

どんだけ見切り発車なんだよ..。

さて気を取り直して、Visual Studio 2019のパスを正しく書き直しtest_nvcc.cuを実行してみたところ、

```
(tensorflow) E:\tubone\project\stylegan2>nvcc test_nvcc.cu -o test_nvcc -run
test_nvcc.cu

C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.0\bin/../include\cuda_runtime.h: warning C4819: ファイルは、現在 のコード ページ (932) で表示できない文字を含んでいます。データの損失を防ぐために、ファイルを Unicode 形式で保存してくだ さい。
C:\Program Files\NVIDIA GPU Computing Toolkit\CUDA\v10.0\include\crt/host_config.h(143): fatal error C1189: #error:  -- unsupported Microsoft Visual Studio version! Only the versions between 2013 and 2017 (inclusive) are supported!
```

Warinigは置いておいて、**fatal error**が出てますね。なんだかVisual Stadio 2019に対応してないとか出てきた..。

んー.... じゃあ2017いれますか..。

[こちら](https://my.visualstudio.com/Downloads?q=visual%20studio%202017&wt.mc_id=o~msft~vscom~older-downloads)からVisual Studio 2017をダウンロードしインストールします。

もちろんMSVCが必要なのでちゃんとインストーラーでC++の開発はインストールしましょう！

インストール後は**compiler_bindir_search_path**にパスを設定します。パスは**cl.exe**が存在する箇所です。バージョン名以外は**custom_ops.py**の通りで大丈夫だと思います。

うまくパスを設定してないとtest_nvcc.cuを実行すると、

```
(tensorflow) E:\tubone\project\stylegan2>nvcc test_nvcc.cu -o test_nvcc -run
nvcc fatal   : Cannot find compiler 'cl.exe' in PATH
```

とcl.exeがPATHに見つからないと怒られます。

私の環境のcl.exeは、

```
C:\Program Files (x86)\Microsoft Visual Studio\2017\Community\VC\Tools\MSVC\14.16.27023\bin\Hostx64\x64
```

でした。

うまくPATHを通してtest_nvcc.cuを実行すると...。

```
現在のコード ページ (932) で表示できない文字を含んでいます。データの損失を防ぐために、ファイルを Unicode 形式で保存して ください。
   ライブラリ test_nvcc.lib とオブジェクト test_nvcc.exp を作成中
CPU says hello.
GPU says hello.
```

Unicode warinigはでるものの、

**CPU says hello.**

**GPU says hello.**

と表示されました。「ハロー！」

まったく関係ないですが、ハローといえば**Radio Happy**ですよね。好き。

https://youtu.be/9pY9MrjeLD4

よし！時はきた！

**generate_anime.py**を実行します。

![img](https://i.imgur.com/k3KihLx.png)

### まだうまく動かない

エラーがでました..。

![img](https://i.imgur.com/0KH7SgH.png)

```
RuntimeError: NVCC returned an error. See below for full command line and output log:

nvcc "C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\_pywrap_tensorflow_internal.lib" --gpu-architecture=sm_75 --use_fast_math --disable-warnings --include-path "C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\include" --include-path "C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\include\external\protobuf_archive\src" --include-path "C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\include\external\com_google_absl" --include-path "C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\include\external\eigen_archive" --compiler-bindir "C:/Program Files (x86)/Microsoft Visual Studio/2017/Community/VC/Tools/MSVC/14.16.27023/bin/Hostx64/x64" 2>&1 "C:\Users\meita\Downloads\stylegan2\dnnlib\tflib\ops\fused_bias_act.cu" --shared -o "C:\Users\meita\AppData\Local\Temp\tmp3_sgpk48\fused_bias_act_tmp.dll" --keep --keep-dir "C:\Users\meita\AppData\Local\Temp\tmp3_sgpk48"

_pywrap_tensorflow_internal.lib
fused_bias_act.cu
nvcc error   : 'cudafe++' died with status 0xC0000005 (ACCESS_VIOLATION)
```

```
nvcc error   : 'cudafe++' died with status 0xC0000005 (ACCESS_VIOLATION)
```

とのことです。なんだこれ...。

### nvcc error : 'cudafe++' died with status 0xC0000005 (ACCESS_VIOLATION)

ここまできて半分諦めてたのですが、ダメ元でエラーをググったらTensorflowに気になるIssueを発見しました。

[nvcc error : 'cudafe++' died with status 0xC0000005 (ACCESS_VIOLATION) #27706](https://github.com/tensorflow/tensorflow/issues/27706)

![img](https://i.imgur.com/zXCnrTq.png)

```
You need to Install Visual C++ Build Tools 2015 Please take a look at these instructions.
```

はぁ... 2015ですか..。

2017で動くって言ってたじゃないか！

![img](https://i.imgur.com/1KUffz4.png)

ということで**Visual Studio 2015**をインストールします..。

<https://my.visualstudio.com/Downloads?q=visual%20studio%202015&wt.mc_id=o~msft~vscom~older-downloads>

Visual Studio 2015は通常インストールするとVCインストールの項目がないのでインストール後、再度インストーラーを起動してVCをインストールするように修正します。

何気に面倒だよねこれ、Stack overflow君が教えてくれなければ解決できなかったよぉ。

[Visual Studio 2015 doesn't have cl.exe](https://stackoverflow.com/questions/31953769/visual-studio-2015-doesnt-have-cl-exe)

### 3度目の正直

よし！適当)

**generate_anime.py**実行します！

![img](https://i.imgur.com/YE8Pdyb.png)

```
(tensorflow) E:\tubone\project\stylegan2>python generate_anime.py
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:516: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint8 = np.dtype([("qint8", np.int8, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:517: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_quint8 = np.dtype([("quint8", np.uint8, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:518: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint16 = np.dtype([("qint16", np.int16, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:519: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_quint16 = np.dtype([("quint16", np.uint16, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:520: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint32 = np.dtype([("qint32", np.int32, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorflow\python\framework\dtypes.py:525: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  np_resource = np.dtype([("resource", np.ubyte, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:541: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint8 = np.dtype([("qint8", np.int8, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:542: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_quint8 = np.dtype([("quint8", np.uint8, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:543: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint16 = np.dtype([("qint16", np.int16, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:544: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_quint16 = np.dtype([("quint16", np.uint16, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:545: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  _np_qint32 = np.dtype([("qint32", np.int32, 1)])
C:\Users\meita\Anaconda3\envs\tensorflow\lib\site-packages\tensorboard\compat\tensorflow_stub\dtypes.py:550: FutureWarning: Passing (type, 1) or '1type' as a synonym of type is deprecated; in a future version of numpy, it will be understood as (type, (1,)) / '(1,)type'.
  np_resource = np.dtype([("resource", np.ubyte, 1)])
Setting up TensorFlow plugin "fused_bias_act.cu": Preprocessing... Loading... Done.
Setting up TensorFlow plugin "upfirdn_2d.cu": Preprocessing... Loading... Done.

Gs                            Params    OutputShape         WeightShape
---                           ---       ---                 ---
latents_in                    -         (?, 512)            -
labels_in                     -         (?, 0)              -
lod                           -         ()                  -
dlatent_avg                   -         (512,)              -
G_mapping/latents_in          -         (?, 512)            -
G_mapping/labels_in           -         (?, 0)              -
G_mapping/Normalize           -         (?, 512)            -
G_mapping/Dense0              262656    (?, 512)            (512, 512)
G_mapping/Dense1              262656    (?, 512)            (512, 512)
G_mapping/Dense2              262656    (?, 512)            (512, 512)
G_mapping/Dense3              262656    (?, 512)            (512, 512)
G_mapping/Dense4              262656    (?, 512)            (512, 512)
G_mapping/Dense5              262656    (?, 512)            (512, 512)
G_mapping/Dense6              262656    (?, 512)            (512, 512)
G_mapping/Dense7              262656    (?, 512)            (512, 512)
G_mapping/Broadcast           -         (?, 16, 512)        -
G_mapping/dlatents_out        -         (?, 16, 512)        -
Truncation/Lerp               -         (?, 16, 512)        -
G_synthesis/dlatents_in       -         (?, 16, 512)        -
G_synthesis/4x4/Const         8192      (?, 512, 4, 4)      (1, 512, 4, 4)
G_synthesis/4x4/Conv          2622465   (?, 512, 4, 4)      (3, 3, 512, 512)
G_synthesis/4x4/ToRGB         264195    (?, 3, 4, 4)        (1, 1, 512, 3)
G_synthesis/8x8/Conv0_up      2622465   (?, 512, 8, 8)      (3, 3, 512, 512)
G_synthesis/8x8/Conv1         2622465   (?, 512, 8, 8)      (3, 3, 512, 512)
G_synthesis/8x8/Upsample      -         (?, 3, 8, 8)        -
G_synthesis/8x8/ToRGB         264195    (?, 3, 8, 8)        (1, 1, 512, 3)
G_synthesis/16x16/Conv0_up    2622465   (?, 512, 16, 16)    (3, 3, 512, 512)
G_synthesis/16x16/Conv1       2622465   (?, 512, 16, 16)    (3, 3, 512, 512)
G_synthesis/16x16/Upsample    -         (?, 3, 16, 16)      -
G_synthesis/16x16/ToRGB       264195    (?, 3, 16, 16)      (1, 1, 512, 3)
G_synthesis/32x32/Conv0_up    2622465   (?, 512, 32, 32)    (3, 3, 512, 512)
G_synthesis/32x32/Conv1       2622465   (?, 512, 32, 32)    (3, 3, 512, 512)
G_synthesis/32x32/Upsample    -         (?, 3, 32, 32)      -
G_synthesis/32x32/ToRGB       264195    (?, 3, 32, 32)      (1, 1, 512, 3)
G_synthesis/64x64/Conv0_up    2622465   (?, 512, 64, 64)    (3, 3, 512, 512)
G_synthesis/64x64/Conv1       2622465   (?, 512, 64, 64)    (3, 3, 512, 512)
G_synthesis/64x64/Upsample    -         (?, 3, 64, 64)      -
G_synthesis/64x64/ToRGB       264195    (?, 3, 64, 64)      (1, 1, 512, 3)
G_synthesis/128x128/Conv0_up  1442561   (?, 256, 128, 128)  (3, 3, 512, 256)
G_synthesis/128x128/Conv1     721409    (?, 256, 128, 128)  (3, 3, 256, 256)
G_synthesis/128x128/Upsample  -         (?, 3, 128, 128)    -
G_synthesis/128x128/ToRGB     132099    (?, 3, 128, 128)    (1, 1, 256, 3)
G_synthesis/256x256/Conv0_up  426369    (?, 128, 256, 256)  (3, 3, 256, 128)
G_synthesis/256x256/Conv1     213249    (?, 128, 256, 256)  (3, 3, 128, 128)
G_synthesis/256x256/Upsample  -         (?, 3, 256, 256)    -
G_synthesis/256x256/ToRGB     66051     (?, 3, 256, 256)    (1, 1, 128, 3)
G_synthesis/512x512/Conv0_up  139457    (?, 64, 512, 512)   (3, 3, 128, 64)
G_synthesis/512x512/Conv1     69761     (?, 64, 512, 512)   (3, 3, 64, 64)
G_synthesis/512x512/Upsample  -         (?, 3, 512, 512)    -
G_synthesis/512x512/ToRGB     33027     (?, 3, 512, 512)    (1, 1, 64, 3)
G_synthesis/images_out        -         (?, 3, 512, 512)    -
G_synthesis/noise0            -         (1, 1, 4, 4)        -
G_synthesis/noise1            -         (1, 1, 8, 8)        -
G_synthesis/noise2            -         (1, 1, 8, 8)        -
G_synthesis/noise3            -         (1, 1, 16, 16)      -
G_synthesis/noise4            -         (1, 1, 16, 16)      -
G_synthesis/noise5            -         (1, 1, 32, 32)      -
G_synthesis/noise6            -         (1, 1, 32, 32)      -
G_synthesis/noise7            -         (1, 1, 64, 64)      -
G_synthesis/noise8            -         (1, 1, 64, 64)      -
G_synthesis/noise9            -         (1, 1, 128, 128)    -
G_synthesis/noise10           -         (1, 1, 128, 128)    -
G_synthesis/noise11           -         (1, 1, 256, 256)    -
G_synthesis/noise12           -         (1, 1, 256, 256)    -
G_synthesis/noise13           -         (1, 1, 512, 512)    -
G_synthesis/noise14           -         (1, 1, 512, 512)    -
images_out                    -         (?, 3, 512, 512)    -
---                           ---       ---                 ---
Total                         30276583

2020-05-04 03:03:32.366467: W tensorflow/core/common_runtime/bfc_allocator.cc:237] Allocator (GPU_0_bfc) ran out of memory trying to allocate 2.14GiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were availa
ble.
2020-05-04 03:03:32.377471: W tensorflow/core/common_runtime/bfc_allocator.cc:237] Allocator (GPU_0_bfc) ran out of memory trying to allocate 2.14GiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were availa
ble.
2020-05-04 03:03:32.966211: W tensorflow/core/common_runtime/bfc_allocator.cc:237] Allocator (GPU_0_bfc) ran out of memory trying to allocate 2.25GiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were availa
ble.
2020-05-04 03:03:32.976815: W tensorflow/core/common_runtime/bfc_allocator.cc:237] Allocator (GPU_0_bfc) ran out of memory trying to allocate 2.25GiB with freed_by_count=0. The caller indicates that this is not a failure, but may mean that there could be performance gains if more memory were availa
ble.
```

実行できた!!

![img](https://i.imgur.com/daSYwz2.png)

ちゃんとresultsに画像が出力されてます！

![img](https://i.imgur.com/VfRjfpW.png)

**かわいいいいいい!!**

小早川紗枝はんに似てますなー！

紗枝はんといえばやっぱり**美に入り彩を穿つ**ですよね。

https://youtu.be/96rmz41v6QE

ごほん！

ちゃんとTransitionもうまく出力されているようです！

https://youtu.be/KpjWeNB5TUI

## 結論

ここまでのスクリプトはNVIDIAのStyleGAN, StyleGAN2をForkした形でGitHubにおいてます。

<https://github.com/tubone24/stylegan>

<https://github.com/tubone24/stylegan2>

機械学習特有の環境構築とかで躓くあるあるはあるものの、何とかできました。

また、GANの世界もここまで進化していると知りびっくりしました。

次回はこちらをJetson nanoに移植していきたいと思います。

## 参考

- [GANの基礎からStyleGAN2まで](https://medium.com/@akichan_f/gan%E3%81%AE%E5%9F%BA%E7%A4%8E%E3%81%8B%E3%82%89stylegan2%E3%81%BE%E3%81%A7-dfd2608410b3)
- [StyleGAN解説 CVPR2019読み会@DeNA](https://www.slideshare.net/KentoDoi/stylegan-cvpr2019dena)
- [イラストで学習したStyleGANを試した](https://blog.blacktanktop.me/?post=20191110_animation_stylegan)
- [Tensorflow GPU, CUDA, CuDNNのバージョン早見表](https://qiita.com/chin_self_driving_car/items/f00af2dbd022b65c9068)
