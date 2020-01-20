---
slug: 2020/1/20/x-ray-datadog
title: AWS X-RayでLambdaのトレースをしつつ、Datadog APMに連携する
date: 2020-01-20T14:08:11.212Z
description: AWS X-RayでLambdaのトレースをしつつ、Datadog APMに連携しようと思います。
tags:
  - AWS
  - Lambda
  - X-Ray
  - Datadog
  - APM
headerImage: 'https://i.imgur.com/WbF4DOc.png'
templateKey: blog-post
---
AWSのTracingサービスのX-Rayを使って、LambdaのService MapやTraceを取得しつつ、DatadogのAPMに連携していきます。

## Table of Contents

```toc

```

## AWS X-Ray とは何ですか。

[公式サイト](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html)によると

> AWS X-Ray はアプリケーションが処理するリクエストに関するデータを収集するサービスです。
> 
> データを表示、フィルタリング、洞察を取得して問題の識別や最適化の機会を識別するために使用するツールを提供します。
> 
> アプリケーションに対するトレース対象のリクエストの場合、リクエストとレスポンスに関する情報だけではなく、アプリケーションがダウンストリーム AWS リソース、マイクロサービス、データベース、および HTTP ウェブ API に対して行う呼び出しの詳細な情報も表示できます。

とのことです。

難しいですね・・。もう少し簡単に言ってみると

**アプリケーション**が**AWSのサービス(DynamoDBとかS3とか)と通信したり**、**外部サービスのAPIをコールしたり**するリクエストとレスポンスを**収集**し、**記録**し、良き感じに**可視化**してくれるサービスです。

このようなサービスのことをTracingとか言ったりします。

実は、X-Rayをお勉強する前に、この手のサービス(Tracing)の基本を押さえる必要があると思い、お正月に[GoのEchoでJaegerを使ってボトルネックを調査する](https://blog.tubone-project24.xyz/2019/1/3/go-jaeger)という記事を書いてました。

X-Rayからは若干離れますが、[OpenTracing](https://opentracing.io/)な情報を知りたい方は上記も読んでみてくださいませ。

さて、話をX-Rayに戻すと、X-Rayを使うと**Tracing**と

![img](https://i.imgur.com/CSr8mCd.png)

**Service Map**を作ることができます。

![img](https://i.imgur.com/Fs498Yd.png)

今回はService Mapで監視するような多段でマイクロサービスなアーキテクチャの監視はしませんが、さっそく、X-RayでLambdaのリクエストをTracingしていきましょう！

## X-Rayを使う for Lambda (Python)

LambdaはPythonで作っていくことにします。

X-Rayを使うには、X-Rayクライアントをソースコード上で使えるようにするため、X-Rayを入れた**Lambda Layer**を作っていきます。(ついでに使うのでRequestsも入れちゃいます。)

ローカル上で

```bash
mkdir python

pip install requests -t python/

pip install aws-xray-sdk -t python/
```
