---
slug: 2021/02/13/netlify-github-action
title: Netlifyのビルド時間をGitHub Actionsで0時間にして月末のヒヤヒヤから解放されよう！
date: 2021-02-13T01:21:49.294Z
description: Netlifyは便利ですが無料枠だと月のビルド時間が300分なので超過しないように神経を使います。GitHub
  Actionsを使えばそんな悩みから解放されるのでご紹介します。
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

画像

NetlifyはGitHubのレポジトリと連携して、フロントのビルドを実行した上で、デプロイするという超便利機能があるのですが、このビルドを回すのに時間の制約があり、

無料民だと月300分となっております。(それ以上は月xドル課金すれば問題なく使えます。課金も経験済み)

300分あれば大丈夫そう、とそう思う気もしなくなくなくなくなくもないですが、
