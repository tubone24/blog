---
slug: 2019/09/08/metasploitable-hyperv
title: Hyper-vにMetasploitableの仮想マシンを立ててみる
date: 2019-09-08T12:55:31.132Z
description: "VirtualBox用のMetasploitableをHyper-vで動かす手順を解説。VMDKからVHDXへのディスク変換にMicrosoft Virtual Machine Converterを使い、PowerShellでの変換コマンドから仮想マシン作成・起動までの流れをまとめました。"
tags:
  - 仮想化
  - Hyper-v
  - metasploitable
  - powerShell
headerImage: '/images/blog/oV13syg.png'
templateKey: blog-post
---
Hyper-vでも仮想マシンしたい!

セキュリティのテストやトレーニング用に意図的に脆弱性を作った仮想マシン **Metasploitable** はVirtualBox用のVMですが、Hyper-vに入れてみます。仮想化技術に関連する記事として[仮想セキュリティブラウザの構築](/2017/07/09/virtual-browser/)も参考にしてみてください。

## Table of Contents

```toc

```

## ダウンロード

[sourceforge](https://sourceforge.net/projects/metasploitable/)からMetasploitableをダウンロードします。

ダウンロードしたZIPファイルを展開すると**VMDK**ファイルがありますので、これをHyper-vのディスクフォーマット**VHDX**にしていきます。

![MetasploitableのZIPを展開して表示されるVMDKファイル](/images/blog/Hx7m0bS.png)

## Microsoft Virtual Machine Converterをダウンロードする

Microsoft Virtual Machine Converterを使えば、VirtualboxのディスクフォーマットファイルをHyper-vのフォーマットに変換できます。

[MVMC](https://www.microsoft.com/en-us/download/details.aspx?id=42497)

MSIをダウンロードしてインストールします。

![Microsoft Virtual Machine ConverterのMSIインストーラー画面](/images/blog/qi0xtKd.png)


## Powershellを使って変換する

MVMCをインストールしたらPowershellを使って変換します。

Powershellを管理者モードで開きます。

![PowerShellを管理者モードで起動した画面](/images/blog/EIowtzV.png)

下記コマンドを打ち、変換します。

```powershell{numberLines: 1}
import-module "C:\Program Files\Microsoft Virtual Machine Converter\MvmcCmdlet.psd1"
 
ConvertTo-MvmcVirtualHardDisk -SourceLiteralPath "xxxx.vmdk" -DestinationLiteralPath "xxxx.vhdx" -VhdFormat Vhdx
```

しばらく待つと、vhdxファイルができます。

## Hyper-vで仮想マシンを作る

仮想マシンを作る方法は普通のHyper-vの仮想マシンを作る方法と同じです。

仮想マシンのディスクを選択するところで、**既存の仮想ハードディスクを使用する**を選択し、先ほど作ったvhdxファイルを選択します。

![Hyper-vの仮想マシン作成画面で既存の仮想ハードディスクを選択する画面](/images/blog/n7h7LsX.png)

## 起動する

Metasploitableを起動します。

無事起動できました！

![MetasploitableがHyper-v上で無事起動した画面](/images/blog/oV13syg.png)
