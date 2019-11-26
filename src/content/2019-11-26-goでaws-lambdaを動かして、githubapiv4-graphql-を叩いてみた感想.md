---
slug: 2019/11/26/go-lambda
title: GoでAWS Lambdaを動かして、GitHubAPIv4(GraphQL)を叩いてみた感想
date: 2019-11-26T11:31:35.438Z
description: 急遽Goで開発することになったので慌てて技術検証の巻
tags:
  - Go
  - Lambda
  - AWS
  - GraphQL
  - GitHub
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# やらねば。（風立ちぬ）

案件でGoを使った開発にシフトしつつあるので必死こいて勉強してるわけですが、AWS LambdaをGoで実装したことがなかったのでちょっと触ってみました、というお話。

## AWS LambdaがGoで動くことを知ってますか？

知っている人も多いと思いますが、2018年のReinvent(AWSのカンファレンスイベント)でLambdaに関するアップデートの中でGoで動くようになったよ～というのがありました。

Lambda自体は、裏側の基盤にFire Clackerを導入したことがきっかけで、集約化と安全性がめちゃんこあがったので、タイムアウトが長くなったり、カスタムランタイムに対応したりと一気に進化したイメージがありましたが、いまだにPythonか、Node.jsで書くかしかして無かったです。（怠け）

仕事上使う機会に恵まれたので今回初めて触ることにしました。

## 今回の開発スコープ

今回はお勉強というか、感触をつかむためにやるだけなのでちゃんとしたサービスは作りません。

別件でGitHub API（GraphQL）を触る必要もあったのでまとめてやってしまいます。

### やること

- main.goのみ
  - RepositoryとかModelとかUsecaseとかそういうのは作らないよ

- GitHub APIv4 GraphQLを使うよ
  - とりあえず自分の公開されてるレポジトリの使用言語を一覧取るよ

- 手でビルドし、手でデプロイするよ

## GraphQLをGoで叩く

Goはまぎれもなくサーバーサイドな言語なのでどちらかというと関心事がGraphQLで返すという感じではありますが、ちゃんとGraphQLクライアントみつけました。

（リンク）

さらに、GitHubAPI専用のクライアントも見つけましたのでこっちを使うことにします。
