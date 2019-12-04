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
