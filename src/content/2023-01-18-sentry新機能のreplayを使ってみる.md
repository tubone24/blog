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

みなさん、[Sentry](https://sentry.io)使ってますか？(長嶋茂雄)

[Sentry](https://sentry.io)はエラートレーシング、パフォーマンス監視ツールとして(特にフロントエンドで)かなりデファクトスタンダードになりつつあります。

かくいうこのブログもSentryめっちゃ使ってます。ありがとうございますSentry様。

主にエラー監視とパフォーマンス計測いとして使ってますが、その模様は[下記記事](https://blog.tubone-project24.xyz/2023/01/01/this-blog#sentry)をご確認ください。

ちなみに私が初めてSentryを触ったのは[2019年らしい](https://blog.tubone-project24.xyz/2019/09/22/sentry)ですね。当時はVue.js書いてたんですね...。懐かしい...。

## Session Replay

今回は年末くらいにBeta版になっていた[Sentry](https://sentry.io)の新しい機能(まだBeta版で、wait listに登録が必要です)の[Session Replay](https://sentry.io/for/session-replay/)を検証していきます。

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

![beta](https://i.imgur.com/VZ1rCxu.png)

このブログは[Gatsby.js](https://www.gatsbyjs.com/)でできているので[React版のSentry](https://docs.sentry.io/platforms/javascript/guides/react/)でReplay機能が使えそうですが、自分の場合、browser処理をjsxで書かず、後述するgatsby-browser.jsで自前で[@sentry/browser](https://www.npmjs.com/package/@sentry/browser)で実装しているので[@sentry/browser](https://www.npmjs.com/package/@sentry/browser)で実装していきます。

![install](https://i.imgur.com/GsVnFR4.png)

利用に特に追加のライブラリのインストールはいりませんが、 [@sentry/browser](https://www.npmjs.com/package/@sentry/browser)を最低**7.27.0**以上にアップグレードする必要がありそうです。

とりあえず最新版にアップグレードすればよさそうです。

```shell{promptUser: tubone}{promptHost: dev.localhost}
yarn upgrade @sentry/browser --latest
```

検証時点で7.31.1がインストールされました。

Gastby.jsの場合、SSGせずブラウザ側で処理したいものは[gatsby-browser.js](https://www.gatsbyjs.com/docs/reference/config-files/gatsby-browser/)に定義します。

元々パフォーマンス検証のために[@sentry/tracing](https://docs.sentry.io/product/sentry-basics/tracing/)もインストールしてますが、sesson replay用の設定をいくつかしていきます。

replaysSessionSampleRate、replaysOnErrorSampleRateにはそれぞれ適当0.1, 1.0を入れてます。

エラーが起きた時のキャプチャはしっかり取りたいので1.0、その他はサンプリングしてくれて構わないので0.1になってます。完全に適当な値なので運用してみてチューニングしていきます。

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

実装できたので早速環境にデプロイして確認していきましょう。

## 実際にうごかしてみた

特にブログをいじっていて自分の環境でエラーがでなかったので、(~~優秀~~)しばらくガチャガチャしていたらサンプリングの方でReplayになにか入ってきました。わくわく。

![list](https://i.imgur.com/UdSz3qc.png)

おお〜！[こいつ・・・動くぞ！](https://dic.nicovideo.jp/a/%E3%81%93%E3%81%84%E3%81%A4%E3%83%BB%E3%83%BB%E3%83%BB%E5%8B%95%E3%81%8F%E3%81%9E%21)

![douga](https://i.imgur.com/ajPwE2R.gif)

特にエラーが出てないのでただのサンプリング結果ですが、確かにユーザーの操作が手にとるように動画でわかります。これはすごいっすね。

![ims](https://i.imgur.com/pioUHQ4.png)

Console、Networkも見てみました。

ただのSSGの画面なので画面遷移時のリクエストしかでてませんね...。もうちょっとバックエンドと通信するようなアプリケーションだときっと楽しそうです。

![nw](https://i.imgur.com/THPTtHj.png)

いいな〜と思った機能でどうやらヒープメモリも取ることができるっぽいです。

メモリリークを見つけるのに役立ちそうですね！

（このブログmemlabをCIで実行しているので、結果と比較しながらメモリリークを対応する、みたいな記事書きたいですね！！！）

![memory](https://i.imgur.com/OjIozWD.png)

## 気になったこと

自分の環境だけなのか、はたまた日本語に対してなのか文字列がすべてマスキングされてしまいました...。

別にブログなので公開情報ばっかりなんですけどね...。

![mask](https://i.imgur.com/WPkRn1L.png)

これはどういった挙動なのかわかっていないので今後調査していきたいと思います。

## 結論

もうちょっと運用してみて、どんなことができるかをまとめる必要はありますが、なんかすごい〜！ということがわかりました。

蛇足ですが私はこういったトレーシング系のツールが大好きです。[AWS X-RayでLambdaのトレースをしつつ、Datadog APMに連携する](https://blog.tubone-project24.xyz/2020/1/20/x-ray-datadog)とか[GoのEchoでJaegerを使ってボトルネックを調査する](https://blog.tubone-project24.xyz/2019/1/3/go-jaeger)とか、結構興味があります。

Sentryにはまだ[Profiling](https://docs.sentry.io/product/profiling/)とか[Cron Monitoring](https://docs.sentry.io/product/crons/)とか私がまだ使いきれてない機能がたくさんあるので時間見つけて検証していきたいと思います。
