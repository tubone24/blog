---
slug: 2019/10/08/serverspec
title: Ansible + Serverspecを使ってMacの環境構築を自動でする (Serverspec編)
date: 2019-10-08T11:34:59.707Z
description: Ansible + Serverspecを使ってMacの環境構築を自動でします。
tags:
  - Serverspec
  - Mac
  - 自動化
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# Serverspecで構築した環境を確認したい！！

前回、Ansibleを使って、Macの環境を構築しました。一部べきとう性が保てない箇所があったりしたので、正しく設定値が入っているかServerspecを使ってMacの状態を確認していきます。

## Serverspecとは

Serverspecとはサーバの自動テストツールです。

せっかくAnsibleとかで自動でたくさんのサーバをプロビジョニングしたのに、確認はテスト項目書片手に目で見て確認…みたいな頭の悪いことをしないために作られたツールです。

RubyのRSpecベースでできているツールなのでRubyでテストを書いたことある人なら取っつきやすいのも特徴です。

## Serverspecのインストール

まずServerspecを入れるディレクトリにServerspecをインストールします。

あらかじめRubyが動く環境を作った上でbundle installしていきます。

まずbundleのベースファイルを作っていきます。

```bash
bundle init
```

次に、GemfileにserverspecとRakeを指定しておきます。

```gemfile
# frozen_string_literal: true

source "https://rubygems.org"

git_source(:github) {|repo_name| "https://github.com/#{repo_name}" }

# gem "rails"
gem "serverspec"
gem "rake"
```

最後に

```bash
bundle install --path=vendor/bundle
```

## テストヘルパーの作成

Serverspecは上述したとおり、Ruby(RSpec)でできてるので、テスト用のヘルパーを作成し、テストに使う変数をspecファイル（テストコード）で利用できるようにしておきます。


