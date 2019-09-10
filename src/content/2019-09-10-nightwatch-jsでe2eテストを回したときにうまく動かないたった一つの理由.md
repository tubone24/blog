---
slug: 2019-09-10-nightwatchjs-chromedriver
title: Nightwatch.jsでE2Eテストを回したときにうまく動かないたった一つの理由
date: 2019-09-10T13:00:00.411Z
description: ChromeDriverがGoogleChrome v76 に対応していないらしい。の続編
tags:
  - chromedriver
  - nightwatchjs
headerImage: 'https://i.imgur.com/MyBxJCZ.png'
templateKey: blog-post
---
# エラーをよく読もう・・

前回書いた記事[ChromeDriverがGoogleChrome v76 に対応していないらしい。](https://blog.tubone-project24.xyz/2019-09-03-chromedriver)の解決編です。

出てくるエラーでググってもそれっぽいものが出てこないので苦しい戦いでしたが、

そもそもchromedriverを利用するプログラム[**Nightwatch.js**](https://nightwatchjs.org/)に思考が至らなかったのがまずかったです。

それでは解決編をどうぞ。

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

- [ChromeDriverとGoogleChromeのVersionを確認する](https://blog.tubone-project24.xyz/2019-09-03-chromedriver#chromedriver%E3%81%A8googlechrome%E3%81%AEversion%E3%82%92%E7%A2%BA%E8%AA%8D%E3%81%99%E3%82%8B)
- [CircleCIのDockerfileを確認してみる](https://blog.tubone-project24.xyz/2019-09-03-chromedriver#circleciのdockerfileを確認してみる)
- [Chrome Betaに変えてみる (自前Build環境の作成)](https://blog.tubone-project24.xyz/2019-09-03-chromedriver#chrome-beta%E3%81%AB%E5%A4%89%E3%81%88%E3%81%A6%E3%81%BF%E3%82%8B)

が、しかし結局直りませんでした。

## もう少しちゃんとエラーを見てみる

もう少しちゃんとエラーを見てみます。すると、あることに気が付きます。

***ChromeBetaにバージョンアップしてChromeDriverもバージョンアップしたのにエラーメッセージに出ているChromeDriverのバージョンが想定のものと違う・・***

自前Build環境の作成時に入れたChromeDriverのバージョンは`77.0.3865.40`でした。

ちゃんとこちらはCIのログに出力されていまして、Chromeのバージョンとも合っています。

```bash{numberLines: 1}{9, 10}
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
