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

![Img](https://i.imgur.com/oBucHNe.png)

AnsibleとはPython製のOSS構成管理ツールです。

便利なモジュールが多数用意されており、パッケージのインストール、コンフィグの書き換え、サービスの立ち上げ、有効化etc.. 様々な構成をYaml形式でパパっとかけることがポイントです。

また、冪等（べきとう）性、つまり何回実行しても結果が変わらないことを保証したり、エージェントレスで構成管理対象のサーバに事前インストールが必要ないことが評価されている点です。

### MacでAnsibleを使う

ローカル環境であるMacの構成管理にもAnsibleが使えます。

ansible_connectionというパラメータをlocalにすることで、localhost上のマシンに対してコマンドが発行できるのでそれをうまく使います。

また、Macでパッケージをインストールするときにたびたびお世話になる**Homebrew**もAnsibleのモジュールにちゃんと用意されていますのでそちらを使います。

Homebrewでのインストールは次のように定義します。

```yaml
- name: 'Install Git'
  homebrew:
    name: 'git'
    state: 'present'
```
