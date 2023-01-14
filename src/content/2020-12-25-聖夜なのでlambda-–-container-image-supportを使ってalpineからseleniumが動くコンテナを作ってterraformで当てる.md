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
headerImage: https://i.imgur.com/dmGb7V6.png
templateKey: blog-post
---
寂しいクリスマスです。

## Table of Contents

```toc

```

## Lambda – Container Image Support

12/1 **[Lambda – Container Image Support](https://aws.amazon.com/jp/blogs/aws/new-for-aws-lambda-container-image-support/)**が発表されました。

![img](https://i.imgur.com/ZWIqgQZ.png)

Lambda作成画面にもContainer Imageが出てきております。

発表当初はあまり注目してなかったのですがとある思いつきをしました。

**Selenium載っける運用なら案外使い勝手いいかもしれない？**と。

## Container Image Supportで何がうれしいの?

Container Image SupportとはLambdaでDocker ImageからContainerが使えますよーということなのですが、使い所はあるのでしょうか？

色々メリットあると思いますが、私が思うに、

- イメージは10GBまでデプロイできる
- Lambda Runtime Interface Emulatorを使ってローカルで実行できる

の2点が嬉しい点だと思います。

**Seleniumでそんなに容量使うのか？**問題はありますが、機会学習の推論をLambdaで実行させる、とかだと容量の壁や、Cライブラリビルドのアーキテクチャ差分に苦しめられる煩わしいパッケージ導入もなくなるのでもしかしたら使えるのかもですね。

## LambdaでSeleniumと言えばserverless-chromeですが

LambdaでSeleniumを動かすと言えばつい最近まで[serverless-chrome](https://github.com/adieuadieu/serverless-chrome)が有名です。

ようはLambdaのZIPパッケージ制限(一昔前はアップロード10MB, S3経由200MBだった)に引っかからないくらい小さくしたChromeをLambdaにパッケージ内包して、Seleniumのランナーから動かすわけです。

とはいえ、環境構築で一癖も二癖もあるserverless-chromeなので、今回は普通のChromeをheadless起動させるDockerコンテナを作ってそれをLambdaで起動していくことで簡単構築ができるのではないか、というのがこの検証の趣旨です。

## 今回やりたいこと、というか課題

話は変わりますが弊社にはSlackのWorkSpaceが乱立してます。

さらに勤怠連絡もSlackに書き込むのですが乱立したWorkSpaceにすべて書き込むのはちょっとめんどくさいです。

(以前はSlackのほかTeamsやらメールやら電話やらあらゆる媒体で一斉勤怠連絡しないといけなくてこれでも楽になりました。)

じゃあ、Slack APIとか使って、相互投稿とかして解決すればいいじゃんとなりそうですが、一部のWorkSpaceはセキュリティの観点から外部連携が禁止とのこと。なんじゃそりゃ...。

![img](https://i.imgur.com/odKSxHU.png)

そこで、セキュア(笑)なSlackのスクリーンショットを取り、普段使っているSlackへ投稿する仕組みにすれば、少なくとも連絡はしたようなものなので、まぁ楽でしょう！ということで作っていきます。

## Alpine Python:3.7

軽量イメージで有名な[Apline](https://hub.docker.com/_/alpine)をベースイメージにします。

はい、この選択肢はとある理由で**間違い**でした、がそれはこの先わかることです。

軽いから使う、という安直極まりない選定で言ってしまったのが後々後悔となりますので、皆さん、ちゃんと調べましょう。

### Container Image Supportを使うにはRICが必要

Lambdaは起動する際にAWS基板側からAWS LambdaランタイムAPIでランタイムをキックすることで実現してます。

そうです。Container Image SupportといいつつもLambdaで実現する以上、こいつを受け取らないといけないのです。

なので単純にdocker runで起動するコンテナイメージを作るだけじゃLambdaには載っけられないので、AWS Lambda Runtime Interface Clients(RIC)というOSSがAWSから提供されてます。

例えばPythonであれば[AWS Lambda Python Runtime Interface Client
](https://github.com/aws/aws-lambda-python-runtime-interface-client)があります。

こいつを介してLambda起動させるわけです。

こいつがやっかいでした。[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)にも書いてありましたが、インストールにLinuxのBuild tool類が必要で、結局Alpineの軽量さの恩恵を受けられませんでした。

とはいえ、落ち込んでいても仕方ないので、まずはSelenium Pythonが動く環境を作っていきます。

Dockerfileを使って、RIC関連とChrome, Chrome-driverを入れていきます。

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

RICを入れるには[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)では、g++、make、cmake、unzip、libcurl4-openssl-devがでしたが、それはUbuntuベースのイメージだったからで、Alpineでは、他に、**autoconf**や**automake**など結構色々必要でした。めんどくさい...。

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

必要なパッケージが入ってないと**You need automake version 1.7 or newer installed.**のようにRICのインストールで怒られてしまいます。こんな罠があるとは..。

あれこれあれこれ試行錯誤し、うまくいけば次のようにRICのBuildが終わってめでたしめでたしです。

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

また、肝心のChromeとChrome-driverはapkでそのまま入れればいいので実にこちらは簡単です。

apkからインストールすることで常に、stableでインストールするので、chromedriverとのバージョンを意識することもありません！れはありがたい。

## Docker Imageを少しでも軽くする

こちらImage Buildし終わるとあら大変。せっかくのAlpineの**41.1MB**の軽量イメージが**1.14GB**と台無しになってしまいました。

```
# Alpine
python         3.7-alpine       f82a49b6a141   10 days ago      41.1MB

# Selenium
selenium       latest           acc90965ec5b   30 hours ago     1.14GB

```

こちらなんとかするためにRICがインストールが完了したタイミングで、build関係のパッケージを同一レイヤーで消してしまいましょう。(別レイヤーにするとファイルの増減が記録されてしまうので注意)

```docker
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

ややこしいですが、こうすることで（後述する日本語フォントも入れながら）846MBまで削減できました。同一レイヤーでいらないものは消す。これ、偉い人とのお約束。

```
selenium   latest           04304fcd4549   18 minutes ago   846MB
```

## ついでに日本語フォントもインストールする

さて、Seleniumを使うときつきまとうのはフォント**豆腐**問題です。

![img](https://i.imgur.com/tjIJUBn.jpg)

日本語のようにASCII文字では表現できない文字は、対応するフォントがインストールされていないと文字の代わりに小さい四角(□)、通称**豆腐**が表示されることがあります。麻雀の白ではないですよ。というより豆腐という日本語が世界語になっているのはすごいですね。

で、話を戻しますが当然Alpineのような軽量Imageには日本語フォントなんて入ってません。

さて、フォント豆腐問題の解消によく使うのが[Google Noto Fonts](https://www.google.com/get/noto/)です。

**No** **to**fuでNotoらしいです。

ただし、配布されているNoto FontsのAll one packageをすべてを使うと例えばアラビア語(اللغة العربية)やサンスクリット語(संस्कृत)なんかも入ってしまい、計**1.1GB**になってしまいます。これは重い。

そこで、日本語フォントだけ利用したい場合、[Noto Sans CJK JP](https://www.google.com/get/noto/#sans-jpan)と[Noto Serif CJK JP](https://www.google.com/get/noto/#serif-jpan)を個別にダウンロードして/usr/share/fonts配下に展開することで容量を抑えることができます。どちらも130MBくらいです。

また、展開したフォントをシステムが使えるようにフォント展開後、fc-cacheも実行していきます。

ちなみにCJKというのは**Chinese**, **Japanese**, **Korean**のことらしいです。

ついでにASCIIフォントのfreefontもインストールします。

```docker
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

これでフォント問題は解決...のはずですが、後半で「だめです」が出るので、さらに改良していくことになります。

## Entrypoint他設定

Lambdaでの起動のため、DockerのEntrypointとCMDを設定します。

[README](https://github.com/aws/aws-lambda-python-runtime-interface-client/blob/main/README.md#creating-a-docker-image-for-lambda-with-the-runtime-interface-client)に書いてあるとおり、Entrypointは**awslambdaric**をCMDは実際のLambdaが起動するときに動く関数を選択します。(ここでは、app.pyのhandler関数)

```docker
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "app.handler" ]
```

## Seleniumが動くようにする

さてSeleniumのランナーに移っていきます。

さきほどコマンドでapp.handlerを指定したので、モジュール名はapp.py、関数名はhandlerでいきます。

また、apkでインストールしたChrome(Chromium)、Chrome-driverはそれぞれ**/usr/bin/chromium-browser** **/usr/lib/chromium/chromedriver**に存在してます。

まずはとりあえずSlackのログインページを開き、タイトルを表示します。次のように組んでいきます。

```python
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
    print(f"PageTitle {d.title}")
```

Chromeの起動オプションに指定している**--headless**、**--disable-gpu**、**--no-sandbox**はいずれもLambdaでのSelenium起動には必須のオプションで、それぞれ**--headless**はヘッドレス起動(ディスプレイやキーボード、マウスなどの入出力機器を接続しない状態をヘッドレスと言います)、**--disable-gpu**はGPU無効(--headlessオプションと併用必須らしい)、**--no-sandbox**はサンドボックス起動無効化のことらしいです。

ちなみに、Chrome(Chromium)はセキュリティ向上のため、レンダリングやスクリプトエンジンをSandboxというchrootで隔離された環境で動かすそうです。

Dockerコンテナ内でchrootをするにはdocker側でそのホストのすべてのデバイスへのアクセスを許可する必要があり、–privilegedオプションが必要となります。

ただ、Lambdaではこちらは許容されないため、–no-sandboxをつけてsandboxを無効化しなければいけません。脆弱性を突かれるとアプリのソースにアクセスされてしまう可能性は残りますが...。

さて、こちらのコードでLambdaにイメージをデプロイして起動して見ると次のようなエラーを吐き出し動きませんでした..。

```
  File "/app/python/lib/python3.6/site-packages/selenium/webdriver/remote/errorhandler.py", line 242, in check_response
    raise exception_class(message, screen, stacktrace)
selenium.common.exceptions.WebDriverException: Message: unknown error: Chrome failed to start: crashed.
  (unknown error: DevToolsActivePort file doesn't exist)
  (The process started from chrome location /usr/bin/chromium-browser is no longer running, so ChromeDriver is assuming that Chrome has crashed.)
```

Chromeがクラッシュしてしまった、という意味合いとはわかりますがどうにもわかりません。エラーがわかりにくいのがSeleniumの悪いところです。

## --disable-dev-shm-usage

さらに調べていくと次のようなことがわかりました。**--disable-dev-shm-usage**というオプションが必要だったようです。

Chromeではキャッシュ用にtmpfs(/dev/shmファイルシステムレベルの共有メモリ)を利用しているのですがLambdaがこちら64MBしかないので落ちてしまうそうです。なので、キャッシュは/tmp(ディスク)を利用してもらうべく**--disable-dev-shm-usage**も追加する必要があります。

ちなみに、Lambdaの/tmpは最近調べたのですが512MBくらいありました。

```python
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
    print(f"PageTitle {d.title}")
```

こちらでエラーは出なくなりましたが、**5分でタイムアウト**してしまいました。

## スピードアップはChrome DriverService

と勝手に聞いてなんとなく納得してしまったので**Chrome DriverService**を使うように書き直したらちゃんとうごきました。なぜなんでしょうねぇー。

```python
def handler(event, context):
    o = Options()
    o.binary_location = chrome_path
    o.add_argument('--headless')
    o.add_argument('--disable-gpu')
    o.add_argument('--no-sandbox')
    o.add_argument('--disable-dev-shm-usage')
    o.add_argument('--window-size=1920x1080')

    print("Start Chrome Session")
    s = Service(executable_path=chromedriver_path)
    s.start()
    d = webdriver.Remote(
        s.service_url,
        desired_capabilities=o.to_capabilities()
    )

    d.get(SLACK_LOGIN_URL)

    print(f"PageTitle {d.title}")
```

## Slackにログインして勤怠チャンネルのスクリーンショットを撮る

さて、Seleniumも無事動いたので、Slackにログインして勤怠チャンネルをパシャっと撮りましょう。

まずはログインページアクセスですが、これはブラウザでhttps://slack-workspace-url.slack.comにアクセスしますと、Eメールとパスワードを聞かれるフォームが出てきます。

![img](https://i.imgur.com/LaMP20t.png)

こちら確認してみると、Elementのidがそれぞれ、email, passwordとなっております。また、Sign inボタンはID signin_btnとなっております。ありがたいですね。

![img](https://i.imgur.com/S8orasB.png)

ということで、idがemailのElementが描画されたらEメール、パスワードを入力し、ボチッとSign inボタンをクリックします。

```
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions

(中略)

    wait = WebDriverWait(d, 10)

    email = wait.until(expected_conditions.visibility_of_element_located((By.ID, "email")))

    email.send_keys(tubone@email.com)

    email = d.find_element(by=By.ID, value="password")
    email.send_keys("hogehoge")

    signin_btn = d.find_element(by=By.ID, value="signin_btn")
    signin_btn.click()

    d.implicitly_wait(10)
    print(f"PageTitle {d.title}")
```

[WebDriverWait](https://selenium-python.readthedocs.io/api.html#module-selenium.webdriver.support.wait)で最大待機秒数を設定後、[expected_conditions.visibility_of_element_located](https://selenium-python.readthedocs.io/api.html#selenium.webdriver.support.expected_conditions.invisibility_of_element_located)で特定の要素が描画されるまで待つようにすることで明示的に要素の描画を待つことが実現できます。

sleep(10)とかよりも効率的で安全ですね。

また、[implicitly_wait](https://selenium-python.readthedocs.io/api.html#selenium.webdriver.remote.webdriver.WebDriver.implicitly_wait)を使うことで何かしらの要素が描画されるまで待つ、みたいなもうちょっと曖昧なこともできます。

ともあれ、これでログインが無事できました。

ログインしたらチャンネルのURLにアクセスします。チャンネルのURLは、

https://app.slack.com/client/xxxxxxxxx/yyyyyyyyy

みたいな感じでyyyyyyがチャンネルと対応してます。あらかじめひかえておきます。

スクリーンショットは[save_screenshot](https://selenium-python.readthedocs.io/api.html#selenium.webdriver.remote.webdriver.WebDriver.save_screenshot)を使えば画面のPNGが撮れます。

ここで少し詰まったのは、Lambdaの場合、**/tmpディレクトリしか書き込み権限がない**ということです。ちょっとハマりました。

/app配下にスクリーンショット吐き出そうとしたらIO Errorになってうまく吐き出せませんでした。

```python
print(d.save_screenshot("/tmp/screen.png"))
```

ちなみに、save_screenshotの戻り値はboolとなっており、Trueは成功、Falseは失敗です。書き込みに失敗してもExceptionはraiseしないので、Python scriptが進んでいってしまい、後半のSlackアップロードでno such fileになってしまいました。難しい。

## Slackにアップロードする

アップロードはSlack APIのfile.uploadを使いました。

あらかじめTOKENとPermissionを設定しておきましょう。

Slack Appを作ったらSlackAPIのOAuth&Permissionsから確認できます。

![img](https://i.imgur.com/Tt6avAl.png)

Permissionsは[channels:join](https://api.slack.com/scopes/channels:join)、[chat:write](https://api.slack.com/scopes/chat:write)、[chat:write.public](https://api.slack.com/scopes/chat:write.public)、[files:write](https://api.slack.com/scopes/files:write)があれば十分だと思います。

![img](https://i.imgur.com/0O9dgma.png)

```python
        url = "https://slack.com/api/files.upload"
        data = {
            "token": SLACK_TOKEN,
            "channels": SLACK_CHANNEL_ID,
            "title": "attend bot",
            "initial_comment": f"({d.title})のattend状況です"
        }
        files = {"file": open(FILENAME, "rb")}
        print(f"Upload To Slack")
        resp = requests.post(url, data=data, files=files)
```

ほとんどモザイクで申し訳ないですが、きっちりSlackにスクリーンショットを投稿できました。

![img](https://i.imgur.com/oHtRLCO.png)

## 一部フォントが豆腐のままになる

確かにうまく言ったのですが、Noto fontsを入れているにも関わらず一部フォントが豆腐のままになってしまう事象が起きてしまいました。

![img](https://i.imgur.com/QxSsfqy.png)

~~12/24なにがあるんでしょうねぇ...~~

色々調べて、[fontconfig](https://www.freedesktop.org/wiki/Software/fontconfig/)でNoto fontを強制適用したり色々しましたがどうにもうまく行かず、しょうがないので日本語フォントの大御所[IPAフォント](https://ipafont.ipa.go.jp/)を入れることにします。

そう言えば、IPAフォントは一般社団法人文字情報技術促進協議会に移管されたようですね。

AlpineでIPAフォントを使うには、

```docker
RUN apk add font-ipa
```

でいいはずなのですが、次のようにパッケージが見つからない警告が出て**うまくいきません**でした。

```
 ---> Running in 1098a4580fb6
fetch http://dl-cdn.alpinelinux.org/alpine/v3.12/main/x86_64/APKINDEX.tar.gz
fetch http://dl-cdn.alpinelinux.org/alpine/v3.12/community/x86_64/APKINDEX.tar.gz
ERROR: unsatisfiable constraints:
  font-ipa (missing):
    required by: world[font-ipa]
```

仕方がないので、[OSDN](https://ja.osdn.net/projects/ipafonts/)からTrueType Fontをダウンロードして、それをImageにADDします。

[IPA Fonts/IPAex Fonts 4書体パック_IPAフォント（Ver.003.03）](https://ja.osdn.net/projects/ipafonts/releases/51868)を使わせていただきました。ADDコマンドで/usr/share/fonts/TTF/配下にTTFファイルを展開して、fc-cache -fvです。

```docker
ADD ./font/*.ttf /usr/share/fonts/TTF/
RUN fc-cache -fv
```

これでフォント豆腐問題は解消しました。やれやれ。

## Slackサインイン警告がでる

もう1つ問題になったのは、LambdaのグローバルIPを固定化していなかったため、変なIPアドレスからログインを実行したという警告がでてしまうことです。

![img](https://i.imgur.com/dmGb7V6.png)

こちらは解決法があり、要は**Lambda in VPC**にしてNatGatewayにEIPを当てて、固定IPからインターネットアクセスをさせてあげればいいわけです。

![img](https://i.imgur.com/GPamgYL.png)

Container Image Supportとはいえ、ここらへんの仕組みはいつも使っているLambdaなので簡単に実現できました。

## Terraform化する

さぁ、すべての舞台が整ったので、Terraform化していきます。

[Resource: aws_lambda_function](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function)も対応しているため、そこまで大変さはありませんでした。ありがとうございます。

Container supportの場合は[package_type](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#package_type)をImageにして[image_uri](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#image_uri)をECRにプッシュしたイメージURIにします。

イメージURIはECRのコンソール画面からでも確認できますが、CIに乗っけるなど考えた場合ちょっと取り回し悪いので、AWS CLI describe-imagesコマンドでimageDigestが確認できますので、Terraform実行時にShellで取得し、動的生成し、terraform apply -var=hogeの形式で変数として渡してやります。

```
aws ecr describe-images --repository-name selenium --image-ids imageTag=latest | jq ".imageDetails[].imageDigest"

"sha256:7ec3ea6afd616c09b291c22e8e7676a8855e05beb1d4ea19af1abc6865e6fe6d"
```

通常のLambdaで必要になる[handler](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#handler)や[runtime](https://registry.terraform.io/providers/hashicorp/aws/latest/docs/resources/lambda_function#runtime)の設定は不要です。Terraformドキュメント上、handlerは必須となっておりますが、**不要**です。

[IntellJ HashiCorp Terraform / HCL language support](https://plugins.jetbrains.com/plugin/7808-hashicorp-terraform--hcl-language-support)を使っているとhandlerとruntimeオプションが無いよ！と怒られてしまいますが、構わず不要で大丈夫です。

![img](https://i.imgur.com/cxxcBx0.png)

## 完成

ということで完成しました。

<https://github.com/tubone24/lambda_container_support_with_selenium>

いろんな技術でうまく行かないことが多かったですが、やりたかったことが無事できました。
