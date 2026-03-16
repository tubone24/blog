---
slug: 2020/1/20/x-ray-datadog
title: AWS X-RayでLambdaのトレースをしつつ、Datadog APMに連携する
date: 2020-01-20T14:08:11.212Z
description: "AWS X-RayでLambda（Python）のリクエストをトレースし、Datadog APMに連携する方法を解説。Lambda Layerの作成、xray_recorderデコレータとpatch_allの使い方、DatadogのAWS Integration設定からAPMモニター構築まで網羅します"
tags:
  - AWS
  - Lambda
  - X-Ray
  - Datadog
  - APM
headerImage: '/images/blog/WbF4DOc.png'
templateKey: blog-post
---
AWSのTracingサービスのX-Rayを使って、LambdaのService MapやTraceを取得しつつ、DatadogのAPMに連携していきます。

## Table of Contents

```toc

```

## AWS X-Ray とは何ですか。

[公式サイト](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html)によると、

> AWS X-Ray はアプリケーションが処理するリクエストに関するデータを収集するサービスです。
> 
> データを表示、フィルタリング、洞察を取得して問題の識別や最適化の機会を識別するために使用するツールを提供します。
> 
> アプリケーションに対するトレース対象のリクエストの場合、リクエストとレスポンスに関する情報だけではなく、アプリケーションがダウンストリーム AWS リソース、マイクロサービス、データベース、および HTTP ウェブ API に対して行う呼び出しの詳細な情報も表示できます。
> 
> <site>[公式Doc AWS X-Ray とは何ですか。](https://docs.aws.amazon.com/ja_jp/xray/latest/devguide/aws-xray.html)</site>

とのことです。

難しいですね・・。もう少し簡単に言ってみると、

**アプリケーション**が**AWSのサービス(DynamoDBとかS3とか)と通信したり**、**外部サービスのAPIをコールしたり**するリクエストとレスポンスを**収集**し、**記録**し、良き感じに**可視化**してくれるサービスです。

このようなサービスのことを**Tracing**とか言ったりします。

実は、X-Rayをお勉強する前に、この手のサービス(Tracing)の基本を押さえる必要があると思い、お正月に[GoのEchoでJaegerを使ってボトルネックを調査する
](https://tubone-project24.xyz/2019/1/3/go-jaeger)という記事を書いてました。

X-Rayからは若干離れますが、[OpenTracing](https://opentracing.io/)な情報を知りたいほうは上記も読んでみてくださいませ。

さて、話をX-Rayに戻すと、X-Rayを使うと**Tracing**と、

![AWS X-Rayのトレーシング画面でリクエストの時系列を表示](/images/blog/CSr8mCd.png)

**Service Map**を作ることができます。

![AWS X-RayのService Mapでサービス間の通信を可視化した画面](/images/blog/Fs498Yd.png)

今回はService Mapで監視するような多段でマイクロサービスなアーキテクチャの監視はしませんが、さっそく、X-RayでLambdaのリクエストをTracingしていきましょう！

## X-Rayを使う for Lambda (Python)

Lambdaは**Python**で作っていくことにします。

### Lambda Layerを作って利用できるようにする

X-Rayを使うには、X-Rayクライアント(<https://github.com/aws/aws-xray-sdk-python>)をソースコード上で使えるようにするため、X-Rayを入れた**Lambda Layer**を作っていきます。

ローカル上で、

```bash
mkdir python

pip install aws-xray-sdk -t python/

zip -r python.zip python/
```

としてX-Ray Client入りの**python.zip**を作ります。

そして、AWSコンソールのLambda Layersからアップロードします。

![Lambda Layersの画面でX-Ray SDKをアップロードする操作](/images/blog/iyjRI2u.png)

作ったLambda LayerはLambda関数にアタッチ(マージ)することで利用できるようになります。

Lambdaで外部APIをたたくため、[Requests](https://requests-docs-ja.readthedocs.io/en/latest/)のLambda Layerも作ってアタッチしてます。

![Lambda関数にX-RayとRequestsのLayerをアタッチした設定画面](/images/blog/ho3V22u.png)

### Pythonコード実装

PythonでX-RayのTracingを使うには大きく2種類の方法があります。

- xray_recorder
- patch

xray_recorderはPython関数に**デコレータ**として設定することで、関数のIn/Outをキャプチャできます。

patchは**Requests**や**Boto3**などいくつかライブラリをPatchして、リクエストをTracingします。
今回はめんどくさいのでpatch対応しているライブラリに全部Patchする**patch_all**を使います。


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

最後に、**LambdaのコンソールからX-Rayを有効化することを忘れずに**

![LambdaコンソールでX-Rayトレーシングを有効化するチェックボックス](/images/blog/5MzpyAw.png)

これで無事にX-Rayが利用できるようになりました。

Lambdaが動くことでTracingされます。

![X-RayでLambda実行のトレーシング結果が表示された画面](/images/blog/cpAdeXe.png)

Lambda単体なのでService Mapもショボいですができてます。

![Lambda単体のX-Ray Service Map表示](/images/blog/Y3aQ44O.png)

## Datadog APMと連携する

X-Rayは**Datadogにも連携可能**です。

早速Datadogに連携していきましょう。

### DatadogがアクセスするRoleのポリシー設定

DatadogがあなたのアカウントにIntegrationするRoleに**X-Rayの読み取り権限**を追加します。

追加するポリシーは以下です。

```javascript
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "XRay",
            "Effect": "Allow",
            "Action": [
                "xray:GetSamplingTargets",
                "xray:GetGroup",
                "xray:GetTraceGraph",
                "xray:GetServiceGraph",
                "xray:GetTimeSeriesServiceStatistics",
                "xray:GetEncryptionConfig",
                "xray:GetSamplingRules",
                "xray:GetGroups",
                "xray:GetTraceSummaries",
                "xray:GetSamplingStatisticSummaries",
                "xray:BatchGetTraces",
                "xray:PutEncryptionConfig"
            ],
            "Resource": "*"
        }
    ]
}
```

### DatadogのAWS Integrationを確認

DatadogのWebコンソールから、X-Rayを取得する設定が入っているか確認します。入っていなければチェックしてください。

![DatadogのAWS IntegrationでX-Ray収集を有効化する設定画面](/images/blog/XWhfj7x.png)

これでAPMからX-Rayが使えるようになります。次のメトリック取得でAPMにTracing関連が追加されているはず。


![Datadog APMにX-Rayのトレーシングデータが連携された画面](/images/blog/YxAhK5X.png)

### APMからTracing情報を確認する

Serviceからダッシュボードの形で、APMに送られてくるTracingをパパっと見ることができます。

![Datadog APMのServiceダッシュボードでトレーシング概要を表示](/images/blog/uRkRqqP.png)

細かくみると、こんな感じでAPMからRequestの内訳やレイテンシーが確認できるようになっているはずです。

![Datadog APMでリクエストの内訳とレイテンシー詳細を確認する画面](/images/blog/WbF4DOc.png)

Service MapもDatadogから確認できますが、こちらはAWSのコンソールのほうが見やすいですね。

![DatadogからX-RayのService Mapを確認した画面](/images/blog/cecuvOW.png)

### Monitorを設定する

APMのメトリックを使って、Monitorを作ることもできます。

例えば、P99のレイテンシーがxx秒を超えてきたらWarningなどにしておくと安心感あるかもですね。

![Datadog APMのメトリックを使ったMonitor設定画面](/images/blog/2FB3QjB.png)

## 結論

DatadogのAPMはLambda + X-Rayでも問題なく利用できる機能とわかりました。

もう少しX-Rayを使いこなせるように頑張りますね。Datadogを使った監視に興味がある方は[Sentryを使ったフロントエンドのエラー監視](/2019/09/22/sentry/)や[クロスルート証明書のSSL監視](/2020/06/01/ssl-cert/)もぜひご覧ください。
