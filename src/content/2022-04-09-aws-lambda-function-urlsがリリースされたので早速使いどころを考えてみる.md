---
id: ""
slug: 2022/04/09/lambda-urls
title: AWS Lambda Function URLsがリリースされたので早速使いどころを考えてみる
date: 2022-04-09T02:50:46.360Z
description: AWS Lambda Function URLsがリリースされ、ますますLambdaが便利になりますが、何に使おっか..という意見もちらほら？
tags:
  - AWS
  - Lambda
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
花粉

## Table of Contents

```toc

```

## AWS Lambda Function URLs

[AWS Lambda Function URLs](https://aws.amazon.com/jp/about-aws/whats-new/2022/04/aws-lambda-function-urls-built-in-https-endpoints/)がリリースされました！！

今まではLambdaを使ってHTTPのエンドポイントを作る際は[mazon API Gateway](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-apigateway.html)と組み合わせて作るか[アプリケーションロードバランサー(ALB)のターゲットにAWS Lambdaを選ぶ](https://aws.amazon.com/jp/blogs/news/lambda-functions-as-targets-for-application-load-balancers/)かいずれかが必要でした。

今回のアップデートでAWS Lambdaサービスの組み込み機能として、HTTPSエンドポイントをLambda単体で作成することができるのでLambdaでAPIを作ったりWebhookの連携先として機能させる際にAPI Gatewayなどをかませる必要がなくなり便利かと思います。

## 確かに便利ではありますが...































