---
slug: 2019/12/03/nuxt-toast
title: Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast編)
date: 2019-12-02T23:43:19.895Z
description: Nuxt.jsのわかりにくい機能の一つ、modulesを使ってみます。
tags:
  - Nuxt.js
  - Vue.js
  - modules
  - toast
  - CompositionAPI
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# わからん

最近[Nuxt.js](https://ja.nuxtjs.org/)と戯れるようにしてますが、Nuxt.jsと[Vue.js](https://jp.vuejs.org/index.html)の新しいAPIである[CompositionAPI](https://vue-composition-api-rfc.netlify.com/)の相性があまりよくないのか色々苦戦してます。

いよいよツラミもわかってきた頃合いなので一つずつまとめていこうかと思います。

## そもそもCompositionAPIとは？

[CompositionAPI](https://vue-composition-api-rfc.netlify.com/)とは、Vue3.x系から正式採用される新しいVue.jsの使い方です。

公式的には

> a set of additive, function-based APIs that allow flexible composition of component logic. （コンポーネントロジックの構成を柔軟にできる関数ベースな追加API）

とのこと。

ここら辺はだんだん使っていけば何となく良いところが見えてきますが、そちらのまとめはまた今度。

CompositionAPIを使おうと思ったのは、Vue3.xで採用されるというのと、もはやTypeScriptで書かないと現場でいじめられてしまうこの世の中で、VueもTypeScriptで書くことが急務になりつつある状況の中、Vue + TypeScriptで一定のデファクトスタンダードを勝ち得た[ClassAPI](https://github.com/vuejs/vue-class-component)という使い方が、色々問題になっているようだったので採用しました。

詳しくは（リンク）を御確認ください。

ざっくりと書き方の違いとしては

ClassAPI(decoratorを使ったパターン)

```javascript

```
CompositionAPI
(コード)

となります。

Nuxt.jsとの相性を考えると色々ツラミがあるのですが、ロジックをVueインスタンスから切り離した形で実装、テストができるのでそれはそれでうれしい気もします。

そこらへんの考察は別機会にまたやります。

## Nuxt.jsのモジュールがCompositionAPIで使いたいんだが

ここからが本題なのですが、よくあるNuxt.jsのmodulesを使う例は全くといっていいほどCompositionAPIでやってるものがないので、Nuxt.jsの動き方を逐次確認しながらmodulesを使ってみます。

例えば、ClassAPI（またはDataAPI）の場合よくあるNuxt.jsモジュールの例はaxiosです。
