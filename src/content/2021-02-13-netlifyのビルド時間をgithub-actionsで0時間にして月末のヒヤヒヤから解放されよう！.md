---
slug: 2021/02/13/netlify-github-action
title: Netlifyのビルド時間をGitHub Actionsで0時間にして月末のヒヤヒヤから解放されよう！
date: 2021-02-13T01:21:49.294Z
description: Netlifyは便利ですが無料枠だと月のビルド時間が300分なので超過しないように神経を使います。GitHub
  Actionsを使えばそんな悩みから解放されるのでご紹介します。
tags:
  - JavaScript
  - Netligy
  - Gatsby.js
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

日々の喧噪から解放されたい。

## Table of Contents

```toc

```

## Netlify

みなさんもご存じ超便利ありがたサービスNetlifyですが、無料で使ってる貧民には毎月とある悩みがでてきます。

*今月のビルド時間は残り○○分*

![img](https://i.imgur.com/TSm24w0.png)

NetlifyはGitHubのレポジトリと連携して、フロントのビルドを実行した上で、デプロイするという超便利機能があるのですが、このビルドを回すのに時間の制約があり、

無料民だと月300分となっております。(それ以上は月xドル課金すれば問題なく使えます。課金も経験済み)

300分あれば大丈夫そう、とそう思う気もしなくなくなくなくなくもないですが、複数レポジトリにわたってNetlifyを使っていたり、Gatsby.jsで画像をたくさん使っていてsharpのリサイズに時間がかかったり、dependabotで定期的にPRが出てpreview deployが発生したりすると
案外ぎりぎりだったりします。

![img](https://i.imgur.com/y7ixbEG.png)

なので、私のような貧民は月末になると、Netlifyのビルド時間が気になってこのブログの記事を書かなくなったり、サイトリファクターのペースが落ちてしまいます。

特にブログ更新は顕著で、例えば今書いている記事も通勤の電車の中でスマホから書いているわけなので、細かくコミットを打って保存したいのですが、コミットを打ってプッシュしてしまうと、ビルドが走ることになるので、WIPでのコミットが億劫になり、結果的に家のようなまとめてプッシュできるような作業スペースがある場所でないと、
ブログを書かなくなってしまいました。

## この悩みGitHub Actionsにお任せください

ということでこの悩み、GitHub Actionsで解決してみたいと思います。

なんか工務店のCMみたいな表現になってしまいました。

`youtube:https://www.youtube.com/embed/DHH1Fhi9qcs`

## Netlifyのビルド時やっていることを洗い出して代替する

基本的にNetlifyがビルド時やってることは、例えばGatsby.jsであれば、gatsby buildコマンドを実行し、特定のディレクトリーに配置されたビルド済みJSをデプロイする動きなので、
それをそっくりGitHub Actionsに移行すればいいのですが、Netlifyがビルド済みJSに対して後処理を実行してるパターンもあります。

私の場合、JSやイメージを最適化してくれるAsset optimizationとFormタグに属性をつければ勝手にFormを作ってくれるForm detectionの二つが設定されていましたのでそれぞれまず無効化します。

![img](https://i.imgur.com/ytjbJQA.png)

![img](https://i.imgur.com/LfL70Br.png)


