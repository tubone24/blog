---
slug: 2020/05/10/plant-check
title: Raspberry PIを使って植物の水やり監視システムを作る
date: 2020-05-10T06:29:01.182Z
description: Raspberry PIを使って植物の水やり監視システムを作る
tags:
  - 電子工作
  - Raspberry PI
headerImage: https://i.imgur.com/amaoydT.jpg
templateKey: blog-post
---
Raspberry PIを使って家のガジュマルを枯らさないようにします。

## Table of Contents

```toc

```

## ガジュマル

我が家には**ガジュマル**が観葉植物としています。

![img](https://i.imgur.com/mDq4FWO.jpg)

ガジュマルには日光がある程度必要なので窓際に置いているのですが、水やりを忘れがちです。

何度も枯らしかけたので、Raspberry PIを使って水やり管理をできるようにします。

ついでに余っていた温度計やフォトレジスタも組み込んで観葉植物の管理システムを作ってみようかと思います。


## Raspberry PI Zero WH

今回は余っていたRaspberry PI Zero WHを使います。

性能はそこまでよくないですが、低電力でコンパクトなのでこういった用途には向いていると思います。

![img](https://i.imgur.com/GmYDK0C.jpg)

中身はこんな感じです。

インターフェースはHDMI(ちっさいの)とUSB Microと電源供給用のUSB Micro、ディスク代わりのMicroSD、カメラモジュールです。

不要だと思いつつも余っていたのでヒートシンクをつけてます。

![img](https://i.imgur.com/k4R1znI.jpg)

## 土壌センサー

土壌センサーはAmazonで購入しました。

[HiLetgo 5個セット LM393 3.3V-5V土壌水分検出センサー土壌水分センサーArduino自動散水システムロボット用の湿度計検出ロボットスマートカー [並行輸入品]](https://amzn.to/2URR8D5)

5個入りで￥550
でした。安い。

![img](https://i.imgur.com/amaoydT.jpg)

## DHT11

温度と湿度は**DHT11**を使います。電子工作の有名どころですね。

デジタル接続ができるのでA/Dに通さなくていい優れものです。

精度はわかりません。趣味で作るものなのであまり気にしなくていいと思います。

![img](https://i.imgur.com/JvjiUuD.jpg)

## フォトレジスタ

フォトレジスタとは光が当たると抵抗が下がるやつです。

![img](https://i.imgur.com/kSjQyey.jpg)


## ADC0832

A/Dのコンバータは**ADC0832**を使いました。

なかなかデータシートが出てこず大変でしたがこちらです。

[データシート](http://www.ti.com/lit/ds/symlink/adc0832-n.pdf)

![img](https://i.imgur.com/msMkGJb.jpg)

8digitの隣にあるチップがADC0832です。

## 構成

今回は土壌センサーとフォトレジスタと2つアナログがありますのでADC0832のチャンネルをフルに2チャンネル使う構成にしてます。

また、土壌センサーはずっと電力を印加していると電気分解が起きてセンサーがボロボロに**腐食**してしまうため、VCCはGPIOで制御して取るようにしてます。

![img](https://i.imgur.com/bwjrBtF.png)

![img](https://i.imgur.com/TwBitlX.jpg)


## コード

今回はセンサーをAPI化して別システムからリクエストを投げることで計測を行うシステムにしようと思うのでAPIサーバ化します。

APIサーバ化には今回は[Falcon](https://falconframework.org/)を使ってみました。

```python
import json
import falcon
import RPi.GPIO as GPIO
from time import sleep
import json
import ADC0832
import Adafruit_DHT

# Excitation Voltage for sensors
pin = 15

# initialize GPIO
GPIO.setwarnings(False)


# Excitation Voltage
def output_fromGPIO(pin, output):
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, output)
    sleep(0.1)


def get_temperature():
    try:
        output_fromGPIO(pin, True)
        _, temperature = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
        return temperature
    finally:
        output_fromGPIO(pin, False)


def get_humidity():
    try:
        output_fromGPIO(pin, True)
        humidity, _ = Adafruit_DHT.read_retry(Adafruit_DHT.DHT11, 4)
        return humidity
    finally:
        output_fromGPIO(pin, False)


def get_moisture():
    try:
        ADC0832.setup()
        output_fromGPIO(pin, True)
        while True:
            moisture = ADC0832.getResult(0)
            if moisture != -1:
                return moisture
            sleep(1)
    except:
        ADC0832.destroy()
    finally:
        output_fromGPIO(pin,False)


def get_light():
    try:
        ADC0832.setup()
        output_fromGPIO(pin,True)
        light = ADC0832.getResult(1) - 80
        print(light)
        if light < 0:
            light = 0
        return light
    except:
        ADC0832.destroy()
    finally:
        output_fromGPIO(pin,False)


class CheckHumidity(object):

    def on_get(self, _, resp):
        msg = {
            "key": "humidity",
            "value": get_humidity()
        }
        resp.body = json.dumps(msg)


class CheckTemperature(object):
    def on_get(self, _, resp):
        msg = {
            "key": "temperature",
            "value": get_temperature()
        }
        resp.body = json.dumps(msg)


class CheckMoisture(object):
    def on_get(self, _, resp):
        msg = {
            "key": "moisture",
            "value": get_moisture()
        }
        resp.body = json.dumps(msg)


class CheckLight(object):
    def on_get(self, _, resp):
        msg = {
            "key": "light",
            "value": get_light()
        }
        resp.body = json.dumps(msg)


app = falcon.API()
app.add_route("/humidity", CheckHumidity())
app.add_route("/temperature", CheckTemperature())
app.add_route("/moisture", CheckMoisture())
app.add_route("/light", CheckLight())


if __name__ == "__main__":
    from wsgiref import simple_server
    httpd = simple_server.make_server("0.0.0.0", 8000, app)
    httpd.serve_forever()
```

8000ポートでAPIサーバが立ち上がり、GET APIでほしいセンサー情報にアクセスすることができます。

## 動かしてみる

ガジュマルの植木鉢に設置してみます。

![img](https://i.imgur.com/2J8rx9K.jpg)

Zabbixのexternal scriptsを使ってAPIから情報を取得し、グラフにしてみました。

![img](https://i.imgur.com/tHoBvbQ.png)

うまく取得できました。

## 結論

ここまでのコードはZabbixのテンプレート含めGitHubに公開してます。

<https://github.com/tubone24/raspi_plant_checker>

これで枯らすことなく育てることができますね！