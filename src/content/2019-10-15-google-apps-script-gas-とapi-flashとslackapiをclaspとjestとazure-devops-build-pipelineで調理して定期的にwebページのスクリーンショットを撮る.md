---
slug: 2019/10/24/gas-webscreenshot
title: >-
  Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮る
date: 2019-10-23T22:22:00.000Z
description: >-
  Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮る
tags:
  - JavaScript
  - TypeScript
  - Google Apps Script
  - API FLASH
  - SlackAPI
  - Clasp
  - GitHub Action
  - Jest
  - 自動テスト
  - Unit Test
headerImage: 'https://i.imgur.com/QCjxEBN.png'
templateKey: blog-post
---
タイトル長い。

くっそ長いタイトルで恐縮ですが、Google Apps Script(GAS)とAPI FLASHとSlackAPIをClaspとJestとGitHub Actionで調理して定期的にWebページのスクリーンショットを撮っていきたいと思います。

作成したコード [GitHub](https://github.com/tubone24/web-screenshot-to-slack-gas)はこちらとなります。

GASへの詳しい設定方法は拙作コードの[Readme](https://github.com/tubone24/web-screenshot-to-slack-gas/blob/master/README.md)をご参照いただければと思います。

## Table of Contents

```toc

```

## Google Apps Script(GAS)とは？

Google Driveをご存じでしょうか？

スプレッドシートやらプレゼンテーションと呼ばれる某ExcelやPowerPointの基本機能がWeb画面で扱えるアレです。

Google Apps Scriptはそれのマクロだと思っていただけるとイメージがつきやすいかと思います。

ExcelやPowerPointだとVBAがマクロ言語ですが、Google Apps ScriptはJavaScriptが言語です。

さすがGoogle公式言語。

またGoogle Apps Scriptのことを省略してGASとか言ったりするそうです。

ガスガス✨

GAS専用のマクロ用関数がある程度用意されてるのでマクロを組むのも簡単ですし、時間で関数をキックするトリガー機能もあるので、簡単なFaaS（Function as a Service）として
利用できます。

今回は後者の使い方が中心となります。

## JavaScriptはJavaScriptなんだけどさ

さきほど書いたとおり、ほとんどGASはJavaScriptなのですが、ES6な記法ではないので、JavaScriptとは恐れ多くても言えないというのが実状です。

なので上記と合わせ素のGASを使うと下記のような悲しいことがおきます。

- 古くさいJavaScriptを書く
- テストできない
- CIに乗っけられない（手デプロイ）

これは悲しいですね。

## 悲しい世界には美しい花が咲く

と悲しい気持ちになってるところで見つけたのがclaspです。

claspはGoogle謹製のGASデプロイツールなのですが、勇者が
[Claspを使ったTypeSciptテンプレートを作ってました。](https://github.com/howdy39/gas-clasp-starter)天才かよ。

今回はこちらのテンプレートを借りて開発を進めたいとおもいます。

## API FLASH のサービス層作成

今回のGASの目的は、**WEBページのスクリーンショットを撮る**ということですので、スクリーンショットを簡単に取得する方法としてAPI FLASHを使います、

### API FLASHとは

[API FLASH](https://apiflash.com/)とは、**Chrome**ベースのWebscreenshotAPI提供サービスです。

API FLASH自体はAWS Lambdaを使ってるらしく、スケーラビリティが高いと主張してます。

おそらく、[Serverless-chrome](https://github.com/adieuadieu/serverless-chrome)をLambdaで実行しているものと思われます。

Chromeベースのキャプチャリングなので、レンダリングも正確で非対応ページがすくないのもうれしいところです。

さらに、うれしい機能として遅延キャプチャリング機能があり、ページのレンダリングを待ってからキャプチャを撮ることも可能です。

```text
https://api.apiflash.com/v1/urltoimage?access_key=hoge&url=hoge&delay=10
```

のようなURLでHttp Getをするだけでキャプチャが撮れるんです、すごいですね。

ちなみに、無料版には1ヶ月あたりの利用制限がありますのでご注意を。

### 実際できあがったコード

TypeSciptでこんな感じのサービス層を作りました。

```typescript
export class ApiFlashService {
  static captureWebPage = (
    url: string,
    accessKey: string,
    width: string,
    height: string,
    delay: string
  ): GoogleAppsScript.Base.Blob => {
    const captureUrl = ApiFlashService.createChaptureUrl(url, accessKey, width, height, delay);
    const responseData = UrlFetchApp.fetch(captureUrl);
    return responseData.getBlob();
  };
  private static createChaptureUrl = (
    url: string,
    accessKey: string,
    width: string,
    height: string,
    delay: string
  ): string => {
    return `https://api.apiflash.com/v1/urltoimage?access_key=${accessKey}&url=${url}&width=${width}&height=${height}&delay=${delay}&fresh=true`;
  };
}
```

GASの場合APIのコールには**URLFetchApp**が利用できます。

`UrlFetchApp.fetch(url)` とするだけでAPIがコールできます。

URLFetchAppはもちろんGAS専用のAPIですが、TypeSciptのLintがちゃんと利くのが何気にすごいと思いました。

![img](https://i.imgur.com/gul9s4W.png)

## Slackのサービス層

コードは省略しますが上と同じ要領でURLFetchを使って、Slackコール部も作ります。

## テスト

テストはJestで作ります。

ポイントは先ほどから利用しているURLFetchをMock化する必要があることです。

Jestのグローバル変数定義であらかじめURLFetchを作り、JestのMock関数をテストケースごとにfetch関数と置き換えることで実現できます。

package.jsonに、

```json
  "jest": {
    "verbose": true,
    "globals": {
      "UrlFetchApp": {}
    },
  },
```

とすることでグローバルにUrlFetchAppができますので、テストコードで、

```typescript
const mockFetch = jest.fn();
UrlFetchApp.fetch = mockFetch;

describe('sendSlackServiceOK', () => {
  it('sendImage', () => {
    const actual = SendSlackService.sendImage('test-token', 'test-image', 'test-title', '#test');
    const expectedOption = {
      method: 'post',
      payload: { token: 'test-token', file: 'test-image', channels: '#test', title: 'test-title' }
    };
    expect(mockFetch.mock.calls[0][0]).toBe('https://slack.com/api/files.upload');
    expect(mockFetch.mock.calls[0][1]).toEqual(expectedOption);
    expect(actual).toBe(true);
  });
});
```

とすることでfetch関数がmockに置き換わり、テスト可能です。

mock関数をあらかじめ作成しておくと、コールのassertも可能です。

## Buildとdeploy

StarterではWebpackを使ってTypeSciptのGAS化を実行しているようです。

```shell{promptUser: tubone}{promptHost: dev.localhost}
npm run build
```

とすることで、dist配下にGASのコードが配置されました。

デプロイは、claspを利用します。

```shell{promptUser: tubone}{promptHost: dev.localhost}
clasp login
clasp push
```

とするだけでデプロイできちゃいます。

## GitHub Actionで自動デプロイさせる

ここまできたらあとはCIに乗っけるだけです。

clasp loginをローカル上で実施したときに取得できるトークンがclasprc.jsonに出力されているので、こちらをGitHub ActionのSecret機能で渡してあげます。

![img](https://i.imgur.com/ogQ4ILr.png)

あとは、testが通ったらclasp loginして、build, deployする定義をかけばよいです。

GitHub ActionのSecretにはこのようにアクセスします。

```shell{promptUser: tubone}{promptHost: dev.localhost}
echo "${{ secrets.CLASPRC_JSON }}" > ~/.clasprc.json
```

## 完成

GASにデプロイできたらcronでトリガーさせてあげれば定期的にキャプチャをとります。

やったー!!

無事にSlackへキャプチャが送られてきました！

![Img](https://raw.githubusercontent.com/tubone24/web-screenshot-to-slack-gas/master/docs/images/slack-preview.png)
