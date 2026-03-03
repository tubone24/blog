---
slug: 2021/12/31/blog-bootstrap
title: 今年も最後だからBlogのBootstrap v3を何とかする
date: 2021-12-31T07:09:52.428Z
description: 長らくBlogのスタイルを支えてきたBootstrap v3が技術負債になってしまっていたのでとりあえずBootstrap v5にしたお話。
tags:
  - JavaScript
  - BootStrap
  - 年越し
headerImage: https://i.imgur.com/nVO9loz.png
templateKey: blog-post
---
年末ですね。

## Table of Contents

```toc

```

## 今年の汚れ今年のうちに。

ということで、長らく超技術負債となってしまっていた**このブログ**をなんとかします。

このブログは、Gatsby.jsをGitHub ActionsでビルドしてNetlifyにデプロイして作られているのですが、CSSフレームワークは**Bootstrap v3.5.1**を使って作られていました。

さすがに[2019年にサポート対象外](https://blog.getbootstrap.com/2019/07/24/lts-plan/)となっているフレームワークを使い続けるのはどうかと思っておりましたが、別に動いているしいいかと思い放置していました。

が、しかしさすがに今年の汚れ今年のうちにと思い立ち、思い切って脱Bootstrapを考え、[Tailwind](https://tailwindcss.com/)とか[daisyUI](https://daisyui.com/)とか、[tailwind-bootstrap-grid
](https://tailwind-bootstrap-grid.netlify.app/)とか色々試した結果、めんどくさくなって**Bootstrap v5**に移行することにしました。

## 問題点

BootStrap v3で動いていたこのブログのソースを見てもらえばわかるのですが、Gatsby.jsで動いているブログなのに、Bootstrapは **&lt;script&gt;** タグを使ってCDNライクに使ってました。(CDN配信ではありません。ここらへんも闇です。)
  
Gatsby.jsでは**HTML.js**というファイルを作ることでHTMLファイルのビルド時に任意のタグを埋め込むことができます。

それを**悪用**して次のようにBootstrapのCSSを **&lt;link&gt;** タグで、jQueryとBootstrapのJSを **&lt;script&gt;** タグでそれぞれ配信されたものを使っている形となっておりました。


```javascript
import React from 'react';

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) => (
  <html {...htmlAttributes} lang="ja">
    <head>
      <link
        rel="stylesheet"
        href="/vendors/css/bootstrap.min.custom.css" // Bootstrap cssを利用
      />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
      <script src="/vendors/js/jquery-3.5.1.slim.custom.min.js" defer /> // Bootstrapで利用するjQueryを利用
      <script src="/vendors/js/bootstrap.custom.min.js" defer /> // Bootstrap JSを利用
    </body>
  </html>
);

export default HTML;
```

これでは下記の問題が発生する形になり大変問題に感じてました。

- npmの管理外になり、パッケージの更新ができない(もはややる気がなかった)
- Bootstrap特有の超でかいCSSをheadでlinkさせてしまっていることでパフォーマンスに悪影響
- deferで読み込むようにしているがBootstrapJS, JQueryも同様に問題
- 上記のパフォーマンス問題を解決するために、CSS, JS, JQueryをゴリゴリに改造(Purge)したものをホスティングし、それを配信し使っていた。(もはや...)

ゴリゴリに改造したCSSとかが正直[サンクコスト](https://www.nomura.co.jp/terms/japan/sa/A02367.html#:~:text=%E8%8B%B1%E8%AA%9E%E8%A1%A8%E8%A8%98%E3%81%AFsunk%20cost,%E3%82%B5%E3%83%B3%E3%82%AF%E3%82%B3%E3%82%B9%E3%83%88%E5%8A%B9%E6%9E%9C%E3%81%A8%E5%91%BC%E3%81%B6%E3%80%82)になっており、かつブログのレイアウトを変えたくない気持ちもあったため長らく放置されることになったのです。
  
余談ですが、サンクコストって最近言葉知りました。

## いざ直す旅へ

ということで早速直していきましょう。冒頭でもお話しましたが、やはり最近のトレンド的に[Tailwind](https://tailwindcss.com/)で行きたいですよね!!!!!! (行きたいです〜)

というわけで[Tailwind](https://tailwindcss.com/)を利用する決断をするのですがやってみて次のような悩みが出てきました。
  
**膨大に作ってしまったコンポーネントをUtility classにするのだるい**

はい...ぶっちゃけそういった悩みが出ました。困りましたね...。なんとかならないものでしょうか...。

探していたら、[daisyUI](https://daisyui.com/)というBootstrapライクなUtility classがあったので使ってみましたが、自分の環境だとほぼ置き換えなしでできそうなのがボタンくらいでした。

加えてめんどくさいのはこのブログの**Gridシステム**です。ある意味Bootstrapから抜けることのできない一番の理由がGridかもしれません。いや...ちゃんと作り直せばいいだけなんですけどね。
  
困り果てていると[tailwind-bootstrap-grid](https://tailwind-bootstrap-grid.netlify.app/)というまたもや便利そうなものが出てくるじゃあありませんか。しかしこれも導入を断念しました。
  
理由はこのブログのカスタムCSSを管理しているSASSとの相性が悪いことで、ビルドすると次のようなエラーが出てきてしまうことです。

```
ModuleBuildError: Module build failed (from ./node_modules/postcss-loader/dist/cjs.js): TypeError: config is not a function
```

node-sassやめてPostCSSにすれば直りそうですが、年末にCSSをいじりまくるときっと辛いと思うので断念することにしました。

## そもそも問題点を考える

そもそもの話ですが、Tailwind化が目的ではなくBootstrap v3をなんとかしたいことが問題でしたので、いっそのことBootstrapを問題ないバージョンまでバージョンアップすればいいと気が付きました。

そうと決まれば、Bootstrap v5からはjQueryを使わなくてよくなっていたのでいっそのことv3 => v5のビックバンリライトを実施することにしました。

## やったこと

まず、HTML.jsでの **&lt;script&gt;** タグでのBootstrap利用をやめました。

Gatsby.jsでは**gatsby-browser.js**を使って、ブラウザ側で利用したいモジュールを設定できますのでこちらにCSSとJSをimportするようにします。

```javascript
import './src/styles/global.scss';
import { Dropdown } from 'bootstrap/dist/js/bootstrap'; //　必要なJSモジュールはDropdownなので

// global.scssには @import "~bootstrap/scss/bootstrap.scss"; という形でBootstrapのCSSをimportする
```

これだけでうまくいくかなーと思いましたが、さすがに甘くありませんでした。ちょっとコードの方も手直しします。

### Dropdown menuの変更

Dropdown menuのtoggle buttonの実装方法がちょっとだけ変わってました。 **data-toggle**と**data-target**がそれぞれ**data-bs-toggle**、**data-bs-target**に変わっただけです。

```javascript
// before
  <button
   className="navbar-toggler"
   type="button"
   data-toggle="collapse"
   aria-label="navbar-toggler"
   data-target="#navbarSupportedContent"
  >
        
// after
  <button
   className="navbar-toggler"
   type="button"
   data-bs-toggle="collapse"
   aria-label="navbar-toggler"
   data-bs-target="#navbarSupportedContent"
  >
```

### Column orderの制限

Columnの順番を制御できるOrderについて今までは無邪気にorder-10とかできたのですが、order-5までの制限となっておりました。なのでこちらも修正します。

```javascript
// before
    <Sidebar />
    <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-10 content">
      <Content post={html} />
    </div>
 
// after
    <Sidebar />
    <div className="col-xl-7 col-lg-6 col-md-12 col-sm-12 order-2 content">
      <Content post={html} />
    </div>
```

### デフォルトでaタグにtext-decoration: underlineがつく

といういらない変更が入っていたので、こちらは**global.sCSS**でnoneを上書きします。
    
![underlineがつく](https://i.imgur.com/RRvEIHy.png)

```css
a {
  text-decoration: none;
}
```
  
### デフォルトでscroll-behavior smoothがつく

というおせっかいが入っているのでこちらもglobal.sCSSで無効化します。別にあってもいいかなとも思ったのですが、画像の**Lazy loading**との相性が最悪で遷移先のページでうまく画像を読み込んでくれなかったので無効化します。
 
```css
:root {
  scroll-behavior: auto;
}
```

あとは細かいレイアウト崩れをちょこちょこ直して完成です。
    
## Purgeの野望

さてこれでBootstrap v5化はできました。Tailwindを使おうと思った理由はPurgeだったので、Purgeしてしまいます。

Gatsby.jsではCSSのPurgeに[gatsby-plugin-purgeCSS](https://www.gatsbyjs.com/plugins/gatsby-plugin-purgecss/)が利用できます。今回はglobal.sCSSにBootstrapのCSSをimportしているので**gatsby-config.js**に次のように設定してあげることで利用してないCSS RuleをPurgeしてくれます。

```javascript
    {
      resolve: `gatsby-plugin-purgecss`,
      options: {
        printRejected: true,
        develop: true,
        purgeOnly : ['src/styles/global.scss'], // global.scssを指定
      },
    },
```
  
## 完成

というわけで完成しました。

今あなたが見ているブログがまさに**Bootstrap v5で動いているブログ**なわけです。

ちなみに、Purgeの効果あってかわかりませんが、Lighthouseのパフォーマンススコアは次のとおりでした。

![lighthouse](https://i.imgur.com/FX0kdBo.png)

みなさまこのブログは **なんでTypeScriptでリライトしないのか？** という疑問があると思うのですが、それもこのBootstrap問題がちょっと絡んでいるので、この際頑張ってTypeScript化しようかなと思ってます。
 
## 最後に

本年もお世話になりました。来年もよろしくおねがいします!!!

![tora](https://i.imgur.com/mwxtvWim.png)






