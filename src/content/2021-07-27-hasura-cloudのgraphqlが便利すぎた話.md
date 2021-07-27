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
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
勉強しようと思うと掃除してしまうのはなんででしょうかね。

## Table of Contents

```toc

```

## Hasura Cloud

皆さんは[Hasura Cloud](https://hasura.io/ )を知ってますか？

PostgreSQLやMS SQL Serverに接続するだけで、DBのテーブルからGraphQLエンドポイントを作ってくれる、というSaaS(API as a Service)です。

今更ながら最近この便利なサービスを知ったのでご紹介がてらゴーミーサービスを作っていきます。

## Hasura

Hasura自体はOSSで[hasura/graphql-engine](https://github.com/hasura/graphql-engine)にて公開されております。Dockerコンテナでコンソールも立ち上げることができるので気軽な検証はDockerを使うのもありだと思います。

ですが、Hasura CloudがHobby用に無料枠を公開しているのでそちらを今回使っていきたいと思います。

![img](https://raw.githubusercontent.com/hasura/graphql-engine/master/assets/demo.gif)

↑公式ドキュメントからの引用ですがこんな感じでWebコンソールでPostgreSQLに接続して簡単にGraphQLのエンドポイントを作れるようになるらしいです。

## PostgreSQLの準備はHerokuで

Hasuraを使うためにPostgreSQLを作らなければいけません。もちろんお金はないので無料で作れるところを探します。

これは個人Webサービス開発者なら定石過ぎて逆に嫌煙されるくらい有名な手段かもしれませんが、今回はHerokuの[Database](https://data.heroku.com/)にてPostgreSQLを作っていきます。

作成は非常に簡単で、HerokuのダッシュボードからElementsを選択し、Addonsで[Heroku-PostgreSQL](https://elements.heroku.com/addons/heroku-postgresql)を選択するだけです。

![ma](https://i.imgur.com/hkpshVql.png)

こちらレプリケーションやレコード上限がありますが、無料枠があります。10000レコードを超えると課金対象になるので、ならないように定期レコード削除機能も開発する必要がありますね。

## アーキテクチャ

![arch](https://i.imgur.com/iz9IpHf.png)

今回はこのようなアーキテクチャにします。以前[Raspberry PIを使って植物の水やり監視システムを作る](https://blog.tubone-project24.xyz/2020/05/10/plant-check)で作ったラズパイ水やり管理システムのメトリックを定期的に収集してHasuraのGraphQL mutationを介してHeroku PostgreSQLに書き込み、それをVercel + Next.jsで作ったダッシュボードでこれまたHasura GraphQLを介してQuery取得し可視化する、というものです。

~~別に毎日水やりすればいいだけなのですが...~~

## DBとの接続

Hasura CloudとPostgreSQLを接続するために先ほど作成したHeroku PostgreSQLの接続情報を確認します。DB自体はHerokuダッシュボードのDatabaseから確認することができますのでそちらからSetting=>View Crendencialsを選択します。

![ima](https://i.imgur.com/TR9WStil.png)

こちらの情報を控え、Hasura CloudのコンソールからDataを選択し、新しいDababaseの情報を入れ込みます。執筆しながら気が付いたのですがよく見たらHeroku PostgreSQLが作れるメニューがありますね...

![ima](https://i.imgur.com/vzpBanB.png)

無事接続が完了すると、このようにスキーマやテーブルが作れるようになります。

![img](https://i.imgur.com/c1BI53V.png)

テーブルを作ってみましょう。create tableから簡単に作れます。

![img](https://i.imgur.com/JdOrlnf.png)

default valueにnow()などの関数が入れられますのでtimestampはこちらで作っちゃうことにしました。便利ですね。

無事接続ができて適当な行を作ればこのようにメインコンソールからGraphQLが実行できるようになります。

!{img](https://i.imgur.com/R0GFe6X.png)

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

PythonのGraphQLクライアントといえば、gqlが有名です。

基本的にドキュメント通りなのですが、ポイントになるところはヘッダーにx-hasura-admin-secretを設定してあげると特に制限なくmutationできますので、Clientで設定してます。本当はちゃんとロール作ったほうがいいですが、JWT認証がめんどくさかったのでadmin使ってしまいました。

また、mutationでDBにinsertするときはinsert\_{{table名}}\_oneでできます。また、下記の通りvariablesを渡すこともできます。

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

