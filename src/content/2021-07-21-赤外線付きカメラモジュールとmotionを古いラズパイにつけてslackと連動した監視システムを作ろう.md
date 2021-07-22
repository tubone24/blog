---
slug: 2021/07/21/motion-ir
title: 赤外線付きカメラモジュールとmotionを古いラズパイにつけてSlackと連動した監視システムを作ろう
date: 2021-07-21T10:08:14.329Z
description: ラズパイが家に溢れてもったいないので赤外線付きカメラモジュールとmotionを古いラズパイにつけてSlackと連動した監視システムを作ることにしました
tags:
  - RaspberryPi
  - motion
  - 監視カメラ
  - Slack
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
作ってみよう！

## Table of Contents

```toc

```

## 我が家のラズパイ事情

多くのご家庭でお困りかもしれませんが、使ってないラズパイが転がりまくってます。

ラズパイって結構直近の進化がすごくて、性能が上がったから買ってみよう！とか、液晶モジュール付けてしまったから特に使ってないけど外すのめんどくさいしそのままにしておこうとか、そういった感じで眠ったラズパイが何種類かあります。

で、こいつらを眠らせておいても仕方がないので、早速こちらを使って何かHomeIoTチックなことをやってみたいと想います。

## 監視カメラ

そこまで我が家は大したセキュリティー意識はないですが、せっかくなら玄関に監視カメラでもつけたいなと思い始めました。

とりあえず、人がきたらSlackに検知状況とそのときの画像や動画を投稿します。

## 赤外線カメラ

いつも玄関は省エネの観点で電気を消してますので、通常のカメラではちょっと明るさがたりません。

そこで、ラズパイのカメラモジュールに挿すことのできる赤外線カメラを探したところありました。

<iframe style="width:120px;height:240px;" marginwidth="0" marginheight="0" scrolling="no" frameborder="0" src="https://rcm-fe.amazon-adsystem.com/e/cm?ref=qf_sp_asin_til&t=tubone2403-22&m=amazon&o=9&p=8&l=as1&IS2=1&detail=1&asins=B07T5DZY73&linkId=f8faa703fc20d70f581fd9dc824117ff&bc1=000000&amp;lt1=_blank&fc1=333333&lc1=0066c0&bg1=ffffff&f=ifr">
    </iframe>

値段もお手頃でこいつはいいですね。





















































