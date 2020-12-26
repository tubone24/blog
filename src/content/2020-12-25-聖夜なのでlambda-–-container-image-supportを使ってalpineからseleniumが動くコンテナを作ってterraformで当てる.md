---
slug: 2020/12/25/selenium-lambda-container
title: Lambda – Container Image Supportを使ってAlpineからSeleniumが動くコンテナを作ってTerraformで当てる
date: 2020-12-25T14:58:26.302Z
description: 最近サポートされたLambdaのContainer Image Supportを使って、Seleniumを動かしてみます。ついでにTerraform化します。
tags:
  - AWS
  - Lambda
  - Selenium
  - Terraform
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
寂しいクリスマスです。

## Table of Contents

```toc

```

## Lambda – Container Image Support

12/1 Lambdaの**コンテナイメージサポート**が発表されました。

とはいえ、正直カスタムランタイムをしたい気持ちもないし、発表当初はあまり注目してなかったのですがとある思いつきをしました。

**Selenium載っける運用なら案外使い勝手いいかもしれない？**と。

## コンテナサポートで何がうれしいの?

色々メリットあると思いますが、思うに

- イメージは10GBまでデプロイできる
- Lambda Runtime Interface Emulatorを使ってローカルで実行できる

の2点だと思います。Seleniumでそんなに容量使うのか？問題はありますが、機会学習の推論をLambdaで実行させる、とかだとCライブラリ依存関係に苦しめられる煩わしいパッケージ導入もなくなるのでもしかしたら使えるのかもですね。

## LambdaでSeleniumと言えばserverless-chromeですが

LambdaでSeleniumを動かすと言えばつい最近まで[serverless-chrome](https://github.com/adieuadieu/serverless-chrome)が有名です。

ようはLambdaのZIPパッケージ制限(一昔前はアップロード10MB, S3経由200MBだった)に引っかからないくらい小さくしたChromeをSeleniumのランナーから動かすわけです。

とはいえ、環境構築で一癖も二癖もあるserverless-chromeなので、今回は普通のChromeをheadless起動させるDockerコンテナを作ってそれをLambdaで起動していきましょう！

## 今回やりたいこと、というか課題

話は変わりますが弊社にはSlackのWorkSpaceが乱立してます。

さらに勤怠連絡もSlackに書き込むのですが乱立したWorkSpaceにすべて書き込むのはちょっとめんどくさいです。

じゃあ、Slack APIとか使って解決すればいいじゃんとなりそうですが、一部のWorkSpaceはセキュリティーの観点から外部連携が禁止とのこと。なんじゃそりゃ...。

![img](https://i.imgur.com/odKSxHU.png)

そこで、セキュア(笑)なSlackのスクリーンショットを取り、普段使っているSlackへ投稿する仕組みにすればまぁ楽でしょう！ということで作っていきます。

## Alpine Python:3.7

軽量イメージで有名なAplineをベースイメージにします。

はい、この選択肢はとある理由で間違いでした、がそれはこの先わかることです。

軽いから使う、という安直極まりない選定で言ってしまったのが後々後悔となりますので、皆さん、ちゃんと調べましょう。

### Container Supportを使うにはRICが必要

Lambdaは起動する際に基板側からAWS Lambda ランタイム APIでキックされることで実現してます。

そうです。Container Supportでもこいつを受け取らないといけないのです。

なので単純に起動するコンテナイメージを作るだけじゃLambdaには載っけられないので、AWS Lambda Runtime Interface Clients(RIC)というOSSがAWSから提供されてます。例えばPythonであれば[AWS Lambda Python Runtime Interface Client
](https://github.com/aws/aws-lambda-python-runtime-interface-client)があります。

こいつがやっかいでした。[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)にも書いてありましたが