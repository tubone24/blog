---
slug: 2017/06/16/grafana
title: Grafana&World Ping を活用して簡単な死活監視をしてみよう
date: 2017-06-15T22:53:28.047Z
description: Grafana&World Ping を活用して簡単な死活監視をしてみよう
tags:
  - 監視
  - Grafana
  - World Ping
headerImage: https://i.imgur.com/iLyWtZb.png
templateKey: blog-post
---
どうも。GrafanaのUIは結構かっこいいことで有名で、自身もZabbix APIを活用してZabbixのメトリックをGrafanaで見れるようにしております。

![img](https://i.imgur.com/N2pDM5D.png)

こんな感じ。Zabbixのスクリーンと全く同じ内容ですが、妙に「監視している感」がありますね。

## Table of Contents

```toc

```

## ZabbixのデータはZabbixで見ればいいのでは？

はい。おっしゃるとおりです。そもそもそんな監視するほど重要なものがあるかと言われると。。

でも、Grafanaにはもっと手軽にかっこいい画面を見る方法があります。

## GrafanaのWorld Pingを使ってみよう

Grafanaの優秀な点はPlugin機能で簡単にデータソースやパネルを追加できる点です。

もともと、GrafanaはInfluxDBの可視化用みたいな位置づけっぽいですが、データソースプラグインを追加することで、例えばElasticsearch・Graphiteや、CloudWatch、さらにはkubernetesやDatadogなどのコンテナの監視までできるという優れものです。

また、データソースではないですが、World Pingという世界中のエンドポイントからPing・DNS・HTTPなどの死活監視を提供するサービスと連携させることで、簡単にかっちょいい画面を作ることができます。

![img](https://i.imgur.com/4puZFgk.png)

こんな感じで好きなプラグインをコマンド一発でインストールできます。

## インストールしてみる

まず、Grafanaの入ったサーバーでrootユーザーで

```
grafana-cli plugins install raintank-worldping-app
```

こうすることで、簡単にプラグインが導入されます。

## Grafana.net APIを取得しWorld Pingが利用できるようにする


![img](https://i.imgur.com/3jpOIzC.png)

Grafana Web画面の左側のメニューに「World Ping」が表示されていると思いますのでPlugin Configから、Grafana.netのAPIを発行しましょう。

こうすることでWorld Pingが利用できます。無茶な監視をしない限り、無料版で事足りると思います。

## エンドポイントを追加する

監視対象のIPまたはドメイン名をエンドポイントと呼んでますが、エンドポイントを設定していきます。

同じく、Grafana Web画面の左側のメニューに「World Ping」⇒「Endpoints」と進みます。

エンドポイントは無料版だと最大3つです。

![img](https://i.imgur.com/JVyAD6w.png)

このようにEndpointにドメイン名を設定し、監視したいサービスを選びConfigureを押します。

![img](https://i.imgur.com/XCXFfBk.png)

細かい設定等でてきますから、設定していきます。

監視間隔、死活監視を投げるインスタンスの国、ポート、HTTPメソッドなど細かく設定できます。

また、閾値を超えた場合に決められたメールに通知することもできます。(あらかじめメールサーバーの設定をGrafana.iniでしておきます。)

一応、無料版だと600万回/月しか監視できないようなので無茶な設定はやめましょう。

アップデートボタンを押せば、設定が完了します。

## 画面を見る

World Pingがすごいのは、あらかじめGrafana画面を提供している点で、設定さえすればすぐ可視化できることです。

同じく、Grafana Web画面の左側のメニューに「World Ping」⇒「World Ping Home」と進むと、設定したエンドポイントが表示されますので

エンドポイント名もしくはハートマークのサービス名をクリックすると画面が表示されます。

![img](https://i.imgur.com/iLyWtZb.png)

かっちょええ。
