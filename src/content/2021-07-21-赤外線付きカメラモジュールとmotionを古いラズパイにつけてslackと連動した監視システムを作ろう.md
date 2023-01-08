---
slug: 2021/07/21/motion-ir
title: 赤外線付きカメラモジュールとmotionを古いラズパイにつけてSlackと連動した監視システムを作ろう
date: 2021-07-21T10:08:14.329Z
description: ラズパイが家に溢れてもったいないので赤外線付きカメラモジュールとmotionを古いラズパイにつけてSlackと連動した監視システムを作ることにしました
tags:
  - RaspberryPi
  - motion
  - 監視カメラ
  - Slack
headerImage: https://i.imgur.com/JaW3aQ0.jpg
templateKey: blog-post
---
作ってみよう！

## Table of Contents

```toc

```

## 我が家のラズパイ事情

多くのご家庭でお困りかもしれませんが、使ってないラズパイが転がりまくってます。

ラズパイって結構直近の進化がすごくて、性能が上がったから買ってみよう！とか、液晶モジュール付けてしまったから特に使ってないけど外すのめんどくさいしそのままにしておこうとか、そういった感じで眠ったラズパイが何種類かあります。

で、こいつらを眠らせておいても仕方がないので、早速こちらを使って何かHomeIoTチックなことをやってみたいと想います。

## 監視カメラ

そこまで我が家は大したセキュリティ意識はないですが、せっかくなら玄関に監視カメラでもつけたいなと思い始めました。

とりあえず、人がきたらSlackに検知状況とそのときの画像や動画を投稿します。

## 赤外線カメラ

いつも玄関は省エネの観点で電気を消してますので、通常のカメラではちょっと明るさがたりません。

そこで、ラズパイのカメラモジュールに挿すことのできる赤外線カメラを探したところありました。

[5MP 1080P Camera for raspberry pi 4 Model b カメラモジュールraspberryカメラモ赤外線ケース付き夜間LEDラズベリーパイ4 / 3 / Pi Zero Wに適して (IR with Case)](https://www.amazon.co.jp/gp/product/B07T5DZY73/ref=as_li_tl?ie=UTF8&camp=247&creative=1211&creativeASIN=B07T5DZY73&linkCode=as2&tag=tubone2403-22&linkId=034a4706556d75193eef893e1d8c3e2a)

値段もお手頃でこいつはいいですね。

組み立て方も簡単で、カメラ部分に赤外線センサーをねじ止めし、ラズパイのカメラモジュールに差し込むだけです。

![inmf](https://i.imgur.com/JaW3aQ0l.jpg)

組み立てると上のようになります。

私の用意していたラズパイがWifi非対応の超古いタイプ[Raspberry Pi B+](https://jp.rs-online.com/web/p/raspberry-pi/8111284/)だったので有線LANを引きまして、高さが足りないのでiPadminiの箱の上にガムテープで固定するという何とも残念な仕上がりですが、とりあえず装着完了。

![img](https://i.imgur.com/Eda8D6Il.jpg)

試しにカメラが使えるか、テストしてみます。

```
raspistill -o test.jpg
```

![img](https://i.imgur.com/YOUDPIcl.jpg)

無事写真が撮れました。色味がちょっと変なのは赤外線だから仕方ありませんね。

## motion

[motion](https://motion-project.github.io/index.html)という、カメラからのビデオ信号をリアルタイムに解析し、動体検知や録画撮影などができるLinuxプログラムがあります。

こちらを使えば簡単に監視カメラを作ることができます。

早速motionをインストールして設定していきます。

```
sudo apt install motion

sudo motion
```

さきほど写真の撮影には成功したので起動するかなーと思ったのですがダメです！motionが起動しません!!エラーが出ます。

```
[1:ml1] [NTC] [VID] [Jul 21 21:00:03] vid_start: Opening V4L2 device
[1:ml1] [NTC] [VID] [Jul 21 21:00:03] v4l2_start: Using videodevice /dev/video0 and input -1
[1:ml1] [ALR] [VID] [Jul 21 21:00:03] v4l2_start: Failed to open video device /dev/video0: No such file or directory
[1:ml1] [ERR] [VID] [Jul 21 21:00:03] vid_start: V4L2 device failed to open
[1:ml1] [WRN] [ALL] [Jul 21 21:00:03] mlp_retry: Retrying until successful connection with camera
[1:ml1] [NTC] [VID] [Jul 21 21:00:03] vid_start: Opening V4L2 device
[1:ml1] [NTC] [VID] [Jul 21 21:00:03] v4l2_start: Using videodevice /dev/video0 and input -1
[1:ml1] [ALR] [VID] [Jul 21 21:00:03] v4l2_start: Failed to open video device /dev/video0: No such file or directory
[1:ml1] [ERR] [VID] [Jul 21 21:00:03] vid_start: V4L2 device failed to open
```

**Failed to open video device /dev/video0: No such file or directory**というエラーが出てますね。

ラズパイのカメラモジュールは/dev/video0として認識されないのですかね。

途方に暮れてしまいましたがラズパイのフォーラムに解決策が書いてありました。

[Motion -> v4l2_start: Failed to open video device /dev/video0: No such file or directory](https://www.raspberrypi.org/forums/viewtopic.php?t=255442)


どうやらラズパイカメラモジュール用のV4L2ドライバは標準ではロードされず、video0デバイスを取得するには **modprobe bcm2835-v4l2**を実行する必要があったとのこと。

```
sudo modprobe bcm2835-v4l2
```

これで再起動したところ無事、**/dev/video0**ができていました。

とりあえずmotionを起動させたところ、無事起動しました。

## motionで動体検知をするconfigを設定する。

motion.confは下記の通りに設定しました。後ほど検知後の動きを設定するスクリプトについてもご紹介しますがインラインで軽く解説していきます。

```
daemon on #デーモン化してサービスとして登録
process_id_file /var/run/motion/motion.pid
setup_mode off
logfile /var/log/motion/motion.log
log_level 6
log_type all
videodevice /dev/video0
v4l2_palette 17
input -1
norm 0
frequency 0
power_line_frequency -1
rotate 180 #画像が反転してたので直す
width 640
height 480
framerate 100 #とりあえず最大。ただし性能的にあんまりぬるぬるにはならなかった。監視カメラだし別にぬるぬるじゃなくてもいい。
minimum_frame_time 0
netcam_keepalive off
netcam_tolerant_check off
rtsp_uses_tcp on
auto_brightness off
brightness 0
contrast 0
saturation 0
hue 0
roundrobin_frames 1
roundrobin_skip 1
switchfilter off
threshold 1500
threshold_tune off
noise_level 32
noise_tune on
despeckle_filter EedDl
smart_mask_speed 0
lightswitch 0
minimum_motion_frames 1
pre_capture 0
post_capture 0
event_gap 60 # 動体検知イベントから次のイベント検知までのインターバル。設定しないと連続撮影が続いてクッソ重くなる
max_movie_time 120
emulate_motion off
output_pictures best # 動体検知した際に画像を出力する、bestにしていると動体検知イベント中一番大きな動体検知が発生したフレームを切り取ってくれる
output_debug_pictures off
quality 75 # 画像の品質
picture_type jpeg # 画像のフォーマット、jpgで問題ない
ffmpeg_output_movies on # 動体検知した際に、動体検知イベント中の動画を出力してくれる
ffmpeg_output_debug_movies off
ffmpeg_timelapse 0
ffmpeg_timelapse_mode daily
ffmpeg_bps 700000
ffmpeg_variable_bitrate 0
ffmpeg_video_codec mp4 # 動画コーデック、mp4一択だがmpeg4にするとaviにもできる
ffmpeg_duplicate_frames true
use_extpipe off
snapshot_interval 0
locate_motion_mode on # 動体検知イベントの画像、動画中に検知部分に四角を表示する
locate_motion_style redbox # 赤枠にする
text_right %Y-%m-%d\n%T-%q
text_changes off
text_event %Y%m%d%H%M%S
text_double on # 監視カメラの端っこにある時間とか記載してあるテキストを大きくする
target_dir /home/pi/motion/output # 動画、画像出力先
snapshot_filename %v-%Y%m%d%H%M%S-snapshot
picture_filename %v-%Y%m%d%H%M%S-%q
movie_filename %v-%Y%m%d%H%M%S
timelapse_filename %Y%m%d-timelapse
ipv6_enabled off
stream_port 8081
stream_quality 50
stream_motion off
stream_maxrate 1
stream_localhost off # offにしておくと、IPアドレス:8081でアクセスするとリアルタイムに動画ストリーミングされる
stream_limit 0
stream_auth_method 0
webcontrol_port 8080
webcontrol_localhost off　# offにしておくと、IPアドレス:8080でアクセスすると設定変更や再起動が可能なWebコンソールが出てくる
webcontrol_html_output on
track_type 0
track_auto off
track_iomojo_id 0
track_step_angle_x 10
track_step_angle_y 10
track_move_wait 10
track_speed 255
track_stepsize 40
quiet on
on_picture_save "/bin/sh /home/pi/motion/notify_picture_trigger.sh %f" # 画像が保存されたときの追加起動スクリプト %fで保存された画像を引数で渡すことができる
on_movie_start "/usr/bin/python3 /home/pi/motion/notify_fast_trigger.py" # 動体検知され動画が記録され始めたら追加起動するスクリプト
on_movie_end "/bin/sh /home/pi/motion/notify_movie_trigger.sh %f" # 動画の記録が終了したら追加起動するスクリプト
on_camera_found "/usr/bin/python3 /home/pi/motion/notify_camera_found.py" # カメラモジュールとの疎通が回復したら起動するスクリプト
on_camera_lost "/usr/bin/python3 /home/pi/motion/notify_camera_lost.py" # カメラモジュールとの疎通が取れなくなったら起動するスクリプト
```

ここでポイントになるのは動体検知実行時に画像や動画を保存できるだけでなく、それを追加起動スクリプトで通知できるということです。

動画や画像をSlackに送信すれば監視カメラシステム的に十分ですね。

動画だけの配信でもいいかもしれませんが、モバイルSlackだと、動画の場合プレビューがされないので画像も送信することにします。

![md](https://i.imgur.com/IEF2Q1Rl.png)

## Stream配信

motion.confで**stream_localhost off**とすることで、他の端末からストリーム配信を視聴できるようになります。例えばVPNとかを自宅に構築済みの場合は気になったら外出先からカメラを確認する、という使い方ができます。

我が家はOpenVPNでイントラ接続が可能になってます。

![img](https://i.imgur.com/MbyFzmel.png)

## 動画をSlackに投稿

さて、ここからが本番のSlackへの画像投稿です。

Slackへのファイル投稿はAPPSを使います。何番煎じかわからないくらいたくさん記事が転がっているのでここでは解説しませんが、Botトークンを入手する必要があります。

[ご参考: 超簡単PythonでSlackにファイルアップロード＆メッセージ投稿（Slack API利用）新方式](https://note.com/10mohi6/n/n0fd906a5f980)

動画が作成完了されたら動くスクリプトは**on\_movie\_end**で設定できますが今回はshellを呼び出して、shellのなかでSlack投稿用のPythonに連携します。

特に理由はないですが、Slackアップロード以外に何かやることがある場合にこうしておくと便利かな、というのとアップロード済みの動画をラズパイから削除することを実施するためです。

```shell
#!/bin/bash
FILE=$1
python3 /home/pi/motion/upload_slack.py $FILE "MP4 File"
rm -f $FILE
```

upload_slack.pyはこんな感じ.

SlackのChannelIDはSlackWeb版を使うとURLの最後のパスがそれにあたります。公式は[APIを叩いて調べる](https://api.slack.com/methods/channels.list)のを進めてますが、Web版が一番簡単に見つけられます。

```python
import sys
import datetime
import json
import requests

FILENAME = sys.argv[1]
FILEFORMAT = sys.argv[2]
TOKEN = "xoxb-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" # Slackトークン
CHANNEL = "C0xxxxxxxxxxxx" # ChannelID

print(FILENAME)
with open("{}".format(FILENAME), "rb") as f:
    dt_now = datetime.datetime.now()
    files = {"file": f.read()}
    param = {
        "token": TOKEN, 
        "channels" :CHANNEL,
        "filename" :FILENAME,
        "title": FILEFORMAT
        }
    resp = requests.post(url="https://slack.com/api/files.upload",params=param, files=files)
    print(resp.text)
```

何のことはないですね。ファイルをバイナリで読み込んで送るだけです。

ちなみに、動画の投稿は検知から**1分**ほどかかります。古いラズパイの性能がかなり低いということもありますが、画像ファイル作成にはffmpegでのエンコードが発生するので時間がかかる、というわけです。

それでは、監視カメラとしてはアウトな気がするので追加で**on\_movie\_start**を設定します。こちらは動画ファイルが作成されるタイミングでトリガーされるスクリプトなのでほぼ動体検知タイミングで通知を飛ばすことができます。

投稿はただのincoming webhookです。画像や動画は置いておいてとりあえず何か起きたよ！って通知だけSlackにあげることにしました。

```
import datetime
import json
import requests

WEB_HOOK_URL = "https://hooks.slack.com/services/xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
dt_now = datetime.datetime.now()
requests.post(WEB_HOOK_URL, data = json.dumps({
    "text": "Alarm triggered. Check out the attached video! {}".format(dt_now.strftime("%Y/%m/%d %H:%M:%S")),
    'username': "motion_detect",
    'icon_emoji': ":robot_face:",
    'link_names': 1,
}))
```

## Slackに画像を投稿

モバイル版のSlackでもプレビュー見たい問題のため、画像も投稿します。ただ、こちらもほぼ上記と同じなのでスクリプトは割愛します。

ちなみに、**output_pictures best**にすると、動画の作成完了まで画像は保存されませんので、投稿スピードは遅いです。

## できた！

![img](https://i.imgur.com/m5HEdzHl.png)

このように監視カメラで動体検知をするとSlackに通知が飛び、画像と動画が確認できるようになりました。

ちょっと検知閾値が低すぎて、シーリングライトのオンオフでも反応しますが、反応しないよりはいいかなと思ってます。

## 問題発生

無事完成となったのですが、早速致命的な問題が起きてしまいます。

motion起動から3～4時間すると、カメラモジュールがハングってしまい釣られてmotion自体もdefunctして完全にOS再起動以外直す手段がなくなってしまう事象が発生しました。

とりあえず、カメラモジュールがハングった場合最低でも検知できないとまずいので**on\_camera\_lost**を設定します。

こちらもスクリプトは割愛しますが、incoming webhookでカメラモジュールのハングを通知する仕組みです。

![img](https://i.imgur.com/tpdlfLfl.png)

うまく検知できてますね。

Slackで通知を受け取ることでますます再現性が高いことがわかったので、何か根本的な原因があると思いとりあえず思い当たる2つを修正しました。

- osのdist-upgrade不具合が解消されてるかもしれない
- オーバークロックの無効化

こちら2つを実施したところ直りました。何だったんでしょうか。。

## 結論

とりあえず監視カメラが自作できたのでラズパイ有効活用は成功ではないでしょうか？

