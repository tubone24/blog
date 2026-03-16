---
slug: 2020/06/19/react-iframe
title: React Iframeを使ってPortfolioサイトにSoundCloudのメディアプレーヤーをつける
date: 2020-06-18T15:17:39.468Z
description: "React Iframeライブラリを使って、Gatsby.js製PortfolioサイトにSoundCloudのメディアプレーヤーを埋め込む方法を紹介します。iframeタグをReactコンポーネントに変換するだけの簡単な手順でSoundCloudプレーヤーを実装できます。"
tags:
  - JavaScript
  - React
headerImage: /images/blog/XhixJxO.png
templateKey: blog-post
---
PortfolioサイトにSoundCloudのメディアプレーヤーを載っけたくなったので、調べてみました。

## Table of Contents

```toc

```

## Portfolioサイト

拙作のPortfolioサイトは[Gatsby.jsとNetlifyで作ったこのブログ](/2019/09/01/netlify-and-gatsby/)と同じくGatsuby.jsを使って作っており、Netlifyにてホスティングしてます。

<https://portfolio.tubone-project24.xyz/>

![Gatsby.jsで作ったPortfolioサイトのトップページ画面](/images/blog/YklaEFu.png)

趣味の写真を基軸に、作ったゴミプロダクトや技術範囲を書いたりしてます。

~~綺麗な~~写真やこのBlogの紹介をしてますが、SoundCloudに掲載している音楽もPortfolioサイトに載せようと思います。

## React Iframe

SoundCloudはShareボタンからiframeで動くメディアプレーヤを作ることができます。

![SoundCloudのShareボタンからiframeコードを取得する画面](/images/blog/qoLj5Cq.png)

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

![PortfolioサイトにSoundCloudメディアプレーヤーが埋め込まれた完成画面](/images/blog/Btf7On2.png)

できあがりです。iframeタグをReact Iframeに置き換えるだけで作れてしまうのでチョー簡単です。

## 結論

ものすごく簡単にできて特に突っ込みどころのない記事になってしまいました。すみません。

Portfolioサイトはもう少し改造したいですね。[Sentryを使ったエラー監視](/2019/09/22/sentry/)も入れてみようかな。