---
slug: 2019/09/30/netlify-form
title: Netlify Formを使って、簡易Contact Formを作ってみる
date: 2019-09-30T03:47:34.524Z
description: Netlify Formを使って、簡易Contact Formを作ってみます。
tags:
  - Netlify
  - Netlify Form
  - Gatsby.js
  - React
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# くっそかんたんにFormできた

Netlifyに簡単にFormを作る機能が用意されているので利用用途ないですが、Gatsby.jsで作ったBlogにFormを作ってみようかと思います。

[https://www.netlify.com/docs/form-handling/](https://www.netlify.com/docs/form-handling/)

特に必要なわけではないので技術選定とかはしませんが、一般的にForm付きのページを作る際、

- PHPでゴリゴリ書く
- Google Formを使う

の選択肢があるかと思います。

せっかくGatsby.jsで静的サイトに仕上げてるのでPHPで書くのだけはやめたいです。

そんなときにNetlify FormやGoogle Formは役立つのかもしれませんね。

## Gatsby.jsでForm用ページを個別に作る

せっかくのReactなのでコンポーネントにしてもよいのですが、Formなんて1ページしか使わないので
再利用性を考えずページとして作っちゃいます。

Gatsby.jsではpagesに入れたJavaScriptは固定ページとして動作しますので、ここではcontact.jsという名前でFormページを作ります。（お問い合わせページですね）

公式Docを読むとFormタグを打つ際にattributeに data-netlify=true とするだけらしいですね。こりりゃ簡単。

早速作ってみます。

ソース

このような形でFormタグにattributeを追加するだけです。

どうやらNetlifyでビルド済みのHTMLをアップロードする際、タグを解析してからアップロードしてるらしい。

なので、ほかにもFormを使う際はname属性を変えて、別のFormということを示す必要があります。
　
もちろん、タグには通常のHTML同様、Bootstrapやラベル、patternを当てることもできますので、

ソース

のような形や

ソース

のような形で直感的なFormを作ることもできます。

## Bot除け

Netlify FormではいわゆるスパムBot除けとして2種類のオプションが

用意されてます。

1. いわゆる人間だったらこのフォームに何も入れるなという隠れフォームを作る（data-netlify-honeypot）
2. reCaptureを設定する

今回はお手軽に実装したいため、1番で進めます。

### data-netlify-honeypot

data-netlify-honeypotの設定はFormのattributeに

data-netlify-honeypot=隠れフォームのname を設定します。

ソース

そして実際に隠れフォームを設定します。

hiddenにしてるため、ふつう人間が入力することはないですが、念のため、フォームに何も入れるなというラベルを貼っておきます。

こうすることで、bot-fieldに何らかしら値が入ってた場合、Form内容がNetlifyに登録されないようになります。

## 内容の確認

内容の確認はNetlifyから簡単にできます。

また、Formが送信された時にメール or Slack or Webhookを流す機能もあります。

これでお問い合わせを見逃すことがなくなりますね！

## 結論

以前、PHPで頑張ってFormを作ってましたが、最近はこんなに簡単にFormが作れるのかと感心しました。
