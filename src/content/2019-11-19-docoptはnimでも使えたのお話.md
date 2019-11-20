---
slug: 2019/11/19/docopt-nim
title: docoptはNimでも使えたのお話
date: 2019-11-19T11:55:07.057Z
description: Pythonですごい便利なdocoptはNimでも使えるという発見をした人のぼやき。
tags:
  - docopt
  - Nim
headerImage: 'https://i.imgur.com/FeDnyEc.jpg'
templateKey: blog-post
---
# めっちゃ便利じゃんアゼルバイジャン

Pythonで結構有名なdocoptがNimという言語でも使えたので喜びのあまり記事を書く運びになりました。

## そもそもNimとは？

![img](https://i.imgur.com/kYsjLcW.png)

Nimとは、公式Doc https://nim-lang.org/  によると、静的型付なコンパイラ言語でPython, Ada, modulaなどの成熟した言語のいいとこ取りをした**能率的**で、**表現力豊か**で、**エレガント**な言語とのこと。

大手化粧品メーカーばりにうたい文句が多いですが、私なりに触っての特徴をお伝えしますと…

### 早い

Nimはスクリプト言語でもVM上で動くわけでもなく、ネイティブな実行ファイルにコンパイルされます。

よく、Pythonは遅い～的な小言をいう人にはこの手の言語が合ってると思いますが、そういう人に限ってGoがいいと言ったりします。

~~（私はGo大好きです！！ただ、世の中Goだけじゃないよ～と言いたいのと、社内に優秀なGoエンジニアが何名か居るので社内ではRust信者として今は活動中。。）~~

Goとの優位差を見せつけるには、Nimのコンパイラの優秀さを示すことかと思います。

（構文が楽とかPythonライクで書きやすいとかそういった優位差を示す記事もありますが、個人的にはGoもNimもそんなに難しさは変わらないと思います。Rustは難しいけど書いてて楽しいです。）

自分で検証してないので完全に他人の受け売りですが、[こちらの記事](http://h-miyako.hatenablog.com/entry/2015/01/23/060000)を確認すると、最適化オプションをがちゃがちゃしたC(いわゆる -O3オプション)には負けましたが、それでも他の言語と比較すると圧倒的に早い。

詳しいことはわからないのですが、-o3オプションって、いいイメージないんですよね…。昔、-o3オプションで爆速にしたら、実行時コアダンプ吐いて落ちまくったんですよね。。そこに匹敵するスピードがあるのはすごい。

というのもNim自体がCを通してコンパイルするいわゆるトランスパイルな言語なのでまぁ相性がいいんでしょうね。

（ちなみに、C++/Objective-C/JavaScriptなんかにもトランスパイルできるらしい。C言語からの実行ファイルビルドのためLinux,Mac,Windowsだけでなく、Nitendo Switchでも動く実行ファイルを作れるみたいです。作ったことないけど。）

### 一部の人に人気がある

気がする、という感じですがNimの記事書いていてNimの悪口言っている人をあまり見ません。

構文がエレガントという意見は個人的にはよくわかんなかったです・・・。~~クラスもまさにCの構造体チックだし。。~~が、悪い感じはしませんでした。マクロはやはり便利だよねという。

## じゃあとりあえず使ってみる

ということで早速使ってみます。

今回は毎回おなじみEbook-homebrew（リンク）のクライアントCLIを作ってみます。

CLIなので、コマンドラインから引数を受け取らなければなりません。

ちょっと調べて出てきた **parseopt** がよいと思いこちらで実装進めてましたが、めんどくさくてレポジトリをほったらかしにしてました。

parseoptを使うとこんな感じです。

```
import parseopt2

when isMainModule:
  for kind, key, val in getopt() :
    case kind
    of cmdArgument:
      if key == "status":
        echo("status")
      if key == "upload":
        echo("upload")
    of cmdLongOption, cmdShortOption:
      if key == "h" or key == "help":
        echo("help")
      echo "Options > ",key,"=" ,val
    of cmdEnd:
      echo "end"
```

直感的じゃない・・・。

## そこで僕はdocopt

[docopt](http://docopt.org/)はPythonで使ったことがあるのですが、CLIのUsageを書くだけでコマンドラインパーサーとして動く優れもの。

Nimで使うとこんな感じになります。

```
const doc = """
Overview:
  Client App with ebook-homebrew's rest API for Nim
Usage:
  ebook_homebrew_nim_client status
  ebook_homebrew_nim_client convert <directory> <contentType> [--output=<outputFile>]
Options:
  status                Check API Status
  convert               Upload Images, convert to PDF and download result.pdf
  <directory>           Specify directory with in images
  <contentType>         Image content Type such as "image/jpeg"
  --output=<outputFile> Output Filename [default: result.pdf]
"""

import docopt
import ebook_homebrew_nim_clientpkg/submodule

proc main() =
  let args = docopt(doc, version = "0.1.0")
  if args["status"]:
    echo getStatus()
  if args["convert"]:
    let uploadId = extractUploadId(uploadImgSeq(listImgFiles($args["<directory>"]), $args["<contentType>"]))
    discard convertImg(uploadId, $args["<contentType>"])
    if args["--output"]:
      convertPdfDownload(uploadId, $args["--output"])
    else:
      convertPdfDownload(uploadId, "result.pdf")

when isMainModule:
  main()
```

先頭で **const doc** として、Overview, Usage, Optionsを書きます。

よく見かける書き方ですね。

- サブコマンドは**status**, **convert** のように直接指定します。
- 位置引数は<hoge> とカッコで囲みます。位置引数は特性上必須パラメータとなります。
- オプションは --hogeとします。また、[]で囲むことで任意なパラメーターになります。

引数の取り出しかたは、
