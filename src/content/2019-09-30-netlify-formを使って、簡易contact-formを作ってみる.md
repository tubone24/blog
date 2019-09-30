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

Netlifyに簡単にFormを作る機能が用意されているので利用用途ないですが、BlogにFormを作ってみようかと思います。

[https://www.netlify.com/docs/form-handling/](https://www.netlify.com/docs/form-handling/)

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
　
もちろん、タグには通常のHTML同様、Bootstrapやラベルを当てることもできますので、

ソース

のような形や

ソース

のような形で直感的なFormを作ることもできます。

## Bot除け

Netlify FormではいわゆるスパムBot除けとして2種類のオプションが

用意されてます。
