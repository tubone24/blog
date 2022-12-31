---
slug: 2022/12/31/suicide-linux
title: コマンドを間違えたらそこで試合終了！ Suicide Linuxで遊んでいたら5秒ももたなかった話
date: 2022-12-31T11:35:30.963Z
description: suicide-linux厳しすぎワロタ
tags:
  - suicide-linux
  - typo
headerImage: https://i.imgur.com/t0rrElc.png
templateKey: blog-post
---

世知辛い仕様...。

## Table of Contents

```toc

```

## 年末いかがお過ごしですか？

こんばんわ。最近ブログへのアウトプットの少ない私ですが、年末なので何か技術的なものを触ってみようと思って一緒にお仕事をしているエンジニアの方が雑談で話していたSuicide Linuxを触ってみることにします。

## Suicide Linuとは？

文字通り自殺するLinuxです。

といってもわからないと思いますので、公式のレポジトリを見てみましょう。

<https://github.com/tiagoad/suicide-linux>

> You know how sometimes if you mistype a filename in Bash, it corrects your spelling and runs the command anyway? Such as when changing directory, or opening a file.

> I have invented Suicide Linux. Any time - any time - you type any remotely incorrect command, the interpreter creatively resolves it into rm -rf / and wipes your hard drive.

> It's a game. Like walking a tightrope. You have to see how long you can continue to use the operating system before losing all your data.

> Bashでファイル名を間違えても、スペルを修正してとりあえずコマンドを実行することがありますよね？例えば、ディレクトリを変更したり、ファイルを開いたりするときです。

> 私はSuicide Linuxを発明しました。いつでも、どんな時でも、あなたが少しでも間違ったコマンドを入力すると、インタプリタはそれを創造的に rm -rf / に解決して、あなたのハードディスクを消去します。

> これはゲームなんだ。綱渡りのようなものだ。すべてのデータを失う前に、どれだけ長くオペレーティング・システムを使い続けられるか、見なければならない。

とのことです。

私もよくあるのですが、コマンドの打ち間違いで

```shell{promptUser: tubone}{promptHost: dev.localhost}
sl
```

とタイポして

```
zsh: command not found: sl
```

とbashやzshに怒られることありませんでしょうか？

**私はあります。**

というより、私の使っているzshの拡張機能でタイポの可能性のあるコマンドが実行された場合

```
ls is correct? [Yes, No, Abort, Edit]:
```

という具合にプロンプトで候補を教えてくれます。技術は便利ですね。

Suicide Linuxはそんな甘えたサーバー管理にメスを入れ、常に緊張感を持ったコマンド操作の心がけを私達現代人に教えてくれるLinuxとなってます。

## 早速やらかした。

起動方法は超簡単で、ちゃんとDockerのイメージになっているのでpullしてbashを起動するだけです。

```shell{promptUser: tubone}{promptHost: dev.localhost}
docker run --rm -it tiagoad/suicide-linux
```

そうすると、rootユーザーでbashが立ち上がります。Dockerだとrootユーザーでのattachに慣れてますが、今回は緊張しますね。

さて、とりあえず、Node.jsでも入れてなにかのアプリでも起動させるか〜。

```shell{promptUser: tubone}{promptHost: dev.localhost}
ll
```

![no](https://i.imgur.com/t0rrElc.png)

Noooooo!!!

`ll`とは、 `ls -l` のエイリアスで慣例的にいくつかのLinuxでエイリアス設定されて...いるのですが、案外初期設定だとエイリアスになってなかったりします。

私は結構、 `ll` が手癖のようになっていて、ディレクトリを移動した最初に必要でもないのに実行したりします。

Suicide Linuxも例に漏れず、設定されていなかったです。

あらら...。使えなくなってしまいました。 rm -rfが実行されました...。

よくできていて、使えなくなると、プロンプトが赤くなります。

悲しい...。

## どうやって制御しているのか？

コマンドをミスるだけで、rm -rfしてくれるSuicide Linuxですが、どうやって動作を実現しているのでしょうか？

まず、[Dockerfile](https://github.com/tiagoad/suicide-linux/blob/master/Dockerfile)を見ると

```dockerfile
FROM debian:bullseye

COPY bash.bashrc /etc/

ENTRYPOINT ["bash"]
```

ベースイメージはDebian11っぽいです。シンプルなもので、謎のbashrcが仕込まれている以外、素のDebianでした。

工夫があるのはやはり謎の[bashrc](https://github.com/tiagoad/suicide-linux/blob/master/bash.bashrc)です。実は結構bashの細かい仕様を活用してたりします。

まず、 **command_not_found_handle** というFunctionですが、これは文字通りcommand not foundが発生した際に実行されるFunctionそのものです。こいつを上書きしてあげれば任意の動きになるということですね。

```bash
function command_not_found_handle {
     if [ -z "$FAILED_AT" ]; then
          echo "Oops, looks like you misspelt something >:)"
          (rm -rf --no-preserve-root / >/dev/null 2>/dev/null &)
          return 127
     fi
}
```