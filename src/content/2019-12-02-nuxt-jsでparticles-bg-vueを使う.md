---
slug: 2019/12/02/particles-bg-vue
title: Nuxt.jsでparticles-bg-vueを使う
date: 2019-12-01T23:44:00.665Z
description: Nuxt.jsでparticles-bg-vueを使う記事です。
tags:
  - Nuxt.js
  - Vue.js
  - particles-bg-vue
  - particles.js
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# すすめられたので使ってみた。

以前、[particles.jsをVue.jsで使ってかっこいいページを作る](https://blog.tubone-project24.xyz/2019-09-12-particles-js)という記事を書いたところ、記事にコメントがありました。

[lindelof](https://github.com/lindelof)さんというOSS作者さんからでparticles.jsをVue.jsのBackgroundにするなら[particles-bg-vue](https://github.com/lindelof/particles-bg-vue)がいいよ～と紹介されましたので早速使ってみました。

## particles-bg-vueとは？

particles.js以上にかっちょいいparticleをVueで使うためのOSSぽいです。少しコードを呼んでみましたが、Protonという軽量particleライブラリがあり、そちらを背景にセットするComponentのようです。

細かいことはともかく早速使ってみます。

## Nuxt.jsでの利用法

ただ、particles-bg-vueをVue.jsで使うだけなら、READMEを読みましょうというだけなので、Nuxt.jsでの利用法を確認していきます。

### インストール

インストールはnpmまたはyarnを使います。

簡単ですね。

### pluginsでVue useする

Nuxt.jsでVue useする一番簡単な方法はpluginsとして読み込むことです。

```javascript
// plugins/particles.ts

import Vue from 'vue';
import VueParticlesBg from "particles-bg-vue";

Vue.use(VueParticlesBg);
```

Nuxt.jsで上記のpluginsを読み込むために `nuxt.config.ts` のコンフィグを変更します。

```
// nuxt.config.ts
export default {
  mode: 'spa',
  env: {},
  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" }
    ]
  },
  loading: { color: "#3B8070" },
  css: [],
  plugins: ['@/plugins/compositionAPI', '@/plugins/particles'], //読み込む
```

### layoutsで共通的にparticleを当てる

Nuxt.js共通的にレイアウトを当てる時は、layoutsに宣言し、各ページで利用します。

```
//layouts/default.vue
<template>
  <div class="app">
    <particles-bg type="circle" :bg="true" /> // templateでparticles-bgを宣言
    <nuxt/>
  </div>
</template>
```


