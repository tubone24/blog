---
slug: 2020/12/25/selenium-lambda-container
title: 聖夜なのでLambda – Container Image
  Supportを使ってAlpineからSeleniumが動くコンテナを作ってTerraformで当てる
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

