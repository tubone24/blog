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
やらねば。（風立ちぬ）

案件で**Go**を使った開発にシフトしつつあるので必死こいて勉強してるわけですが、**AWS Lambda**を**Go**で実装したことがなかったのでちょっと触ってみました、というお話。

## Table of Contents

```toc

```

## AWS LambdaがGoで動くことを知ってますか？

![img](https://i.imgur.com/h1EK5QS.png)

知っている人も多いと思いますが、2017年のre:Invent 2017(AWSのカンファレンスイベント)でLambdaに関するアップデートのなかでGoで動くようになったよ～というのがありました。[［速報］AWS Lambdaが機能強化。.NETとGo言語をサポート、サーバレスアプリケーションのリポジトリも登場。AWS re:Invent 2017
](https://www.publickey1.jp/blog/17/aws_lambdanetgoaws_reinvent_2017.html)

![img](https://www.publickey1.jp/2017/lambda01.gif)

Lambda自体は、裏側の基盤に[AWS Firecracker](https://aws.amazon.com/jp/blogs/news/firecracker-lightweight-virtualization-for-serverless-computing/)を導入したことがきっかけで、集約化と安全性がめちゃんこあがったので、タイムアウトが長くなったり、カスタムランタイムに対応したりと一気に進化したイメージがありましたが、いまだにPythonか、Node.jsで書くかしかして無かったです。（怠け）

~~どこかでFirecrackerをいじりたいですね。~~

仕事上使う機会に恵まれたので今回Go Lambdaをはじめて触ることにしました。

## 今回の開発スコープ

今回はお勉強というか、感触をつかむためにやるだけなのでちゃんとしたサービスは作りません。

別件で**GitHub API（GraphQL）**を触る必要もあったのでまとめてやってしまいます。

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

Goはまぎれもなくサーバーサイドな言語なのでどちらかというと関心事がGraphQLのサーバーサイド実装でBFFたくさん作るのめんどくさいからまとめてGraphQLで返したい！という感じのモチベーションの記事が多めではありますが、ちゃんと**GraphQLクライアント**みつけました。

[shurcooL/GraphQL](shurcooL/graphql)

さらに、**GitHubAPIv4専用のクライアント**も見つけましたのでこっちを使うことにします。

[shurcooL/githubv4](https://github.com/shurcooL/githubv4)

話は逸れますがGitHubAPIv4はGitHubの**Personal access tokens**
で**Access Token**を発行する必要があります。

[New personal access token](https://github.com/settings/tokens/new)から発行できます。発行しておきましょう。shurcooL/githubv4でも使います。

![img](https://i.imgur.com/k926T60.png)

shurcooL/githubv4自体の使い方はそこまで難しくなく、HttpClientやAuthをすませた後、**GraphQLのクエリ**を**Goの構造体**として定義して投げつければよいです。

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

**あらまぁ、簡単！**と思ったものの、上記のように**Nodes**は取得できたのですが、**Edgesに定義された値**がどうやってもとれない。。

例えば・・

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

のようにedgesに項目がありnodeを取りたい場合、

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

[取りたい項目](https://developer.github.com/v4/object/languageedge/)

今回は趣旨から反するのでいったん塩漬け。。

## LambdaでGoを使うとき

main関数にはAWSが用意している `github.com/aws/aws-lambda-go/lambda` からロジックを
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

GoをLambdaにデプロイするときは、**実行ファイルにBuild**したものを**ZIPで固めて**あげます。

Lambda画面のCloud9から編集できないんですね・・・

実行ファイル、ということはビルドするプラットフォーム(OSとか)に依存してしまうのでは？と思ったのですが、 ベストプラクティスとして `GOOS=linux` をgo build時につけることでLinux互換な実行ファイルになるみたいです。

```shell{promptUser: tubone}{promptHost: dev.localhost}
GOOS=linux go build main.go
```

あとは実行ファイルをZIPで固めて、Lambda作ってアップロードして保存すれば終わりです。

## 実行

Lambdaのテスト実行をしてみます。

![img](https://i.imgur.com/HBHjuZk.png)

無事、GitHubの私のレポジトリ群の言語一覧が取れました。

printしているものはCloudwatchにも出てきていました。(goのlogを使ってもきちんとCWにログ出るそうです。)

![img](https://i.imgur.com/DDLSLo4.png)

ひとまず完成っぽいです。

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

こういう便利なもの、もっと作っていきたいですね。

## 使ってみての感想

GoでLambdaを組んでみての感想は、

- Cloud9で直接Lambda編集したいなぁ…
- lambda.startにラッピングする必要があるのでローカルで確認しにくいなぁ
  - こちら解決する方法は次回考えます
- 果たして早くなったのか？
  - わからん。調べたい
