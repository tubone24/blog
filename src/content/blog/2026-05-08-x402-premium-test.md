---
slug: 2026/05/08/x402-premium-test
title: "x402ペイウォール テスト記事（プレミアムコンテンツ）"
date: 2026-05-08
description: "x402プロトコルを使ったペイウォール実装のテスト記事。Base Sepoliaテストネットで課金ゲートの動作確認用。"
tags:
  - x402
  - ペイウォール
  - テスト
headerImage: /images/blog/langfuse_v4_new.png
templateKey: blog-post
useAi: false
premium: true
priceUsd: 0.05
---

これはプレミアムコンテンツのティーザー部分です。ここまでは無料で閲覧できます。

x402プロトコルを使ったペイウォールのテスト記事です。この記事では、AIエージェントが自動決済できるペイウォールの仕組みを解説します。

<!-- paywall -->

## プレミアムコンテンツ（ここからが有料部分）

ここからは課金後に表示されるフルコンテンツです。

## x402プロトコルとは

x402はHTTP 402ステータスコードを活用したペイメントプロトコルです。AIエージェントやx402対応クライアントが自動決済できる仕組みを提供します。

## 実装の詳細

### サーバーサイド

Express + `@x402/express` ミドルウェアを使ってペイウォールを実装しています。

```javascript
import { paymentMiddleware, x402ResourceServer } from "@x402/express";

app.use(paymentMiddleware(
  {
    "POST /premium-content": {
      accepts: [{
        scheme: "exact",
        price: "$0.05",
        network: "eip155:84532",
        payTo: process.env.WALLET_ADDRESS,
      }],
    },
  },
  resourceServer
));
```

### クライアントサイド

Paywallコンポーネントがx402フローを処理し、決済後にpagecryptで暗号化されたHTMLを復号します。

## まとめ

x402プロトコルは、AIエージェント時代の新しいマイクロペイメントの仕組みです。
