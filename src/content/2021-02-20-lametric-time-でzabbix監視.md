---
slug: 2017/09/25/lametric
title: LaMetric Time でZabbix監視
date: 2017-09-25T13:06:27.976Z
description: ネットとつながる LED 時計
tags:
  - LaMetric
  - おうちハック
  - zabbix
headerImage: https://i.imgur.com/kExy4vG.jpg
templateKey: blog-post
---
## Table of Contents

```toc

```

## ネットとつながる LED 時計

LaMetricを買いました。

![img](https://i.imgur.com/kExy4vG.jpg)

かっこいい！

Gmailとか、天気とか、RSSとか受信してお知らせしてくれます！


## Zabbixの監視用アプリ作ってみた。

LaMetricのデベロッパーサイトは[こちら](https://developer.lametric.com/)

自作のZabbix AlertスクリプトからLaMetricのアプリをPushすることで通知します。

[AlertScriptはGitHubにアップしています。](https://github.com/tubone24/lametric_zab)

こんな感じ。

![img](https://i.imgur.com/e4yqppL.jpg)


アプリ自体は非公開なので、（Zabbixのアイコンは公開しました）自分で作ってみてください。
