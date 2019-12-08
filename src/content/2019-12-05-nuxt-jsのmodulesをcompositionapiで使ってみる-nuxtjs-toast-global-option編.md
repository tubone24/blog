---
slug: 2019/12/05/nuxtjs-toast-module
title: Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast Global Option編)
date: 2019-12-05T14:16:43.104Z
description: Nuxt.jsのmodulesでGlobal Optionを使ってみます。
tags:
  - Nuxt.js
  - Vue.js
  - CompositionAPI
  - toast
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# 前回の続きです

前回（リンク）ではNuxt.jsのmodulesを使ってtoastを出してみました。

ただ、前回の実装だとどこからともなく

> 特に再利用もしてないし、共通処理も定義してないからpluginsとか使ってあげれば、modulesじゃなくていいんじゃないんですかねぇ

という声が聞こえてきそうです。

いやはやその通りだとは思いますのでmodulesのもう一つの魅力、global optionsの実装を進めようかと思います。

## toastのoption問題

toastを使う際にはtoastを出す場所(position), toastをひっこめるまでの時間(duration)、色合いなどをtoastを呼び出す際に設定しますが・・・。

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

@nuxtjs/toastにはglobal optionsの機能があります。

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

このようにmodulesで@nuxtjs/toastを読み込んだ後、toast共通設定を入れます。

たったこれだけ簡単！

## もっと見通しをよくしたい。registerを使おう

さらにコードの見通しをよくしたければ、registerという機能を使うことができます。

たとえば致命的なエラーの時は共通のメッセージを出すtoastを各コンポーネントに量産しなければならない場合など、コードのコピペはしんどいしメンテナンスもよくないのでこいつが便利です。

```typescript{numberLines: 1}{11-19}
//nuxt.config.ts

  modules: [
    '@nuxtjs/toast',,
  ],
  toast: {
    position: 'top-center',
    duration: 2000,
    fullWidth: true,
    iconPack : 'material',
    register: [
      {
        name: 'unknownError', //toast名
        message: 'UnknownError!!', //toastのmessage
        options: {
          type: 'error', //個別に設定したいオプションがあれば
        },
      },
    ],

  },

```
