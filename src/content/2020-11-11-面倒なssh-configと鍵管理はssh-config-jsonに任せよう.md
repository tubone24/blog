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

## はじめに

皆さんはサーバーへのSSH、どうしてますか？

仕事柄管理しているサーバーへのSSHログインが多いため、**SSH Config**を使ってログインの手間を少なくしてます。

特にSSHログインに鍵ファイルを利用したり、DBアクセスのためのポートフォワードをしたり、多段SSHをしようとするとSSHコマンドの長さはおのずと長くなり、毎回打ち込むのはそれはそれは億劫になります。

```
ssh tubone24@10.0.0.1 -i ~./ssh/id_rsa -L 127.0.0.1:80:intra.example.com:80 ProxyCommand='ssh -p 22 -W %h:%p step.server.com'
```

めんどくさいですね。

そこで例えば上記のようなコマンドをSSH Configに設定し、

```
Host serverA
    HostName 10.0.0.1
    User tubone24
    Port 22
    IdentityFile ~./ssh/id_rsa
    LocalForward   127.0.0.1:80:intra.example.com:80
    ProxyCommand ssh -p 22 -W %h:%p step.server.com
```

次のようにエイリアスでアクセスできるようにするわけです。

```
ssh serverA
```

ちなみに、ZSHでは[zsh-completions](https://github.com/zsh-users/zsh-completions)という補完プラグインを設定することで、

SSH Configのtab補完をしてくれるので上記との合わせ技でかなり効率的になります。

## 課題

とっても便利なSSH Configですが、PC移行や環境構築時、いろいろやっかいです。

### 鍵とまとめて設定しなければならない

まぁ当たり前と言えば当たり前なのですが、SSH Config上で設定した鍵ファイルも併せて管理しないと当然サーバーにアクセスできません。

私の働いている現場では、**鍵ファイルをS3に配置し**、アクセス権を持ってる鍵が必要な人が各々鍵をローカルにダウンロードする必要があります。

せっかくSSH Configだけ別のPCに移行しても結局鍵のダウンロードが必要なわけです。

### SSH Configも立派な機微なファイル

鍵ファイルは前述の通りですが、じゃあSSH Configの受け渡しはどうでしょう？

SSH ConfigにはサーバーのIPアドレス、ログイン名などかなりセキュリティー上機微な情報が入っており、

dotfileのように、GitHubのレポジトリー管理にするのもはばかられます。

## 課題への解

さて、こちらの課題を整理すると

1. SSH鍵も一元的に管理したい
2. SSH Config自体も安全に管理したい

となります。

良い方法はあるでしょうか？

## SSH Config JSON

そこでボクは~~オリーブオイル~~ SSH Config JSON。

SSH ConfigをJSON形式で鍵ファイルとともに1ファイルにラッピングし、AES暗号で暗号化する、というツールを作ってみました。

## 特徴

- SSH ConfigのJSON変換、複合ができます
- IdentityFile(SSH鍵)をJSONにラッピングし一元管理できます
- AES暗号に対応し、JSONを暗号化しSSH鍵とともに安全に管理できます

## 使い方

主な使い方はRead the docsにドキュメントサイトを作りましたのでそちらをご参照ください。

<https://ssh-config-json.readthedocs.io/en/latest/>

一例を書きますとまずインストールはpipで行います。

```
pip install ssh-config-json
```

するとGlobalコマンドに**scj**というものができます。

**S**sh **C**onfig **J**sonですね。

自らの~/.ssh/configをSSH鍵もセットでJSONにしたければ

```
scj dump dump_config.json -i
```

とするとdump.jsonとしてSSH ConfigをラッピングしたJSONができます。

復元したければ

```
scj restore dump_config.json -i
```

とやることで、SSH鍵とともに展開されます。

さらに暗号化オプションをつければ

```
scj dump dump_config.json -i -e
```

とJSONを暗号化したファイルが生成され、AESキーを使った複合もできます。

## 技術解説

特に難しい技術は使ってませんが、このブログの趣旨はそういったところにあると思うので解説します。

### コマンドパーサー

コマンドパーサーはおなじみdocoptです。もう何回目でしょうか。お世話になっております。

やはり便利なのはusageを書いているとロジックもできあがるところで、なんというかまぁ本当にべんりです。

Nimのdocoptの解説になってしまいますが、詳しくは[docoptはNimでも使えたのお話](https://blog.tubone-project24.xyz/2019/11/20/docopt-nim)をご確認ください。

### コマンドラインパーサーのテストコード

docoptを絡めたテストコードを今回は書いてみました。とはいい、これはもはやdocopt本体のテストになってしまうのでアンチパターンになりますが。

本来的には、docoptをmock化するのが正義なんですけど、自前でパーサー作った場合とかに使えそうなのでまぁいいでしょう。

docoptの実装はどうやらsys.argvからコマンドライン引数を取り出しているようです。当たり前といえば当たり前か。

Pytestなどのテストランナーに書けた際、sys.argvはテストランナーに渡したものが入っているので

```
    def test_main_dump(self):
        del sys.argv[1:]
        sys.argv.append("dump")
        sys.argv.append("tests/assets/test_config_xxx")
        sys.argv.append("-c")
        sys.argv.append("tests/assets/test_config")
        with patch("builtins.open") as mock_open:
            main()
            mock_open.assert_any_call("tests/assets/test_config_xxx", "w")
            mock_open.assert_any_call("tests/assets/test_config")
        del sys.argv[1:]
```

のように無理矢理sys.argvを任意の値に変更することで、テスト対象にコマンドライン引数が渡せます。

終わったらお片づけでdel文を忘れずに！

### Pycryptodome

AESの暗号化には**Pycryptodome**を利用してます。

Pythonの暗号化ライブラリといえばpycryptoが有名ですが、こちらはPyPIを見ると2013/10/13以降更新がありません。（涙）なので、今回はPycryptodomeを使うことにしました。

[AES対応のPython暗号化ライブラリを比較検証してみた](https://dev.classmethod.jp/articles/python-crypto-libraries/)を確認してみるに、Pycryptodomeは低レベルの暗号化ライブラリらしく、低レベルの暗号ライブラリーは難しいと聞いてましたが、使ってみて案外ドキュメントがしっかりしていたことと、英語であれば結構実装例が出てきたので予想よりは詰まらなかったです。

### AES暗号化 EAXモード

今回は暗号利用モードは[公式ドキュメント](https://pycryptodome.readthedocs.io/en/latest/src/examples.html#encrypt-data-with-aes)通りEAXモードを使いました。

そもそも暗号利用モードってなに？という人は下の画像を見てみてください。

![img](https://i.imgur.com/OrwJJwp.jpg)

通常暗号化というものはとある文字列（バイト列）を別の文字列（バイト列）に変換するものなので、暗号化結果の出現度合いによってその全容がわかってしまってはいけません。

そこで、AES(今回は話が分かりやすいようにブロック暗号に絞ります)ではいくつかの暗号利用モードを定義し、例えばCBCというモードでは前の暗号ブロック（最初の場合は初期化ベクトル）と次の平文のブロックのXORをとり、そこへ暗号をかけるようにします。

そうすることにより、同じ平文、同じ鍵を用いた場合一つ前のブロックと次のブロックとの間で出現する文字列が異なってくるので暗号文から推測される可能性を少なくすることができます。

ちょっと古いですがエニグマ暗号もブロック暗号ではないですが、出現する文字のパターンから平文への頻度分析から判断されないように単純な換字式暗号ではなく、入力ごとに換字表が入れ替わるローターを仕込んでいた形で、ちょっと仕組みはCBCと比べるとあっさりしてますが、まぁやりたいことは似たような感じですね。

![img](https://i.imgur.com/OrwJJwp.jpg)

さて、話を戻します。

EAXモード[EAXモード（encrypt-then-authenticat-then-translate）](https://en.wikipedia.org/wiki/EAX_mode)は、暗号ブロック暗号の動作モードの一つで、メッセージの認証（完全性）と秘匿性を同時に提供するように設計されたモードで、いわゆる**Authenticated Encryption with Associated Data (AEAD) アルゴリズム**となっております。

![img](https://i.imgur.com/bbXnZFo.png)

上の図のように、ブロックを暗号化をする1パスとブロックごとの真正性を実現するための1パスの2パス方式を採用することが特徴です。

えっ！じゃあ、暗号利用モードのCBCモードは何が担保できないんですか？？って思ったあなた！するどいですね。どうやら、CBCモードなどの古いモードではHMAC SHAなどのハッシュをかけることでダイジェストを作り、完全性を担保しているらしいです。CBC-HAMCという方式ですね。ふーむ。

EAXモードでは完全性と秘匿性の担保を1つの暗号化フローの中で実現し、効率よく両方を担保しているとのこと。

![img](https://i.imgur.com/bbXnZFo.png)

とは言ってもPycryptodomeではmodeをEAXにするだけで簡単に使えるので細かく考える必要はなさそうです。

### 鍵のハッシュ化

ご存じの通りAESでは共通鍵の鍵長として、128bitから256bitまで選ぶことができます。

特に迷うことないので256bitの鍵を利用することにしました。

が、しばしば問題になるのが256bit、つまり32byteの鍵バイト列を人は簡単に作れない、ということです。

パスワードポリシーが、32文字のASCII文字です！それ以上でもそれ以下でもいけません。だったら辛いでしょう。

また、貧弱な鍵バイト列のせいで総当たり攻撃をされてもいけません。

そこで一般に、ユーザーからの入力された鍵に対してハッシュ関数をかけたものを鍵バイト列として使うことが知られてます。

こうすることで上記の問題は解決できます。（とは言ってもハッシュから鍵バイト列を推測されないようによくあるpasswordのような文字はやめましょう。）

### MD5問題

さて、前述の通りハッシュ関数を使って指定バイトのキーを生成すればいいですがここで問題が起きます。

**32バイトのハッシュを作るにはどのハッシュ関数を使えばいいんだろう？**

いくつか公開されているサンプルコードでは、**md5** を利用してました。

md5を使うと次のようになります。

```
import hashlib

key = hashlib.md5(key.encode("utf-8")).hexdigest()).encode("utf-8")
```

ぶっちゃけ後で調べたら[StackOverFlow](https://stackoverflow.com/questions/47002578/algorithm-to-generate-12-byte-hash-from-web-urls)にもある通り、暗号化に使う鍵のハッシュ関数はもっとそこまで安全性を考慮する必要はないので

md5が正解だったようですが、何となく前時代的なハッシュ化アルゴリズムが嫌だったのでSHA-3世代のShake128を使うことにしました。

ShakeはいわゆるSHA-3ファミリーのハッシュ関数ですが、可変長のダイジェストを作り出すことができます。128bitつまり、16バイトのダイジェストを作る場合には次のようなコードになります。

```
key = hashlib.shake_128(key.encode("utf-8")).hexdigest(16)).encode("utf-8")
```

### 初期化ベクトル

初期化ベクトルとは、ブロック暗号にて同じ平文を暗号文にした際、その形質が同じになってしまうことによりセキュリティー驚異を取り除くために、使われる概念です。

ちょっと意味合いはことなりますが、エニグマ暗号の初期値乱数表みたいなものです。

こちらはランダム性が高いほどセキュリティーが向上するため、次のようにPycryptodomeのRandom.get_random_bytesから生成します。
