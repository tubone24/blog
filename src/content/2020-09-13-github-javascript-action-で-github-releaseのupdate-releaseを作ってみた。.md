---
slug: 2020/08/14/github-action
title: GitHub JavaScript Action で GitHub ReleaseのUpdate Releaseを作ってみた。
date: 2020-09-13T12:41:20.699Z
description: GitHub JavaScript Action で GitHub ReleaseのUpdate Releaseを作ってみた。
tags:
  - GitHub
  - GitHub Actions
headerImage: https://i.imgur.com/kXVhSw7.png
templateKey: blog-post
---
ちょうどいい、GitHub Actionsがなかったので作ってみました。

## Table of Contents

```toc

```

## なんで？

GitHub Actionsで**uses**を使ったことはありますか？

```yaml
name: Generate Word Cloud

on:
  push:
    branches:
      - master
  schedule:
    - cron: "0 5 * * *"

jobs:
  GenerateWordCloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python 3.x
        uses: actions/setup-python@v1 # ここ
        with:
          python-version: "3.7"
      - uses: actions/cache@v1 # ここ
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
```

GitHub Actionsを使うときには何かと便利なやつですが、公式には**actions**というレポジトリにいます。

<https://github.com/actions>

今回は、[post_twitter_on_work](https://github.com/tubone24/post_twitter_on_work)の開発の中で、GitHub ReleasesにGitHub ActionsでBuildしたArtifactsをアップデートしたい欲求が出てきました。

通常、GitHub ReleasesをGitHub Actionsで使うには、[actions/create-release](https://github.com/actions/create-release)を使うことが多いです。

こちらの使い方としては、

1. Git Tagを打ってPushする
2. Pushに反応して、actions/create-releaseが動く
3. 出来上がったReleasesに[actions/upload-release-asset](https://github.com/actions/upload-release-asset)でArtifactsを上げる

という感じの使い方になるかと思います。

が、しかし、[post_twitter_on_work](https://github.com/tubone24/post_twitter_on_work)では下記理由でそれができない（やりたくない）のでした。

- Git Tagうつのめんどくさい。
  - GitHub ReleasesからDraft ReleaseでTag打ちたい
- matrixで何度もJobが動く
  - 重複して、Create Releasesできない

## そこで、GitHub JavaScript Action

いいものがないなら作る。それしかないです。

GitHub Actionを作るには2種類の方法があります。

- [Dockerコンテナ](https://docs.github.com/ja/actions/creating-actions/about-actions#docker-container-actions)
- [JavaScript](https://docs.github.com/ja/actions/creating-actions/about-actions#javascript-actions)

Dockerコンテナで作る場合、GitHub ActionsのLinux上でコンテナを起動するので、WindowsやMacのOSでは動きません。また、いろんなことができる一方、コンテナが立ち上がるための時間もかかります。

JavaScriptでは、Node.js 12で動くJSコードを書くだけです。WindowsやMacのOS上でも問題なく動きます。JavaScriptに慣れていて、特定のライブラリや言語を使わないといけない状況でなければJavaScript一択だと思います。

<https://github.com/actions/javascript-action>