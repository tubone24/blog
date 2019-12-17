---
slug: 2019-09-08-metasploitable-hyperv
title: Hyper-vにMetasploitableの仮想マシンを立ててみる
date: 2019-09-08T12:55:31.132Z
description: Hyper-vにMetasploitableの仮想マシンを立ててみる
tags:
  - 仮想化
  - Hyper-v
  - metasploitable
  - powerShell
headerImage: 'https://i.imgur.com/oV13syg.png'
templateKey: blog-post
---
Hyper-vでも仮想マシンしたい

セキュリティのテストやトレーニング用に意図的に脆弱性を作った仮想マシン **Metasploitable** はVirtualBox用のVMですが、Hyper-vに入れてみます。

## Table of Contents

```toc

```

## ダウンロード

[sourceforge](https://sourceforge.net/projects/metasploitable/)からMetasploitableをダウンロードします。

ダウンロードしたzipファイルを展開すると**VMDK**ファイルがありますので、これをHyper-vのディスクフォーマット**VHDX**にしていきます。

![Img](https://i.imgur.com/Hx7m0bS.png)

## Microsoft Virtual Machine Converterをダウンロードする

Microsoft Virtual Machine Converterを使えば、VirtualboxのディスクフォーマットファイルをHyper-vのフォーマットに変換することができます。

[MVMC](https://www.microsoft.com/en-us/download/details.aspx?id=42497)

MSIをダウンロードしてインストールします。

![Img](https://i.imgur.com/qi0xtKd.png)


## Powershellを使って変換する

MVMCをインストールしたらPowershellを使って変換します。

Powershellを管理者モードで開きます。

![Img](https://i.imgur.com/EIowtzV.png)

下記コマンドを打ち、変換します。

```powershell{numberLines: 1}
import-module "C:\Program Files\Microsoft Virtual Machine Converter\MvmcCmdlet.psd1"
 
ConvertTo-MvmcVirtualHardDisk -SourceLiteralPath "xxxx.vmdk" -DestinationLiteralPath "xxxx.vhdx" -VhdFormat Vhdx
```

しばらく待つと、vhdxファイルができます。

## Hyper-vで仮想マシンを作る

仮想マシンを作る方法は普通のHyper-vの仮想マシンを作る方法と同じです。

仮想マシンのディスクを選択するところで、**既存の仮想ハードディスクを使用する**を選択し、先ほど作ったvhdxファイルを選択します。

![Img](https://i.imgur.com/n7h7LsX.png)

## 起動する

Metasploitableを起動します。

無事起動できました！

![Img](https://i.imgur.com/oV13syg.png)
