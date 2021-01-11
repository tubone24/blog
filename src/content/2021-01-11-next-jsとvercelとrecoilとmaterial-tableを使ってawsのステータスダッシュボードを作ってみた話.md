---
slug: 2021/01/11/vercel-next
title: Next.jsとVercelとRecoilとMaterial Tableを使ってAWSのステータスダッシュボードを作ってみた話
date: 2021-01-11T13:20:51.060Z
description: Next.jsとVercelとRecoilとMaterial
  Tableを使ってAWSのステータスダッシュボードを作ってみた話です。残念ながらRecoilはうまく使えませんでしたが。
tags:
  - JavaScript
  - Next.js
  - Vercel
  - Recoil
headerImage: https://i.imgur.com/XblRysI.png
templateKey: blog-post
---
腰が痛い

## Table of Contents

```toc

```

## AWSのステータス確認難しいよね

AWSを使ったことのある人ならばわかると思いますが、公式がAWSの障害情報を掲載する[AWS Service Health Dashboard](https://status.aws.amazon.com/)があまり使いやすくないです。

![img](https://i.imgur.com/XghDulZ.png)

それぞれのリージョンの障害がRSSで配信される形式になっているのですが、わざわざRSSを登録するのもめんどくさいし、Slackとかの連携に乗っけるのもそれはそれで便利なのですが、そもそもSlackを見ていないほかの人でも障害情報を共有したいです。

実は、AWS Service Health Dashboardの情報はJSONで取得することができます。

<https://status.aws.amazon.com/data.json>

こちらのJSONを活用して勉強がてら使いやすいダッシュボードを作っていきます。

## クビになるぞ！

最近、これといった新しい技術に触れておらず、このままだとクビになりそうなので、そろそろ重い腰を上げてNext.jsを勉強することにしました。

また、Next.jsを使う場合はVercelが便利だよーとのことですので、こちらも使っていきます。

## Next.js

Next.jsでは/api配下に格納したコードについては、サーバーサイドとして振る舞います。

クライアントから直接status情報がかかれたJSONを読みとってもよかったのですが、HTMLの面倒なサニタイジング処理など面倒なことはサーバーサイドに持ってこようということで、
statusJSONを取得して、フロントに返却するサーバーコードを書いていきます。

次のようなコードになりました。

コード

注意点として、必ずハンドラーはexport defaultを指定してあげないこと以外はいたって直感的なコードとなっております。

Vercelに載っけるとわかるのですが、こちらのコード、Lambdaにデプロイされることになります。たしかに見覚えある感じですね。

また、Next.jsと関係ないのですが、axiosのレスポンスに型がつけられるって知ってましたか？

## Material Table

Material UI準拠のテーブルとして、Material Tableなるものがありましたので今回採用することにしました。

コード

使い方もシンプルかつ比較的高機能でいい感じです。いい感じですが後述するRecoilとの相性問題とDatetimeの扱いが微妙なのがツラミでした。

## Recoil

Recoilとは
