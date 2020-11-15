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
