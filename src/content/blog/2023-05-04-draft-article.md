---
slug: 2023/05/04/nfc-business-cart
title: "NFCタグを使ったデジタル名刺をPageCryptを使って作ってみた"
date: 2023-05-04T05:01:23+0000
description: "NFCタグとPageCrypt（AES256暗号化）を組み合わせたデジタル名刺の作り方を解説。AstroでペライチHTMLをビルドし、Renderにホスティングすることでスマホをかざすだけでアクセスできる電子名刺を実現します"
tags:
  - JavaScript
  - Astro
  - Pagecrypt
  - Render
headerImage: https://i.imgur.com/K4G7266.gif
templateKey: blog-post
---

## Table of Contents

```toc

```

## ペーパーレス時代に

これからの時代はペーパーレスです。名刺もきっとペーパーレスにするべきだと思います。(唐突)

直近オフライン系のイベントに参加する機会が多く、紙の名刺を供給するのが面倒なので電子名刺っぽいものを作ってみることにしました。

## こんな感じ

こんな感じの構成にしてみました。

![NFCタグ・Astro・PageCrypt・Renderを組み合わせたデジタル名刺の構成図](https://i.imgur.com/Br1vCID.png)

まず、デジタル名刺ページは[Astro](https://docs.astro.build/ja/getting-started/)を使って作成をしております。ペライチのHTMLをビルドする形になります。ちなみに[このブログ自体もGatsby.jsで構築](/2023/01/01/this-blog)しており、静的サイトジェネレーターには馴染みがあります。

その後、[pagecrypt](https://www.maxlaumeister.com/pagecrypt/)を使って、HTMLを暗号化します。

[SubtleCrypto](https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto) JavaScript APIをどうやら使っているらしく、AES256で暗号化されます。

pagecryptは大変優秀で、

- そのままHTMLにアクセスするとパスワードの入力フォームが表示され、正しいパスワードを入力することでアクセス。
- URLのアンカーに`https://example.com/#password` など、パスワードを設定することでパスワード画面を経由せずアクセス

ができます。

(ただし、後者のアクセスはGETリクエストのURLを中間経路でダッシュされる可能性があるので、機微情報を扱う際はおすすめしません。)

![PageCryptのパスワード入力フォームが表示された暗号化済みHTMLページ](https://i.imgur.com/1Oh9APi.png)

NFCタグにはパスワード付きURLを仕込んでおくことで、実質NFCタグ経由じゃないと名刺サイトにアクセスできなくする、という対応が可能となります。

ホスティングの基盤は[render](https://render.com/)を使ってます。[このブログではNetlifyを使ってGitHub Actions経由でデプロイ](/2021/02/13/netlify-github-action)していますが、今回はrender+NFCという構成にしてみました。

## デモ

この用にNFCタグにスマートフォンをかざすだけで、デジタル名刺サイトにアクセスができました！

![スマートフォンをNFCタグにかざしてデジタル名刺サイトにアクセスするデモ動画](https://i.imgur.com/K4G7266.gif)

