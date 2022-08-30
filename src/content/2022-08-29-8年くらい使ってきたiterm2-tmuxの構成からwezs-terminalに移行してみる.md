---
slug: 2022/08/29/wezterm
title: 8年くらい使ってきたiTerm2 + tmuxの構成からWez's Terminalに移行してみる
date: 2022-08-29T13:00:24.971Z
description: 8年くらい使ってきたiTerm2 + tmuxの構成からWez's Terminalに移行してみる
tags:
  - terminal
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
## Table of Contents

ついにターミナル周りを更新します。

```toc

```

## Wez's Terminal Emulatorとは？

[Wez's Terminal Emulator](https://wezfurlong.org/wezterm/)とは[Wez](https://github.com/wez/)さんの作ったRust製のターミナルです。

ターミナルは正直そこまで違いがないと思ってましたが、weztermの主な特徴としてGPUアクセラレータとクロスプラットフォームがあるらしいです。

クロスプラットフォームについては私はWindows,Mac両方使うことが多いので助かりますね。

GPUアクセラレータは以前のターミナル（iTerm2）で不満もなかったので感動が味わえるか不安です。ただiTerm2はなんとなくもっさりしている気がしてます。気がしているだけと割り切ってましたが調べてみると他の皆さんももっさりしていることに不満を申しているっぽいです[要出典: 他の皆さんとは?]。

## 今までの環境

今までずっとMacではiTerm2にtmuxを指してターミナルとして使ってました。

特に不満もなかったのでコンフィグの更新はあるものの、なんだかんだ8年くらいこの構成だと思います。

というよりこの手の設定を構築してしまうと更新が億劫になるんですよね。

![img](https://i.imgur.com/WeeoXsW.png)

ただそこまでカスタマイズはしてなくてちょっとキーバインドを変えているのとコピーモードを使いやすくしているのとステータスバーを表示させているくらいです。

同じような使い心地でweztermに乗り換えられれば大満足です。

## 乗り換えてみた

![img](https://i.imgur.com/h5RiIEv.png)

こんな感じになりました。








