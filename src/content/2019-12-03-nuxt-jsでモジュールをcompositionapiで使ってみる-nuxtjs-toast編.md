---
slug: 2019/12/03/nuxt-toast
title: Nuxt.jsでモジュールをCompositionAPIで使ってみる(@nuxtjs/toast編)
date: 2019-12-02T23:43:19.895Z
description: Nuxt.jsのわかりにくい機能の一つ、modulesを使ってみます。
tags:
  - Nuxt.js
  - Vue.js
  - modules
  - toast
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# わからん

最近Nuxt.jsと戯れるようにしてますが、Nuxt.jsとVue.jsの新しいAPIであるCompositionAPI（リンク）の相性があまりよくないのか色々苦戦してます。

いよいよツラミもわかってきた頃合いなので一つずつまとめていこうかと思います。

## そもそもCompositionAPIとは？

CompositionAPIとは、Vue3.x系から正式採用される新しいVue.jsの使い方です。

もはやTypeScriptで書かないと現場でいじめられてしまうこの世の中なので、VueもTypeScriptで書くことが急務なわけですが、その中で一定のデファクトスタンダードを勝ち得たClassAPIという使い方が、色々問題になっているようでしてVue3.xから採用される運びらしいです。

詳しくは（リンク）を御確認ください。

ざっくりと書き方の違いとしては

ClassAPI
(コード)

CompositionAPI
(コード)

となります。

Nuxt.jsとの相性を考えると色々ツラミがあるのですが、ロジックをVueインスタンスから切り離した形で実装、テストができるのでそれはそれでうれしい気もします。

そこらへんの考察は別機会にまたやります。

## Nuxt.jsのモジュールがCompositionAPIで使いたいんだが

ここからが本題なのですが、
