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

CircleCIだってTravisCIだってMacOS XのOSイメージは用意されています。

ですが、CircleCIの場合で[$39/Month](https://circleci.jp/pricing/#build-os-x)、TravisCIで
