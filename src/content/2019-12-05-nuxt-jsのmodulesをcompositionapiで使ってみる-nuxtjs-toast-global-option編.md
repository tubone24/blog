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

## toastのオプション問題

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
```


