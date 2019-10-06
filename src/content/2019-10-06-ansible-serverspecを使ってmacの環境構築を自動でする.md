---
slug: 2019/10/6/mac-auto-setup
title: Ansible + Serverspecを使ってMacの環境構築を自動でする
date: 2019-10-06T02:20:10.067Z
description: Ansible + Serverspecを使ってMacの環境構築を自動でします
tags:
  - Ansible
  - Serverspec
  - Mac
headerImage: 'https://i.imgur.com/9iGRHft.png'
templateKey: blog-post
---
# 毎回Macの環境構築めんどくさい

開発用MacBookの構成管理がしたくなり、AnsibleとServerspecを使って作りました。

## Ansible

AnsibleとはPython製のOSS構成管理ツールです。

便利なモジュールが多数用意されており、パッケージのインストール、コンフィグの書き換え、サービスの立ち上げ、有効化etc.. 様々な構成をYaml形式でパパっとかけることがポイントです。

また、冪等（べきとう）性
