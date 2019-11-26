---
slug: 2019/11/26/go-lambda
title: GoでAWS Lambdaを動かして、GitHubAPIv4(GraphQL)を叩いてみた感想
date: 2019-11-26T11:31:35.438Z
description: 急遽Goで開発することになったので慌てて技術検証の巻
tags:
  - Go
  - Lambda
  - AWS
  - GraphQL
  - GitHub
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# やらねば。（風立ちぬ）

案件でGoを使った開発にシフトしつつあるので必死こいて勉強してるわけですが、AWS LambdaをGoで実装したことがなかったのでちょっと触ってみました、というお話。

## AWS LambdaがGoで動くことを知ってますか？

知っている人も多いと思いますが、2018年のReinvent(AWSのカンファレンスイベント)でLambdaに関するアップデートの中でGoで動くようになったよ～というのがありました。

Lambda自体は、裏側の基盤にFire Clackerを導入したことがきっかけで、集約化と安全性がめちゃんこあがったので、タイムアウトが長くなったり、カスタムランタイムに対応したりと一気に進化したイメージがありましたが、いまだにPythonか、Node.jsで書くかしかして無かったです。（怠け）

仕事上使う機会に恵まれたので今回初めて触ることにしました。

## 今回の開発スコープ

今回はお勉強というか、感触をつかむためにやるだけなのでちゃんとしたサービスは作りません。

別件でGitHub API（GraphQL）を触る必要もあったのでまとめてやってしまいます。

### やること

- main.goのみ
  - RepositoryとかModelとかUsecaseとかそういうのは作らないよ

- GitHub APIv4 GraphQLを使うよ
  - とりあえず自分の公開されてるレポジトリの使用言語を一覧取るよ

- 手でビルドし、手でデプロイするよ

## とりあえずコード

これが作ったショボコードです。追って解説します。

```go
package main

import (
	"context"
	"fmt"
	"github.com/shurcooL/githubv4"
	"golang.org/x/oauth2"
	"github.com/deckarep/golang-set"
	"github.com/aws/aws-lambda-go/lambda"
)

type Language struct {
	Name  string
	Color string
}

type Repository struct {
	Name string
	Languages struct {
		Nodes []struct {
			Language `graphql:"... on Language"`
		}
	} `graphql:"languages(first: 100)"`
}

var query struct {
	Search struct {
		Nodes []struct {
			Repository `graphql:"... on Repository"`
		}
	} `graphql:"search(first: 100, query: $q, type: $searchType)"`
}


func getLangList () (mapset.Set){
	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: "7xxxxxxxxxxxxxxxxxxxxxxxx"},
	)
	httpClient := oauth2.NewClient(context.Background(), src)

	client := githubv4.NewClient(httpClient)

	langlist := mapset.NewSet()

	variables := map[string]interface{}{
		"q": githubv4.String("user:tubone24"),
		"searchType":  githubv4.SearchTypeRepository,
	}
	
	err := client.Query(context.Background(), &query, variables)
	if err != nil {
		// Handle error.
		fmt.Println(err)
	}

	for _, repo := range query.Search.Nodes {
		fmt.Println("---------")
		fmt.Println(repo.Name)
		for _, lang := range repo.Languages.Nodes {
			fmt.Println(lang.Name)
			langlist.Add(lang.Name)
		}
	}
	return langlist

}

func LambdaHandler () (string, error){
	result := getLangList()
	return fmt.Sprint(result), nil
}

func main() {
	lambda.Start(LambdaHandler)
}
```

## GraphQLをGoで叩く

Goはまぎれもなくサーバーサイドな言語なのでどちらかというと関心事がGraphQLで返すという感じではありますが、ちゃんとGraphQLクライアントみつけました。

（リンク）

さらに、GitHubAPI専用のクライアントも見つけましたのでこっちを使うことにします。

使い方はそこまで難しくなく、HttpClientやAuthをすませた後、GraphQLのクエリを構造体として定義して投げつければよいです。

簡単と思ったものの、上記のようにNodesは取得できたのですが、Edgesに定義された値がどうやってもとれない。。

こちらのPR（リンク）の通りEdgesは構造体のスライスで宣言してね～というのも試したのですがうまくいかず。。

使用言語のサイズが取りたいだけなんですよ…。

今回は趣旨から反するので一旦塩漬け。。


## LambdaでGoを使うとき

main関数には AWSが用意している `github.com/aws/aws-lambda-go/lambda` からロジックを
Invokeさせないと問答無用でLambdaでエラーになってしまいます。


