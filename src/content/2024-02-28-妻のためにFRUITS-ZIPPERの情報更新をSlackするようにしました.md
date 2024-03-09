---
slug: 2024-02-28/妻のためにFRUITS-ZIPPERの情報更新をSlackするようにしました
title: "妻のためにFRUITS ZIPPERの情報更新をSlackするようにしました"
date: 2024-02-28T15:57:29+0000
description: 妻が好きなFRUITS ZIPPERの更新情報をSlackに投稿して情報に最速アクセスできるようにします。
tags:
  - Deno
  - FRUITS ZIPPER
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

ライブに行ってみたい。

## Table of Contents

```toc

```

## FRUITS ZIPPER

皆様FRUITS ZIPPERというアイドルをご存知ですか？

アソビシステム所属のアイドルで昨年のレコード大賞も受賞した今最も勢いのあるアイドルです。

TikTokを中心に今若者から絶大な人気を得ています。

そして何を隠そう、妻がこのアイドルのファンなのです。

来る日も来る日も彼女たちの曲を聞いていたら私も俄然興味が出てきました。武道館ライブが当たるといいな。

## 最新情報のキャッチアップに苦戦

とある日、妻がとても悲しんでいて理由を聞いたら、どうやら「松本かれんちゃんのイベント」の申し込みを見逃してしまったようです。

Twitterには告知がされたらしいのですが、告知タイミングが期限ギリギリだったらしく、反応できなかったようです。

妻の話によると、どうやら公式ホームページのInfomationには情報が反映されるらしく、そちらを定期的に確認さえすれば松本かれんちゃんのイベントに出遅れなかったそうです。

## ということで定期的に確認してみよう

我が家では家族Slackを使ってるので、Slackの特定のチャンネルにInformationが更新されたら、通知する仕組みを作っていきます。

また、妻はTypeScriptを勉強中なのでせっかくなので二人でコーディングできるようにDenoで構築しようと思います。

Denoでこういったスクリプト作るの、べらぼうに簡単なのでみなさんも利用したら離れられなくなりますよ！！！

## DenoでDOMをパースする

DenoでDOMをパースするには[Deno DOM](https://github.com/b-fuze/deno-dom)を使うのが良さそうです。

直感的な使い味でとても使いやすかったです。

QuerySerectorで目的の情報までアクセスするため、今後Webページのレイアウトが変わってしまったら壊れてしまうスクリプトにはなってますが、一旦こちらで実装を進めていきます。

![img](https://i.imgur.com/79xoiL5.png)

サイトの要素を眺めて....作っていきます。

Informationはview allのページがあり、そちらの方がレイアウトの更新に引っ張られなさそうできたのでそちらを使います。

main → section → ul → liとたどれば更新情報が取れそうです。

Nodeも17.5から使えるようにはなってるので、Deno特有の話ではないですが、ライブラリを入れずともfetchが使えるのは便利ですね。

## Denoで時刻を扱う



```typescript
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

const WEB_PAGE_URL_BASE = "https://fruitszipper.asobisystem.com" as const;

// 中略

// FRUITS ZIPPERのサイトにアクセスし、DOMを取得する
  const page = await fetch(`${WEB_PAGE_URL_BASE}/news/1/`);
  const pageContents = await page.text();

  // DOMをパースする(Documentオブジェクトを取得する)
  const document = new DOMParser().parseFromString(pageContents, "text/html");

  // QuerySelectorを使って、更新情報の要素にアクセスする
  const ul = document.querySelector("main > section  > ul");
  const lis = ul?.querySelectorAll("li");

  const information: InformationItem[] = [];

  for (const li of lis) {
    const url = li.querySelector("a")?.getAttribute("href");

    const dateText = li.querySelector("div > .date").textContent;
    const date = datetime().parse(dateText, "YYYY.MM.dd");
    const titleText = li.querySelector("div > .tit").textContent;

    information.push({ date: date, title: titleText, url: url });
  }
```

## Slackに投稿する

## GHAに載せる

## 完成

ということで完成しました！

妻からもよいフィードバックが！！やったやったー！



