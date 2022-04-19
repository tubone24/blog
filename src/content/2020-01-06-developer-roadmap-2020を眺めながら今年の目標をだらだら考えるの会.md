---
slug: 2020/1/6/2020-roadmap
title: Web Developer Roadmap 2020を眺めながら今年の目標(Frontend)をだらだら考えるの会
date: 2020-01-06T04:01:46.368Z
description: 毎年恒例のDeveloper Roadmap 2020が公開されたのでだらだら眺めながら今年の目標を考えます。
tags:
  - ぼやき
  - Frontend
  - Web Developer Roadmap 2020
headerImage: 'https://i.imgur.com/jQ0BMpY.png'
templateKey: blog-post
---

Developer Roadmap 2020が公開されましたので、眺めながら今年の目標をぼやきます。

![img](https://i.imgur.com/jQ0BMpY.png)

量が多いのでとりあえずFrontendから。

## Table of Contents

```toc

```

## 2020のRoadmap Frontendの特徴

[Web Developer Roadmap 2020版が出ていたので2019版と比較](https://qiita.com/hirotakasasaki/items/f93335857c17f6ceab9f)でご紹介があるとおり、今回のRoadmapは**フロントエンド**の変化が大きかったと思います。

まぁ、フロントエンド技術はラットレースとか言われてますよね。

（失礼な表現だと思いますが、そう揶揄されるだけの技術の陳腐化が早い側面は間違いなくあると思います。）

さて、**今年は何を勉強しますかね？**

## React

**React**勉強しておけばええんやで～感すごいっすね。

VueやAngularもオプションとしてはあるみたいですが、初学者はReactでええと。

個人的にはVueは**Composition API**が正式採用されるまで新しい技術の修得は待ちかと思ってますが、日本では一休.comさんがNuxt.jsを採用したこともあり、**Nuxt.jsのイケイケ度**が上がっている気がします。

[Vue.js・Nuxt.jsを導入している企業・サービス一覧](https://qiita.com/00092/items/52d641af8d37e2b07916)

すっごーい！Nuxt.jsが好きなフレンズなんだね！

![img](https://i.imgur.com/hFtHg2b.jpg)

（なぜ今、2020年にけものフレンズなのか、それは私にもわからない。思い出してしまったので・・・。）

しかしながらNuxt.js人気は世界を見通したらNext.jsと比べるとでもないというのが下記リンクから読みとれます。

[Back End Frameworks JavaScript on the server.](https://2019.stateofjs.com/back-end/)

小規模案件はVue、大規模案件はReact、なんて分け方はもはや古いのかもしれませんね。

Angularは触ったことがないのでよくわかりません…。

とりあえずReact勉強します。

Reduxも健在ですが、Hooksのほうが私は好きです。

## TypeScript

ReactといえばTypeScript、と田舎のおばあちゃんも言うくらい、**TypeScript**が来てます。

TypeScriptの恩恵が受けたいからReactという人もたくさんいるくらいです。

VueでTypeScriptってデコレーターバンバカでなんちゃって感ありますから、こちらもComposition APIの正式採用まで導入は控えてもいいかもです。

### Flow

FlowなんてFacebookさん以外使ってるのみたことないので非推奨はまぁそうなのかもしれません。

### Proptypes

Reactで型チェックといえばProptypesと田舎のおばあちゃんが言ってた時代もありましたが、そんなもの使ってると都会っ子に笑われるぞ！

ちなみにこのブログはJS＆Proptypesです。ゴミカスです。


## Web Security Knowledge

今年からの追加らしいです。

フロントエンドのエンジニアたるもの、当たり前ですよね!?

といいながら案外詳しくない人も多いのも実状。

インフラエンジニア上がりの私的には知ってて当然、なんですがセキュリティに限らずサーバー技術やネットワークに弱いエンジニアは多い気がします。

~~昔、BBSとかにポップアップばっか出すへんなJS埋め込んだ遊びとか知らないんですかね…。~~

つくづくおじさんになったと感じます。

## CSS in JS

こちらも流行っていますねー。

**Styled Components**が個人的にはおすすめだと思ってますが、ちゃんと触っていないのでここはほとんど未知の領域です。

BEMでSassがスタイルの王道だと思っているおじさんはいまでもSassです。このブログもそうです。

ブログからStyled Componentsに切り替えますかね・・。

(CSSはCSSで分かれていたほうがわかりやすいと思うのは私だけでしょうか・・・。)

## Web Components

こちらも完全未知領域です。

そもそもどんな技術かもよくわかってません。勉強不足です。

## CSS Framework

**Tailwind CSS**は気になってましたが触ったことないです。流行ると思ってましたがオプションになっていました。

**Material UI**は別のフロントエンジニアとお話ししたときに、めっちゃ言っていたのでこれで作ってみるかな？

ちなみにこのブログはBootstrapでできてます。古参な技術ですがなんだかんだこれなんだよなぁ感あり。

Bulmaは個人的に好き。

## SSR

やっぱ~~ジャイアンツ~~ Next.js

Reactの進行は止められない!?

まぁ、SSR自体には私懐疑的なので勉強しませんがね。

（SEOに役立つといわれているがGoogleのボットJS読めますし）

[SSRは必要？Javascriptで構築したSPAサイトのSEOを考える](https://www.codit.work/notes/mhpxxkeqv4qhzfjecmrn/)

## Static Site Generators

来ました!!**Gatsby.js!!**このブログの技術です!!

引き続き勉強します!!!

**Vuepress**もドキュメントサイトを作るなら個人的にはおすすめです。

## 結論

今年はフロント技術は以下を学びます!!

- Reactをしっかり理解する
- Reduxはちょっと否定派なので嗜み程度でHookで実装する
- CSS Frameworkは勉強する
- Styled componentsを使いこなせるようになる

