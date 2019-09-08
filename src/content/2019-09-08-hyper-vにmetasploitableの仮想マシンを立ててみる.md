---
slug: 2019-09-08-metasploitable-hyperv
title: Hyper-vにMetasploitableの仮想マシンを立ててみる
date: 2019-09-08T12:55:31.132Z
description: Hyper-vにMetasploitableの仮想マシンを立ててみる
tags:
  - Hyper-v
  - metasploitable
  - powershell
headerImage: 'https://i.imgur.com/oV13syg.png'
templateKey: blog-post
---
# Hyper-vでも仮想マシンしたい

セキュリティのテストやトレーニング用に意図的に脆弱性を作った仮想マシン **Metasploitable** はVirtualBox用のVMですが、Hyper-vに入れてみます。

## ダウンロード

[sourceforge](https://sourceforge.net/projects/metasploitable/)からMetasploitableをダウンロードします。

