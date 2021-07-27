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
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
体重が落ちてきました！

## Table of Contents

```toc

```

### スクリプトのTypeScript化

前回～の記事の最後の方でSlackにダッシュボードの情報をあげるスクリプトを作って定期的に実行させることをしました。

がしかし、あろうことかスクリプトはTypeScriptじゃなく、JavaScript(ES module)でした。

どうして、TypeScriptにしなかったかというと、

- Projectで設定しているtsconfigをいじりたくなかった(Next.jsと単なるNode.jsスクリプトを共存させたくなかった)
- Buildしたdistの取り回しがめんどくさい
- ならばとDenoを使おうと思ったが色々失敗した

という理由で、まぁただの付加機能でしかないのでmjsでぱぱっと作ってしまった、というわけです。

今回はロジックは特に変えずにランタイムをDenoに変更し、ついでにTypeScript化させちゃいましょう。

## Denoとは？



```
import {encode} from 'https://deno.land/std/encoding/base64.ts';

const URI_ENDPOINT = 'https://crisp-muskox-39.hasura.app/v1/graphql';

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
