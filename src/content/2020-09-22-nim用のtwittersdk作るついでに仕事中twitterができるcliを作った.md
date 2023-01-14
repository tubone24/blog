---
slug: 2020/09/22/nim-twitter
title: Nim用のTwitterSDK作るついでに仕事中TwitterができるCLIを作った
date: 2020-09-22T11:39:58.035Z
description: Nim用のTwitterSDK作るついでに仕事中TwitterができるCLIを作った
tags:
  - Nim
  - Twitter
headerImage: https://i.imgur.com/BO7QR6p.png
templateKey: blog-post
---
NimのTwitterSDKを作ってOSS兄貴になろうと思ったら、結局なれませんでした。


## Table of Contents

```toc

```

## Nimとは？

詳しくは[docoptはNimでも使えたのお話
](https://blog.tubone-project24.xyz/2019/11/20/docopt-nim#%E3%81%9D%E3%82%82%E3%81%9D%E3%82%82nim%E3%81%A8%E3%81%AF%EF%BC%9F)をご覧いただければと思いますが、**静的型付なコンパイラ言語**でPython, Ada, modulaなどの成熟した言語のいいとこ取りをした**能率的**で、**表現力豊か**で、**エレガントな言語**です。

![img](https://i.imgur.com/BbHTNwQ.png)

いわゆる別言語への**トランスパイル**を通して、ビルドする言語となり、通常はCを使いますが、C++、JavaScript、Javaなんかへの変換が可能です。(フロントとバックエンドと両方の言語としての覇権を狙っている!?)

言語の構文もPythonのそれに近く、さらに言えば実行速度も早く、Goのように**Artifactsが巨大**になることもありません。

ここまで聞くと、いいことことごとくめで素晴らしいのですがNimには欠点があります。

それは悲しいくらい**流行ってない**ということです。

いや、一部の熱狂的信者はいるのですが一般的か？と言われると疑問符がついてしまうのです。

## どうして流行らないのか？

これはあくまでも私の主観なのですが、おそらく、

**Pythonの皮を被ったC言語というのはしょせんC言語でしかない**というところでしょうか？

例えば新しい言語でV言語というのがありますが、あちらは**Go**の構文を色濃く採用しながら、Goのイケてないところを修正してます。例えばジェネリクス(Go2では採用されるらしいですが)やアクセス修飾子、ワンバイナリからlibの切り出しRustに代表されるGCを使わないメモリ管理などを組み込んでいます。

V言語も流行っているわけではないが、Nimよりは周りで聞くような**気**もします。あくまでも気もするだけだが...。

V言語はGoを参考にした構文に対し、NimはPythonを明らかに参考にしています。それだけ、書きやすいのかな？と思いつつ例えばこんなことが起きます。

```nim
proc hoge(n: int): int

proc fuga(n: int): int =
  result = hoge(n) + 1

proc hoge(n: int): int =
  return 2 ^ n
```

C言語に親しみのあるほうは、一行目のhoge関数はプロトタイプ宣言かと思いますが、Python書いているだけだと、こんなことわかりません。

~~大学の授業でC言語やったことある人なら、プロトタイプ宣言はわかりますよね!?~~

Nimを書いているとちょこちょここんなことが起きます。

型は型アノテーションもあったりするので慣れ親しんだ人もいると思いますが、C言語特有の話が出てくるとちょっと混乱したりします。

こういうところがPythonとデラ相性が悪いのです。(と感じるのです)

というより、もうCとして考えてくださいって感じです。

## NimでTwitterSDK作る

とまぁいろいろ問題点は書きましたが、私はNimが好きなので、何か貢献しようと思いTwitterSDKを作っていこうと思います。

マイナー言語は車輪の再開発の心配がなくものづくりができるのですばらしいですね。（涙）

ということでまず、TwitterAPIへのアクセス方法について確認します。

## TwitterAPI

TwitterAPIにはv2とv1.1があるのですが今回はv1.1を使って実装します。

<https://developer.twitter.com/en/docs/twitter-api/v1>

v1.1のAPI認可方式はoAuth1.0です。

### oAuth1.0をNimで使うには？

APIを使うには当然HTTPリクエストができないといけないですが、Nimにはhttpclientというライブラリがあらかじめ用意されております。

がしかしザンネンながら、Nimのhttpclientは**oAuthには対応してない**ので、処理系は自前で作らないといけません。

oAuth2.0、つまりapplication keyとそのシークレットでアクセス可能なAPIであればさほど処理系は難しくなく、Basic認証としてheaderにそれぞれを設定してあげればBearer tokenが取得できます。

```nim
import httpclient

const authEndpoint = "https://api.twitter.com/oauth2/token"

proc getBearerToken(apiKey:string, apiSecret:string):string =
  let client = newHttpClient()
  let credentials = encode(apiKey & ":" & apiSecret)
  client.headers = newHttpHeaders({
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
    "Authorization": "Basic " & credentials
  })
  let body = "grant_type=client_credentials"
  let response = retryRequest(client, authEndpoint, httpMethod = HttpPost, body = body)
  let bearerToken = parseJson(response.body)["access_token"].getStr()
  return bearerToken
```

しかしながらTwitterAPI 1.1で使う、oAuth1.0となると話は異なります。

<https://oauth.net/core/1.0/>

上記サイトにもあるようにoAuth1.0によるクライアント認証には、RequestTokenのリクエストを投げ込み、レスポンスから認可エンドポイントへのRequestToken認可要求リダイレクト、受け取ったTokenを署名にしてAccessTokenリクエストからやっとAccessTokenが受け取れます。

長い...。

![img](https://i.imgur.com/KrG6jYE.png)
(https://oauth.net/core/1.0/)

めんどくさいなぁーと思っていたら、便利なライブラリありました。

### CORDEA/oauth

<https://github.com/CORDEA/oauth>

ありがたいです。使い方もとってもかんたんで、インストール後例えばAccessTokenが取りたいときは、

```nim
import oauth1

const
    requestTokenUrl = "https://api.twitter.com/oauth/request_token"
    authorizeUrl = "https://api.twitter.com/oauth/authorize"
    accessTokenUrl = "https://api.twitter.com/oauth/access_token"
    
proc getAccessToken(apiKey:string, apiSecret:string):Table[string, string] =
  let
    client = newHttpClient()
    requestTokenResponse = client.getOAuth1RequestToken(requestTokenUrl, apiKey, apiSecret, isIncludeVersionToHeader = true) # RequestToken取得
    requestTokenBody = parseResponseBody(requestTokenResponse.body)
    requestToken = requestTokenBody["oauth_token"]
    requestTokenSecret = requestTokenBody["oauth_token_secret"]
  echo "Access the url, please obtain the verifier key."
  echo getAuthorizeUrl(authorizeUrl, requestToken)
  echo "Please enter a verifier key (PIN code)." # Redirect
  let
    verifier = readLine stdin
    accessTokenResponse = client.getOAuth1AccessToken(accessTokenUrl, apiKey, apiSecret, requestToken, requestTokenSecret, verifier, isIncludeVersionToHeader = true) # AccessToken取得
    accessTokenResponseBody = parseResponseBody(accessTokenResponse.body)
    accessToken = accessTokenResponseBody["oauth_token"]
    accessTokenSecret = accessTokenResponseBody["oauth_token_secret"]
  result = initTable[string, string]()
  result["accessToken"]  = accessToken
  result["accessTokenSecret"]  = accessTokenSecret
```

という具合でAccessTokenが取れてしまいます。

さて、これでNimでTwitterのAPIを叩く準備ができました。

### リトライの実装

ついでにAPIコールでリトライできるように改造しましょう。

なんのことはないです。再帰で呼びつつ、リトライカウントを引数で渡しながら0になったら抜けるよくある実装です。

リトライ時のSleepは**Exponential BackOff**つまり**指数関数的バックオフ**の実装にしました。

もともとはネットワークの**コリジョン**が発生したときの待ち時間採択で使われていたアルゴリズムらしいですが、今はもっぱらAPIのリトライ制御に使っています。

（今の子どもたちって、ネットワークのコリジョンとか知らないのでは？半二重通信とかなにそれおいしいの？だと思いますが、それだけ世の中が発達したということですね。）

とはいっても難しいことはないです。なんのことはないです。

![img](https://i.imgur.com/lFclC4Z.png)

で算出できます。

```nim

proc exponentialBackoff*(n: int): int =
   if n < 0:
     return 0
   else:
     return 2 ^ n - 1

# いわゆる再帰でリトライを実施するやつ。デフォルト引数がNimでは使えるから実装かんたん
proc retryoAuth1Request*(client: HttpClient, url: string, apiKey: string, apiSecret: string, accessToken: string, accessTokenSecret: string, isIncludeVersionToHeader: bool = true, httpMethod: HttpMethod = HttpGet, maxRetries: int = 3, retryCount: int = 0): Response  =
  try:
    result = client.oAuth1Request(url, apiKey, apiSecret, accessToken, accessTokenSecret, isIncludeVersionToHeader, httpMethod = httpMethod)
  except:
    if retryCount >= maxRetries:
      raise
    sleep(1000 * exponentialBackoff(retryCount))
    result = retryoAuth1Request(client, url, apiKey, apiSecret, accessToken, accessTokenSecret, isIncludeVersionToHeader, httpMethod = httpMethod, maxRetries = maxRetries, retryCount = retryCount + 1)
    
```

### Nimでのクラス

上記のoauthで取得できたAccessTokenをうまく引き継ぎながら各APIが叩きたくなると、やはりクラスを作りたくなります。

が、Nimには**クラスらしいクラスはありません**。Type、Cでいう構造体にメソッドをprocedure(obj)の糖衣構文の形、第一引数にTypeを指定する形で代用します。(Goと同じ感じですね)

さらにクラスの概念がないので当然コンストラクタもないので、自前コンストラクタを作ります。

```nim
# Typeでアトリビュート(メンバ変数)を定義

type
  Twitter* = ref object of RootObj
    apiKey:string
    apiSecret:string
    accessToken:string
    accessTokenSecret:string
    bearerToken*: string
    tweets*: JsonNode
    searches*: JsonNode
    trends*: JsonNode
    lists*: JsonNode
    sinceId*: string

# 自前コンストラクタ。Twitter Typeを返してあげる
proc newTwitter*(apiKey:string, apiSecret:string, accessToken:string, accessTokenSecret:string):Twitter =
  let tw = new Twitter
  tw.apiKey = apiKey
  tw.apiSecret = apiSecret
  tw.accessToken = accessToken
  tw.accessTokenSecret = accessTokenSecret
  if tw.accessToken == "" and tw.accessTokenSecret == "":
    let tokens = getAccessToken(tw.apiKey, tw.apiSecret)
    tw.accessToken = tokens["accessToken"]
    tw.accessTokenSecret = tokens["accessTokenSecret"]
    discard setConfig("auth", "accessToken", tw.accessToken)
    discard setConfig("auth", "accessTokenSecret", tw.accessTokenSecret)
  tw.bearerToken = getBearerToken(tw.apiKey, tw.apiSecret)
  return tw
  
# 第一引数にTypeを指定するとTypeに関数がバインドされてメソッドっぽくなる
proc getHomeTimeline*(tw:Twitter, sinceId: string = ""):JsonNode =
  let client = newHttpClient()
  var url: string
  if sinceId == "":
    url = homeTimelineEndpoint
  else:
    url = homeTimelineEndpoint & "&since_id=" & sinceId
  let timeline = retryoAuth1Request(client, url, tw.apiKey, tw.apiSecret, tw.accessToken, tw.accessTokenSecret, isIncludeVersionToHeader = true)
  try:
    tw.tweets = parseJson(timeline.body)
  except JsonParsingError:
    echo timeline.headers
    echo timeline.body
``` 

### Configを持たせるには?

Configをプログラムから切り離してもたせる方法はいくつかありますが、色々考えた結果今回はTextConfig形式を使うことにしました。

```ini
[auth]
appKey="xxxxxx"
appKeySecret="xxxxxxxxxxxxxxxx"
accessToken="xxxxxxxxxxxxxx"
accessTokenSecret="xxxxxxx"
```

Windowsでは.iniファイルとして馴染みのある形かと思いますが、name=hogeみたいなパラメータと[section]みたいなセクションから構成されるごくごく普通のコンフィグファイルの形式です。

Nimではparsecfgというライブラリで読むことができ、さらにうれしいのが**書き込み**もできるので今回はこちらを使います。

自身で取得したAppKeyを使いたい場合や、AccessTokenの保存先としてsettings.cfgを指定する形で実装しております。(セキュリティ的にはAccessToken晒し上げよろしくないですが)

セクション内のパラメーターを読み込むときは**getSectionValue**を使います。書き込みの際はsetSectionKeyでセクション、パラメータを指定しwriteConfigします。

```nim
import parsecfg, os, secret

type
  TwitterConfig* = ref object of RootObj
    appKey*: string
    appKeySecret*: string
    accessToken*: string
    accessTokenSecret*: string

proc getConfig*():TwitterConfig =
 var cfg: Config
 if os.existsFile("settings.cfg"):
   cfg = loadConfig("settings.cfg")
 elif os.existsFile(joinPath(getAppDir(),"settings.cfg")):
   cfg = loadConfig(joinPath(getAppDir(),"settings.cfg"))
 result = new TwitterConfig
 if cfg.getSectionValue("auth", "appKey") == "" and cfg.getSectionValue("auth", "appKeySecret") == "":
   result.appKey = getDefaultAppKey()
   result.appKeySecret = getDefaultAppKeySecret()
 else:
   # sectionにあるパラメーターを取るときはgetSectionValueでとれる
   result.appKey = cfg.getSectionValue("auth", "appKey")
   result.appKeySecret = cfg.getSectionValue("auth", "appKeySecret")
 result.accessToken = cfg.getSectionValue("auth", "accessToken")
 result.accessTokenSecret = cfg.getSectionValue("auth", "accessTokenSecret")

proc setConfig*(section: string, key: string, value: string):TwitterConfig =
  var cfg: Config
  if os.existsFile("settings.cfg"):
    cfg = loadConfig("settings.cfg")
  elif os.existsFile(joinPath(getAppDir(),"settings.cfg")):
    cfg = loadConfig(joinPath(getAppDir(),"settings.cfg"))
  # 書き出しをするときは、setSectionKeyをして
  cfg.setSectionKey(section, key, value)
  if os.existsFile("settings.cfg"):
    cfg.writeConfig("settings.cfg")
  elif os.existsFile(joinPath(getAppDir(),"settings.cfg")):
    # writeconfigをする
    cfg.writeConfig(joinPath(getAppDir(),"settings.cfg"))
  return getConfig()
```

## TwitterSDK作ったけど何しようか？

ということで、作ったTwitterSDKを使ってなにか作ろうかと思います。

仕事中にCLIを開いていることが多いのでCLI上でTwitterができるようにして仕事中でもばれずにTwitterできるツールでも作ることにします。

No Twitter、No Lifeです。

![ing](https://i.imgur.com/h8XZ9d2.jpg)

さっそくCLI化する旅に出ましょう！

### コマンドラインインターフェースで色付き文字を出したい！

というときに便利なライブラリがNimにはあります。

terminalの**styledWriteLine**を使えば文字色、背景色を自在に変更できます。

**使うときはBlock節に入れないといけないらしい。**

```nim
import terminal

proc formatTweet*(tweet: Tweet) =
  block:
    let header = tweet.user.name & "(@" & tweet.user.screenName & ") at " & dateFormat(tweet.createdAt)
    styledWriteLine(stdout, fgBlack, bgGreen, header, resetStyle)
```

### コマンドラインパーサーはいつものdocopt

docoptは便利なので本当に愛用しているのですが、Nimでも使えるので今回も使います。

詳しい解説は過去記事[docoptはNimでも使えたのお話](https://blog.tubone-project24.xyz/2019/11/20/docopt-nim)をご確認ください。

## WindowsでもMacでもUbuntuでも使いたい！

ということでGitHub ActionsでCIに乗っけてGitHub Releaseの打ち込みでビルドすることにしました。

GitHub Releaseで反応するworkflowにしたいので、onは**release.types=created**にします。

また、GitHub ActionsではOSの種類をそれぞれ**windows-latest**, **macOS-latest**, **ubuntu-latest**で指定できますのでmatrixで指定しちゃいます。

それぞれのOS対応は下記のとおりです。

label | OS
--- | ---
ubuntu-latest | Ubuntu 18.04
macos-latest | macOS 10.15	
windows-latest | Windows Server 2019

さらに！

Release noteをGitHub Releaseに乗っけたいので、[前回作った](https://blog.tubone-project24.xyz/2020/08/14/github-action)[Update GitHub Release
](https://github.com/marketplace/actions/update-github-release)を使ってます。

Release noteの作成は[git-chglog](https://github.com/git-chglog/git-chglog)を使って作成します。このツールめちゃスゴ..。

```yml
name: Release

on:
  release:
    types: [created]

jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        include:
          - os: ubuntu-latest
            asset_name_suffix: ''
            asset_content_type: application/octet-stream
          - os: windows-latest
            asset_name_suffix: .exe
            asset_content_type: application/octet-stream
          - os: macOS-latest
            asset_name_suffix: ''
            asset_content_type: application/octet-stream
    steps:
      - uses: actions/checkout@v1
      - uses: tubone24/setup-nim-action@v1.0.1
      - name: Set secret file
        env:
          SECRET_FILE: ${{ secrets.SECRET_FILE }}
        run: |
          echo $SECRET_FILE > base64.txt
          nim c --run scripts/createBase64ToFile.nim
        shell: bash
      - name: Install Dependencies
        run: nimble install -d --accept
      - name: Build
        run: nimble build -d:release
      - name: get version
        id: get_version
        run: |
          echo ::set-output name=VERSION::${GITHUB_REF/refs\/tags\//}
        shell: bash
      - name: update release
        id: update_release
        uses: tubone24/update_release@v1.0
        env:
          GITHUB_TOKEN: ${{ github.token }}
      - name: Upload Release Asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.github_token }}
        with:
          upload_url: ${{ steps.update_release.outputs.upload_url }}
          asset_path: ./bin/post_twitter_on_work${{ matrix.asset_name_suffix }}
          asset_name: post_twitter_on_work_${{ runner.os }}_${{ steps.get_version.outputs.VERSION }}${{ matrix.asset_name_suffix }}
          asset_content_type: ${{ matrix.asset_content_type }}
  update-release-note:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Generate Release Note
        id: generate_release_note
        run: |
          wget https://github.com/git-chglog/git-chglog/releases/download/0.9.1/git-chglog_linux_amd64
          chmod +x git-chglog_linux_amd64
          mv git-chglog_linux_amd64 git-chglog
          ./git-chglog --output ./changelog.md $(git describe --tags $(git rev-list --tags --max-count=1))
      - name: Update Release Body
        uses: tubone24/update_release@v1.1.0
        env:
          GITHUB_TOKEN: ${{ github.token }}
        with:
          body_path: ./changelog.md
```

これで、Releaseを打ったタイミングで、各OSに対応したバイナリがArtifactsとして公開されるようになりました！

![img](https://i.imgur.com/zhLloGo.png)

## できたかも～

ということで..。

![ig](https://i.imgur.com/tMjBX5q.jpg)

できたできたかも!!

ダウンロードはこちらから!!!

<https://github.com/tubone24/post_twitter_on_work/releases>

使い方はdocoptのUsageをそのまま貼っておきます。

```
Overview:
  Get Tweets on CLI for Nim Client

Usage:
  post_twitter_on_work status
  post_twitter_on_work home [-r|--resetToken] [-i|--interval=<seconds>]
  post_twitter_on_work mention [-r|--resetToken] [-i|--interval=<seconds>]
  post_twitter_on_work user <username> [-r|--resetToken] [-i|--interval=<seconds>]
  post_twitter_on_work search <query> [-r|--resetToken] [-i|--interval=<seconds>]
  post_twitter_on_work list <username>
  post_twitter_on_work showlist <username> <slugname> [-r|--resetToken] [-i|--interval=<seconds>]
  post_twitter_on_work post <text> [-r|--resetToken]

Options:
  status                      Get status
  home                        Get home timeline
  mention                     Get mention timeline
  user                        Get user timeline
  search                      Get twitter search
  list                        Get twitter list
  post                        Post Tweet
  showlist                    Show list
  <username>                  Twitter username
  <query>                     Search query keyword
  <text>                      Tweet text
  <slugname>                  Slug name
  -i, --interval=<seconds>    Get tweet interval (defaults 60 second)
  -r, --resetToken            Reset accessToken when change user account
```

というのは冗談で、例えば自分のタイムラインが見たいときは、

```
$ post_twitter_on_work home
```

とやってあげればいいです。これだけです。

初回アクセス、またはリセットトークンのときだけ、

```
$ ./post_witter_on_work home

Access the url, please obtain the verifier key.
https://api.twitter.com/oauth/authorize?oauth_token=xxxxxxxxxxxxxxxxxxxxxxx
Please enter a verifier key (PIN code).
```

とアクセストークンのリクエストのためPINの要求が入ります。

URLにアクセスすれば、

![img](https://i.imgur.com/3GwsdvT.png)

という具合でPINが出てくるのでこちらを入力してくれればアクセストークンを取ってそのままタイムラインの表示に移ります。

![img](https://i.imgur.com/VASzn6U.png)

また、返信の確認は、

```
post_twitter_on_work mention
```

投稿は、

```
post_twitter_on_work post 投稿したい文言
```

でできます。シンプルですね。

これで仕事中でもばれずにTwitterできますね（遠い目）。

![img](https://i.imgur.com/zAFRZJQ.gif)

## 結論

実は今すごい仕事が忙しいのでこんなツール作っても仕事中にTwitterなんてできません。

久しぶりにリモートワークだったので、余暇を使って振り返り記事書きました。以上。

