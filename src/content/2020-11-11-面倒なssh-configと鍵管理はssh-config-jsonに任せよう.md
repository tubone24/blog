---
slug: 2020/11/11/ssh-confiig-json
title: 面倒なSSH Configと鍵管理はssh-config-jsonに任せよう
date: 2020-11-11T14:42:50.126Z
description: 面倒なSSH Configと鍵管理はssh-config-jsonに任せよう
tags:
  - サーバー
  - Python
  - SSH
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
PCの入れ替えのたびにSSH Configとその鍵の扱いに困るので作ってみました。

## Table of Contents

```toc

```

## はじめに

皆さんはサーバーへのSSH、どうしてますか？

仕事柄管理しているサーバーへのSSHログインが多いため、SSH Configを使ってログインの手間を少なくしてます。

特にSSHログインに鍵ファイルを利用したり、DBアクセスのためのポートフォワードをしたり、多段SSHをしようとするとSSHコマンドの長さはおのずと長くなり、毎回打ち込むのはそれはそれは億劫になります。

コマンド

そこで例えば上記のようなコマンドをSSH Configに設定し、

コード

次のようにエイリアスでアクセスできるようにするわけです。

コマンド

ちなみに、ZSHではzsh-completionsという補完プラグインを設定することで、

SSH Configのtab補完をしてくれるので上記との合わせ技でかなり効率的になります。

## 課題

とっても便利なSSH Configですが、PC移行や環境構築時、いろいろやっかいです。

### 鍵とまとめて設定しなければならない

まぁ当たり前と言えば当たり前なのですが、SSH Config上で設定した鍵ファイルも併せて管理しないと当然サーバーにアクセスできません
。

私の働いている現場では、鍵ファイルをS3に配置し、アクセス権を持ってる鍵が必要な人が各々鍵をローカルにダウンロードする必要があります。

せっかくSSH Configだけ別のPCに移行しても結局鍵のダウンロードが必要なわけです。

### SSH Configも立派な機微なファイル

鍵ファイルは前述の通りですが、じゃあSSH Configの受け渡しはどうでしょう？

SSH ConfigにはサーバーのIPアドレス、ログイン名などかなりセキュリティー上機微な情報が入っており、

dotfileのように、GitHubのレポジトリー管理にするのもはばかられます。

## 課題への解

さて、こちらの課題を整理すると

1. SSH鍵も一元的に管理したい
2. SSH Config自体も安全に管理したい

となります。

良い方法はあるでしょうか？

## SSH Config JSON

そこでボクは~~オリーブオイル~~ SSH Config JSON。

SSH ConfigをJSON形式で鍵ファイルとともに1ファイルにラッピングし、AES暗号で暗号化する、というツールを作ってみました。

## 特徴

- SSH ConfigのJSON変換、複合ができます
- IdentityFile(SSH鍵)をJSONにラッピングし一元管理できます
- AES暗号に対応し、JSONを暗号化しSSH鍵とともに安全に管理できます

## 使い方

主な使い方はRead the docsにドキュメントサイトを作りましたのでそちらをご参照ください。

一例を書きますとまずインストールはpipで行います。

コード

するとGlobalコマンドにscjというものができます。

Ssh Config Jsonですね。

自らの~/.ssh/configをSSH鍵もセットでJSONにしたければ

コード

とするとdump.jsonとしてSSH ConfigをラッピングしたJSONができます。

復元したければ

コード

とやることで、SSH鍵とともに展開されます。

さらに暗号化オプションをつければ

コード

とJSONを暗号化したファイルが生成され、AESキーを使った複合もできます。

