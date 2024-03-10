---
slug: 2024-02-28/妻のためにFRUITS-ZIPPERの情報更新をSlackするようにしました
title: "妻のためにアイドルの情報が更新されたらSlackに通知する実装をした"
date: 2024-03-11T15:57:29+0000
description: 妻が好きなFRUITS ZIPPERの更新情報をSlackに投稿して情報に最速アクセスできるようにします。
tags:
  - Deno
  - FRUITS ZIPPER
headerImage: https://i.imgur.com/FO7l5lW.png
templateKey: blog-post
---

ライブに行ってみたい。

## Table of Contents

```toc

```

## FRUITS ZIPPER

皆さま[FRUITS ZIPPER](https://asobisystem.com/talent/fruitszipper/)というアイドルをご存じですか？

[アソビシステム](https://asobisystem.com/)所属のアイドルで[昨年のレコード大賞で最優秀新人賞を受賞した](https://news.yahoo.co.jp/articles/c9b2e3ea42b4030cb8641125cb6ca564d3c043d0#:~:text=%E6%97%A5%E6%9C%AC%E3%83%AC%E3%82%B3%E3%83%BC%E3%83%89%E5%A4%A7%E8%B3%9E%E3%80%8D%E3%81%AF%E3%80%812023,ZIPPER%E3%80%8D%E3%81%8C%E9%81%B8%E5%87%BA%E3%81%95%E3%82%8C%E3%81%9F%E3%80%82)今最も勢いのあるアイドルです。

TikTokを中心に今若者から絶大な人気を得ています。

そして何を隠そう、妻がこのアイドルのファンなのです。

来る日も来る日も彼女たちの曲を聞いていたら私も俄然興味が出てきました。[武道館ライブ](https://fruitszipper.asobisystem.com/news/detail/22274)が当たるといいな。

## 最新情報のキャッチアップに苦戦

とある日、妻がとても悲しんでいて理由を聞いたら、どうやら「[松本かれんちゃん](https://asobisystem.com/talent/matsumotokaren/)のイベント」の申し込みを見逃してしまったようです。

Twitterには告知がされたらしいのですが、告知タイミングが申し込み期限ギリギリだったらしく、締め切りまでに反応できなかったようです。

妻の話によると、どうやら公式ホームページのInformation欄には情報が反映されるらしく、そちらを定期的に確認さえすれば松本かれんちゃんのイベントに出遅れなかったそうです。

とはいえ、毎日ホームページをチェックするのも...。

ということで仕組みで解決しましょう。

## ということで定期的に確認してみよう

我が家では家族Slackを導入しているので、Slackの特定のチャンネルにFRUITS ZIPPERのInformationが更新されたら、通知する仕組みを作っていきます。

また、妻はTypeScriptを勉強中なのでせっかくなので二人でコーディングできるようにDenoで構築しようと思います。

Denoでこういった単発のスクリプト作るのは、べらぼうに簡単なのでみなさんもDeno利用したら離れられなくなりますよ!!!

## DenoでDOMをパースする

DenoでDOMをパースするには[Deno DOM](https://github.com/b-fuze/deno-dom)を使うのが良さそうです。

直感的な使い味でとても使いやすかったです。

QuerySelectorで目的の情報までアクセスするため、今後Webページのレイアウトが変わってしまったら壊れてしまうスクリプトにはなってますが、一旦こちらで実装を進めていきます。

![img](https://i.imgur.com/79xoiL5.png)

サイトの要素を眺めて....作っていきます。

ホームページのInformationは[view all](https://fruitszipper.asobisystem.com/news/1/)の専用ページがあり、そちらの方が他情報によるレイアウトの更新に引っ張られなさそうでしたのでそちらを使います。

構造的にmain → section → ul → liとたどれば更新情報が取れそうです。

## Denoで時刻を扱う

Denoで日時を便利に扱うライブラリとして[ptera](https://github.com/Tak-Iwamoto/ptera)を使いました。

DenoでもDateオブジェクトの扱いは引き続きわかりにくいです。JavaScriptのDateはまじで使いづらいです。

なので、pteraを使って日時を扱います。Dayjsライクな使い勝手でとても使いやすかったです。

[Deno DOM](https://github.com/b-fuze/deno-dom)と[ptera](https://github.com/Tak-Iwamoto/ptera)を使って次のようなコードを書きました。

Deno特有の話ではないですが、(Nodeも17.5からfetchが使えるようにはなってるので)ライブラリを入れずともfetchが使えるのは便利ですね。

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

特に工夫されているところもなく上記で作成したinformationオブジェクトを1つずつIncoming WebhookにPOSTしているだけです。

妻も自分も反応できるように、**@channel**投稿にしています。

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

Slackだと会話が流れてしまったり、チケットの抽選を対応したか忘れてしまう問題があったので、合わせて[Notion Database](https://www.notion.so/help/intro-to-databases)にも記録を残しておきます。

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

項目としては、タイトル・日付・リンクのほかに、チェックボックスを設けており、チケットの抽選に対応したかどうかを記録できます。

次のようになりました。

![img](https://i.imgur.com/gPUDGkn.png)

Viewを変更することでカレンダー表示にもできます。（使い所はちょっとわからないですが。）

![img](https://i.imgur.com/yoZJpIh.png)

## GHAに載せる

さて、ここまででスクリプトが完成したので後はGitHub Actionsに載せて定期的に実行するようにしましょう。

今回は一日に一回実行するようにしました。簡単なWorkflowなのでコードは割愛します。

## 完成

ということで完成しました！

妻からもよいフィードバックが!!!やったやったー!!!

![img](https://i.imgur.com/FO7l5lW.png)

