---
slug: 2019-09-03-chromedriver
title: ChromeDriverがGoogleChrome v76 に対応していないらしい。
date: 2019-09-03T13:09:22.595Z
description: ChromeDriverがGoogleChrome v76 に対応していないらしい。
tags:
  - 自動テスト
  - E2E Test
  - Selenium
  - GoogleChrome
  - ChromeDriver
headerImage: 'https://i.imgur.com/6WFqOEs.png'
templateKey: blog-post
---

Vue.jsで書いているコードのCI(CircleCI)が通らなくなっていろいろ調べていると原因がわかってきました。

***いろいろやってますが、結論失敗してます！！　読む時間がもったいない！***

## Table of Contents

```toc

```

## ChromeDriverは Chrome v76に非対応

エラーメッセージが出ていました。

![Img](https://i.imgur.com/6WFqOEs.png)

```bash{numberLines: 1}
{ value:
   { message:
      'session not created: Chrome version must be between 71 and 75\n  (Driver info: chromedriver=2.46.628388 (4a34a70827ac54148e092aafb70504c4ea7ae926),platform=Linux 4.15.0-1043-aws x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 668 milliseconds\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'5d045d2f1712\', ip: \'192.168.32.3\', os.name: \'Linux\', os.arch: \'amd64\', os.version: \'4.15.0-1043-aws\', java.version: \'11.0.4\'\nDriver info: driver.version: unknown',
     error: 'session not created' },
  status: 33 }
```

ChromeのVersionを71～75の間にしなさいとのこと。

## CircleCIのDocker Containerを何とかしたい

今回はCircleCIを使っているのでDockerfileを編集して、何とかならないか試してみます。

## ChromeDriverとGoogleChromeのVersionを確認する

CircleCIでどんなVersionのChromeDriverとGoogleChromeを使っているのか確認します。

CircleCIの[config.yml](https://github.com/tubone24/ebook-homebrew-vue-typescript-client/blob/master/.circleci/config.yml)にバージョン出力を追加します。

```yaml{numberLines: 7}{16, 17}
    steps:
      - checkout
      - restore_cache:
          key: projectname-{{ .Branch }}-{{ checksum "package-lock.json" }}
      - run:
          name: System information
          command: |
            echo "Node $(node -v)"
            echo "NPM v$(npm --version)"
            chromedriver -v
            google-chrome --version
```

## Run結果

v76で統一されているなぁ・・。

```bash{numberLines: 1}{3, 4}
Node v10.16.3
NPM v6.9.0
ChromeDriver 76.0.3809.126 (d80a294506b4c9d18015e755cee48f953ddc3f2f-refs/branch-heads/3809@{#1024})
Google Chrome 76.0.3809.132 
```

## CircleCIのDockerfileを確認してみる

[CircleCIのDockerfile](https://github.com/tubone24/circleci-dockerfiles/blob/master/node/images/10.16.3-stretch/browsers/Dockerfile)をみると、

```dockerfile{numberLines: 41}
# install chrome

RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-stable_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb \
    && (sudo dpkg -i /tmp/google-chrome-stable_current_amd64.deb || sudo apt-get -fy install)  \
    && rm -rf /tmp/google-chrome-stable_current_amd64.deb \
    && sudo sed -i 's|HERE/chrome"|HERE/chrome" --disable-setuid-sandbox --no-sandbox|g' \
        "/opt/google/chrome/google-chrome" \
    && google-chrome --version

RUN CHROME_VERSION="$(google-chrome --version)" \
    && export CHROMEDRIVER_RELEASE="$(echo $CHROME_VERSION | sed 's/^Google Chrome //')" && export CHROMEDRIVER_RELEASE=${CHROMEDRIVER_RELEASE%%.*} \
    && CHROMEDRIVER_VERSION=$(curl --silent --show-error --location --fail --retry 4 --retry-delay 5 http://chromedriver.storage.googleapis.com/LATEST_RELEASE_${CHROMEDRIVER_RELEASE}) \
    && curl --silent --show-error --location --fail --retry 4 --retry-delay 5 --output /tmp/chromedriver_linux64.zip "http://chromedriver.storage.googleapis.com/$CHROMEDRIVER_VERSION/chromedriver_linux64.zip" \
    && cd /tmp \
    && unzip chromedriver_linux64.zip \
    && rm -rf chromedriver_linux64.zip \
    && sudo mv chromedriver /usr/local/bin/chromedriver \
    && sudo chmod +x /usr/local/bin/chromedriver \
    && chromedriver --version

```

どうやらsedでChromeのstableのバージョンと合わせているらしい。なるほど。

Chrome stableからbetaに変えれば通るかもしれない・・。

## Chrome Betaに変えてみる

CircleCIは自前のDockerから環境を作り、CIを回すことができます。

なので、Dockerfileを作り、個人Dockerレポジトリにpushし、config.ymlファイルを編集します。

[こんな感じ](https://github.com/tubone24/ebook-homebrew-vue-typescript-client/blob/master/docker/circleci/fix_chromedriver/Dockerfile)で書き換えたDockerfileを作ります。

```dockerfile{numberLines: 42}
# install chrome

RUN curl --silent --show-error --location --fail --retry 3 --output /tmp/google-chrome-beta_current_amd64.deb https://dl.google.com/linux/direct/google-chrome-beta_current_amd64.deb \
    && (sudo dpkg -i /tmp/google-chrome-beta_current_amd64.deb || sudo apt-get -fy install)  \
    && rm -rf /tmp/google-chrome-beta_current_amd64.deb \
    && google-chrome --version

# Fix ChromeDriverVersion
RUN curl --silent --show-error --location --fail --retry 4 --retry-delay 5 --output /tmp/chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/77.0.3865.40/chromedriver_linux64.zip" \
    && cd /tmp \
    && unzip chromedriver_linux64.zip \
    && rm -rf chromedriver_linux64.zip \
    && sudo mv chromedriver /usr/local/bin/chromedriver \
    && sudo chmod +x /usr/local/bin/chromedriver \
    && chromedriver --version
```

ChromeのBeta版 `google-chrome-beta_current_amd64.deb` ChromeDriverの最新版`https://chromedriver.storage.googleapis.com/77.0.3865.40/chromedriver_linux64.zip`をダウンロードインストールするように変更します。

続けて、[DockerHub](https://cloud.docker.com/i)にDocker個人レポジトリを作っておきます。CircleCIから確認できるように公開設定をpublicにしておきます。

![Img](https://i.imgur.com/8xlE18N.png)

その後、Docker build & pushします。

```bash
$ docker build -t circle-node:10.16.3-stretch-browsers-fix .
$ docker tag circle-node:10.16.3-stretch-browsers-fix tubone24/circleci:10.16.3-stretch-browsers-fi
$ docker push tubone24/circleci:10.16.3-stretch-browsers-fix
```

無事pushまでできたらCircleCIのconfig.ymlのImageを変更します。

```yaml{numberLines: 1}
version: 2
jobs:
  build:
    working_directory: ~/workspace
    docker:
      - image: tubone24/circleci:10.16.3-stretch-browsers-fix
```

では、 ![rerun](https://i.imgur.com/w7LQ34r.png) しましょう！

## 結果

ダメ見たいですね・・

ここまでやったのに解決しない。

![failed](https://i.imgur.com/p2WKJeV.png)
