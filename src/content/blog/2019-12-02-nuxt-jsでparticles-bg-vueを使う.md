---
slug: 2019/12/02/particles-bg-vue
title: Nuxt.jsでparticles-bg-vueを使う
date: 2019-12-01T23:44:00.665Z
description: "Nuxt.jsでparticles-bg-vueを導入してかっこいいパーティクル背景を実装する方法を解説。pluginsでの読み込み、layoutsでの共通適用、Composition APIでの利用例に加え、canvasObjectによるスタイル調整方法も紹介します。"
tags:
  - JavaScript
  - TypeScript
  - Nuxt.js
  - Vue.js
  - particles-bg-vue
  - particle
  - Proton
  - particles.js
headerImage: '/images/blog/IAstOlF.png'
templateKey: blog-post
---
すすめられたので使ってみた。

以前、[particles.jsをVue.jsで使ってかっこいいページを作る](/2019/09/12/particles-js/)という記事を書いたところ、記事にコメントがありました。

[lindelof](https://github.com/lindelof)さんというOSS作者さんからでparticleをVue.jsのBackgroundに当てたいなら[indelof/particles-bg-vue](https://github.com/lindelof/particles-bg-vue)がいいよ～と紹介されましたので早速使ってみました。

## Table of Contents

```toc

```

## particles-bg-vueとは？

particles.js以上にかっちょいいparticleをVueで使うためのOSSぽいです。少しコードを読んでみましたが、[Proton](https://github.com/a-jie/Proton)という軽量particleライブラリがあり、そちらを背景にセットするComponentのようです。

仕上がりはこんな感じ！　(READMEから引用)

![particles-bg-vueのデモ画面 パターン1](https://raw.githubusercontent.com/lindelof/particles-bg-vue/master/images/01.jpg)

![particles-bg-vueのデモ画面 パターン2](https://raw.githubusercontent.com/lindelof/particles-bg/master/image/07.jpg)

![particles-bg-vueのデモ画面 パターン3](https://raw.githubusercontent.com/lindelof/particles-bg-vue/master/images/03.jpg)

Vue.js版だけでなく、[React版](https://github.com/lindelof/particles-bg)もあります。

細かいことはともかく早速使ってみます。

## Nuxt.jsでの利用法

ただ、particles-bg-vueをVue.jsで使うだけなら、[README](https://github.com/lindelof/particles-bg-vue/blob/master/README.md)を読みましょうというだけなので、Nuxt.jsでの利用法を確認していきます。

### インストール

インストールはnpmまたはyarnを使います。

```bash
npm install --save particles-bg-vue
```

簡単ですね。

### pluginsでVue useする

Nuxt.jsでVue useする一番簡単な方法は[plugins](https://ja.nuxtjs.org/guide/plugins/)として読み込むことです。

```typescript
// plugins/particles.ts

import Vue from 'vue';
import VueParticlesBg from "particles-bg-vue";

Vue.use(VueParticlesBg);
```

Nuxt.jsで上記のpluginsを読み込むために `nuxt.config.ts` のコンフィグを変更します。

```javascript{numberLines: 1}{22}
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

Nuxt.js共通的にレイアウトを当てるときは、[layouts](https://ja.nuxtjs.org/api/pages-layout/)に宣言し、各ページで利用します。

```javascript{numberLines: 1}{4}
//layouts/default.vue
<template>
  <div class="app">
    <particles-bg type="circle" :bg="true" /> // templateでparticles-bgを利用
    <nuxt/>
  </div>
</template>
```

typeに設定する内容については、[particles-bg-vueのREADME: Parameter Description](https://github.com/lindelof/particles-bg-vue/blob/master/README.md#parameter-description)をご確認ください。

### layoutsを読み込む

particleを当てたいページに対しては上記で作成したlayoutsを読み込みます。

今回は最新のVue.jsのAPI [Vue Composition API](https://vue-composition-api-rfc.netlify.com/)を例に使ってみます。（Composition APIの詳しい使い方については[Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast編)](/2019/12/04/nuxt-toast/)で詳しく解説しています。）

たとえばトップページ(index)に当てたい場合、

```javascript{numberLines: 1}{19}
<template>
  <section class="section">
    <div class="container">
      <hoge  prop="hogeeee!!"/>
    </div>
  </section>
</template>

<script lang="ts">
  import {
    createComponent,
    reactive,
    onMounted,
    computed,
    ref
  } from '@vue/composition-api';
  import FileList from '@/components/hoge.vue';
  export default createComponent({
    layout: 'default', // createComponentでlayoutを呼ぶ
    components: {
      hoge
    },
    setup() {
    }
  })
</script>
```

とすると適用できます。

![Nuxt.jsにparticles-bg-vueを適用した実際の画面](/images/blog/IAstOlF.png)

簡単ですね!!

## 結論

Nuxt.jsに入門したばかりですが、こんなに簡単にかっこいいページが作れるとは！という感動です。

Thanks! [lindelof](https://github.com/lindelof)-san

## 追記(particleのcanvasのstyleを変えたい！)

[indelof/particles-bg-vue](https://github.com/lindelof/particles-bg-vue)をしばらく使い続け、ちょっとした悩みがでてきました。

![ブラウザ拡大時にparticleのcanvasがはみ出る問題の様子](/images/blog/FhOet7R.png)

ブラウザの拡大率を上げた場合、particleのcanvasがそれに追従せず、きれいなparticleのcanvasからはみ出る・・・。

ということで、なにかできないか確認したところ[particles-bg-vueのREADME: Parameter Description]([particles-bg-vueのREADME: Parameter Description](https://github.com/lindelof/particles-bg-vue/blob/master/README.md#parameter-description))に書いてありました。

とはいったものの、ちょっと記載がわかりにくいのでここに追記します。

### canvasObjectの作成

F12(開発者ツール)などで、particle部分のElementsを確認すると、canvasタグでparticleを表現していることがわかります。

![開発者ツールでparticleのcanvasタグを確認している様子](/images/blog/hw6bydF.png)

こちらのcanvasのstyleはcanvasObjectというObjectをparticle-bgのpropsに渡すと変更が実現できます。

さらに、Vue.jsの新しいAPI、CompositionAPIでは、templateに渡す変数はreactive、reactiveじゃないに関わらずsetup()のreturnで渡す必要があります。

なので、

```javascript{numberLines: 1}{3,26-28,34-36}
<template>
  <div class="app">
    <particles-bg type="circle" :bg="true" :canvas="canvasObject"/> //propsでcanvasObject渡す
    <div id="nav">
      <nuxt-link to="/">Home</nuxt-link> |
      <nuxt-link to="/sample">sample</nuxt-link> |
      <nuxt-link to="/list">list</nuxt-link>
    </div>
    <nuxt/>
  </div>
</template>

<script lang='ts'>
  import {
    createComponent,
    reactive,
    onBeforeMount,
    onUpdated,
    onMounted,
    computed,
    watch,
    ref
  } from '@vue/composition-api';

  const canvasObject = {  //canvasObject宣言
    height: '120%'
    };

  export default createComponent({

    setup () {

      return {
        canvasObject  //templateで使うのでreturn
      };
    }
  });
</script>

```

とやってみると、

![canvasObjectでstyleを変更した後のElements確認](/images/blog/ct8mkR2.png)

正しくstyleが変更され、

![canvasObjectでheightを120%に設定し拡大時もはみ出なくなった画面](/images/blog/0rTlW56.png)

期待通りのcanvasができました！
