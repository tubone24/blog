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






