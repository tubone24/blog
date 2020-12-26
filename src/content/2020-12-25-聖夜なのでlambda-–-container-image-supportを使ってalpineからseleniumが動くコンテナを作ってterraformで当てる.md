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

こちらBuildし終わるとあら大変。せっかくのAlpineの41.1MBの軽量イメージが1.14GBと台無しになってしまいました。

```
# Alpine
python         3.7-alpine       f82a49b6a141   10 days ago      41.1MB

# Selenium
selenium       latest           acc90965ec5b   30 hours ago     1.14GB

```

こちらなんとかするためにRICがインストールできたら、build関係のパッケージをRICのインストールが終わったら同一レイヤーで消してしまいましょう。(別レイヤーにするとファイルの増減が記録されてしまうので注意)

```
RUN apk add --update \
    # Add Dependencies for compile AWS Lambda ric
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
      pip install -r requirements.txt && \
        pip install --target /app awslambdaric && \
        rm /app/requirements.txt && \
      apk del \
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
        groff

```

こうすることで（後述する日本語フォントも入れながら）846MBまで削減することができました。同一レイヤーでいらないものは消す。これ、偉い人とのお約束。

```
selenium   latest           04304fcd4549   18 minutes ago   846MB
```

## ついでに日本語フォントもインストールする

さて、Seleniumを使うときつきまとうのはフォント豆腐問題です。

![img](https://i.imgur.com/tjIJUBn.jpg)

日本語のようにASCII文字では表現できない文字は、対応するフォントがインストールされていないと文字の代わりに小さい四角(□)、通称"豆腐"が表示されることがあります。麻雀の白ではないですよ。

当然Alpineのような軽量Imageには日本語フォントなんて入ってません。

さて、フォント豆腐問題の解消によく使うのが[Google Noto Fonts](https://www.google.com/get/noto/)です。

ただし、Noto Fontsそのものすべてを使うとアラビア語(اللغة العربية)やサンスクリット語(संस्कृत)なんかも入ってしまい、1.1GBになってしまいます。

そこで、日本語フォントだけ利用したいので、Noto Sans CJK JPとNoto Serif CJK JPをダウンロードして/usr/share/fonts配下に展開します。
また、展開したフォントをシステムが使えるようにfc-cacheも実行していきます。

ちなみにCJKというのはChinese, Japanese, Koreanのことらしいです。

ついでにASCIIフォントのfreefontもインストールします。

```
RUN apk add --update \
        ttf-freefont \
        freetype \
        fontconfig \
      mkdir noto && \
        wget -P /app/noto https://noto-website.storage.googleapis.com/pkgs/NotoSansCJKjp-hinted.zip && \
        wget -P /app/noto https://noto-website-2.storage.googleapis.com/pkgs/NotoSerifCJKjp-hinted.zip && \
        unzip /app/noto/NotoSansCJKjp-hinted.zip -d /app/noto && \
        unzip -o /app/noto/NotoSerifCJKjp-hinted.zip -d /app/noto && \
        mkdir -p /usr/share/fonts/noto && \
        cp /app/noto/*.otf /usr/share/fonts/noto && \
        chmod 644 -R /usr/share/fonts/noto/ && \
        rm -rf /app/noto && \
        fc-cache -fv
```

## エントリーポイント他設定

最後にエントリーポイントとコマンドを設定します。

[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)に書いてあるとおり、エントリーポイントは**awslambdaric**をコマンドは実際のLambdaが起動するときに動く関数を選択します。

```
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "app.handler" ]
```

## Seleniumを書いていく

さてSeleniumのランナーに移っていきます。

先程コマンドでapp.handlerを指定したので、モジュール名はapp.py、関数名はhandlerでいきます。

また、apkでインストールしたChrome(Chromium)、Chrome-driverはそれぞれ**/usr/bin/chromium-browser** **/usr/lib/chromium/chromedriver**に存在してます。

まずはとりあえずSlackのログインページを開きます。次のように組んでいきます。

```
from selenium import webdriver
from selenium.webdriver.chrome.options import Options

SLACK_LOGIN_URL = "https://xxxxx.slack.com"
chrome_path = "/usr/bin/chromium-browser"
chromedriver_path = "/usr/lib/chromium/chromedriver"

def handler(event, context):
    o = Options()
    o.binary_location = chrome_path
    o.add_argument('--headless')
    o.add_argument('--disable-gpu')
    o.add_argument('--no-sandbox')
    o.add_argument('--window-size=1920x1080')
    
    d = webdriver.Chrome()
    d.get(SLACK_LOGIN_URL)
```

Chromeの起動オプションに指定している--headless、--disable-gpu、--no-sandboxはいずれも画面のないLambdaでは必須のオプションで、それぞれ--headlessはヘッドレス起動(ディスプレイやキーボード、マウスなどの入出力機器を接続しない状態をヘッドレスと言います)、--disable-gpuはGPU無効(--headlessオプションと併用必須らしい)、--no-sandboxはサンドボックス起動無効化のことらしいです。

ちなみに、Chrome(Chromium)はセキュリティ向上のため、レンダリングやスクリプトエンジンをSandboxというchrootで隔離された環境で動かすそうです。

Dockerコンテナ内でchrootをするにはdocker側でそのホストのすべてのデバイスへのアクセスを許可する必要があり、–privilegedオプションが必要となります。

ただ、Lambdaではこちらは許容されないため、–no-sandboxをつけてsandboxを無効化しなければいけません。脆弱性を突かれるとアプリのソースにアクセスされてしまう可能性は残りますが...。

さて、こちらのコードでLambdaにイメージをデプロイして見ると次のようなエラーを吐き出し動きませんでした..。

```
  File "/app/python/lib/python3.6/site-packages/selenium/webdriver/remote/errorhandler.py", line 242, in check_response
    raise exception_class(message, screen, stacktrace)
selenium.common.exceptions.WebDriverException: Message: unknown error: Chrome failed to start: crashed.
  (unknown error: DevToolsActivePort file doesn't exist)
  (The process started from chrome location /usr/bin/chromium-browser is no longer running, so ChromeDriver is assuming that Chrome has crashed.)
```

Chromeがクラッシュしてしまった、という意味合いとはわかりますがどうにもわかりません。エラーがわかりにくいのがSeleniumの悪いところです。

## --disable-dev-shm-usage

さらに調べていくと次のようなことがわかりました。--disable-dev-shm-usageというオプションが必要だったようです。

Chromeではキャッシュ用にtmpfs(/dev/shm)を利用しているのですがLambdaがこちら64MBしかないので落ちてしまうそうです。なので、キャッシュは/tmpを利用してもらうべく--disable-dev-shm-usageも追加する必要があります。

ちなみに、Lambdaの/tmpは最近調べたのですが512MBくらいありました。

```
def handler(event, context):
    o = Options()
    o.binary_location = chrome_path
    o.add_argument('--headless')
    o.add_argument('--disable-gpu')
    o.add_argument('--no-sandbox')
    o.add_argument('--window-size=1920x1080')
    o.add_argument('--disable-dev-shm-usage')

    d = webdriver.Chrome()
    d.get(SLACK_LOGIN_URL)
```
