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

本エラーを詳しく見ていくと、GoogleChromeのバージョンをv71～v75の間にしなさいというもので、いろいろなサイトを見るとChromeのバージョンアップに合わせてChromeDriverのバージョンも上げないといけない、ということを知りました。

[GitHub Issue #4800 Message: session not created: Chrome version must be between 71 and 75](https://github.com/timgrossmann/InstaPy/issues/4800)
