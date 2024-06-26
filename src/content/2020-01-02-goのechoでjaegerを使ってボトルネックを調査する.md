---
slug: 2019/1/3/go-jaeger
title: GoのEchoでJaegerを使ってボトルネックを調査する
date: 2020-01-03T08:07:30.122Z
description: GoのEchoでJaegerを使ってボトルネックを調査します。
tags:
  - Go
  - Echo
  - Jaeger
  - ボトルネック調査
headerImage: 'https://i.imgur.com/69WEZfu.png'
templateKey: blog-post
---
Goの勉強をしておかないと社内でニートになってしまうので、お勉強を兼ねてGoのWebフレームワークのEchoを使ったアプリケーションを作成中です。

そのなかでボトルネック調査をする必要があったので、Opentracing形式のトレースアプリケーションであるJaegerをローカル環境で使ってみたいと思います。

## Table of Contents

```toc

```

## そもそもEchoとは？

![img](https://i.imgur.com/3ZjGzeX.png)

EchoとはGoのWAF(Web Framework)です。

特徴として公式によると、**High performance**で**extensible**で**minimalist**な **Go web framework**だそうです。

よくわかりませんね。ちょっと特徴を洗い出してみます。

### はやい

Goのなかでもパフォーマンスがいいと言われている[Gin](https://gin-gonic.com/)に比べても**十分な速度がでている**ことが公式のGitHubにのってました。

![img](https://camo.githubusercontent.com/d8800e2ee37115207efc1f3e937a28fb49d90e22/68747470733a2f2f692e696d6775722e636f6d2f49333256644d4a2e706e67)

Ginより早いならEcho使っておけばええんや！と思いますが、

GitHubレポジトリのスター数はEchoは**16.1k**, Ginは**34.4k**とGinの方が人気なのは間違いありませんので、プロジェクトによって見極める必要はありそうです。

また、Goの場合は標準のnet/httpライブラリがそこそこ優秀なので簡単なAPI作成であれば**WAF不要論**もあります。

### 公式ドキュメントが優秀

Echoの場合、Ginに比べて**公式のドキュメントが充実**しているような気がしました。気のせいかもしれません。

Ginの方はドキュメントに[DISQUS](https://disqus.com/)のコメント欄があります。これはいいアイディアですね。

[Echoの公式ドキュメント](https://echo.labstack.com/guide)

[Ginの公式ドキュメント](https://gin-gonic.com/docs/)

さて、Echoがいいという話はこんなところにして早速jaegerの実装してみます。

## jaegerとは？

[jeager](https://www.jaegertracing.io/docs/1.16/)は[Uber Technologies Inc.](https://uber.github.io/#/)が**OSS**として公開した**分散トレーシングシステム**です。

![img](https://i.imgur.com/69WEZfu.png)

マイクロサービスなアーキテクチャを横串で監視できる強みと**Go, Java, Node, Python, C++** でクライアントが提供されていることが魅力です。

また、トレーシングの結果収集も[OpenTracing](https://opentracing.io/)としてドキュメントがありますので、別言語にも移植できそうです。

(Nimに移植しますかね・・・。)

ともかく、かっこいいですね。今回はマイクロサービスな作り方をしていないので、そこまでかっこよくはなりませんが、さっそく使っていきましょう!

## jaeger tracing

**Jaegerの実装と関係ないコードは省いてます。**

まずは、**main.go** エントリーポイントから、

```go
// main.go

package main

import (
	"github.com/labstack/echo/v4"
	"github.com/tubone24/what-is-your-color/handler"
	"github.com/labstack/echo-contrib/jaegertracing"
)

func main() {
	e := echo.New()
	c := jaegertracing.New(e, nil)
	defer c.Close()

	e.GET("/get/:username", handler.GetColor())

	log.Fatal(e.Start(":9090"))
}
```

echo.New()したあとに、[echo-contrib](https://github.com/labstack/echo-contrib)で提供されている**jaegerteacing**を呼びます。

これだけで、各APIの呼び出しをrouterごとに記録できるようになっています。
簡単ですね！便利ですね！

## child spanを記録する

さらにAPI内部の動き、例えばDBの書き込みスピードなどを計測する場合には**child span**という機能を使うことで実現できます。

**/get/:username**というAPIのハンドラーを見てみます。

```go
package handler

import (
	"github.com/labstack/echo-contrib/jaegertracing"
	"github.com/labstack/echo/v4"
	"net/http"

	"github.com/tubone24/what-is-your-color/api"
)

func GetColor() echo.HandlerFunc {
	return func(c echo.Context) error {
		username := c.Param("username")
		github := &api.GitHub{Client: &api.GithubClientImpl{}}
		sp := jaegertracing.CreateChildSpan(c, "Call API")
		defer sp.Finish()
		sp.SetBaggageItem("Func", "GetColor")
		sp.SetTag("Func", "GetColor")
		err, langs := github.DoGetColor(username)
		if err != nil {
			return echo.NewHTTPError(http.StatusInternalServerError, "Internal Error")
		}
		return c.JSON(http.StatusOK, langs)
	}
}
```

このコード例では、GitHubのAPIからの結果を**github.DoGetColor(username)** で取得していますが、手前で**CreateChildSpan** でchildspanを指定してます。

## jaegerで結果を見る

jaegerを起動します。起動には[公式ドキュメント](https://www.jaegertracing.io/docs/1.9/getting-started/#all-in-one)にのっている**all-in-one docker**を使います。(あらかじめDockerコンテナが動く環境を作っておきます。)

```bash
docker run -d --name jaeger \
  -e COLLECTOR_ZIPKIN_HTTP_PORT=9411 \
  -p 5775:5775/udp \
  -p 6831:6831/udp \
  -p 6832:6832/udp \
  -p 5778:5778 \
  -p 16686:16686 \
  -p 14268:14268 \
  -p 9411:9411 \
  jaegertracing/all-in-one:1.9

```

~~不要な開放ポートがありますが、めんどくさいのでドキュメントそのままです。~~

起動すると、jaegerUIが<http://localhost:16686/>で立ち上がります。

さきほど作ったEchoサーバーも立ち上げます。

```bash
go run main.go
```

APIをコールしてみるとTracingされているのがわかります。

![img](https://i.imgur.com/CRKvFq6.png)

**/get/:username**というAPIのコールも出ています。

![img](https://i.imgur.com/1uQdmdX.png)

こまかく見ていきますと、:usernameはpath parameterなのですが、APIコール時に**tubone24**というユーザー名を設定しコールしたことがわかります。

**1.04sかかってますね・・・。**

![img](https://i.imgur.com/c0y81lE.png)

また、childspanも無事記録してます。

![img](https://i.imgur.com/1uQdmdX.png)

![img](https://i.imgur.com/dh3WfC2.png)

どうやらバックエンド(GitHub)へのコールはそこまで**0.48ms**とそこまで遅くはないみたいです。

別のところにボトルネックがあるんですかね・・。

## 結論

jaegerでトレーシングが簡単にできましたが、ボトルネック発見は難しいということがよくわかりました。
