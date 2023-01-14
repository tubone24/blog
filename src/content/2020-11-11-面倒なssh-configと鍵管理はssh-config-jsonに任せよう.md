---
slug: 2020/11/11/ssh-confiig-json
title: 面倒なSSH Configと鍵管理はssh-config-jsonに任せよう
date: 2020-11-11T14:42:50.126Z
description: 面倒なSSH Configと鍵管理はssh-config-jsonに任せよう
tags:
  - サーバー
  - Python
  - SSH
headerImage: https://i.imgur.com/qBFYNb6.png
templateKey: blog-post
---
PCの入れ替えのたびにSSH Configとその鍵の扱いに困るので作ってみました。

## Table of Contents

```toc

```

## はじめに

皆さんはサーバーへの**SSH**、どうしてますか？

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

SSH ConfigにはサーバーのIPアドレス、ログイン名などかなりセキュリティ上機微な情報が入っており、

dotfileのように、GitHubのレポジトリー管理にするのもはばかられます。

## 課題への解

さて、こちらの課題を整理すると、

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

一例を書きますとまずインストールはpipで行ないます。

```
pip install ssh-config-json
```

するとGlobalコマンドに**scj**というものができます。

**S**sh **C**onfig **J**sonですね。

自らの~/.ssh/configをSSH鍵もセットでJSONにしたければ、

```
scj dump dump_config.json -i
```

とするとdump.jsonとしてSSH ConfigをラッピングしたJSONができます。

復元したければ、

```
scj restore dump_config.json -i
```

とやることで、SSH鍵とともに展開されます。

さらに暗号化オプションをつければ、

```
scj dump dump_config.json -i -e
```

とJSONを暗号化したファイルが生成され、AESキーを使った複合もできます。

## 技術解説

特に難しい技術は使ってませんが、このブログの趣旨はそういったところにあると思うので解説します。

## コマンドパーサー

コマンドパーサーはおなじみ**docopt**です。もう何回目でしょうか。お世話になっております。

やはり便利なのはusageを書いているとロジックもできあがるところで、なんというかまぁ本当にべんりです。

Nimのdocoptの解説になってしまいますが、詳しくは[docoptはNimでも使えたのお話](https://blog.tubone-project24.xyz/2019/11/20/docopt-nim)をご確認ください。

### コマンドラインパーサーのテストコード

docoptを絡めたテストコードを今回は書いてみました。とはいい、これはもはやdocopt本体のテストになってしまうのでアンチパターンになりますが。

本来的には、docoptをmock化するのが正義なんですけど、自前でパーサー作った場合とかに使えそうなのでまぁいいでしょう。

docoptの実装はどうやら**sys.argv**からコマンドライン引数を取り出しているようです。当たり前といえば当たり前か。

Pytestなどのテストランナーに書けた際、sys.argvはテストランナーに渡したものが入っているので、

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

**終わったらお片づけでdel文を忘れずに！**

## Pycryptodome

AESの暗号化には**Pycryptodome**を利用してます。

Pythonの暗号化ライブラリといえばpycryptoが有名ですが、こちらはPyPIを見ると2013/10/13以降更新がありません。（涙）なので、今回はPycryptodomeを使うことにしました。

[AES対応のPython暗号化ライブラリを比較検証してみた](https://dev.classmethod.jp/articles/python-crypto-libraries/)を確認してみるに、Pycryptodomeは低レベルの暗号化ライブラリらしく、低レベルの暗号ライブラリーは難しいと聞いてましたが、使ってみて案外ドキュメントがしっかりしていたことと、英語であれば結構実装例が出てきたので予想よりは詰まらなかったです。

### AES暗号化 EAXモード

今回は暗号利用モードは[公式ドキュメント](https://pycryptodome.readthedocs.io/en/latest/src/examples.html#encrypt-data-with-aes)通り**EAXモード**を使いました。

そもそも暗号利用モードってなに？という人は下の画像を見てみてください。

![img](https://i.imgur.com/OrwJJwp.jpg)

通常暗号化というものはとある文字列（バイト列）を別の文字列（バイト列）に変換するものなので、暗号化結果の出現度合いによってその全容がわかってしまってはいけません。

そこで、AES(今回は話が分かりやすいようにブロック暗号に絞ります)ではいくつかの暗号利用モードを定義し、例えばCBCというモードでは前の暗号ブロック（最初の場合は初期化ベクトル）と次の平文のブロックのXORをとり、そこへ暗号をかけるようにします。

そうすることにより、同じ平文、同じ鍵を用いた場合1つ前のブロックと次のブロックとの間で出現する文字列が異なってくるので暗号文から推測される可能性を少なくできます。

ちょっと古い内容かつ厳密にはブロック暗号ではないですが、エニグマ暗号も出現する文字のパターンから平文への頻度分析から判断されないように単純な換字式暗号を用いず、入力ごとに換字表が入れ替わるローターを仕込んで対策してました。ちょっと仕組みはCBCと比べるとあっさりしてますが、まぁやりたいことは似たような感じですね。

![img](https://i.imgur.com/LNR7N4P.jpg)

さて、話を戻します。

EAXモード[EAXモード（encrypt-then-authenticat-then-translate）](https://en.wikipedia.org/wiki/EAX_mode)は、暗号ブロック暗号の動作モードの1つで、メッセージの認証（完全性）と秘匿性を同時に提供するように設計されたモードで、いわゆる**Authenticated Encryption with Associated Data (AEAD) アルゴリズム**となっております。

![img](https://i.imgur.com/bbXnZFo.png)

上の図のように、ブロックを暗号化をする1パスとブロックごとの真正性を実現するための1パスの2パス方式を採用することが特徴です。

えっ！じゃあ、暗号利用モードのCBCモードは何が担保できないんですか??って思ったあなた！するどいですね。どうやら、CBCモードなどの古いモードではHMAC SHAなどのハッシュをかけることでダイジェストを作り、完全性を担保しているらしいです。CBC-HAMCという方式ですね。ふーむ。

EAXモードでは完全性と秘匿性の担保を1つの暗号化フローのなかで実現し、効率よく両方を担保しているとのこと。

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

ぶっちゃけあとで調べたら[Stack Overflow](https://stackoverflow.com/questions/47002578/algorithm-to-generate-12-byte-hash-from-web-urls)にもあるとおり、暗号化に使う鍵のハッシュ関数はもっとそこまで安全性を考慮する必要はないので、

md5が正解だったようですが、何となく前時代的なハッシュ化アルゴリズムが嫌だったのでSHA-3世代のShake128を使うことにしました。

ShakeはいわゆるSHA-3ファミリーのハッシュ関数ですが、可変長のダイジェストを作り出すことができます。128bitつまり、16バイトのダイジェストを作る場合には次のようなコードになります。

```
key = hashlib.shake_128(key.encode("utf-8")).hexdigest(16)).encode("utf-8")
```

### 初期化ベクトル

初期化ベクトルとは、ブロック暗号にて同じ平文を暗号文にした際、その形質が同じになってしまうことによりセキュリティ驚異を取り除くために、使われる概念です。

ちょっと意味合いはことなりますが、エニグマ暗号の初期値乱数表みたいなものです。

こちらはランダム性が高いほどセキュリティが向上するため、次のようにPycryptodomeのRandom.get_random_bytesから生成します。

```
initialization_vector = Random.get_random_bytes(AES.block_size)
cipher = AES.new(self.key, AES.MODE_EAX, initialization_vector)
```

### バイト列の書き込み

Python書いたことある人なら当たり前とは思いますが、バイト列の書き込みをする際はopenモードをバイナリーにしないといけません。

```
    def encrypt_file(self, path, delete_raw_file=False):
        with open(path, "r") as f1, open(path + ".enc", "wb") as f2:
            f2.write(self.encrypt(f1.read()))
        if delete_raw_file:
            os.remove(path)
        print(f"Encrypted file: {path}.enc")
```

## Lint

Pythonのコード規約チェックはpep8からflake8など多岐にわたり、かつPytestなどのテストランナーと組み合わせることができますが、今回はBlackを使います。

Blackはpep8と比べかなり制約の強い（柔軟性の低い）Pythonコードフォーマッタです。

Blackの公式Docには、

> Blackを使用することで、あなたは手作業でのフォーマットの細かい部分のコントロールを譲ることに同意したことになります。その見返りとして、Blackはあなたにスピード、決定論、そしてフォーマットに関するpycodestyleの口煩いからの自由を与えてくれます。時間と精神的エネルギーを節約して、より重要なことに充てることができるようになります。

と書いてあります。本当にその通りだと思います。

Blackはフォーマットチェックのほか、自動フォーマットにも対応してるのでautopep8と同じ用な使い方ができるわけです。

```
 black ssh_config_json
```

autopep8との違いはその規約の厳しさと柔軟性の欠如にあります。

pep8では強制されないような、改行の仕方や、シングルクォートとダブルクォートの統一、末尾カンマの統一、余計な丸括弧の削除、数値リテラルの書き方までも細かく強制されます。

まさに、公式も言っているとおりフォーマットでのコントロールを完全に譲ることになります。

pep8では特定のルールの無効化を細かく設定できますが、Blackはフォーマット適用ソースと最大行文字数しか制御できません。

```
[tool.black]
line-length = 88
target-version = ['py37']
include = '\.pyi?$'
exclude = '''

(
  /(
      \.eggs         # exclude a few common directories in the
    | \.git          # root of the project
    | \.hg
    | \.mypy_cache
    | \.tox
    | \.venv
    | _build
    | buck-out
    | build
    | dist
  )/
  | foo.py           # also separately exclude a file named foo.py in
                     # the root of the project
)
'''
```

> Black化されたコードは、あなたが読んでいるプロジェクトに関係なく同じように見えます。しばらくすると書式設定が透明になり、代わりにコンテンツに集中することができます。

まさにその通りで、「ロジックは問題ないけど、なんでこの書き方なんですか？見にくいですよ？」みたいな不毛な議論は「だってBlackが」と言えるわけです。

SSH Config JSONではBlackフォーマットを採用してます。

[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## CI/CDに載っける

せっかくテストコードも書いたので、CI載っけましょう。

毎度おなじみGitHub Actionsです。

正直、最近はGitHub Actions一択になりつつあります。

PRのタイミングでテストとBlackのフォーマットチェックを走らせます。

--checkオプションをつければ、フォーマットがゴミだとエラーで落ちてCIがfailedするようになります。

```
 black ssh_config_json  --check
```

## PyPIに自動デプロイする

さて、ここまできてらもう自動でPyPIにパッケージ登録できるようにしたいですね。

PyPIへのパッケージ登録を行なうには当然パッケージを作らないと行けませんが、Pythonの場合setup.pyを記載することで作ることができます。

さらに、setup.pyはただのPythonコードでしかないので、それをコンフィグに起こしたsetup.cfgという方法もあります。

下記のようにパッケージの情報を記載し、

```
[metadata]
name = ssh_config_json
version = attr: ssh_config_json.__version__
description = Dump JSON for your ssh config include IdentityFiles and restore those.
long_description = file: README.rst, CHANGELOG.rst
long_description_content_type = text/x-rst
url = https://github.com/tubone24/ssh_config_json
project-urls =
    Documentation = https://ssh-config-json.readthedocs.io/en/latest/
    ProjectBlog = https://blog.tubone-project24.xyz
author = tubone24
author_email = tubo.yyyuuu@gmail.com
keywords = ssh-config, json, backup, AES
license = MIT
license-file = LICENSE
platform = any
classifiers =
    Development Status :: 4 - Beta
    Intended Audience :: Developers
    License :: OSI Approved :: MIT License
    Operating System :: OS Independent
    Topic :: Documentation :: Sphinx
    Topic :: System :: Archiving :: Backup
    Programming Language :: Python
    Programming Language :: Python :: 3.6
    Programming Language :: Python :: 3.7
    Programming Language :: Python :: 3.8

```

setup.pyでsetup.cfgを読み込むようにして、

```
from setuptools import setup

setup()
```

```
python setup.py sdist bdist_wheel
```

でdist配下にパッケージ作成ができます。簡単ですね。



### バージョン管理

PyPIでは同一バージョンのパッケージ登録ができません。

次のようにsetup.pyもしくはsetup.cfgのいずれかにバージョンを指定すれば
いいのですが *attr* を使って次のようにすることでPythonコード上に設定した変数を読み込むことができるので、
CLIのバージョン表示と平仄をとることができます。

```
IntelliJ IDEAPyCharm   
[metadata]
name = ssh_config_json
version = attr: ssh_config_json.__version__
description = Dump JSON for your ssh config include IdentityFiles and restore those.
```

さらに、パッケージ登録についても[pypa/gh-action-pypi-publish](https://github.com/marketplace/actions/pypi-publish)を使えば簡単に実装できます。

```
      - name: Publish package
        uses: pypa/gh-action-pypi-publish@master
        with:
          user: tubone24
          password: ${{ secrets.pypi_password }}
          skip_existing: true
```

## 結論

いろいろなことを組み合わせて、便利ツールが実装できました。ありがとうございました。
