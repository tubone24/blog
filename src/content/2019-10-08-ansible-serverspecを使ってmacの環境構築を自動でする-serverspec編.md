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

そうしたら、bundle installしていきます。

```bash
bundle install --path=vendor/bundle
```

## Serverspecの初期化

ServerspecがインストールできたらServerspecの初期化をしていきます。

bundleで

```bash
bundle exec serverspec-init
```

と実行すると、

```bash
Select OS type:
 
  1) UN*X
  2) Windows
 
Select number: 1  # MacなのでUnix系を選択
 
Select a backend type:
 
  1) SSH
  2) Exec (local) # MacなのでLocal Execを選択
 
Select number: 2
 
 + spec/
 + spec/localhost/
 + spec/localhost/sample_spec.rb
 + spec/spec_helper.rb
 + Rakefile
 + .rspec
```

とします。これで準備はOKです。


## テストヘルパーの作成

Serverspecは上述したとおり、Ruby(RSpec)でできてるので、テスト用のヘルパーを作成し、テストに使う変数をspecファイル（テストコード）で利用できるようにしておきます。

今回は `spec/spec_helper.rb` に

```ruby
require 'serverspec'

set :backend, :exec

# Load Variables for variables.yml
def load_configuration (key)
    configuration = YAML.load_file 'variables.yml'
    configuration['vars'][key].map do |package|
      package.kind_of?(Hash) ? package['name'] : package
    end
end

# Load Homebrew packages
def homebrew_packages
    load_configuration 'homebrew_packages'
end

def git_conf
  load_configuration 'git_conf'
end
```

という感じでhelperを作り、別に `variables.yml` を作りました。

```yaml
vars:
  homebrew_packages:
    - git
    - nodenv
    - pyenv
    - pyenv-virtualenv
    - rbenv
    - ruby-build
    - tfenv
    - awscli
    - packer
    - jq
    - docker
  git_conf:
    - tubone24
    - hogehoge@gmail.com
```

## Specファイル（テストコード）の作成

ここまで準備できたらいよいよSpecファイルを書いていきます。

今回はHomebrewでインストールするパッケージの一覧とgit configで設定する名前、メール情報を変数化してます。

helperでYamlに記載した変数をSpecで利用できるようになりました。

### アプリがインストールされているかの確認

Homebrewで正しくアプリがインストールされているかの確認は

ソース

を使います。

HomebrewでインストールしていればAssert OKとなるはずです。

### コマンドの結果を確認する

コマンドの結果、例えばインストールしたアプリのバージョン確認は

ソース

とすることで実現できます。

正規表現でマッチさせるため、例えば否定系は

ソース

と書けます。

### ファイルに文字列が含まれているか？

今回作ったレポジトリには入れてませんが、configファイルに文字列が含まれているかということもServerspecで確認できます。

ソース

このようにすることで、ファイルが存在することとファイルに指定した文字列が記載されてるかをテストできます。

詳しくは公式Docを御確認ください。

## Makefileで一発実行

最後にMakefileを作って終わりです。

下記の通りに定義を作りました。

Rubyのbundle installがあるため、before-checkという定義も作ってます。

ソース

## 結論

Macの構成管理をAnsibleで行い確認をServerspecで行うところまで無事できました！

次回はもうすることないかと思いきや、こいつをCIにのっけてみようかと思います！！

もうめちゃくちゃだよ
