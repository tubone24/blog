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
  - 分類学習
  - 顔認識
headerImage: 'https://i.imgur.com/1tudTrI.png'
templateKey: blog-post
---
(過去ブログからの移転した記事です)

くいなちゃんのかわいさで僕は満足です。

どうも。ひなこのーと、よかったです。かわいかったです。でも、ひなこのーとを見ているとき、いろんな人からこんなことを言われました。

## Table of Contents

```toc

```

<!-- textlint-disable -->
## ひなこのーとって、エロいごちうさじゃね？
<!-- textlint-enable -->

はぁああああああん!?

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

途方に暮れていたところ、すばらしいスクリプトがあったので使わせていただきます。

[Python、OpenCVで顔の検出（アニメ）
](https://torina.top/detail/331/)

こちらのスクリプトをそのまま使ってひなこのーとの1～12話から顔という顔を切り抜こう！

その際、[OpenCVによるアニメ顔検出ならlbpcascade_animeface.xml](http://ultraist.hatenablog.com/entry/20110718/1310965532)のすばらしい設定ファイルを活用します。

このXMLは後々使いますので、その際また。

そして、切り抜いた顔をそれぞれのキャラごとにフォルダに移します。（手作業）

こんな感じ。 50×50の可愛い画像がたくさん！

データセットはそれぞれ、

- ひなこ1164枚
- くいな678枚
- まゆき563枚
- ゆあ541枚
- ちあき536枚
- その他5493枚

です。少ない。。。

![img](https://i.imgur.com/qfwNwpQ.png)

### 学習させる

ご注文はDeep Learningですか？は、Caffeを使っていますが、自分はChainerの方がなじみあるので、Chainerを使っていきます。

と言ってももうすでに化物語で同じことをやっていた人がいたので、モデル定義と学習、予測のコードをお借りしました。

[python: chainerを使って化物語キャラを認識させるよ！ 〜part5.5 主要キャラで多値分類(改良編)〜](https://www.mathgram.xyz/entry/chainer/bake/part5.5_1)

今回は、ひなこ・くいな・まゆき・ゆあ・ちあき・その他の計6つの分類になりますので、モデル定義などのパラメータのみ変更しています。

#### モデル定義

```python
#coding:utf-8

import os

import chainer
from chainer import optimizers
import chainer.functions as F
import chainer.links as L
import chainer.serializers as S

import numpy as np

class clf_hinako(chainer.Chain):
    def __init__(self):

        super(clf_hinako, self).__init__(
            conv1 =  F.Convolution2D(3, 16, 5, pad=2),
            conv2 =  F.Convolution2D(16, 32, 5, pad=2),
            l3    =  F.Linear(6272, 256),
            l4    =  F.Linear(256, 6) #ここを6にしました
        )

    def clear(self):
        self.loss = None
        self.accuracy = None

    def forward(self, X_data, y_data, train=True):
        self.clear()
        X_data = chainer.Variable(np.asarray(X_data), volatile=not train)
        y_data = chainer.Variable(np.asarray(y_data), volatile=not train)
        h = F.max_pooling_2d(F.relu(self.conv1(X_data)), ksize = 5, stride = 2, pad =2)
        h = F.max_pooling_2d(F.relu(self.conv2(h)), ksize = 5, stride = 2, pad =2)
        h = F.dropout(F.relu(self.l3(h)), train=train)
        y = self.l4(h)
        return F.softmax_cross_entropy(y, y_data), F.accuracy(y, y_data)
```

モデル定義に合わせて分類の数を変更し、画像の枚数に合わせて学習用、テスト用画像の枚数などを調整しました。

```python
#coding: utf-8

import cv2
import os
import six
import datetime

import chainer
from chainer import optimizers
import chainer.functions as F
import chainer.links as L
import chainer.serializers as S
from clf_hinako_model import clf_hinako

import numpy as np

def getDataSet():

X_train = []
X_test = []
y_train = []
y_test = []

for i in range(0,6):
path = “dataset/”
if i == 0:

cutNum = 5493 # その他の画像数です。
cutNum2 = 5393 # 内100枚をテスト用にします。

elif i == 1:
cutNum = 1164 # ひなこの画像数です。
cutNum2 = 1139 # 内25枚をテスト用にします。

elif i == 2:
cutNum = 678 # くいなの画像数です。
cutNum2 = 653 # 内25枚をテスト用にします。

elif i == 3:
cutNum = 563 # まゆきの画像数です。
cutNum2 = 538 # 内25枚をテスト用にします。

elif i == 4:
cutNum = 541 # ゆあの画像数です。
cutNum2 = 516 # 内25枚をテスト用にします。

elif i == 5:
cutNum = 536 # ちあきの画像数です。
cutNum2 = 511 # 内25枚をテスト用にします。

imgList = os.listdir(path+str(i))
imgNum = len(imgList)
for j in range(cutNum):
imgSrc = cv2.imread(path+str(i)+”/”+imgList[j])

if imgSrc is None:continue
if j < cutNum2:
X_train.append(imgSrc)
y_train.append(i)
else:
X_test.append(imgSrc)
y_test.append(i)

return X_train,y_train,X_test,y_test

def train():

X_train,y_train,X_test,y_test = getDataSet()

X_train = np.array(X_train).astype(np.float32).reshape((len(X_train),3, 50, 50)) / 255
y_train = np.array(y_train).astype(np.int32)
X_test = np.array(X_test).astype(np.float32).reshape((len(X_test),3, 50, 50)) / 255
y_test = np.array(y_test).astype(np.int32)

model = clf_hinako()
optimizer = optimizers.Adam()
optimizer.setup(model)

epochNum = 30
batchNum = 50
epoch = 1

while epoch <= epochNum:
print(“epoch: {}”.format(epoch))
print(datetime.datetime.now())

trainImgNum = len(y_train)
testImgNum = len(y_test)

sumAcr = 0
sumLoss = 0

perm = np.random.permutation(trainImgNum)

for i in six.moves.range(0, trainImgNum, batchNum):

X_batch = X_train[perm[i:i+batchNum]]
y_batch = y_train[perm[i:i+batchNum]]

optimizer.zero_grads()
loss, acc = model.forward(X_batch, y_batch)
loss.backward()
optimizer.update()

sumLoss += float(loss.data) * len(y_batch)
sumAcr += float(acc.data) * len(y_batch)
print(‘train mean loss={}, accuracy={}’.format(sumLoss / trainImgNum, sumAcr / trainImgNum))

sumAcr = 0
sumLoss = 0

for i in six.moves.range(0, testImgNum, batchNum):
X_batch = X_test[i:i+batchNum]
y_batch = y_test[i:i+batchNum]
loss, acc = model.forward(X_batch, y_batch, train=False)

sumLoss += float(loss.data) * len(y_batch)
sumAcr += float(acc.data) * len(y_batch)
print(‘test mean loss={}, accuracy={}’.format(
sumLoss / testImgNum, sumAcr / testImgNum))
epoch += 1

S.save_hdf5(‘model’+str(epoch+1), model)
```

### 学習結果

```bash
(py27con) C:\Users\tubone\PycharmProjects\anime-learn>python train.py
epoch: 1
2017-07-16 21:40:03.060000
train mean loss=1.16183573621, accuracy=0.619771432281
test mean loss=1.05560781558, accuracy=0.506666666104
epoch: 2
2017-07-16 21:42:13.192000
train mean loss=0.800489272901, accuracy=0.69348571573
test mean loss=0.871727473206, accuracy=0.577777779765
epoch: 3
2017-07-16 21:44:23.290000
train mean loss=0.698785139833, accuracy=0.743085714408
test mean loss=0.780110951927, accuracy=0.631111116873
epoch: 4
2017-07-16 21:46:33.502000
train mean loss=0.597107084649, accuracy=0.786971424307
test mean loss=0.548737568988, accuracy=0.83111111323
epoch: 5
2017-07-16 21:48:44.037000
train mean loss=0.500077148761, accuracy=0.82479999406
test mean loss=0.480820135938, accuracy=0.857777780957
epoch: 6
2017-07-16 21:50:57.706000
train mean loss=0.451180534618, accuracy=0.841257137571
test mean loss=0.448005066978, accuracy=0.87555554178
epoch: 7
2017-07-16 21:53:09.992000
train mean loss=0.405994535514, accuracy=0.861028568063
test mean loss=0.472903796368, accuracy=0.835555553436
epoch: 8
2017-07-16 21:55:22.262000
train mean loss=0.358310819779, accuracy=0.87851428066
test mean loss=0.306394663122, accuracy=0.911111103164
epoch: 9
2017-07-16 21:57:34.985000
train mean loss=0.337241342791, accuracy=0.880799995831
test mean loss=0.308397501707, accuracy=0.902222216129
epoch: 10
2017-07-16 21:59:47.595000
train mean loss=0.324274266022, accuracy=0.886742852415
test mean loss=0.323723706934, accuracy=0.871111101574
epoch: 11
2017-07-16 22:01:59.865000
train mean loss=0.296059874466, accuracy=0.897142853737
test mean loss=0.390861597326, accuracy=0.848888880677
epoch: 12
2017-07-16 22:04:12.384000
train mean loss=0.28229231613, accuracy=0.900799994469
test mean loss=0.381249505613, accuracy=0.888888888889
epoch: 13
2017-07-16 22:06:25.189000
train mean loss=0.242525527115, accuracy=0.915771426473
test mean loss=0.304150695602, accuracy=0.906666656335
epoch: 14
2017-07-16 22:08:37.995000
train mean loss=0.231497560718, accuracy=0.919314283303
test mean loss=0.275258473224, accuracy=0.906666662958
epoch: 15
2017-07-16 22:10:50.532000
train mean loss=0.219778511652, accuracy=0.923199997629
test mean loss=0.354618171851, accuracy=0.91555554337
epoch: 16
2017-07-16 22:13:02.623000
train mean loss=0.218345963359, accuracy=0.926285712378
test mean loss=0.36049440172, accuracy=0.897777775923
epoch: 17
2017-07-16 22:15:15.105000
train mean loss=0.199432469181, accuracy=0.933599996226
test mean loss=0.403067363633, accuracy=0.87555554178
epoch: 18
2017-07-16 22:17:27.614000
train mean loss=0.188562800608, accuracy=0.936114283289
test mean loss=0.316384883391, accuracy=0.911111109787
epoch: 19
2017-07-16 22:19:40.506000
train mean loss=0.187215176012, accuracy=0.933028570243
test mean loss=0.360161377324, accuracy=0.906666676203
epoch: 20
2017-07-16 22:21:53.107000
train mean loss=0.165474589265, accuracy=0.94388571058
test mean loss=0.282101011939, accuracy=0.919999996821
epoch: 21
2017-07-16 22:24:05.521000
train mean loss=0.153822022751, accuracy=0.947999996117
test mean loss=0.33798650321, accuracy=0.919999996821
epoch: 22
2017-07-16 22:26:18.048000
train mean loss=0.140677581344, accuracy=0.952228568281
test mean loss=0.309250995517, accuracy=0.924444450272
epoch: 23
2017-07-16 22:28:30.608000
train mean loss=0.138967069973, accuracy=0.951314284801
test mean loss=0.488151417838, accuracy=0.871111101574
epoch: 24
2017-07-16 22:30:43.540000
train mean loss=0.150780805051, accuracy=0.945828568935
test mean loss=0.305154048734, accuracy=0.924444450272
epoch: 25
2017-07-16 22:32:55.811000
train mean loss=0.133075305953, accuracy=0.952799998692
test mean loss=0.421937998798, accuracy=0.906666662958
epoch: 26
2017-07-16 22:35:08.076000
train mean loss=0.119467954348, accuracy=0.954514285156
test mean loss=0.384507967366, accuracy=0.902222222752
epoch: 27
2017-07-16 22:37:20.527000
train mean loss=0.138162662153, accuracy=0.949028568949
test mean loss=0.317712697718, accuracy=0.928888883856
epoch: 28
2017-07-16 22:39:32.964000
train mean loss=0.114523774907, accuracy=0.961485714912
test mean loss=0.39709764719, accuracy=0.919999996821
epoch: 29
2017-07-16 22:41:45.211000
train mean loss=0.120365411943, accuracy=0.958171426228
test mean loss=0.379737239745, accuracy=0.93333334393
epoch: 30
2017-07-16 22:43:57.336000
train mean loss=0.110197391031, accuracy=0.958742856298
test mean loss=0.401306927204, accuracy=0.920000010067
```

計32エポックで学習終了です。

## 主要キャラの分類モデルを作成し、イラストを読み込ませて判定する

予測用のコードも以下からお借りしています。

[python: chainerを使って化物語キャラを認識させるよ！ 〜part5.5 主要キャラで多値分類(改良編)〜](https://www.mathgram.xyz/entry/chainer/bake/part5.5_1)

```python
# -*- coding: utf-8 -*-
#!/usr/bin/env python
import sys

import numpy as np
import six
import cv2
import os


import chainer
from chainer import computational_graph as c
import chainer.functions as F
import chainer.serializers as S

from chainer import optimizers

from clf_hinako_model import clf_hinako


model = clf_hinako()
S.load_hdf5('./model32', model) # 32モデルだったので。
#model = pickle.load(open('model30','rb'))

chara_name = ['Unknown', "Hinako","Kuina","Mayuki","Yua","Chiaki"]

def forward(x_data):
    x = chainer.Variable(x_data, volatile=False)
    h = F.max_pooling_2d(F.relu(model.conv1(x)), ksize = 5, stride = 2, pad =2)
    h = F.max_pooling_2d(F.relu(model.conv2(h)), ksize = 5, stride = 2, pad =2)
    h = F.dropout(F.relu(model.l3(h)), train=False)
    y = model.l4(h)

    return y

def detect(image, cascade_file = "./lbpcascade_animeface.xml"): # アニメ顔抽出時使ったXMLを指定
    if not os.path.isfile(cascade_file):
        raise RuntimeError("%s: not found" % cascade_file)

    cascade = cv2.CascadeClassifier(cascade_file)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)

    faces = cascade.detectMultiScale(gray,
                                     scaleFactor = 1.1,
                                     minNeighbors = 1,
                                     minSize = (20, 20))

    print(faces)

    return faces

def recognition(image, faces):
    face_images = []

    for (x, y, w, h) in faces:
        dst = image[y:y+h, x:x+w]
        dst = cv2.resize(dst, (50, 50))
        face_images.append(dst)

    face_images = np.array(face_images).astype(np.float32).reshape((len(face_images),3, 50, 50)) / 255

    #face_images = cuda.to_gpu(face_images)

    return forward(face_images) , image

def draw_result(image, faces, result):

    count = 0
    for (x, y, w, h) in faces:
        classNum = 0
        result_data = result.data[count]
        classNum = result_data.argmax()
        recognized_class = chara_name[result_data.argmax()]
        font = cv2.FONT_HERSHEY_TRIPLEX # 名前を入れたいので、OpenCVのFont機能を使います。
        font_size = 1.1
        if classNum == 0:
                cv2.rectangle(image, (x, y), (x+w, y+h), (255,255,3), 3)
                cv2.putText(image, chara_name[0], (x,y), font, font_size,
                            (255, 255, 3)) # 重ねたい画像を選択し、フォントサイズ等を指定
        elif classNum == 1:
                cv2.rectangle(image, (x, y), (x+w, y+h), (0,0,255), 3)
                cv2.putText(image, chara_name[1], (x,y), font, font_size,
                            (0, 0, 255))
        elif classNum == 2:
                cv2.rectangle(image, (x, y), (x+w, y+h),  (255,0,0), 3)
                cv2.putText(image, chara_name[2], (x,y), font, font_size,
                            (255, 0, 0))
        elif classNum == 3:
                cv2.rectangle(image, (x, y), (x+w, y+h), (255,255,255), 3)
                cv2.putText(image, chara_name[3], (x,y), font, font_size,
                            (255, 255, 255))
        elif classNum == 4:
                cv2.rectangle(image, (x, y), (x+w, y+h), (255,0,255), 3)
                cv2.putText(image, chara_name[4], (x,y), font, font_size,
                            (255, 0, 255))
        elif classNum == 5:
                cv2.rectangle(image, (x, y), (x+w, y+h), (0,255,255), 3)
                cv2.putText(image, chara_name[5], (x,y), font, font_size,
                            (255, 128, 255))

        count+=1

    return image

#ファイル読み込み
img = cv2.imread("test.jpg")

faces = detect(img)

result, image = recognition(img, faces)

image = draw_result(image, faces, result)
cv2.imwrite('out.png',image)
```

### 実際、読み込ませる

実際読み込ませてみたものがこちら。

- 水色はUnknown
- 赤がひなこ
- 青がくいな
- 白がまゆき
- 紫がゆあ
- オレンジがちあき

です。

![img](https://i.imgur.com/1tudTrI.png)

大家さんだけがUnknownとなってしまいました。。。

データ量が少なかったためでしょうね。

## できあがったモデルでごちうさの画像を読み込ませて、ひなこのーとのキャラに分類されないことを確認する

いよいよオーラスです。これをやるためにつくったモデルです。

さっそく読み込ませて見ます。

![img](https://i.imgur.com/N909ILj.png)

むむっ。ココアさんがひなこに、シャロちゃんがまゆちゃんと認識されているではないか。

ココアさんとひなこ、なんか似ているように感じなくも...

フルール・ド・ラパンの制服と、まゆちゃんの私服が似ているというのはあるが、髪色で判断しているわけではないよな??

金髪で判断しているという可能性がぬぐいきれないので。これでもくらえ！きんモザ＆ごちうさのコラボじゃあああ。

![img](https://i.imgur.com/mWRGXtm.png)

![img](https://i.imgur.com/KLiwNQR.png)

金髪で判断しているというわけではなかった。

それにしてもココアさん＝ひなこは覆らないな。

### 絵のタッチを変えてみる

こうなったら徹底討論じゃあ。絵のタッチを変えてどうなるか試してみましょう。

![img](https://i.imgur.com/GwUtdtM.png)

<span style="font-size: 200%">ココア、お前だったのか!!（結論）</span>

### おまけ１　ひなこのーともイラストで認識させてみる

![img](https://i.imgur.com/85nBHnf.png)

![img](https://i.imgur.com/YQrn166.png)

どうやら、くいなちゃんの認識率が一番いい。くいなちゃんかわいいからね。

### おまけ２ くいなちゃん、某オタク少女に似ている説を確かめる

![img](https://i.imgur.com/DCkFvv2.png)

大丈夫でした!!!
