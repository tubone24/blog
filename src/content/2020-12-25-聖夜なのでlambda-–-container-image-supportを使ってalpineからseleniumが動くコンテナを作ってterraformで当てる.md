---
slug: 2020/12/25/selenium-lambda-container
title: Lambda – Container Image Supportを使ってAlpineからSeleniumが動くコンテナを作ってTerraformで当てる
date: 2020-12-25T14:58:26.302Z
description: 最近サポートされたLambdaのContainer Image Supportを使って、Seleniumを動かしてみます。ついでにTerraform化します。
tags:
  - AWS
  - Lambda
  - Selenium
  - Terraform
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---
寂しいクリスマスです。

## Table of Contents

```toc

```

## Lambda – Container Image Support

12/1 Lambdaの**コンテナイメージサポート**が発表されました。

とはいえ、正直カスタムランタイムをしたい気持ちもないし、発表当初はあまり注目してなかったのですがとある思いつきをしました。

**Selenium載っける運用なら案外使い勝手いいかもしれない？**と。

## コンテナサポートで何がうれしいの?

色々メリットあると思いますが、思うに

- イメージは10GBまでデプロイできる
- Lambda Runtime Interface Emulatorを使ってローカルで実行できる

の2点だと思います。Seleniumでそんなに容量使うのか？問題はありますが、機会学習の推論をLambdaで実行させる、とかだとCライブラリ依存関係に苦しめられる煩わしいパッケージ導入もなくなるのでもしかしたら使えるのかもですね。

## LambdaでSeleniumと言えばserverless-chromeですが

LambdaでSeleniumを動かすと言えばつい最近まで[serverless-chrome](https://github.com/adieuadieu/serverless-chrome)が有名です。

ようはLambdaのZIPパッケージ制限(一昔前はアップロード10MB, S3経由200MBだった)に引っかからないくらい小さくしたChromeをSeleniumのランナーから動かすわけです。

とはいえ、環境構築で一癖も二癖もあるserverless-chromeなので、今回は普通のChromeをheadless起動させるDockerコンテナを作ってそれをLambdaで起動していきましょう！

## 今回やりたいこと、というか課題

話は変わりますが弊社にはSlackのWorkSpaceが乱立してます。

さらに勤怠連絡もSlackに書き込むのですが乱立したWorkSpaceにすべて書き込むのはちょっとめんどくさいです。

じゃあ、Slack APIとか使って解決すればいいじゃんとなりそうですが、一部のWorkSpaceはセキュリティーの観点から外部連携が禁止とのこと。なんじゃそりゃ...。

![img](https://i.imgur.com/odKSxHU.png)

そこで、セキュア(笑)なSlackのスクリーンショットを取り、普段使っているSlackへ投稿する仕組みにすればまぁ楽でしょう！ということで作っていきます。

## Alpine Python:3.7

軽量イメージで有名なAplineをベースイメージにします。

はい、この選択肢はとある理由で間違いでした、がそれはこの先わかることです。

軽いから使う、という安直極まりない選定で言ってしまったのが後々後悔となりますので、皆さん、ちゃんと調べましょう。

### Container Supportを使うにはRICが必要

Lambdaは起動する際に基板側からAWS Lambda ランタイム APIでキックされることで実現してます。

そうです。Container Supportでもこいつを受け取らないといけないのです。

なので単純に起動するコンテナイメージを作るだけじゃLambdaには載っけられないので、AWS Lambda Runtime Interface Clients(RIC)というOSSがAWSから提供されてます。例えばPythonであれば[AWS Lambda Python Runtime Interface Client
](https://github.com/aws/aws-lambda-python-runtime-interface-client)があります。

こいつがやっかいでした。[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)にも書いてありましたが、インストールにBuild toolが必要で結局Alpineの軽量さを作り出すことができませんでした。

とはいえ、まずはSelenium Pythonが動く環境を作っていきます。

DockerfileにRIC関連とChrome, Chrome-driverを入れていきます。

```
FROM python:3.7-alpine

ENV PYTHONIOENCODING utf-8
WORKDIR /app

RUN apk add --update \
        build-base \
        libtool \
        autoconf \
        automake \
        libexecinfo-dev \
        make \
        cmake \
        libcurl \
        wget \
        bash \
        which \
        groff \
        udev \
        chromium \
        chromium-chromedriver  && \
        pip install --target /app awslambdaric && \
        pip install selenium
```

RICを入れるには[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)では、g++、make、cmake、unzip、libcurl4-openssl-devでしたが、それはUbuntuベースのイメージだったからで、Alpineでは、他に、autoconfやautomakeなど結構必要でした。めんどくさい...。

```
Collecting awslambdaric
  Downloading awslambdaric-1.0.0.tar.gz (3.2 MB)
    ERROR: Command errored out with exit status 1:
     command: /usr/local/bin/python -c 'import sys, setuptools, tokenize; sys.argv[0] = '"'"'/tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/setup.py'"'"'; __file__='"'"'/tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/setup.py'"'"';f=getattr(tokenize, '"'"'open'"'"', open)(__file__);code=f.read().replace('"'"'\r\n'"'"', '"'"'\n'"'"');f.close();exec(compile(code, __file__, '"'"'exec'"'"'))' egg_info --egg-base /tmp/pip-pip-egg-info-xp6t7j5r
         cwd: /tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/
    Complete output (16 lines):
    buildconf: autoconf version 2.69 (ok)
    buildconf: autom4te version 2.69 (ok)
    buildconf: autoheader version 2.69 (ok)
    buildconf: automake not found.
                You need automake version 1.7 or newer installed.
    Traceback (most recent call last):
      File "<string>", line 1, in <module>
      File "/tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/setup.py", line 94, in <module>
        ext_modules=get_runtime_client_extension(),
      File "/tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/setup.py", line 45, in get_runtime_client_extension
        extra_link_args=get_curl_extra_linker_flags(),
      File "/tmp/pip-install-_vlp4rwk/awslambdaric_c160f1900b624d1a85d1135d75e3b6ef/setup.py", line 18, in get_curl_extra_linker_flags
        check_call(["./scripts/preinstall.sh"])
      File "/usr/local/lib/python3.7/subprocess.py", line 363, in check_call
        raise CalledProcessError(retcode, cmd)
    subprocess.CalledProcessError: Command '['./scripts/preinstall.sh']' returned non-zero exit status 1.
    ----------------------------------------
ERROR: Command errored out with exit status 1: python setup.py egg_info Check the logs for full command output.
```

入ってないと**You need automake version 1.7 or newer installed.**のように怒られてしまいます。こんな罠があるとは..。

うまくいけば次のようにRICのBuildが終わってめでたしめでたしです。

```
Building wheels for collected packages: awslambdaric, simplejson
  Building wheel for awslambdaric (setup.py): started
  Building wheel for awslambdaric (setup.py): still running...
  Building wheel for awslambdaric (setup.py): finished with status 'done'
  Created wheel for awslambdaric: filename=awslambdaric-1.0.0-cp37-cp37m-linux_x86_64.whl size=246020 sha256=4d2550bf826e2ad294aa0335eb87987b63d61d13aad8c06c189c080ff4479ac5
  Stored in directory: /root/.cache/pip/wheels/f2/d6/df/40b746a2bdaca7ceec3244383e8e252c5a9f3870621fd68a37
  Building wheel for simplejson (setup.py): started
  Building wheel for simplejson (setup.py): finished with status 'done'
  Created wheel for simplejson: filename=simplejson-3.17.2-cp37-cp37m-linux_x86_64.whl size=74647 sha256=ffca4c04bc4b3e577dcd91c83e01b3670d6274e1a7dde0177a699c7174a3c8f9
  Stored in directory: /root/.cache/pip/wheels/e5/69/2c/bdcb34114373fc0dbb53242f5df4bf41bce149acac4f8160d0
Successfully built awslambdaric simplejson
```

また、肝心のChromeとChrome-driverはapkでそのまま入れればいいので実に簡単です。stableでインストールするので、driverとのバージョンを意識することもありません！

## Imageを少しでも軽くする

こちらBuildし終わるとあら大変。せっかくのAlpineの軽量イメージが台無しになってしまいました。

```
# Alpine
python                                                              3.7-alpine       f82a49b6a141   10 days ago      41.1MB

# Selenium
selenium       <none>           acc90965ec5b   30 hours ago     1.14GB

```
