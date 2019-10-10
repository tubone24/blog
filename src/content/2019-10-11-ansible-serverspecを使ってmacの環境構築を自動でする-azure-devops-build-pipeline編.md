---
slug: 2019/10/11/azure-dev-pipeline
title: Ansible + Serverspecを使ってMacの環境構築を自動でする (Azure DevOps Build Pipeline編)
date: 2019-10-10T15:04:39.398Z
description: Ansible + Serverspecを使ってMacの環境構築を自動化し、Azure DevOps Build PipelineでCIを回します。
tags:
  - Ansible
  - Serverspec
  - Mac
  - Azure Devops Build Pipeline
headerImage: 'https://i.imgur.com/9iGRHft.png'
templateKey: blog-post
---
# CIで回そう！

前回まででついにAnsible + ServerspecでMacの構成管理ができたわけですが、まだ残ってることがあります。

それが**CIにのせる**ことです。

は？

いみあるの？と思われた人も多いと思いますが、そこそこ意味のある活動になります。

なぜなら…

**一度プロビジョニングしたMacは初期化しない限り二度ときれいなMacにはならない**からです。

なんかの格言ぽいですが、常にクリーンなMacで作った構成管理を確かめてみたい、ということでCIに乗っけてしまいます。

## MacOS X が使えるCIってあるの？


結論から先にかけばあります。

私の大好きなCIのCircleCIだってMacOS XのOSイメージは用意されています。

ですが、CircleCIの場合で[$39/Month](https://circleci.jp/pricing/#build-os-x)とお金がかかってしまいます…。

こんな個人プロジェクトにお金を払うわけにはいきませんで、別のCIを考えます。

## Azure DevOps Build Pipeline

MacOS Xが無料で使えるCIはいくつかあるのですが、今回はAzure DevOps Build Pipelineにしました。

選定の理由はUIがかっこよくて見やすいのと、

ソース

とすることで、Build上必要なパッケージが利用可能になるからです。

(今回はServerspecでRubyを使うのですが、Rubyも構成管理してるので本機能は不要でした…)

## Yamlを書く

CIの定義を万と書いてきた私からしたら、つらい…とも思わないのですがCIを動かすための定義をYamlに書いていきます。
