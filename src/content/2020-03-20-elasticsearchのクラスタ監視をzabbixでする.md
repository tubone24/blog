---
slug: 2017/7/23/elasticsearch-zabbix
title: Elasticsearchのクラスタ監視をZabbixでする
date: 2017-07-22T16:59:14.751Z
description: Elasticsearchのクラスタ監視をZabbixでする(過去記事)
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

Elastic_zabに同梱しているelastic.shをZabbixサーバのexternalscriptsディレクトリに配置します。実行権限もZabbixユーザにします。

```
$ git clone https://github.com/tubone24/Elastic_zab

$  cp -p Elastic_zab/elastic.sh /usr/lib/zabbix/externalscripts/

$ chown zabbix. /usr/lib/zabbix/externalscripts/elastic.sh

$ chmod 751 /usr/lib/zabbix/externalscripts/elastic.sh
```

## Zabbixにテンプレートをインストールする

Zabbix画面の設定のテンプレートから[elasticsearch_zab.xml](https://github.com/tubone24/Elastic_zab/blob/master/elasticsearch_zab.xml)をインポートします。

![img](https://i.imgur.com/cTG62da.png)

うまくインストールできれば、テンプレート一覧にElastic clusterが出現します。

![img](https://i.imgur.com/mzeLWwv.png)

## Elasticsearchのノードにテンプレートを当てる

Elasticsearchのノードにテンプレートを当てます。

![img](https://i.imgur.com/zpTarcD.png)

合わせて、ElasticsearchのIPとポートをマクロで設定しておきます。

![img](https://i.imgur.com/Vw5bbsA.png)

設定するマクロは以下の2つです。

- **{$ESIP}** = ElasticsearchのIPもしくはDNSネームを設定します。
- **{$ESPORT}** = Elasticsearchのポートを設定します。


## 監視する

うまく監視できるとこんなグラフができます。

![img](https://i.imgur.com/tE9cC6Q.png)

## おまけ Zabbixの予測関数を使ってみた

いくつかの監視アイテムはforecastやtimeleftといったZabbixの関数を利用しています。

予測は線形としています。

予測値はトリガー設定していないのでお好みでトリガーを設定するのもいいのではないでしょうか。

![img](https://i.imgur.com/ylKkzK6.png)

こんな感じで計算アイテムで簡単に実装できるのが魅力ですね。
