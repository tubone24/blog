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

簡単そうですね。では早速作っていきましょう。

```
├─ansible
│  └─mac
│      ├─inventory
|      |  ├─default
│      │  └─group_vars
│      │      └─local
│      ├─playbooks
│      └─roles
│          └─dev-tools
│              ├─tasks
|              |    └─main.yml
│              └─vars
                 └─main.yml
```

Ansibleのディレクトリ構成は上記のようにしてます。

Ansibleのplaybookを作るにはざっくり3つの手順を取ります。

1. 接続先情報をまとめたInventoryを設定
2. 実際の構成情報を記載したRoleを設定
3. InventoryとRoleをひとまとめにしたplaybookを設定

では早速Inventoryの設定から進めていきます。

### Inventoryを設定する

Inventoryは複数のサーバをグルーピングして、同時にプロビジョンするためにサーバの接続情報をまとめておくコンフィグです。

今回はMacに適用するため、接続先情報はlocalとなります。

inventoryをコマンドで指定しない場合にdefalutで設定される`defalut`ファイルに下記を設定します。

```ini
[local]
localhost
```

これで、特にInventoryを指定しない場合は`localhost`として接続がされます。また、InventoryGroupとして`local`を指定しているため、`group_vars/local`にlocalとして共通の変数を定義することもできます。

今回は複数サーバで共有させる変数が見当たらないので特に設定しません。

```yaml
ansible_connection: 'local'
```

### Roleを設定

次にRoleを設定していきます。

今回は特にRoleを分ける必要もないのですが、たとえば

- 開発者のMac
- デザイナーのMac
- 運用者のMac

とそれぞれインストールするアプリが異なる場合、全員に共通して入れたい設定やAさんは開発者兼デザイナーで両方のアプリが入れたいなどの要求もある場合はそれぞれ

- dev-tool
- design-tool
- ops-tool

みたくRoleをわけておくのがセオリーです。
