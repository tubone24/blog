---
slug: 2020/07/25/gas-bot
title: 4連休を使ってGASとLINE BOTとFirebaseを使ってラーメン食べたいBOTを作ってみた
date: 2020-07-24T15:49:47.993Z
description: GASとLINE BOTを使ってラーメン食べたいBOTを作ってみた
tags:
  - GAS
  - LINEBOT
headerImage: https://i.imgur.com/aFfsvoe.gif
templateKey: blog-post
---
4連休、StayHomeが叫ばれる中、ラーメンが食べたくなったので、LINEBOTを含めたラーメンソリューションを作ってみました。

![img](https://i.imgur.com/aFfsvoe.gif)

## Table of Contents

```toc

```

## StayHomeとは？

StayHomeとは、**COVID-19**の感染拡大を防止するために、**「人に会うのを可能な限り避ける」**取り組みのなかで、**みんなお家にいようね！**という標語のようなものです。

多くの芸能人が呼びかけていて、あの**星野源**さんが歌いながらさまざまなことにチャレンジする動画作成がミームになってましたね。

個人的には、

https://youtu.be/Lk3MZrxXswY

がもはや星野源さん関係ないけど笑ってしまいました。天和上がったよって顔がまたなんとも...。

さて、StayHomeですが残念ながら独身生活もこう長くなってくると、人と接しなくてもストレスなく生きられてしまうので、全然StayHome OKマンな私です。ただのんびりDアニメストアでアニメを見ながら、きのこの山を食べて、ゴロゴロしているのも4連休のお休みを作ってくださった神様(政府)に申し訳ないので、ためになることをしようと思いました。

**「StayHomeでCOVではなくDEVしよう」**

## 縛りプレイ

ただ闇雲に開発するだけでは面白くないので今回も縛りプレイを実施していこうと思います。

- 貧乏なのでオールフリー(無料)
- できる限りサーバーレス
- LINEを絡める

特にLINEを絡めた開発をするのには理由がありまして、最近本業の開発で隣のチームがLINEのメッセージレイアウトがどうとか言っているのを聞いていて、ちょっとでも話題に入れるようにしたいという下心があるわけです。

## 全体構成

今回のアプリケーションは**LINEの位置情報から近くのラーメン屋を探す**サービスにしたいと思います。

お友達にヒアリングしてみると、**食べたラーメンを登録したい**、 **食べたラーメンを共有したい**などのご意見があったので**ライフログ**機能もつけます。

### ワイヤーフレーム

![img](https://i.imgur.com/KUqm5Qs.png)

雑ですが作ってみました。位置情報を送ると、近くのラーメン屋を検索してカルーセルで紹介します。

また、ラーメン評価ボタンを付けて、クリックするとFirebaseで作ったフロントに飛んで星をつけることができます。

![img](https://i.imgur.com/ibZirgX.png)

なので、LINEBOTを基軸にサービスを組みますが、今回はバックエンド処理がLINEの[MessagingAPI](https://developers.line.biz/ja/reference/messaging-api/)のWebhookで起動し、返信を返す機能なのでBOT部分はGASのdoPostを使って作ります。

ラーメン登録画面などはさすがにGASで作り切るのはしんどいので、Firebaseを使います。フロント自体はある程度実装経験があるNuxt.jsを使います。

## 無料&サーバーレスといえばGAS

さて、GASが今回も出てきました。GAS大好きすぎるマンですね。すみません。

GASとはGoogle Apps Scriptsのことで詳しくは過去ブログ[Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮る
](https://tubone-project24.xyz/2019/10/24/gas-webscreenshot#google-apps-scriptgas%E3%81%A8%E3%81%AF%EF%BC%9F)をご確認いただければと思います。

今回もTypeScript + Claspで開発していき、GitHub Actionsでデプロイまで完了するCI/CDを構築していきたいと思います。

## GASで詰まったところ

### 近くのラーメン情報の取得方法

LINEのMessagingAPIではユーザーが位置情報を送ると、設定したWebhookに対して緯度経度が送られます。

```
{
  "replyToken": "nHuyWiB7yP5Zw52FIkcQobQuGDXCTA",
  "type": "message",
  "mode": "active",
  "timestamp": 1462629479859,
  "source": {
    "type": "user",
    "userId": "U4af4980629..."
  },
  "message": {
    "id": "325708",
    "type": "location",
    "title": "my location",
    "address": "〒150-0002 東京都渋谷区渋谷２丁目２１−１",
    "latitude": 35.65910807942215,
    "longitude": 139.70372892916203
  }
}
```

<https://developers.line.biz/ja/reference/messaging-api/#wh-location>

そこで、送られた緯度経度を使って、近くのラーメン屋情報を取得するのですが、取得に使ったAPIが、

[ぐるなびレストラン検索API
](https://api.gnavi.co.jp/api/manual/restsearch/)でした。

登録も簡単で、緯度経度をフィルターで使えるので、結構便利に使えそうだったので選びました。

位置情報を緯度経度で指定し、ラーメン屋のカテゴリコード(RSFST08008,RSFST08009,RSFST08012,RSFST08013)を指定し、緯度経度を設定するだけでこんな結果が返ってきます。

```
{
    "@attributes": {
        "api_version": "v3"
    },
    "total_hit_count": 10,
    "hit_per_page": 1,
    "page_offset": 1,
    "rest": [
        {
            "@attributes": {
                "order": 0
            },
            "id": "gf8f400",
            "update_date": "2020-03-31T14:49:10+09:00",
            "name": "創作麺工房 鳴龍",
            "name_kana": "ソウサクメンコウボウナキリュウ",
            "latitude": "35.728676",
            "longitude": "139.730343",
            "category": "ラーメン、つけ麺",
            "url": "https://r.gnavi.co.jp/akadann10000/?ak=UKutMOVrMfs3qHtpT1euv06MXqPjNZyGW51PnE3qUOk%3D",
            "url_mobile": "http://mobile.gnavi.co.jp/shop/gf8f400/?ak=UKutMOVrMfs3qHtpT1euv06MXqPjNZyGW51PnE3qUOk%3D",
            "coupon_url": {
                "pc": "",
                "mobile": ""
            },
            "image_url": {
                "shop_image1": "https://rimage.gnst.jp/rest/img/akadann10000/t_0n6v.jpg",
                "shop_image2": "",
                "qrcode": "https://c-r.gnst.jp/tool/qr/?id=gf8f400&q=6"
            },
            "address": "〒170-0005 東京都豊島区南大塚2-34-4 SKY南大塚1F",
            "tel": "050-3461-5239",
            "tel_sub": "03-6304-1811",
            "fax": "03-6304-1811",
            "opentime": "月 ランチ：11:30～15:00\n水～日 ランチ：11:30～15:00\n水～日 ディナー：18:00～21:00",
            "holiday": "毎週火曜日\n※※スープがなくなり次第終了することがございます。詳細はお電話でお問い合わせ下さい。",
            "access": {
                "line": "ＪＲ",
                "station": "大塚駅",
                "station_exit": "南口",
                "walk": "4",
                "note": ""
            },
            "parking_lots": "",
            "pr": {
                "pr_short": "丸鶏、牛骨、生牡蠣の旨みあふれるスープと小麦の風味ただよう自家製麺。店主のこだわりを一杯に昇華。",
                "pr_long": "国内外の名店で腕を磨いた店主が、満を持して2012年に開店。「自分の食べたいものしか出さない」という店主渾身のスープと自家製麺から成る、担担麺、拉麺、つけ麺は、いずれもうまみ豊かでコク深い逸品ぞろい。タレや調味料も手作りにこだわっている。ボリュームたっぷりの自家製チャーシューや海老ワンタンなどのアラカルトも人気で、多くのファンを惹きつけている。ミシュランガイド東京2018 一つ星"
            },
            "code": {
                "areacode": "AREA110",
                "areaname": "関東",
                "prefcode": "PREF13",
                "prefname": "東京都",
                "areacode_s": "AREAS2160",
                "areaname_s": "大塚",
                "category_code_l": [
                    "RSFST08000",
                    "RSFST08000"
                ],
                "category_name_l": [
                    "ラーメン・麺料理",
                    "ラーメン・麺料理"
                ],
                "category_code_s": [
                    "RSFST08008",
                    "RSFST08012"
                ],
                "category_name_s": [
                    "ラーメン",
                    "担々麺"
                ]
            },
            "budget": 1000,
            "party": "",
            "lunch": 900,
            "credit_card": "",
            "e_money": "",
            "flags": {
                "mobile_site": 1,
                "mobile_coupon": 0,
                "pc_coupon": 0
            }
        }
    ]
}
```

色々返ってきますが、今回必要なのは**店名**、**場所情報**、**写真**、**電話番号**です。

ただ、この例ではお店の写真が**shop_image1**に設定されているのですが、ほとんどの検索結果で画像がありませんでした。

画像がないとカルーセルがしょぼくなってしまいます。

一応画像がない場合はいらすとやさんにあった、

![img](https://i.imgur.com/DxiGaAr.jpg)

で置き換えるようにしましたがそれにしても悲しいので、少し工夫したいと思います。

[ホットペッパーグルメサーチAPI](https://webservice.recruit.co.jp/doc/hotpepper/reference.html)を併用して、同名のお店がヒットしたらホットペッパー側の画像(こっちのほうが画像は充実している)を採用するように変更しました。

ホットペッパーグルメサーチAPIのレスポンスはこんなかんじです。

```
{
    "results": {
        "api_version": "1.26",
        "results_available": 4,
        "results_returned": "4",
        "results_start": 1,
        "shop": [
            {
                "access": "山手線　大塚駅より徒歩5分",
                "address": "東京都豊島区北大塚２－８－８　北大塚ビル１F",
                "band": "不可",
                "barrier_free": "なし",
                "budget": {
                    "average": "1000円",
                    "code": "B001",
                    "name": "1501～2000円"
                },
                "budget_memo": "お通し代なし",
                "capacity": 20,
                "card": "利用不可",
                "catch": "太陽のラーメンとは？ ♪めがねの日♪",
                "charter": "貸切不可",
                "child": "お子様連れ歓迎",
                "close": "月",
                "coupon_urls": {
                    "pc": "https://www.hotpepper.jp/strJ000732789/map/?vos=nhppalsa000016",
                    "sp": "https://www.hotpepper.jp/strJ000732789/scoupon/?vos=nhppalsa000016"
                },
                "course": "なし",
                "english": "なし",
                "free_drink": "なし",
                "free_food": "なし",
                "genre": {
                    "catch": "おいしくてヘルシー！フレッシュなラーメン",
                    "code": "G013",
                    "name": "ラーメン"
                },
                "horigotatsu": "なし",
                "id": "J000732789",
                "karaoke": "なし",
                "ktai_coupon": 1,
                "large_area": {
                    "code": "Z011",
                    "name": "東京"
                },
                "large_service_area": {
                    "code": "SS10",
                    "name": "関東"
                },
                "lat": 35.733611638,
                "lng": 139.726689431,
                "logo_image": "https://imgfp.hotp.jp/IMGH/30/84/P010113084/P010113084_69.jpg",
                "lunch": "あり",
                "middle_area": {
                    "code": "Y057",
                    "name": "巣鴨・大塚・駒込"
                },
                "midnight": "営業している",
                "mobile_access": "山手線 大塚駅より徒歩5分",
                "name": "太陽のトマト麺 大塚北口支店",
                "name_kana": "たいようのとまとめん　おおつかきたぐちしてん",
                "non_smoking": "全面禁煙",
                "open": "火～土、祝前日: 11:00～翌1:00 （料理L.O. 翌0:30 ドリンクL.O. 翌0:30）日、祝日: 11:00～翌0:00 （料理L.O. 23:30 ドリンクL.O. 23:30）",
                "other_memo": "",
                "parking": "なし",
                "party_capacity": "",
                "pet": "不可",
                "photo": {
                    "mobile": {
                        "l": "https://imgfp.hotp.jp/IMGH/67/80/P019506780/P019506780_168.jpg",
                        "s": "https://imgfp.hotp.jp/IMGH/67/80/P019506780/P019506780_100.jpg"
                    },
                    "pc": {
                        "l": "https://imgfp.hotp.jp/IMGH/67/80/P019506780/P019506780_238.jpg",
                        "m": "https://imgfp.hotp.jp/IMGH/67/80/P019506780/P019506780_168.jpg",
                        "s": "https://imgfp.hotp.jp/IMGH/67/80/P019506780/P019506780_58_s.jpg"
                    }
                },
                "private_room": "なし",
                "service_area": {
                    "code": "SA11",
                    "name": "東京"
                },
                "shop_detail_memo": "",
                "show": "なし",
                "small_area": {
                    "code": "X142",
                    "name": "大塚"
                },
                "station_name": "大塚",
                "tatami": "なし",
                "tv": "なし",
                "urls": {
                    "pc": "https://www.hotpepper.jp/strJ000732789/?vos=nhppalsa000016"
                },
                "wedding": "",
                "wifi": "あり"
            }
        ]
    }
}
```

↑**photo**が写真です。

ちなみに検索結果のマージも行なうので、ホットペッパーのみ掲載店についても表示するようにしています。

### 一度に送れるカルーセルは10個×5メッセージまで

という制約がLINE MessaingAPIにあります。

正確には、ReplyTokenで返信できる上限が5メッセージ、1メッセージに設定できるカルーセルが10個となってます。

「xx件ヒットしました」というテキストで1メッセージ消費するので4メッセージカルーセルに設定できます。

なので、40件以上お店がヒットした場合、一度に送りきれないことがわかりました。

なので切り詰めて送るようにしました。

### Firebaseへのアクセス

GASでFirebaseにアクセスする、これが一番苦戦しました。

そもそもGASでFirebaseにアクセスする必要があるんだっけ？という話ですが、

GASでFirebaseにアクセスするには[FirestoreApp](https://github.com/grahamearley/FirestoreGoogleAppsScript)をライブラリから使ってアクセスするのがいいみたいですが、こちらをClaspに乗っけるのに苦労しました。

結論からですが、ts-ignoreを使ってliberaryからimportされている**FirestoreApp**の参照エラーを取り除くことでclaspと共存が可能でした。

```typescript
export class FirestoreService {
  private firestore: any;
  constructor(email: string, key: string, projectId: string) {
    // @ts-ignore because of Add GoogleScripts Library
    this.firestore = FirestoreApp.getFirestore(email, key, projectId);
  }
  updateData(collectionId: string, documentId: string, data) {
    this.firestore.updateDocument(collectionId + '/' + documentId, data, true);
  }
}
```

また、GASからlibraryを使う方法は簡単でGAS画面で**リソース=>ライブラリ**から**1VUSl4b1r1eoNcRWotZM3e87ygkxvXltOgyDZhixqncz9lQ3MjfT1iKFw**をAdd a libraryします。

![img](https://i.imgur.com/pdgBiAu.png)

ここで注意として指定するバージョンは最新にしないことです。

最新のバージョンはGASのV8エンジンに対応したため、旧版のGASでは動かなかったです。
## 結論

なんかめんどくさくなってきたので、フロント周りの記事は別機会に書きます...。

