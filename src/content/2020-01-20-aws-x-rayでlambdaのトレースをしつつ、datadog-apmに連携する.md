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

### Lambda Layerを作って利用できるようにする

X-Rayを使うには、X-Rayクライアント(<https://github.com/aws/aws-xray-sdk-python>)をソースコード上で使えるようにするため、X-Rayを入れた**Lambda Layer**を作っていきます。

ローカル上で

```bash
mkdir python

pip install aws-xray-sdk -t python/

zip -r python.zip python/
```

としてX-Ray Client入りの**python.zip**を作ります。

そして、AWSコンソールのLambda Layersからアップロードします。

![img](https://i.imgur.com/iyjRI2u.png)

作ったLambda LayerはLambda関数にアタッチ(マージ)することで利用できるようになります。

Lambdaで外部APIをたたくため、[Requests](https://requests-docs-ja.readthedocs.io/en/latest/)のLambda Layerも作ってアタッチしてます。

![img](https://i.imgur.com/ho3V22u.png)

### Pythonコード実装

PythonでX-RayのTracingを使うには大きく2種類の方法があります。

- xray_recorder
- patch

xray_recorderはPython関数にデコレータとして設定することで、関数のIn/Outをキャプチャすることができます。

patchはRequestsやBoto3などいくつかライブラリをpatchして、リクエストをTracingします。
今回はめんどくさいのでpatch対応しているライブラリに全部patchするpatch_allを使います。


```python
from aws_xray_sdk.core import xray_recorder # デコレータをつけた関数をキャプチャ
from aws_xray_sdk.core import patch_all # boto3やrequestsにX-Rayパッチを適用し、監視する

patch_all() # X-Rayパッチ

@xray_recorder.capture("hoge_function") # 関数キャプチャ
def hoge_function(hogeeee, hogeeee):
    hogehoge_logic(hogeeee)
```

さぁ、Lambdaのコードを無事に書き終えたらLambdaをデプロイして終わりです。

今回は手でLambdaを作りましたので、特にCIな話題はないです。すみません。

LambdaのコンソールからX-Rayを有効化することを忘れずに

![img](https://i.imgur.com/5MzpyAw.png)
