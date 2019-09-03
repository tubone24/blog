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

Vue.jsで書いているコードのCIが通らなくなっていろいろ調べていると原因がわかってきました。

## ChromeDriverは Chrome v76に非対応

エラーメッセージが出ていました。

```
{ value:
   { message:
      'session not created: Chrome version must be between 71 and 75\n  (Driver info: chromedriver=2.46.628388 (4a34a70827ac54148e092aafb70504c4ea7ae926),platform=Linux 4.15.0-1043-aws x86_64) (WARNING: The server did not provide any stacktrace information)\nCommand duration or timeout: 668 milliseconds\nBuild info: version: \'3.141.59\', revision: \'e82be7d358\', time: \'2018-11-14T08:25:53\'\nSystem info: host: \'5d045d2f1712\', ip: \'192.168.32.3\', os.name: \'Linux\', os.arch: \'amd64\', os.version: \'4.15.0-1043-aws\', java.version: \'11.0.4\'\nDriver info: driver.version: unknown',
     error: 'session not created' },
  status: 33 }
```

