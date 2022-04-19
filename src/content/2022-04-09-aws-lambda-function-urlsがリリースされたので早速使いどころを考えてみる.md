---
id: ""
slug: 2022/04/09/lambda-urls
title: AWS Lambda Function URLsがリリースされたのでタイムアウトの挙動を確かめてみる
date: 2022-04-09T02:50:46.360Z
description: AWS Lambda Function URLsがリリースされ、ますますLambdaが便利になりますが、何に使おっか..という意見もちらほら？
tags:
  - AWS
  - Lambda
headerImage: https://i.imgur.com/alxzd7y.png
templateKey: blog-post
---
花粉.

## Table of Contents

```toc

```

## AWS Lambda Function URLs

[AWS Lambda Function URLs](https://aws.amazon.com/jp/about-aws/whats-new/2022/04/aws-lambda-function-urls-built-in-https-endpoints/)がリリースされました!!

今まではLambdaを使ってHTTPのエンドポイントを作る際は[Amazon API Gateway](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-apigateway.html)と組み合わせて作るか[アプリケーションロードバランサー(ALB)のターゲットにAWS Lambdaを選ぶ](https://aws.amazon.com/jp/blogs/news/lambda-functions-as-targets-for-application-load-balancers/)かいずれかが必要でした。

今回のアップデートでAWS Lambdaサービスの組み込み機能として、HTTPSエンドポイントをLambda単体で作成できるのでLambdaでAPIを作ったりWebhookの連携先として機能させる際にAPI Gatewayなどをかませる必要がなくなり便利かと思います。

## 使ってみる

使い方は超簡単でLambdaを作る際に関数を作る際に関数URLを有効化にしてあげるだけです。

![コンソール](https://i.imgur.com/tD6NepW.png)

後々の検証のため次のようなコードをデプロイしてみます。

```javascript
async function sleep(time) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, time);
  });
}

exports.handler = async (event) => {
    console.log(event);
    let sleepTime = 0;
    if (event.queryStringParameters !== undefined && event.queryStringParameters.sleep !== undefined) {
      sleepTime = Number(event.queryStringParameters.sleep);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(`Hello from Lambda and sleep ${sleepTime}!!!`),
    };
    await sleep(sleepTime);
    return response;
};
```

![lambda概要](https://i.imgur.com/Fe6zbrS.png)

デプロイできると関数URLが発行されます。

https://{url-id}.lambda-url-region.on.awsという不思議なTLDのURLができました。

こちらにアクセスしてみると、

![ブラウザアクセス](https://i.imgur.com/OaIFZxx.png)

確かにちゃんと関数が実行されてレスポンスが返ってきました！

また、handlerの引数で取得するeventの中身も、

```javascript
{
  version: '2.0',
  routeKey: '$default',
  rawPath: '/',
  rawQueryString: '',
  headers: {
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'none',
    'accept-language': 'ja',
    'x-forwarded-proto': 'https',
    'x-forwarded-port': '443',
    dnt: '1',
    'x-forwarded-for': 'xxx.xxx.xxx.xxx',
    'sec-fetch-user': '?1',
    accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
    'sec-ch-ua-mobile': '?0',
    'x-amzn-trace-id': 'Root=1-62510b5b-xxxxxxxxxxxxxxxxxxxx',
    'sec-ch-ua-platform': '"Windows"',
    host: 'xxxxxxxxxxxxxxxxxxxxxxxxx.lambda-url.ap-northeast-1.on.aws',
    'upgrade-insecure-requests': '1',
    'accept-encoding': 'gzip, deflate, br',
    'sec-fetch-dest': 'document',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
  },
  requestContext: {
    accountId: 'anonymous',
    apiId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    domainName: 'xxxxxxxxxxxxxxxxxxxxxxxxxx.lambda-url.ap-northeast-1.on.aws',
    domainPrefix: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    http: {
      method: 'GET',
      path: '/',
      protocol: 'HTTP/1.1',
      sourceIp: 'xxx.xxx.xxx.xxx',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.75 Safari/537.36'
    },
    requestId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    routeKey: '$default',
    stage: '$default',
    time: '09/Apr/2022:04:28:11 +0000',
    timeEpoch: 1649478491452
  },
  isBase64Encoded: false
}
```

みたいな感じで[API Gatewayのイベント形式](https://docs.aws.amazon.com/ja_jp/lambda/latest/dg/services-apigateway.html#apigateway-example-even)とよく似てます。

なので、API Gatewayで動かしていたLambdaの置き換え、みたいなこともそこまで苦労しないかもしれませんね。


## 確かに便利ではありますが...

実際API Gatewayと組み合わせる構成と比べて、リソースを作るのが楽、以外何がうれしいの？という気はしますのでもう少しDeep Diveしてみたいと思います。

## 認証

認証的な設定は[今のところAWS IAM認証](https://docs.aws.amazon.com/lambda/latest/dg/urls-auth.html)がまずサポートされてます。

クレデンシャルとかから署名バージョン4を作成してアクセス時にして認証させる方法です。

独自のオーソライザーが挟めないので、あくまでも同じアカウントにアクセスできる開発者向けのAPIとして使うのがよさそうです。もっと込み入ったことがやりたいならAPI Gatewayをおとなしく使いましょう...。(もうちょっと色々試してみます。)

IAM認証を設定したうえで、署名を付けず未認証の状態でアクセスすると、

```
{"Message":"Forbidden"}
```

が返ってきました。

## タイムアウト

いよいよ本題です。API GatewayとLambdaの組み合わせを使っているとよく困る話がAPI Gatewayのタイムアウトだと思ってます。

Lambdaのタイムアウトは15分まで拡張されてますが、API Gatewayの最大統合タイムアウトは30秒でそれを[クオータで](https://docs.aws.amazon.com/ja_jp/apigateway/latest/developerguide/limits.html
)引き上げることもできないのでAPI Gateway + Lambdaの構成の際はどう頑張ってもAPIが30秒でタイムアウトしないような設計が求められます。

確かにHTTPで30秒以上かかるようなAPIは非同期APIにして完了をポーリングさせたり、pushさせたりしたほうが正しい設計だと思いますが思いのほか30秒タイムアウトが厳しい...。という経験は多いのではないでしょうか？

この記事を見たとき私はLambdaにURLエンドポイントがビルトインされるならタイムアウトはLambdanのそれになるのでは？と思いました。実験してみます。

さきほどデプロイしたコードをもう一度見てみましょう。

```javascript
async function sleep(time) {
  return new Promise((resolve, _reject) => {
    setTimeout(resolve, time);
  });
}

exports.handler = async (event) => {
    console.log(event);
    let sleepTime = 0;
    if (event.queryStringParameters !== undefined && event.queryStringParameters.sleep !== undefined) {
      sleepTime = Number(event.queryStringParameters.sleep);
    }
    const response = {
        statusCode: 200,
        body: JSON.stringify(`Hello from Lambda and sleep ${sleepTime}!!!`),
    };
    await sleep(sleepTime);
    return response;
};
```

returnの手前でsleep(setTimeout)を入れてます。そしてクエリパラメーターでsleepのミリ秒を指定できるようにしてます。

まず、何も設定しないときはsleepはしないのですぐレスポンスが返ってきます。

sleepを1000にすれば1秒待ってレスポンスが返ってきます。

![1秒](https://i.imgur.com/V6AQ1kl.png)

では、API Gatewayのタイムアウトの30秒に設定してみましょう。(Lambdaのタイムアウトは2分にしてます)

![30秒](https://i.imgur.com/Jh9cixG.png)

タイムアウトしませんでした!!ではLambdaのタイムアウトまで引き延ばしてみましょう！

![タイムアウト](https://i.imgur.com/UCbN8Df.png)

Internal Server Errorしました。これは直感的でいいですね。

## 結論

Lambdaライフを楽しみましょう！






























