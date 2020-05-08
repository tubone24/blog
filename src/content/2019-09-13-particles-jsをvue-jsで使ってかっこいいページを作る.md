---
slug: 2019-09-12-particles-js
title: particles.jsをVue.jsで使ってかっこいいページを作る
date: 2019-09-12T14:57:14.492Z
description: particles.jsをVue.jsで使う方法
tags:
  - JavaScript
  - Vue.js
  - particle.js
headerImage: 'https://i.imgur.com/CafEJCU.png'
templateKey: blog-post
---
とりあえずかっこよくしたい

とりあえず作ったWebページをかっこよくしたいと思い手軽に使えるparticles.jsをVue.jsで使ってみます。

## Table of Contents

```toc

```

## npm

particles.jsをVue.jsで簡単に使えるようにしたものがすでにnpmで公開されてました。

今回はこちらを使います。

[vue-particles](https://github.com/creotip/vue-particles)

## 簡単な使い方

まず、main.tsでvue-particlesをimportします。

```typescript{numberLines: 1}
import Vue from 'vue';
import App from './App.vue';
import router from './router';

import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
// @ts-ignore
import VueParticles from 'vue-particles';

import store from './store/';

Vue.use(BootstrapVue);
Vue.use(VueParticles);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
```

importしたあとに、Vue.useします。

次にApp.vueでparticles.jsを設定します。まずはTemplateにcomponentを設定します。

```typescript{numberLines: 1}
      <vue-particles
              color="#add8e6"
              :particleOpacity="0.7"
              linesColor="#add8e6"
              :particlesNumber="80"
              shapeType="circle"
              :particleSize="6"
              :linesWidth="2"
              :lineLinked="true"
              :lineOpacity="0.4"
              :linesDistance="150"
              :moveSpeed="4"
              :hoverEffect="true"
              hoverMode="grab"
              :clickEffect="true"
              clickMode="push"
              retina_detect="true"
      >
      </vue-particles>
```

次にCSSですのでstyleで設定します。

```css{numberLines: 1}
#particles-js {
    background-image: url("https://raw.githubusercontent.com/tubone24/ebook-homebrew-vue-typescript-client/master/src/assets/bg.jpg");
    background-size: cover;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -999;
}
```

z-indexを-999にしました。こうすることでほかのコンポーネントの下に滑り込ませられます。

## 完成！

これでかっこよいサイトになりました。


![Img](https://i.imgur.com/CafEJCU.png)
