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
