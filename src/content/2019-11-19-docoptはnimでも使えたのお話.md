---
slug: 2019/11/20/docopt-nim
title: docoptはNimでも使えたのお話
date: 2019-11-20T11:55:00.000Z
description: Pythonですごい便利なdocoptはNimでも使えるという発見をした人のぼやき。
tags:
  - Nim
  - docopt
  - GitHub Action
  - CLI
headerImage: 'https://i.imgur.com/FeDnyEc.jpg'
templateKey: blog-post
---
めっちゃ便利じゃんアゼルバイジャン。

Pythonで結構有名なdocoptがNimという言語でも使えたので喜びのあまり記事を書く運びになりました。

## Table of Contents

```toc

```

## そもそもNimとは？

![img](https://i.imgur.com/kYsjLcW.png)

Nimとは、公式Doc <https://nim-lang.org/>  によると、静的型付なコンパイラ言語でPython, Ada, modulaなどの成熟した言語のいいとこ取りをした**能率的**で、**表現力豊か**で、**エレガント**な言語とのこと。

**大手化粧品メーカー**ばりにうたい文句が多いですが、私なりに触っての特徴をお伝えしますと…

### 早い

Nimはスクリプト言語でもVM上で動くわけでもなく、ネイティブな実行ファイルにコンパイルされます。

よく、Pythonは遅い～的な小言をいう人にはこの手の言語が合ってると思いますが、そういう人に限って**Go**がいいと言ったりします。

~~（私は**Go大好き**です!!ただ、世の中Goだけじゃないよ～と言いたいのと、**社内に優秀なGoエンジニアが何名か居るので**社内では**Rust信者**として今は活動中。。）~~

Goとの優位差を見せつけるには、**Nimのコンパイラ**の優秀さを示すことかと思います。

（構文が楽とかPythonライクで書きやすいとかそういった優位差を示す記事もありますが、個人的にはGoもNimもそんなに難しさは変わらないと思います。~~Rustは難しいけど書いてて楽しいです。~~）

自分で検証してないので完全に他人の受け売りですが、[こちらの記事](http://h-miyako.hatenablog.com/entry/2015/01/23/060000)を確認すると、

最適化オプションをがちゃがちゃしたC(いわゆる -O3オプション)には負けましたが、それでも他の言語と比較すると**圧倒的に早い**。

(ちょっと古めの記事なので最新はわからん。)

| **Language**       | sec(exec) | sec(compile) |
| ------------------ | --------- | ------------ |
| c                  | 3.993     | 0.02         |
| c (optimized -o2)  | 2.062     | 0.29         |
| go                 | 3.795     | 0.313        |
| nim                | 25.996    | 0.795        |
| **nim(optimized)** | **1.625** | 1.4          |
| rust               | 4.692     | 0.29         |
| rust(optimized)    | 3.602     | 0.303        |

(引用: \[この頃流行りの言語たち（他）でベンチマーク（Dart, Go, Julia, Nim, Python, Rust他）](http://h-miyako.hatenablog.com/entry/2015/01/23/060000))

詳しいことはわからないのですが、-o3オプションって、いいイメージないんですよね…。昔、-o3オプションで爆速な実行ファイルを作成しようとしたら、コンパイルは問題なく完了するのにいざ実行しようとするとコアダンプ吐いて落ちまくったんですよね。。

そんな危険なオプションに匹敵するスピードがあるのはすごい。

というのもNim自体がCを通してコンパイルするいわゆるトランスパイルな言語なのでまぁ相性がいいんでしょうね。

（ちなみに、C++/Objective-C/JavaScriptなんかにもトランスパイルできるらしい。C言語からの実行ファイルビルドのためLinux,Mac,Windowsだけでなく、[Nitendo Switchでも動く実行ファイルを作れるみたいです。](https://github.com/nim-lang/Nim/pull/8069)作ったことないけど。）

### 一部の人に人気がある

気がする、という感じですがNimの記事書いていてNimの悪口言っている人をあまり見ません。

構文がエレガントという意見は個人的にはよくわかんなかったです・・・。~~クラスもまさにCの構造体チックだし。。~~が、悪い感じはしませんでした。**マクロはやはり便利だよね**という印象です。

## じゃあとりあえず使ってみる

ということで早速使ってみます。

今回は毎回おなじみ[Ebook-homebrew](https://github.com/tubone24/ebook_homebrew)のクライアントCLIを作ってみます。

CLIなので、コマンドラインから引数を受け取らなければなりません。

ちょっと調べて出てきた **parseopt** がよいと思いこちらで実装進めてましたが、思いのほか新しい言語の学習コストと相まってめんどくさくてやる気がなくなりレポジトリをほったらかしにしてました。

parseoptを使うとこんな感じです。

```nim
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

* getoptからkind, key, valを逐次取り、それぞれ**cmdArgument**, **cmdLongOption**, **cmdShortOption**ごとにif文で判定して・・・。

オプションが入っているときの位置引数の値をとりたい！みたいなときどないすんねんと・・。

## そこで僕はdocopt

Nimでも見つけちゃいました。

![img](https://i.imgur.com/FeDnyEc.jpg)

[docopt](http://docopt.org/)はPythonで使ったことがあるのですが、CLIのUsageを書くだけでコマンドラインパーサーとして動く優れもの。

Pythonだとこんな感じ、[Client App with ebook-homebrew's rest API
](https://github.com/tubone24/ebook_homebrew/blob/master/examples/use_rest_api/src/main.py)

```python
"""
Overview:
  Client App with ebook-homebrew's rest API
Usage:
  main.py [-h|--help] [-v|--version]
  main.py upload <directory> <extension> [--host <host>] [--port <port>]
  main.py convert <id> <extension> [--host <host>] [--port <port>]
  main.py download <id> <file> [--host <host>] [--port <port>]
Options:
  upload         : upload
  convert        : convert
  <directory>    : directory
  <extension>    : extension
  <id>           : upload_id
  <file>         : filename
  -h, --help     : show this help message and exit
  -v, --version  : show version
  --host         : API server host
  --port         : API server port
"""

import json
import os
import glob
import base64
import requests
from docopt import docopt

__version__ = "2.0.0"


def main(args):
    """Call submodules"""

    if args["upload"]:
        upload(args)
    elif args["convert"]:
        convert(args)
    elif args["download"]:
        download(args)
    elif args["--version"]:
        show_version()
```

モジュールの先頭で文字列としてUsage書いてますね。

Nimで使うとこんな感じになります。

```nim
const doc = """
Overview:
  Client App with ebook-homebrew's rest API for Nim
Usage:
  ebook_homebrew_nim_client status
  ebook_homebrew_nim_client convert <directory> <contentType> [-o|--output=<outputFile>]
Options:
  status                Check API Status
  convert               Upload Images, convert to PDF and download result.pdf
  <directory>           Specify directory with in images
  <contentType>         Image content Type such as "image/jpeg"
  -o, --output=<outputFile> Output Filename [default: result.pdf]
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

* サブコマンドは**status**, **convert** のように直接指定します。
* 位置引数は<hoge> と<>カッコで囲みます。位置引数は特性上必須パラメーターと任意パラメーター(後述しますが\[]で囲む)を併用する場合は必須パラメーターを先に書かなければなりません。
* オプションは --hogeとします。また、\[]で囲むことで任意なパラメーターになります。加えて、ショートオプション（-h）とロングオプション両方使いたい場合は**\|**(パイプ)を使います。
* \-h, --helpもしくは間違ったパラメータ指定の場合はconst docの内容を出力します。(help表示)

引数の取り出しかたは、

* let args = docopt(doc) する
* args\["hoge"]でサブコマンド取得(Bool)
* args["<hoge>"]で位置引数の有無取得 **$**で文字列化され値が取得可能に
* args\["--output"]でオプションの判定、 **$**で文字列化されオプション設定時の位置引数値が取得可能

わーお簡単。

## 結論

んで出来上がったものがこちら[ebook-homebrew-nim-client
](https://github.com/tubone24/ebook-homebrew-nim-client)

ちゃっかり上記レポジトリはGitHub ActionでCI化してます。(参考: [Nim用のGitHub Actionsを作ってみた
](https://qiita.com/jiro4989/items/809f2a520c2e40d65bd3))

docoptのおかげでNimが好きになったような気がします。

NimはほかにもGUIフレームワークのnimx, WebフレームワークのJester, Nimで書かれたカーネルのnimkernelなど触ってみたいものがたくさんあります。

時間を見つけて少しずつ触っていきたいですね。
