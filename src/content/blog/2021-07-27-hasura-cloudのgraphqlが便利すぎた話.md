---
slug: 2021/07/27/hasura-graphql
title: Hasura CloudのGraphQLが便利すぎた話
date: 2021-07-27T02:45:28.646Z
description: Hasura Cloudというのを最近知りましたが、簡単にGraphQLエンドポイントが作れてびっくりしました、という感想文です。
tags:
  - Hasura
  - GraphQL
  - Vercel
  - Next.js
  - Heroku
  - imgur
headerImage: https://i.imgur.com/R0GFe6X.png
templateKey: blog-post
---
勉強しようと思うと掃除してしまうのはなんででしょうかね。

## Table of Contents

```toc

```

## Hasura Cloud

皆さんは[Hasura Cloud](https://hasura.io/ )を知ってますか？

PostgreSQLやMS SQL Serverに接続するだけで、DBのテーブルから**GraphQLエンドポイント**を作ってくれる、というSaaS(API as a Service)です。

今更ながら最近この便利なサービスを知ったのでご紹介がてらゴーミー(Go Me!)サービスを作っていきます。

## Hasura

Hasura自体はOSSで[hasura/graphql-engine](https://github.com/hasura/graphql-engine)にて公開されております。Dockerコンテナでコンソールも立ち上げることができるので気軽な検証はDockerを使うのもありだと思います。

ですが、Hasura Cloudが**Hobby用に無料枠を公開している**のでそちらを今回使っていきたいと思います。

![img](https://raw.githubusercontent.com/hasura/graphql-engine/master/assets/demo.gif)

↑公式ドキュメントからの引用ですがこんな感じでWebコンソールでPostgreSQLに接続して簡単にGraphQLのエンドポイントを作れるようになるらしいです。

## PostgreSQLの準備はHerokuで

Hasuraを使うためにPostgreSQLを作らなければいけません。もちろんお金はないので無料で作れるところを探します。

これは個人Webサービス開発者なら定石過ぎて逆に嫌煙されるくらい有名な手段かもしれませんが、今回はHerokuの[Database](https://data.heroku.com/)にてPostgreSQLを作っていきます。

作成は非常に簡単で、HerokuのダッシュボードからElementsを選択し、Addonsで[Heroku-PostgreSQL](https://elements.heroku.com/addons/heroku-postgresql)を選択するだけです。

![ma](https://i.imgur.com/hkpshVql.png)

こちらレプリケーションやレコード上限がありますが、無料枠があります。**10000レコードを超えると課金対象**になるので、ならないように定期レコード削除機能も開発する必要がありますね。

## アーキテクチャ

![arch](https://i.imgur.com/iz9IpHf.png)

今回はこのようなアーキテクチャにします。以前[Raspberry PIを使って植物の水やり監視システムを作る](https://tubone-project24.xyz/2020/05/10/plant-check)で作ったラズパイ水やり管理システムのメトリックを定期的に収集してHasuraのGraphQL mutationを介してHeroku PostgreSQLに書き込み、それをVercel + Next.jsで作ったダッシュボードでこれまたHasura GraphQLを介してQuery取得し可視化する、というものです。

~~別に毎日水やりすればいいだけなのですが...~~

## DBとの接続

Hasura CloudとPostgreSQLを接続するために先ほど作成したHeroku PostgreSQLの接続情報を確認します。DB自体はHerokuダッシュボードのDatabaseから確認できますのでそちらからSetting=>View Crendencialsを選択します。

![ima](https://i.imgur.com/TR9WSti.png)

こちらの情報を控え、Hasura CloudのコンソールからDataを選択し、新しいDababaseの情報を入れ込みます。執筆しながら気が付いたのですがよく見たらHeroku PostgreSQLが作れるメニューがありますね..。

![ima](https://i.imgur.com/vzpBanB.png)

無事接続が完了すると、このようにスキーマやテーブルが作れるようになります。

![img](https://i.imgur.com/c1BI53V.png)

テーブルを作ってみましょう。create tableから簡単に作れます。

![img](https://i.imgur.com/dm0FJPU.png)

default valueにnow()などの関数が入れられますのでtimestampはこちらで作っちゃうことにしました。便利ですね。

無事接続ができて適当な行を作ればこのようにメインコンソールからGraphQLが実行できるようになります。

![img](https://i.imgur.com/R0GFe6X.png)

Query↓

```graphql
query MyQuery {
  raspi_plant_checker(order_by: {timestamp: desc}) {
    light
    id
    moisture
    timestamp
  }
}
```

結果↓

```json
{
  "data": {
    "raspi_plant_checker": [
      {
        "light": 175,
        "id": 6,
        "moisture": 0,
        "timestamp": "2021-07-25T12:17:47.776369+00:00"
      },
      {
        "light": 0,
        "id": 5,
        "moisture": 0,
        "timestamp": "2021-07-24T02:48:54.994038+00:00"
      },
      {
        "light": 175,
        "id": 4,
        "moisture": 0,
        "timestamp": "2021-07-23T12:51:50.070372+00:00"
      },
      {
        "light": 175,
        "id": 3,
        "moisture": 255,
        "timestamp": "2021-07-23T08:26:12.603547+00:00"
      },
      {
        "light": 175,
        "id": 2,
        "moisture": 255,
        "timestamp": "2021-07-23T07:54:17.186706+00:00"
      }
    ]
  }
}
```

まだロールを設定してないのでリクエストヘッダーにx-hasura-admin-secretを設定しないといけないですがこの状態ですでにエンドポイントURLが使えるようになっております。

めちゃくちゃ簡単ですね。

## Pythonで定期的にGraphQLのmutationをする

PythonのGraphQLクライアントといえば、[gql](https://github.com/graphql-python/gql)が有名です。

基本的にドキュメント通りなのですが、ポイントになるところはヘッダーに**x-hasura-admin-secret**を設定してあげると特に制限なくmutationできますので、Clientで設定してます。本当はちゃんとロール作ったほうがいいですが、JWT認証がめんどくさかったのでadmin使ってしまいました。

また、mutationでDBにinsertするときは**insert\_{{table名}}\_one**でできます。さらに、下記の通りvariablesを渡すこともできます。

```python
from gql import gql, Client
from gql.transport.requests import RequestsHTTPTransport

HASURA_URL = "https://xxxxx"
HASURA_SECRET = "xxxxxxx"


def upload_metric_to_hasura(moisture, light):
    client = Client(
        transport=RequestsHTTPTransport(
            url=HASURA_URL,
            use_json=True,
            headers={
                "Content-type": "application/json",
                "x-hasura-admin-secret": HASURA_SECRET
            },
            retries=3,
        ),
        fetch_schema_from_transport=True,
    )
    query = gql(
        """
        mutation MyMutation ($light: numeric!, $moisture: numeric!){
            insert_raspi_plant_checker_one(object: {light: $light, moisture: $moisture}) {
                id
                light
                moisture
                timestamp
            }
        }
        """
    )
    params = {"light": light, "moisture": moisture}
    result = client.execute(query, variable_values=params)
    print(result)
    
upload_metric_to_hasura(2, 3)
```

GraphQLだけ切り出すとこんな感じ。

```graphql
        mutation MyMutation ($light: numeric!, $moisture: numeric!){
            insert_raspi_plant_checker_one(object: {light: $light, moisture: $moisture}) {
                id
                light
                moisture
                timestamp
            }
        }
```

また、今回はHeroku PostgreSQLのレコード制限があるので古いデータは消すことにします。

なので、同じくmutationでdeleteを実現する必要があります。

```python
def delete_old_metrics_to_hasura(days_before=7):
    dt_now = datetime.now(timezone.utc)
    before_day = dt_now - timedelta(days=days_before)
    dt = before_day.astimezone().isoformat(timespec='microseconds')
    client = Client(
        transport=RequestsHTTPTransport(
            url=HASURA_URL,
            use_json=True,
            headers={
                "Content-type": "application/json",
                "x-hasura-admin-secret": HASURA_SECRET
            },
            retries=3,
        ),
        fetch_schema_from_transport=True,
    )
    query = gql(
        """
        mutation MyMutation ($dt: timestamptz){
            delete_raspi_plant_checker(where: {timestamp: {_lt: $dt}}) {
                returning {
                    id
                    light
                    moisture
                    timestamp
                }
            }
        }
        """
    )
    params = {"dt": dt}
    result = client.execute(query, variable_values=params)
    print(result)

delete_old_metrics_to_hasura()
```

\_ltをwhere句で使えるので簡単ですね。↓がGraphQLです。

```graphql
        mutation MyMutation ($dt: timestamptz){
            delete_raspi_plant_checker(where: {timestamp: {_lt: $dt}}) {
                returning {
                    id
                    light
                    moisture
                    timestamp
                }
            }
        }
```

## ロールを設定する

今回はNext.jsで作ったフロントから直接Hasuraを叩く必要がありますので、やはりadminのままでは使いにくいので読み込みのみロールを作ることにします。といってもユーザー認証の必要ないanonymousのロールを作り、そこにテーブルのSelect権限だけつける形を取ります。

![img](https://i.imgur.com/gvA0pe2.png)

まず、テーブル設定画面からpermissionを設定し、とりあえず**anonymous**というユーザーを作ります。

Hasuraではanonymous接続はデフォルトでOffになっているのでこちらを有効にしていきます。

プロジェクトコンソールまで戻って、環境変数**HASURA_GRAPHQL_UNAUTHORIZED_ROLE**に先ほど作った**anonymous**を設定します。

![img](https://i.imgur.com/rRAVwPw.png)

さらに、いたずらにQueryを発行されて無料利用枠を消費されたくないのでリミットをつけます。こちらはコンソールのSecurityから設定できます。

anonymousはglobalの設定を踏襲することにしますので、globalでそれぞれのリミットを設定して、IPアドレスごとにリミット制御するようにしました。

![img](https://i.imgur.com/FvSFqnx.png)

## Next.js(React TypeScript)からGraphQLを利用する

さて、準備ができましたのでいよいよダッシュボードの開発に移ります。

JavaScriptで使えるGraphQLクライアントといえば[Apollo](https://www.apollographql.com/docs/)が有名なので今回はこちらを利用していきます。

何番煎じかわからないので詳しい解説は抜きにしていきます。下のようにすればうまく取れるはずです。

```tsx
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

const URI_ENDPOINT = "https://xxxxxxxxxxxx.hasura.app/v1/graphql";

const client = new ApolloClient({
  uri: URI_ENDPOINT,
  cache: new InMemoryCache()
});

export const Table = (): JSX.Element => {
  const getPlantData = async() => {
    const { data } = await client.query({
      query: gql`          
          query MyQuery {
              raspi_plant_checker {
                  id
                  light
                  moisture
                  timestamp
              }
          }
      `
    });
    const plantCheckerData = data.raspi_plant_checker.map((data) => ({id: data.id, light: data.light, moisture: data.moisture, timestamp: data.timestamp}))
    return plantCheckerData
    ...(省略)
```

ちょっと詰まったなと思ったところはAppoloから取得したGraphQLの結果にはQueryで指定した項目以外に\[\[Prototype\]\]が付いてきます。今回取得した値をrecoilを使って状態管理しようと思ったのですが、このprototypeが邪魔でrecoilがうまく動かなかったので、mapで配列を再定義している、というわけです。

他はmeterial table使ったり、chart.js使ったりしてますがこちらは以前作った[Next.jsとVercelとRecoilとMaterial Tableを使ってAWSのステータスダッシュボードを作ってみた話](https://tubone-project24.xyz/2021/01/11/vercel-next)のパクリコードなので解説は割愛します。

## できた

こんな感じでできました。我が家の植物情報なんてほかの人は興味なさそうですがVercelにあげて公開することにしました。

<https://plant-check-graph.vercel.app/>

![img](https://i.imgur.com/YznBG45.png)

ちょっと失敗したなと思ったのは土壌水分量(moisture)はセンサーの抵抗値から算出するのですが、0が抵抗値が低い状態を示しているので、つまり湿っているという状態です。直感的に逆ですね。

ともあれ出来上がってよかったです。

## おまけ Slackに毎日状況をグラフ付きで投稿する

ここからは完全に余談なのですがせっかくダッシュボード作っても自分で毎日見に行くことはまずありません!!(なぜ作った)

なので、せっかくなので、こちらのダッシュボードを毎日画面キャプチャし、Slackに投稿する機能も作ってみたいと思います。お勉強がてらキャプチャ機能はCypressで作ることにしました。

まず、Cypressの設定をしていきます。

cypressのインストールやpackage.jsonの設定は割愛します。

specファイル**screenshot.spec.js ** は次のようになりました。

```javascript
describe('ScreenShotNetatmoDashboard', () => {
  it('TopPageWithGraphs', () => {
    cy.visit("/");
    cy.wait(10000)
    cy.get('div > span:nth-child(2) > .MuiIconButton-colorInherit:nth-child(1) > .MuiIconButton-label > .MuiSvgIcon-root').click()
    cy.screenshot('screenShot',{
      capture: 'fullPage'
    });
  });
});
```

変な要素指定がありますが、こちらはMaterial Tableにあるアクションボタンを押している動作です。そうしないとChart.jsで作ったグラフが開かない作りにしてしまったので。

また、こんな変な要素、よく見つけられたと思ったほうに朗報でCypressにはChrome拡張がありまして、[Cypress Scenario Recorder](https://chrome.google.com/webstore/detail/cypress-scenario-recorder/fmpgoobcionmfneadjapdabmjfkmfekb?hl=ja)というものがあります。こちらを使えばツールが自動生成するようなボタンでも要素を取得することが簡単です。

~~本当はスクラッチで作ってtest-idをつけるべきというのは知ってますよ..!!!!~~

![img](https://i.imgur.com/KaTx1pD.png)

また、上記SpecだとbaseURLの設定がされていないのでこのままでは動かないのでcypress.jsonも設定する必要があります。

```json
{
  "baseUrl": "https://plant-check-graph.vercel.app/"
}
```

これで画面キャプチャが取れるようになったので次はSlackへのアップロードスクリプトです。

例によってTypeScript化してません!!変換もめんどくさかったのでES modules JSファイルです。恥ずかしい!!~~本当はDenoで作るつもりだったの!!うまく動かなかったの!!~~

``` javascript
import { ApolloClient, gql, HttpLink, InMemoryCache  } from '@apollo/client'
// "fetch" has not been found globally and no fetcher has been configured. To fix this, install a fetch package (like https://www.npmjs.com/package/cross-fetch), instantiate the fetcher, and pass it into your HttpLink constructor.
import fetch from 'cross-fetch';
import fs from 'fs'
import axios from 'axios'

const filePath = './cypress/screenshots/screenshot.spec.js/screenShot.png';
const slackWebhookUrl = process.env.SLACK_WEBHOOK_URL;
const imgurClientId = process.env.IMGUR_CLIENT_ID;

const URI_ENDPOINT = 'https://xxxxxxxxxxxxx.hasura.app/v1/graphql';

const dashBoardUrl = 'https://plant-check-graph.vercel.app/'

const client = new ApolloClient({
  link: new HttpLink({ uri: URI_ENDPOINT, fetch }),
  cache: new InMemoryCache()
});

const base64Data = fs.readFileSync(filePath, { encoding: 'base64' });

const data = {
  image: base64Data.replace(new RegExp('data.*base64,'), ''),
  type: 'base64'
}

const config = {
  headers: {
    Authorization: `Client-ID ${imgurClientId}`
  }
}

axios.post('https://api.imgur.com/3/image', data, config).then((resp) => {
  const imageLink = resp.data.data.link
  console.log(imageLink)
  client.query({
    query: gql`
        query MyQuery {
            raspi_plant_checker {
                id
                light
                moisture
                timestamp
            }
        }
    `
  }).then((resp) => {
    const latestData = resp.data.raspi_plant_checker[resp.data.raspi_plant_checker.length - 1]
    const slackPayload = {
      text: `*How are you?* \n<${dashBoardUrl}|Click here> for details! \n${imageLink}`,
      attachments: [
        {
          fields: [
            {
              title: 'Moisture',
              value: latestData.moisture,
              short: 'true'
            },
            {
              title: 'Light',
              value: latestData.light,
              short: 'true'
            },
          ]
        }
      ]
    }
    axios.post(slackWebhookUrl, slackPayload).then((resp) => {
      console.log("OK")
    })
  })
  }
)
```

ポイントとしては、

- 画像の投稿にSlackのfileAPIを使わないでimgurのAPIを使っている(ただ使ってみたかっただけ)
- Appolo clientをnodeで使うとfetchが存在しないので個別にcross-fetchをインストールして **link: new HttpLink({ uri: URI_ENDPOINT, fetch })** という具合で設定してやる必要がある
- cypressのscreenshotは./cypress/screenshots/spec名/ファイル名で出力されるのでbase64で読み込んでいる

さらにCypressやらSlackアップロードスクリプトを定期的に実行するRunnerを作ります。もうお分かりですね？　GitHub Actionsです。

```yaml
  
name: Upload Slack

on:
  push:
    branches:
      - main
  schedule:
    - cron: '10 6 * * *'

jobs:
  UploadSlack:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - uses: denoland/setup-deno@v1
        with:
          deno-version: 'v1.x'
      - name: npm install
        run: npm install
      - name: run cypress
        run: npm run cy:run
      - name: Upload Slack
        env:
          IMGUR_CLIENT_ID: ${{ secrets.IMGUR_CLIENT_ID }}
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
        run: node scripts/uploadScreenShot.mjs
```

これで毎日Slackに植物情報が投稿されるようになりました。

![img](https://i.imgur.com/xNW7WDG.png)


## 反省

Denoを使ってSlackアップロードスクリプトは改修します。絶対に。





