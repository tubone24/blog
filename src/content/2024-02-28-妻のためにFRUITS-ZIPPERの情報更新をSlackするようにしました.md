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

皆様[FRUITS ZIPPER](https://asobisystem.com/talent/fruitszipper/)というアイドルをご存知ですか？

[アソビシステム](https://asobisystem.com/)所属のアイドルで[昨年のレコード大賞で最優秀新人賞を受賞した](https://news.yahoo.co.jp/articles/c9b2e3ea42b4030cb8641125cb6ca564d3c043d0#:~:text=%E6%97%A5%E6%9C%AC%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E5%A4%A7%E8%B3%9E%E3%80%8D%E3%81%AF%E3%80%812023,ZIPPER%E3%80%8D%E3%81%8C%E9%81%B8%E5%87%BA%E3%81%95%E3%82%8C%E3%81%9F%E3%80%82)今最も勢いのあるアイドルです。

TikTokを中心に今若者から絶大な人気を得ています。

そして何を隠そう、妻がこのアイドルのファンなのです。

来る日も来る日も彼女たちの曲を聞いていたら私も俄然興味が出てきました。武道館ライブが当たるといいな。

## 最新情報のキャッチアップに苦戦

とある日、妻がとても悲しんでいて理由を聞いたら、どうやら「[松本かれんちゃん](https://asobisystem.com/talent/matsumotokaren/)のイベント」の申し込みを見逃してしまったようです。

Twitterには告知がされたらしいのですが、告知タイミングが期限ギリギリだったらしく、反応できなかったようです。

妻の話によると、どうやら公式ホームページのInformationには情報が反映されるらしく、そちらを定期的に確認さえすれば松本かれんちゃんのイベントに出遅れなかったそうです。

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

Denoで日時を便利に扱うライブラリとして[ptera](https://github.com/Tak-Iwamoto/ptera)を使いました。

DenoでもDateオブジェクトの扱いは引き続きわかりにくいです。まじで使いづらいです。

なので、pteraを使って日時を扱います。Dayjsライクな使い勝手でとても使いやすかったです。

[Deno DOM](https://github.com/b-fuze/deno-dom)と[ptera](https://github.com/Tak-Iwamoto/ptera)を使って次のようなコードを書きました。

```typescript
import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { datetime } from "https://deno.land/x/ptera/mod.ts";

const WEB_PAGE_URL_BASE = "https://fruitszipper.asobisystem.com" as const;

// 中略

type InformationItem = {
    date: datetime.DateTime;
    title: string;
    url: string;
};

// FRUITS ZIPPERのサイトにアクセスし、DOMを取得する
const page = await fetch(`${WEB_PAGE_URL_BASE}/news/1/`);
const pageContents = await page.text();

// DOMをパースする(Documentオブジェクトを取得する)
const document = new DOMParser().parseFromString(pageContents, "text/html");

// QuerySelectorを使って、更新情報の要素にアクセスする
const ul = document.querySelector("main > section  > ul");
const lis = ul?.querySelectorAll("li");

const information: InformationItem[] = [];

// ListItemから更新情報を取得する
for (const li of lis) {
    // URLを取得する
    const url = li.querySelector("a")?.getAttribute("href");

    const dateText = li.querySelector("div > .date").textContent;
    // 日付をパースする
    const date = datetime().parse(dateText, "YYYY.MM.dd");
    // タイトルを取得する
    const titleText = li.querySelector("div > .tit").textContent;

    information.push({ date: date, title: titleText, url: url });
  }
```

## Slackに投稿する

SlackのIncoming Webhookで更新があった場合は通知を飛ばすようにしております。

特に工夫されているところもなく上記で作成したinformationオブジェクトを一つずつIncoming WebhookにPOSTしているだけです。

妻も自分も反応できるように**@channel**投稿にしています。

```typescript
const notifySlack = async (information: InformationItem[]) => {
  const messages = information.map((item) => {
    const linkText = `【${item.date.format("YYYY-MM-dd")}】${
        item.title
    }`.trim();
    return `
         <!channel> <${WEB_PAGE_URL_BASE}${item.url}|${linkText}>
        `;
  });

  for (const message of messages) {
    const postDataForSlack = JSON.stringify({
      type: "mrkdwn",
      text: message,
    });
    const response = await fetch(SLACK_WEBHOOK_URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: postDataForSlack,
    });
  }
};
```

実際に投稿されたものはこんな感じです。

![img](https://i.imgur.com/LCFGex8.png)

妻も喜んでますね。

## Notion Databaseに記録する

Slackだと会話が流れてしまったり、チケットの抽選を対応したか忘れてしまう問題があったので、合わせてNotion Databaseにも記録を残しておきます。

[NotionのAPI](https://developers.notion.com/docs/working-with-databases#adding-pages-to-a-database)を使って、Databaseに記録しています。

```typescript
const writeNotionDatabase = async (information: InformationItem[]) => {
  for (const item of information) {
    const body = {
      parent: { database_id: NOTION_DATABASE_ID },
      properties: {
        タイトル: {
          title: [{ text: { content: item.title } }],
        },
        日付: {
          date: { start: item.date.format("YYYY-MM-dd") },
        },
        リンク: {
          url: `${WEB_PAGE_URL_BASE}${item.url}`,
        },
        チェックボックス: {
          checkbox: false,
        },
      },
    };
    await fetch("https://api.notion.com/v1/pages", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Notion-Version": "2022-06-28",
        Authorization: `Bearer ${NOTION_API_SECRET}`,
      },
      body: JSON.stringify(body),
    });
  }
};
```

![img](https://i.imgur.com/yoZJpIh.png)

![img](https://i.imgur.com/gPUDGkn.png)

## GHAに載せる

## 完成

ということで完成しました！

妻からもよいフィードバックが！！やったやったー！



