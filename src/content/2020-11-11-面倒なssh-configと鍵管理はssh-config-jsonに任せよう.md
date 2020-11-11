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

## 経緯

皆さんはサーバーへのSSH、どうしてますか？

仕事柄管理しているサーバーへのSSHログインが多いため、SSH Configを使ってログインの手間を少なくしてます。

