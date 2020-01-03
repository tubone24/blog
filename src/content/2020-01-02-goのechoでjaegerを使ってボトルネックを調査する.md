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
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
Goの勉強をしておかないと社内でニートになってしまうので、お勉強を兼ねてGoのWebフレームワークのEchoを使ったアプリケーションを作成中です。

その中でボトルネック調査をする必要があったので、Opentracing形式のトレースアプリケーションであるJaegerをローカル環境で使ってみたいと思います。

## Table of Contents

```toc

```

## そもそもEchoとは？

**High performance**で**extensible**で**minimalist**な **Go web framework**だそうです。

よくわかりませんね。ちょっと特徴を洗い出してみます。

### はやい

Goの中でもパフォーマンスがいいと言われているGinに比べても十分な速度がでていることが公式のGitHubにのってました。

![img](https://camo.githubusercontent.com/d8800e2ee37115207efc1f3e937a28fb49d90e22/68747470733a2f2f692e696d6775722e636f6d2f49333256644d4a2e706e67)

Ginより早いならEcho使っておけばええんや！と思いますが、

GitHubレポジトリのスター数はEchoは16.1k, Ginは34.4kとGinの方が人気なのは間違いありませんので、プロジェクトによって見極める必要はありそうです。

### 公式ドキュメントが優秀

Echoの場合、Ginに比べて公式のドキュメントが充実しているような気がしました。気のせいかもしれません。

Ginの方はドキュメントに[DISQUS](https://disqus.com/)のコメント欄があります。これはいいアイディアですね。

[Echoの公式ドキュメント](https://echo.labstack.com/guide)

[Ginの公式ドキュメント](https://gin-gonic.com/docs/)

さて、Echoがいいという話はこんなところにして早速実装してみます。

## jaeger tracing

Jaegerの実装と関係ないコードは省いてます。

まずは、**main.go** エントリーポイントから

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

echo.New()したあとに、echo-contribで提供されているjaegerteacingを呼びます。

これだけで、各APIの呼び出しをrouterごとに記録することができるようになっています。
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

jaegerを起動します。起動には[公式ドキュメント](https://www.jaegertracing.io/docs/1.9/getting-started/#all-in-one)にのっているall-in-one dockerを使います。(あらかじめDockerコンテナが動く環境を作っておきます。)

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

先程作ったEchoサーバも立ち上げます。

```bash
go run main.go
```

APIをコールしてみるとTracingされているのがわかります。

![img](https://i.imgur.com/CRKvFq6.png)

**/get/:username**というAPIのコールも出ています。

![img](https://i.imgur.com/1uQdmdX.png)

こまかく見ていきますと、:username はpath parameterなのですが、APIコール時に**tubone24**というユーザ名を設定しコールしたことがわかります。

![img](https://i.imgur.com/c0y81lE.png)

また、childspanも無事記録してます。

![img](https://i.imgur.com/1uQdmdX.png)

![img](https://i.imgur.com/dh3WfC2.png)




## 結論












