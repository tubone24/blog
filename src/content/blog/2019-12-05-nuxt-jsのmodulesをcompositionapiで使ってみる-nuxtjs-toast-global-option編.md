---
slug: 2019/12/08/nuxtjs-toast-module
title: Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast Global Option編)
date: 2019-12-08T04:16:00.000Z
description: "Nuxt.jsの@nuxtjs/toastモジュールでGlobal OptionとRegister機能を活用し、toast設定を共通化する方法を解説。nuxt.config.tsでの一括設定やtoast.global呼び出しにより、コンポーネント側のコードを大幅に簡潔にできます。"
tags:
  - JavaScript
  - TypeScript
  - Nuxt.js
  - Vue.js
  - CompositionAPI
  - toast
headerImage: '/images/blog/29nafu5.png'
templateKey: blog-post
---
前回の続きです。

前回[Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast編)](/2019/12/04/nuxt-toast/)ではNuxt.jsのmodulesを使ってtoastを出してみました。

ただ、前回の実装だとどこからともなく、

> 特に再利用もしてないし、共通処理も定義してないからpluginsとか使ってあげれば、modulesじゃなくていいんじゃないんですかねぇ

という声が聞こえてきそうです。

いやはやその通りだとは思いますのでmodulesのもう1つの魅力、**global options**の実装を進めようかと思います。

## Table of Contents

```toc

```

## toastのoption問題

toastを使う際にはtoastを出す場所(**position**), toastをひっこめるまでの時間(**duration**)、色合いなどをtoastを呼び出す際に設定しますが・・・。

```typescript{numberLines: 1}{2-7,16,18}
const doDownload = async (filePath: string): Promise<void> => {
  const options = {
    position: 'top-center',
    duration: 2000,
    fullWidth: true,
    type: 'error',
  } as any;
  try{
    const blob = await downloadPDF(filePath);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'result.pdf';
    link.click();
  } catch (e) {
    if (e instanceof PdfFileNotFoundError) {
      toast.show('No File!!', options)
    } else {

      toast.show('UnknownError!!', options)
    }
  }
}
```

コードの見通しが悪いですね・・。

同じような設定を複数のtoastにoptionsで設定するのはめんどくさい・・。

## modules global optionを使ってみる

では、こちらを改善していきます。

**@nuxtjs/toast**には**global options**の機能があります。

```typescript
//nuxt.config.ts

  modules: [
    '@nuxtjs/toast',
  ],
  toast: {
    position: 'top-center',
    duration: 2000,
    fullWidth: true,
    iconPack : 'material',

  },
```

このように**modules**で**@nuxtjs/toast**を読み込んだ後、**toast共通設定**を入れます。

たったこれだけ簡単！

## もっと見通しをよくしたい。registerを使おう

さらにコードの見通しをよくしたければ、**register**という機能を使うことができます。

たとえば致命的なエラーの時は共通のメッセージを出すtoastを各コンポーネントに量産しなければならない場合など、コードのコピペはしんどいしメンテナンスもよくないのでこいつが便利です。

```typescript{numberLines: 1}{11-27}
//nuxt.config.ts

  modules: [
    '@nuxtjs/toast',
  ],
  toast: {
    position: 'top-center',
    duration: 2000,
    fullWidth: true,
    iconPack : 'material',
    register: [
      {
        name: 'nofileError',
        message: 'No File!!',
        options: {
          type: 'info',
        },
      },
      {
        name: 'unknownError',
 //toast名: 利用するときに使う名前
        message: 'UnknownError!!',
 //toastのmessage
        options: {
          type: 'error',
 //個別に設定したいオプションがあれば
        },
      },
    ],
  },

```

とtoastの情報を登録しておくことにより利用側で、

```typescript{numberLines: 1}{10,12}
const doDownload = async (filePath: string): Promise<void> => {
  try{
    const blob = await downloadPDF(filePath);
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'result.pdf';
    link.click();
  } catch (e) {
    if (e instanceof PdfFileNotFoundError) {
      toast.global.nofileError(); //呼び出し
    } else {
      toast.global.unknownError();
 //呼び出し
    }
  }
};

```

とtoastのインスタンスに対して**global.name**と宣言するだけで使えちゃいます!!

![Global Optionを使ったtoast表示の画面（見た目は前回と同じ）](/images/blog/29nafu5.png)

当然、見た目は同じですね。

## 結論

modulesのglobal optionsをつかうことによりコードの見通しが良くなった気がします。

Nuxt.js + Composition APIの連携をさらに深掘りしたい方は、[VuexのStateをReactiveに使う方法](/2019/12/09/nuxt-composition-vuex/)や[particles-bg-vueを使ったパーティクル背景の実装](/2019/12/02/particles-bg-vue/)もご参照ください。
