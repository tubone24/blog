---
slug: 2023/01/18/reboot-linux
title: Raspberry Piを定期的に再起動させる
date: 2023-01-17T15:52:28.580Z
description: Raspberry Piを定期的に再起動させる
tags:
  - RaspberryPi
  - cron
  - reboot
  - Slack
headerImage: https://i.imgur.com/oEMLAHF.png
templateKey: blog-post
---

かんたんですが、備忘的に残しておきます。

## Table of Contents

```toc

```

## Raspberry PIのWifiドングルが定期的に使えなくなる。

今使っているRaspberry PIがめちゃくちゃ古くて、Wi-Fiに対応してない機種なので、USBのWi-Fiドングルを指して使っているのですが、こいつがしばらく起動しているとRaspberry PIから認識されなくなってしまう問題が発生しております。

[TP-Link Wi-Fi 無線LAN 子機 11n/11g/b デュアルモード対応モデル 英語パッケージ TL-WN725N(EU)](https://www.amazon.co.jp/dp/B008IFXQFU?ref=ppx_pop_dt_b_product_details&th=1)

とりあえずワークアラウンドとしてRaspberry PIの**再起動を定期的**に実施してやり、Wi-Fiドングルを再認識させることにします。

## crontabを使えば楽勝

再起動自体はなんてことはなく、ただ**root権限でcronを実行**すればよいだけでした。

```shell{promptUser: pi}{promptHost: dev.raspberrypi}
sudo crontab -e
```

root権限でcrontabを開き、 **/sbin/reboot**を実行するだけです。

```bash
00 16 * * * /sbin/reboot
```

## 再起動時に起動したよ的なSlackをあげる

念の為、再起動したRaspberry PIから通知がほしいのでSlack通知を設定します。

また、Slack通知時SSHで今後Raspberry PIにログインするときに困らないように割り当てられたIPアドレスも一緒に通知します。

起動時に任意のコマンドを実行するには**rc.local**が便利です。

```shell{promptUser: pi}{promptHost: dev.raspberrypi}
vi /etc/rc.local
```

```bash
sudo -u pi /usr/bin/python3 /home/pi/motion/notify_reboot.py &

exit 0
```

piユーザーにPythonのpip設定を済ませているため、piユーザーで任意のPythonコードを呼び出す形です。

必ず最後**exit 0**を実行する必要があります。そうしないと起動シーケンスが失敗したことになってしまいます。

```python
import requests, json
import netifaces

ip_address = netifaces.ifaddresses('wlan0')[netifaces.AF_INET][0]['addr']

WEB_HOOK_URL = "https://hooks.slack.com/services/xxxxx"
requests.post(WEB_HOOK_URL, data = json.dumps({
    "text": "*!!!Reboot!!!* \n\nNew IP:" + ip_address,
    'username': "motion_detect",
    'icon_emoji': ":robot_face:",
    'link_names': 1,
}))
```

Pythonコードは超カンタンで、wlan0のIPアドレスを[netifaces](https://pypi.org/project/netifaces/)を使って取得してIncoming webhookで送信するだけです。
netifacesのinstallをpipであらかじめ実施しておきます。

```shell{promptUser: pi}{promptHost: dev.raspberrypi}
pip3 install netifaces==0.11.0
```

## 結果

![reboot](https://i.imgur.com/oEMLAHF.png)

こんな感じで定期的に(1日1回)再起動が実施されIPアドレスの通知もSlackにしてくれます。
