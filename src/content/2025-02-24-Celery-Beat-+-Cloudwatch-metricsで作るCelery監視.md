---
slug: 2025-02-24/Celery-Beat-+-Cloudwatch-metricsで作るCelery監視
title: "Celery Beat + Cloudwatch metricsで作るCelery監視"
date: 2025-02-24T08:52:25+0000
description: Celery Beat + Cloudwatch metricsで作るCelery監視
tags:
  - AWS
  - Celery
  - Cloudwatch
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

少しずつあったかくなってきましたね。

## Table of Contents

```toc

```

## Celeryとは？

CeleryはPythonベースのオープンソースの使われる非同期タスクキュー/ジョブキューです。

Celeryは、分散メッセージパッシングの考え方に基づいた思想で作られており、Webサーバーのワークロードから重たい処理を切り出すことが可能で、非同期でタスクを実行し、タスクのスケジューリング、タスクの結果の取得を簡単に実装できます。

例えば、以下のような用途で使われます。

- メール送信
  - 一括メール送信などWebサーバーから長時間ワークロードを切り離す
- ファイル処理
  - ファイルのフォーマット変換など

メッセージパッシングを自前で実装すると結構苦労しますが、Celeryを使うことで次のようにデコレーターベースで簡単に実装できます。

```python
from celery import Celery

app = Celery('tasker',
             backend='redis://127.0.0.1:6379/0',
             broker='redis://127.0.0.1:6379/0')

@app.task
def add(a, b):
    return a + b

# タスクの実行
result = add.delay(4, 5).get()
```

とても簡単ですね。

### ちょっとだけCeleryのおさらい

このあと、用語がバンバン飛び交うのでCeleryの基本をおさらいしていきましょう。

まずCeleryは以下の要素で構成されています。

- タスク: Celeryワーカーで実行される関数で、@taskデコレータを使用して通常のPython関数の実装のまま、Celeryのタスクとして登録できます

- ブローカー: メッセージの仲介役として機能し、RedisやRabbitMQ, AWSならSQSが主にサポートされています

- 結果バックエンド: タスクの実行結果を保存する場所で、RedisやMongoDBなどのNoSQLだけでなく、ORM(SQLAlchemy)経由でRDBも対応してます。AWSならDynamoDB、S3などがサポートされています

- ワーカー: 実際にタスクを実行するプロセス。celerydが常駐プロセスとして動作します

例えばFastAPIと絡めた動きとしては、以下の図のようになります。

ブローカーと結果バックエンドは、例えばRabbitMQ、MongoDBなどそれぞれPub/Sub、データベースの専用の製品で構成することもできますが、Redisで両方を構成することもできます。

ちなみにAWSでCeleryを絡めた構成をつくるならこのような形で構成されることが多いです。

## Celeryの監視困ってませんか？

Celeryを使っていると、タスクがどれくらい進んでいるのか、どれくらいのタスクが残っているのか、どれくらいのタスクが失敗しているのか、などの情報が欲しくなります。

そしてできれば

よく紹介される方法としては、[Flower](https://flower.readthedocs.io/en/latest/)を使う方法があります。

Flowerはタスクの状態を見るためのツールであり、システムの監視に載せるには専用にPrometheusなどの監視ツールと連携する必要があります。

専用にPrometheusなどの監視ツールを立てるのは、ちょっと面倒ですよね。また、Flowerが障害点になってしまうことも課題になります。

## Celery Beat

Celery Beatは、Celeryのスケジューラーです。Celery Beatを使うと、登録しているタスクを定期的に実行できます。
