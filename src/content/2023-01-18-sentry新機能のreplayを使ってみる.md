---
slug: 2023/01/18/sentry-replay
title: Sentry新機能のSession Replayを使ってみる
date: 2023-01-18T14:53:12.367Z
description: とりあえずこのブログを人柱にして年末年始にBeta版が出たSentry新機能のSession Replayを使ってみます。
tags:
  - Sentry
  - tracing
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
## Table of Contents

ずっと年末年始に気になっていた機能でしたが、そろそろ気になってきたので検証します。

```toc

```

## Sentry

みなさん、Sentry使ってますか？(長嶋茂雄)

Sentryはエラートレーシング、監視ツールとして(特にフロントエンドで)かなりデファクトスタンダードになりつつあります。

かくいうこのブログもSentryめっちゃ使ってます。ありがとうございますSentry様。

主にエラー監視とパフォーマンス計測いとして使ってますが、その模様は[下記記事](https://blog.tubone-project24.xyz/2023/01/01/this-blog#sentry)をご確認ください。

## Session Replay

今回はSentryの新しい機能(まだBeta版で、wait listに登録が必要です)の[Session Replay](https://sentry.io/for/session-replay/)を検証していきます。

そもそもSession Replayとはなんぞや？ということで、公式のページを確認すると

> Sentry's Session Replay provides a video-like reproduction of user interactions on a site or web app, giving developers the details they need to resolve errors and performance issues faster. All user interactions - including page visits, mouse movements, clicks, and scrolls - are captured, helping developers connect the dots between a known issue and how a user experienced it in the UI.
> 
> Sentryのセッションリプレイは、サイトやウェブアプリでのユーザーとのやりとりをビデオのように再現し、エラーやパフォーマンスの問題を迅速に解決するために必要な詳細を開発者に提供します。ページの訪問、マウスの動き、クリック、スクロールなど、すべてのユーザーインタラクションがキャプチャされ、開発者は既知の問題とユーザーがUIでどのようにそれを体験したかという点を結びつけるのに役立ちます。

ということらしいです。エラーが出た時のユーザーの操作がビデオのように確認できる、ということですかね。すごいですね。

公式のデモ動画も有りました。ポケモンを捕まえるアプリでエラーをSentryでキャッチしてそのReplayをデモしてます。

https://www.youtube.com/watch?v=sZwMmiwBwho&t=533s&ab_channel=Sentry

![demo1](https://i.imgur.com/og3l3dy.png)

動画の中ではとあるユーザーがミュウを捕まえたときにundefinedに対してmapを処理する処理が入ってしまったようで画面がホワイトアウトしてしまうエラーが発生ししてましたが、通常のトレーシングだとその耐意見がわかりにくいのでエラーの重要性がわからないということが問題になってました。

![demo2](https://i.imgur.com/s3r6CdD.png)

Session Replayを使うとユーザーのインタラクションが動画で再現できるので体験が追いやすいとのこと。

![demo3](https://i.imgur.com/ZG3GBdw.png)

Networkやconsole logも確認できるのでまるでローカルでDevtoolsを開いてデバッグしているかの如く、確認ができることをデモってました。

![demo3](https://i.imgur.com/zr3fCX6.png)

ユーザーの名前などセンシティブな情報にはSentry側で自動でマスキングもしてくれるようです。安心してプロダクトに導入できそうです。

## さっそく導入してみた

自分のSentryアカウントはBeta版でSession Replayが使える状態になっていたので早速使ってみます。

このブログはGatsby.jsでできているのでReact版のSentryでReplay機能が使えそうです。

![install](https://i.imgur.com/GsVnFR4.png)

利用に特に追加のライブラリのインストールはいりませんが、 @sentry/browserを最低**7.27.0**以上にアップグレードする必要がありそうです。

とりあえず最新版にアップグレードすればよさそうです。

```shell{promptUser: tubone}{promptHost: dev.localhost}
yarn upgrade @sentry/browser --latest
```

検証時点で7.31.1がインストールされました。

Gastby.jsの場合、SSGせずブラウザ側で処理したいものはgatsby-browser.jsに定義します。

元々パフォーマンス検証のために@sentry/tracingもインストールしてますが、replay用の設定をいくつかしていきます。

replaysSessionSampleRate、replaysOnErrorSampleRateとりあえず適当に入れてますが、エラーが起きた時のキャプチャはしっかり取りたいので1.0、その他はサンプリングしてくれて構わないので0.1になってます。適当な値なので運用してみてチューニングしていきます。

プラスでintegrationsに`new Sentry.Replay()`を設定すればReplay機能が有効になるっぽいです。

```javascript
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

  Sentry.init({
    dsn: "https://xxxxxxxx@sentry.io/xxxxx",
    release: `tubone-boyaki@${process.env.GATSBY_GITHUB_SHA}`,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Integrations.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 1.0,
  });
```

早速環境にデプロイして確認していきましょう。

## 実際にうごかしてみた

特にブログをいじっていて自分の環境でエラーがでなかったので、しばらくガチャガチャしていたらReplayになにか入ってきました。わくわく。

![list](https://i.imgur.com/UdSz3qc.png)

おお〜！こいつ・・・動くぞ！

![douga](https://i.imgur.com/ajPwE2R.gif)

特にエラーが出てないのでただのサンプリング結果ですが、確かにユーザーの操作が手にとるように動画でわかります。これはすごいっすね。

![ims](https://i.imgur.com/pioUHQ4.png)

Networkも見てみました。ただのSSGの画面なので画面遷移時のリクエストしかでてませんね...。もうちょっとバックエンドと通信するようなアプリケーションだときっと楽しそうです。

console logなんかも確認できました。

![nw](https://i.imgur.com/THPTtHj.png)

メモリも取ることができるっぽいです。メモリリークを見つけるのに役立ちそうですね！（このブログmemlabをCIで実行しているので、結果と比較しながらメモリリークを対応する、みたいな記事書きたいですね。）

![memory](https://i.imgur.com/OjIozWD.png)

## 結論

もうちょっと運用してみて、どんなことができるかをまとめる必要はありますが、なんかすごい〜！ということがわかりました。
