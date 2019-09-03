---
slug: 2019-09-03-chromedriver
title: ChromeDriverがGoogleChrome v76 に対応していないらしい。
date: 2019-09-03T13:09:22.595Z
description: ChromeDriverがGoogleChrome v76 に対応していないらしい。
tags:
  - Selenium
  - GoogleChrome
  - ChromeDriver
headerImage: 'https://i.imgur.com/6WFqOEs.png'
templateKey: blog-post
---
# CIがこけた・・

Vue.jsで書いているコードのCI(CircleCI)が通らなくなっていろいろ調べていると原因がわかってきました。

## ChromeDriverは Chrome v76に非対応

エラーメッセージが出ていました。

```javascript{numberLines: 1}
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

```javascript{numberLines: 7}{16, 17}
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

```console{numberLines: 1}{3, 4}
Node v10.16.3
NPM v6.9.0
ChromeDriver 76.0.3809.126 (d80a294506b4c9d18015e755cee48f953ddc3f2f-refs/branch-heads/3809@{#1024})
Google Chrome 76.0.3809.132 
```



