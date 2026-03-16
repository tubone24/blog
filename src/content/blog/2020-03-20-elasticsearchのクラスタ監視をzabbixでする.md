---
slug: 2017/7/23/elasticsearch-zabbix
title: Elasticsearchのクラスタ監視をZabbixでする
date: 2017-07-22T16:59:14.751Z
description: "ZabbixでElasticsearchクラスタを監視するテンプレートの作り方を解説。外部スクリプトの配置からテンプレートのインポート、マクロ設定、forecastやtimeleft等のZabbix予測関数を活用したプロアクティブ監視の実装手順まで紹介します"
tags:
  - Zabbix
  - Elasticsearch
  - forecast
headerImage: 'https://i.imgur.com/tE9cC6Q.png'
templateKey: blog-post
---
ZabbixでElasticsearchのクラスタを監視したい、したくない？

Elasticsearchのノードを先日1つ追加しましたので、ちょい傾向とかを確認しようと思いZabbixで監視できるテンプレートとかを作ってみました。

[Elastic_zab](https://github.com/tubone24/Elastic_zab)

## Table of Contents

```toc

```

## 使い方

Elastic_zabに同梱しているelastic.shをZabbixサーバーのexternalscriptsディレクトリに配置します。実行権限もZabbixユーザーにします。

```
$ git clone https://github.com/tubone24/Elastic_zab

$  cp -p Elastic_zab/elastic.sh /usr/lib/zabbix/externalscripts/

$ chown zabbix. /usr/lib/zabbix/externalscripts/elastic.sh

$ chmod 751 /usr/lib/zabbix/externalscripts/elastic.sh
```

## Zabbixにテンプレートをインストールする

Zabbix画面の設定のテンプレートから[elasticsearch_zab.xml](https://github.com/tubone24/Elastic_zab/blob/master/elasticsearch_zab.xml)をインポートします。

![Zabbixのテンプレートインポート画面でXMLファイルを選択](https://i.imgur.com/cTG62da.png)

うまくインストールできれば、テンプレート一覧にElastic clusterが出現します。

![テンプレート一覧にElastic clusterが表示された画面](https://i.imgur.com/mzeLWwv.png)

## Elasticsearchのノードにテンプレートを当てる

Elasticsearchのノードにテンプレートを当てます。

![Elasticsearchノードにテンプレートを適用する設定画面](https://i.imgur.com/zpTarcD.png)

合わせて、ElasticsearchのIPとポートをマクロで設定しておきます。

![ZabbixマクロでElasticsearchのIPとポートを設定する画面](https://i.imgur.com/Vw5bbsA.png)

設定するマクロは以下の2つです。

- **{$ESIP}** = ElasticsearchのIPもしくはDNSネームを設定します。
- **{$ESPORT}** = Elasticsearchのポートを設定します。


## 監視する

うまく監視できるとこんなグラフができます。

![ZabbixでElasticsearchクラスタの監視グラフが表示された画面](https://i.imgur.com/tE9cC6Q.png)

## おまけ Zabbixの予測関数を使ってみた

いくつかの監視アイテムはforecastやtimeleftといったZabbixの関数を利用しています。

予測は線形としています。

予測値はトリガー設定していないのでお好みでトリガーを設定するのもいいのではないでしょうか。

![Zabbixのforecast関数を使った予測値グラフの表示例](https://i.imgur.com/ylKkzK6.png)

こんな感じで計算アイテムで簡単に実装できるのが魅力ですね。監視ツールとしては他にも[Grafana World Pingを使った死活監視](/2017/06/16/grafana/)を試したり、[AWS X-RayとDatadog APMを連携した分散トレーシング](/2020/1/20/x-ray-datadog/)にも取り組んでいます。Elasticsearchの活用では[企業名サジェスト機能の開発](/2024/12/05/cost-effective-company-name-suggestion-feature/)もご覧ください。
