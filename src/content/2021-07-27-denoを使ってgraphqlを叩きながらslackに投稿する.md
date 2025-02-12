---
slug: 2021/07/28/deno-slack
title: Denoを使ってGraphQLを叩きながらSlackに投稿する
date: 2021-07-27T15:07:09.874Z
description: |
  以前Deno化を断念したSlackアップロードスクリプトをDeno化したというお話し。
tags:
  - Deno
  - GraphQL
  - Slack
headerImage: https://i.imgur.com/iXpteuJ.jpg
templateKey: blog-post
---
体重が落ちてきました！

## Table of Contents

```toc

```

### スクリプトのTypeScript化

前回[Hasura CloudのGraphQLが便利すぎた話](https://tubone-project24.xyz/2021/07/27/hasura-graphql#%E5%8F%8D%E7%9C%81)の記事の最後の方でSlackにダッシュボードの情報をあげるスクリプトを作って定期的に実行させることをしました。

がしかし、あろうことかスクリプトは**TypeScript**じゃなく、**JavaScript(ES module)**でした。

どうして、TypeScriptにしなかったかというと、

- Projectで設定しているtsconfigをいじりたくなかった(Next.jsと単なるNode.jsスクリプトを共存させたくなかった)
- Buildしたdistの取り回しがめんどくさい
- ならばとDenoを使おうと思ったが色々失敗した

という理由で、まぁただの付加機能でしかないのでmjsでぱぱっと作ってしまった、というわけです。

今回はロジックは特に変えずにランタイムをDenoに変更し、ついでにTypeScript化させちゃいましょう。

## Denoとは？

Denoとは、Node.jsの作者であるRyan Dahlによって作られた、新しいJavaScript/TypeScriptランタイムです。

Node.jsに関する10の反省点という講演のなかで氏がNode.jsのここがまずかった！ということをあげて、Denoのプロトタイプ版を出したのが始まりとか。

ちなみに、Nodeを並べ替えるとDeno。

ちなみにアイコンは恐竜らしい。ダイナソーでDeno。

アイコンについてのおもしろ話は、

https://hashrock.hatenablog.com/entry/2019/02/04/040505

を参照しよう！直接作者と会話できるのはいいですね。

## 書いたコード

実際、Denoで動かそうとNodeで動かそうとあまり違いがないと思ってたのですが細かい違いがありました。(初心者)

まず、基本的なことですがビルトインの機能がすべて**Deno**に内包されてます。

なので環境変数は、

```
const imgurClientId = Deno.env.get('IMGUR_CLIENT_ID') as string;
```

のように取得します。**process.env**ではないんですね。
あとas stringという記述がありますがas stringしておかないと、fetch関数に渡すときTypeErrorとなってしまいます。

Denoにはnpmやらpackage.jsonのようなモジュール管理がランタイムに内蔵されているため、importはURLで参照します。

もちろんCommonJSのrequireなんてありません。なので、requireしていた部分も書き直しです。

やはり便利だなと思ったのは**サーバーでfetchが使える**ことでしょうか？cross-fetchとか入れないでいいんですよ！

(でもaxios使いたいマンなので、喜び半分くらいですね。)

あと便利だなと思ったのはtop levelのコードで**await**って書いていいことですね。これはありがたい。


```typescript
import {encode} from 'https://deno.land/std/encoding/base64.ts';

const URI_ENDPOINT = 'https://xxxxx.hasura.app/v1/graphql';

const filePath = './cypress/screenshots/screenshot.spec.js/screenShot.png';
const dashBoardUrl = 'https://plant-check-graph.vercel.app/'
const slackWebhookUrl = Deno.env.get('SLACK_WEBHOOK_URL') as string;
const imgurClientId = Deno.env.get('IMGUR_CLIENT_ID') as string;

const readImageData = await Deno.readFile(filePath);
const encodedData = encode(readImageData);

const imgurPayload = {
  image: encodedData.replace(new RegExp('data.*base64,'), ''),
  type: 'base64'
}

const imgurHeaders = {
  'Accept': 'application/json',
  'Authorization': `Client-ID ${imgurClientId}`,
  'Content-Type': 'application/json'
}

const imgurRes = await fetch('https://api.imgur.com/3/image', {method: 'POST', headers: imgurHeaders, body: JSON.stringify(imgurPayload)})
const imgurJson = imgurRes.json()
const { data: imgurData } = await imgurJson
const imgurLink = imgurData.link

const query = {
  query: 'query MyQuery {\nraspi_plant_checker(order_by: {timestamp: desc}, limit: 1) {\n      light\n      moisture\n      timestamp\n      id\n  }\n}',
  variables: null,
  operationName: 'MyQuery'
}

const hasuraHeaders = {
  'Content-Type': 'application/json'
}

const hasuraRes = await fetch(URI_ENDPOINT, {method: 'POST', headers: hasuraHeaders, body: JSON.stringify(query)})
const hasuraJson = hasuraRes.json()
const hasuraData = await hasuraJson
const latestHasuraData = hasuraData.data.raspi_plant_checker[0]
console.log(latestHasuraData)

const slackPayload = {
  text: `*How are you?* \n<${dashBoardUrl}|Click here> for details! \n${imgurLink}`,
  attachments: [
    {
      fields: [
        {
          title: 'Moisture',
          value: latestHasuraData.moisture,
          short: 'true'
        },
        {
          title: 'Light',
          value: latestHasuraData.light,
          short: 'true'
        },
      ]
    }
  ]
}

const slackHeaders = {
  'Accept': 'application/json',
  'Content-Type': 'application/json'
};

await fetch(slackWebhookUrl, {method: 'POST', headers: slackHeaders, body: JSON.stringify(slackPayload)})
```

## 結論

使いどころはまだ限られる気もしますが、徐々にDenoに慣れていこうと思います!!!！


