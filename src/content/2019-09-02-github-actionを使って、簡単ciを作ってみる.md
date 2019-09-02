---
slug: 2019-09-02-github-action
title: Github Actionを使って、簡単CIを作ってみる
date: 2019-09-02T11:33:53.870Z
description: 最近Github Actionを使って簡単Ciを作ってみました。
tags:
  - Github
  - GithubAction
  - CI
headerImage: 'https://imgur.com/V2Aobi8.png'
templateKey: blog-post
---
# CIマニアと化したtubone

最近Github Actionを触って便利さに気がついてしまったのでご紹介します。

## Github Actionとは？

Github Actionとは、 ***built by you, run by us*** です。[（公式より）](https://github.blog/2018-10-17-action-demos/)

詰まるところGithub製のCIです。

結構簡単に使えたのでご紹介します。

## Github Actionのプレビューに応募する

Github Action自体はまだプレビュー版ですので、こちらのサイトから
利用申請をする必要があります。

私は申し込みから一週間くらいで使えるようになりました。

無事利用できるようになりますと、レポジトリにActionボタンが
出てきます。

## Workflowを設定する

Github ActionはほかのCIと同じくYAMLファイルで定義します。
