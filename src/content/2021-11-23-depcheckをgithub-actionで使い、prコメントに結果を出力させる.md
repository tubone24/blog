---
slug: 2021/11/21/depcheck
title: depcheckをGitHub Actionで使い、PRコメントに結果を出力させる
date: 2021-11-21T11:16:54.648Z
description: depcheckを使うと、package.jsonで定義されたライブラリがコードで使われているかどうかを確認することができます。確認の結果は、以下の例のように、GitHub Actions の実行時に PR コメントでユーザーに通知することができます。
tags:
  - JavaScript
  - depcheck
  - GitHub
headerImage: https://i.imgur.com/x0HzZEF.png
templateKey: blog-post
---
package.jsonはNodeのつらいところ。

## Table of Contents

```toc

```

## はじめに

JavaScriptやTypeScriptでのシステム開発に必要不可欠なNode Package Manager、いわゆるnpmはしばしばライブラリサイズが大きくなりがちなことが問題になります。

![img](https://i.imgur.com/yxDDBOX.jpg)

もちろんこちらの問題は様々な議論が尽くされているわけですし、今更どうこう言うつもりはないです。

<iframe width="560" height="315" src="https://www.youtube.com/embed/SHIci8-6_gs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

上記問題を解決する方法はいろいろあると思いますが、私のような末端開発者にはとりあえず使ってないライブラリを削除する、くらいしかできないのでそれらを加速させる方法を考えていきましょう。






























