---
slug: 2020/06/19/react-iframe
title: React Iframeを使ってPortfolioサイトにSoundCloudのメディアプレーヤーをつける
date: 2020-06-18T15:17:39.468Z
description: React Iframeを使ってPortfolioサイトにSoundCloudのメディアプレーヤーをつける
tags:
  - JavaScript
  - React
headerImage: https://i.imgur.com/XhixJxO.png
templateKey: blog-post
---
PortfolioサイトにSoundCloudのメディアプレーヤーを載っけたくなったので、調べてみました。

## Table of Contents

```toc

```

## Portfolioサイト

拙作のPortfolioサイトはGatsuby.jsを使って作っており、Netlifyにてホスティングしてます。

<https://portfolio.tubone-project24.xyz/>

![img](https://i.imgur.com/YklaEFu.png)

趣味の写真を基軸に、作ったゴミプロダクトや技術範囲を書いたりしてます。

~~綺麗な~~写真やこのBlogの紹介をしてますが、SoundCloudに掲載している音楽もPortfolioサイトに載せようと思います。

## React Iframe

SoundCloudはShareボタンからiframeで動くメディアプレーヤを作ることができます。

![img](https://i.imgur.com/qoLj5Cq.png)

しかしながら、iframeをReact(Gatsby.js)で使うには少し工夫が必要で、その工夫が[React Iframe](https://www.npmjs.com/package/react-iframe)を使うというものです。

まず、npmやyarnでReact Iframeをインストールします。

```
npm install --save react-iframe
```

次にSoundCloudのShareボタンからiframeタグを出力します。例えば私の場合こんな感じのiframeタグができます。

```
<iframe width="100%" height="450" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/197229086&color=%23333335&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"></iframe>
```

そうしたら、iframeタグをReact Iframeに置き換える形でReact IframeのPropsとして宣言する形です。

```javascript
import Iframe from 'react-iframe'


            <p>Listen to my musics!</p>
            <Iframe width="100%" height="450" scrolling="no" frameBorder="no" allow="autoplay"
  src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/users/197229086&color=%23333335&auto_play=false&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true"/>
```

![img](https://i.imgur.com/Btf7On2.png)

できあがりです。iframeタグをReact Iframeに置き換えるだけで作れてしまうのでチョー簡単です。

## 結論

ものすごく簡単にできて特に突っ込みどころのない記事になってしまいました。すみません。

Portfolioサイトはもう少し改造したいですね。