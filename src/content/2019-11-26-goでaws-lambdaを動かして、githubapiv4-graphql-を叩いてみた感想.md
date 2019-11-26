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
headerImage: 'https://i.imgur.com/h1EK5QS.png'
templateKey: blog-post
---
# やらねば。（風立ちぬ）

案件でGoを使った開発にシフトしつつあるので必死こいて勉強してるわけですが、AWS LambdaをGoで実装したことがなかったのでちょっと触ってみました、というお話。

## AWS LambdaがGoで動くことを知ってますか？

![img](https://i.imgur.com/h1EK5QS.png)

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
		"q": githubv4.String("user:tubone24"), //検索するuser名
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

[shurcooL/graphql](shurcooL/graphql)

さらに、GitHubAPI専用のクライアントも見つけましたのでこっちを使うことにします。

[shurcooL/githubv4](https://github.com/shurcooL/githubv4)

GitHubAPIv4はGitHubのPersonal access tokensでAccess Tokenを発行する必要があります。

[New personal access token](https://github.com/settings/tokens/new)から発行できます。

![img](https://i.imgur.com/k926T60.png)

shurcooL/githubv4自体の使い方はそこまで難しくなく、HttpClientやAuthをすませた後、GraphQLのクエリを構造体として定義して投げつければよいです。

このようなGraphQLなら・・

```json
{
  search(query: "user:tubone24", type: REPOSITORY, first: 100) {
    edges {
      node {
        ... on Repository {
          name
          languages(first: 100) {
            edges {
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
}
```

下記のようにすれば取得できます。

```go
//main.go

import (
	"context"
	"fmt"
        "golang.org/x/oauth2"
	"github.com/shurcooL/githubv4"
)

// 構造体でGraphQL定義

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


func hoge () {
	src := oauth2.StaticTokenSource(
		&oauth2.Token{AccessToken: "7xxxxxxxxxxxxxxxxxxxxxxxx"},
	) //AccessTokenを設定

	httpClient := oauth2.NewClient(context.Background(), src) //AccessTokenをhttpClientに設定

	client := githubv4.NewClient(httpClient) //先ほど作ったhttpClient使ってclientを作成

	variables := map[string]interface{}{
		"q": githubv4.String("user:tubone24"), //検索するuser名
		"searchType":  githubv4.SearchTypeRepository,
	}
	
	err := client.Query(context.Background(), &query, variables) //client.Queryで実行。エラーのみが戻りで実行結果は咲くほど定義した構造体に格納
	if err != nil {
		// Handle error.
		fmt.Println(err)
	}

	for _, repo := range query.Search.Nodes {
		fmt.Println("---------")
		fmt.Println(repo.Name)
		for _, lang := range repo.Languages.Nodes {
			fmt.Println(lang.Name)
                        fmt.Println(lang.Color)
		}
	}

}

```

あらまぁ、簡単！と思ったものの、上記のようにNodesは取得できたのですが、Edgesに定義された値がどうやってもとれない。。例えば・・

```json{numberLines: 1}{9}
{
  search(query: "user:tubone24", type: REPOSITORY, first: 100) {
    edges {
      node {
        ... on Repository {
          name
          languages(first: 100) {
            edges {
              size
              node {
                name
                color
              }
            }
          }
        }
      }
    }
  }
}
```

のようにedgesに項目がありnodeを取りたい場合

```go{numberLines: 1}{9-13}
type Language struct {
	Name  string
	Color string
}

type Repository struct {
	Name string
	Languages struct {
            Edges []struct {
		Node struct {
			Language `graphql:"... on Language"`
		}
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
```

とやってもエラーになってしまう・・。

[こちらのPR](https://github.com/shurcooL/githubv4/issues/30)の通りEdgesは構造体のスライスで宣言してね～というのも試したのですがうまくいかず。。

使用言語のサイズが取りたいだけなんですよ…。

今回は趣旨から反するので一旦塩漬け。。


## LambdaでGoを使うとき

main関数には AWSが用意している `github.com/aws/aws-lambda-go/lambda` からロジックを
Invokeさせないと問答無用でLambdaでエラーになってしまいます。

そこで `github.com/aws/aws-lambda-go/lambda` の `lambda.Start` を使って動かします。

```go{numberLines: 1}{7}
func LambdaHandler () (string, error){
	result := hoge() //login
	return fmt.Sprint(result), nil
}

func main() {
	lambda.Start(LambdaHandler)
}

```

## AWS Lambdaにデプロイする

GoをLambdaにデプロイするときは、実行ファイルにBuildしたものをZIPで固めてあげます。

実行ファイル、ということはビルドするプラットフォームに依存してしまうのでは？と思ったのですが、 ベストプラクティスとして `GOOS=linux` をgo build時につけることでLinux互換な実行ファイルになるみたいです。

```
$ GOOS=linux go build main.go
```

あとは実行ファイルをZIPで固めて、Lambda作ってアップロードして保存すれば終わりです。

## 実行

Lambdaのテスト実行をしてみます。

![img](https://i.imgur.com/HBHjuZk.png)

無事、GitHubの私のレポジトリ群の言語一覧が取れました。

printしているものはCloudwatchにも出てきていました。(goのlogを使ってもきちんとCWにログ出るそうです。)

![img](https://i.imgur.com/DDLSLo4.png)

## おまけ

上記のコードでは、レポジトリ群に重複した言語があった場合は重複を避ける形で出力しています。

PythonではSetという便利なものがあるのですが、Goではあるのでしょうか・・・。

ありました。

[deckarep/golang-set](https://github.com/deckarep/golang-set)

```go{numberLines: 1}{3,9,16}
import (
	"fmt"
	"github.com/deckarep/golang-set"
)

// 中略・・

func main () {
	langlist := mapset.NewSet() // setを作る
        // 中略
	for _, repo := range query.Search.Nodes {
		fmt.Println("---------")
		fmt.Println(repo.Name)
		for _, lang := range repo.Languages.Nodes {
			fmt.Println(lang.Name)
			langlist.Add(lang.Name) //setにAddする
		}
	}
	return langlist // set{hoge, fuga} 重複がないsetが返る
}
```

便利！

