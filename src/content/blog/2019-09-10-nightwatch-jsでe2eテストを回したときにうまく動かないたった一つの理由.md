---
slug: 2019-09-10-nightwatchjs-chromedriver
title: Nightwatch.jsでE2Eテストを回したときにうまく動かないたった一つの理由
date: 2019-09-10T13:00:00.411Z
description: ChromeDriverがGoogleChrome v76 に対応していないらしい。の続編
tags:
  - 自動テスト
  - E2Eテスト
  - ChromeDriver
  - Nightwatch.js
headerImage: 'https://i.imgur.com/MyBxJCZ.png'
templateKey: blog-post
---
エラーをよく読もう・・

前回書いた記事[ChromeDriverがGoogleChrome v76 に対応していないらしい。](https://tubone-project24.xyz/2019-09-03-chromedriver)の解決編です。

出てくるエラーでググってもそれっぽいものが出てこないので苦しい戦いでしたが、

そもそもchromedriverを利用するプログラム[**Nightwatch.js**](https://nightwatchjs.org/)に思考が至らなかったのがまずかったです。

それでは解決編をどうぞ。

## Table of Contents

```toc

```

## エラーのおさらい

当方ではVue.js(TypeScript + Vuex)でフロントエンドアプリをこじんまり作っていてCircleCIでE2Eテストを回していましたが、急にFailedが出るようになり、CIが通らなくなりました。

CircleCIで出ているエラーを見てみると次のようなエラーが出ていました。

```
{ value:
   { message:
      'session not created: Chrome version must be between 71 and 75\n  (Driver info: chromedriver=2.46.628388 (4a34a70827ac54148e092aafb70504c4ea7ae926),platform=Linux 4.15.0-1043-aws x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 668 milliseconds\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'5d045d2f1712\', ip: \'192.168.32.3\', os.name: \'Linux\', os.arch: \'amd64\', os.version: \'4.15.0-1043-aws\', java.version: \'11.0.4\'\nDriver info: driver.version: unknown',
     error: 'session not created' },
  status: 33 }
```

本エラーを詳しく見ていくと、**GoogleChromeのバージョンをv71～v75の間にしなさい**というもので、いろいろなサイトを見るとChromeのバージョンアップに合わせて**ChromeDriverのバージョンも上げないといけない**、ということを知りました。

[GitHub Issue #4800 Message: session not created: Chrome version must be between 71 and 75](https://github.com/timgrossmann/InstaPy/issues/4800)

そこで、前回の記事内で下記のことを実施しました。

- [ChromeDriverとGoogleChromeのVersionを確認する](https://tubone-project24.xyz/2019-09-03-chromedriver#chromedriver%E3%81%A8googlechrome%E3%81%AEversion%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B)
- [CircleCIのDockerfileを確認してみる](https://tubone-project24.xyz/2019-09-03-chromedriver#circleciのdockerfileを確認してみる)
- [Chrome Betaに変えてみる (自前Build環境の作成)](https://tubone-project24.xyz/2019-09-03-chromedriver#chrome-beta%E3%81%AB%E5%A4%89%E3%81%88%E3%81%A6%E3%81%BF%E3%82%8B)

が、しかし結局直りませんでした。

## もう少しちゃんとエラーを見てみる

もう少しちゃんとエラーを見てみます。すると、あることに気が付きます。

***ChromeBetaにバージョンアップしてChromeDriverもバージョンアップしたのにエラーメッセージに出ているChromeDriverのバージョンが想定のものと違う・・***

自前Build環境の作成時に入れたChromeDriverのバージョンは`77.0.3865.40`でした。

ちゃんとこちらはCIのログに出力されていまして、Chromeのバージョンとも合っています。

```bash{numberLines: 1}{9,10}
$ #!/bin/bash -eo pipefail
  echo "Node $(node -v)"
  echo "NPM v$(npm --version)"
  chromedriver -v
  google-chrome --version

Node v10.16.3
NPM v6.9.0
ChromeDriver 77.0.3865.40 (f484704e052e0b556f8030b65b953dce96503217-refs/branch-heads/3865@{#442})
Google Chrome 77.0.3865.56 beta
```

ただエラーのほうでは `Driver info: chromedriver=2.46.628388` となっており明らかにバージョンが違います。

## chromedriver=2.46.628388の謎

ChromeDriverの[配布サイト](https://chromedriver.chromium.org/downloads)に行くと、2.46のChromeDriverは**Supports Chrome v71-73**なことがわかります。

あれれ、おかしいぞ・・・。

## Nightwatch.jsのChromeテストの挙動

いよいよ怪しくなってきたので、エラーが出ていない箇所のCIログも追っていきます。

すると `npm install` する際の動作ログに怪しい動作が見当たりました。

```
> chromedriver@2.46.0 install /home/circleci/workspace/node_modules/chromedriver
> node install.js

Current existing ChromeDriver binary is unavailable, proceding with download and extraction.
Downloading from file:  https://chromedriver.storage.googleapis.com/2.46/chromedriver_linux64.zip
Saving to file: /tmp/2.46/chromedriver/chromedriver_linux64.zip
Received 782K...
Received 1573K...
Received 2357K...
Received 3141K...
Received 3925K...
Received 4709K...
Received 5277K total.
Extracting zip contents
Copying to target path /home/circleci/workspace/node_modules/chromedriver/lib/chromedriver
Fixing file permissions
Done. ChromeDriver binary available at /home/circleci/workspace/node_modules/chromedriver/lib/chromedriver/chromedriver
```

node_module内にChromeDriverをダウンロードしている??

**まさか、Nightwatch.jsはこれを使っているのでは?? バージョンもあっているし**

## 試しにnode_moduleの中に入っているChromeDriverを最新のものと置き換える

以前作った自前Bulid環境をふんだんに使ってみます。

Dockerfileを次のように変更します。


```dockerfile{numberLines: 1}{3,16,17}
# install chrome

RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && (sudo dpkg -i /tmp/google-chrome-stable_current_amd64.deb || sudo apt-get -fy install)  \
    && rm -rf /tmp/google-chrome-stable_current_amd64.deb \
    && google-chrome --version

#  Install ChromeDriver
RUN CHROME_VERSION="$(google-chrome --version)" \
    && export CHROMEDRIVER_RELEASE="$(echo $CHROME_VERSION | sed 's/^Google Chrome //')" && export CHROMEDRIVER_RELEASE=${CHROMEDRIVER_RELEASE%%.*} \
    && CHROMEDRIVER_VERSION=$(curl --silent --show-error --location --fail --retry 4 --retry-delay 5 http://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROMEDRIVER_RELEASE}) \
    && curl --silent --show-error --location --fail --retry 4 --retry-delay 5 --output /tmp/chromedriver_linux64.zip "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" \
    && cd /tmp \
    && unzip chromedriver_linux64.zip \
    && rm -rf chromedriver_linux64.zip \
    && sudo cp chromedriver /usr/local/bin/chromedriver \
    && sudo chmod +x chromedriver \
    && sudo chmod +x /usr/local/bin/chromedriver \
    && chromedriver --version
```

- とりあえず、ChromeBetaではなく、安定版を入れるように変更しました。
- 最新のChromeDriverを/tmp領域に実行権限を入れたまま放置するようにしました。

続いてCI側です。

CircleCIのconfig.ymlを次のように変えました。

```yaml{numberLines: 1}{4,5,6}
      - run:
          name: Install dependencies
          command: npm install
      - run:
          name: Fix ChromeDriver with nightwatch.js
          command: mv -f /tmp/chromedriver node_modules/chromedriver/lib/chromedriver/chromedriver
```

- npm install後、node_modulesのChromeDriverを最新のもの(/tmpに入れたもの)と置き換えます。

## 実行！

なんとうまくいきました。

直ったのでOKです。

![Img](https://i.imgur.com/71HlXYT.png)

久しぶりにsuccessを見た・・。

![Img](https://i.imgur.com/FYjENBL.png)

## あとがき

Nightwatch.jsの動きが気になったのでもう少し深く見ていくとNightwatch.js自体はChromeDriverを依存パッケージとしては入れないようです。

[Package.json](https://github.com/nightwatchjs/nightwatch/blob/master/package.json)

代わりにChromeDriverを入れていたのは`vue-cli
` のテストパッケージでした。

[Package.json](https://github.com/vuejs/vue-cli/blob/dev/packages/%40vue/cli-plugin-e2e-nightwatch/package.json)

また、最新のnpm installできる[ChromeDriver](https://www.npmjs.com/package/chromedriver)は`76.0.1
`でしたので、もしかしたらnpm updateするだけでよかったのかもしれません。

一応、依存パッケージのアップデートはCI契機([Dependabot Preview
](https://github.com/marketplace/dependabot-preview))で動かすようにしていたのがあだになったかもしれませんねー。
