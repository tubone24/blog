---
slug: 2021/02/13/netlify-github-action
title: Netlifyのビルド時間をGitHub Actionsで0時間にして月末のヒヤヒヤから解放されよう！
date: 2021-02-13T01:21:49.294Z
description: Netlifyは便利ですが無料枠だと月のビルド時間が300分なので超過しないように神経を使います。GitHub
  Actionsを使えばそんな悩みから解放されるのでご紹介します。
tags:
  - JavaScript
  - Netligy
  - Gatsby.js
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

日々の喧噪から解放されたい。

## Table of Contents

```toc

```

## Netlify

みなさんもご存じ超便利ありがたサービスNetlifyですが、無料で使ってる貧民には毎月とある悩みがでてきます。

*今月のビルド時間は残り○○分*

![img](https://i.imgur.com/TSm24w0.png)

NetlifyはGitHubのレポジトリと連携して、フロントのビルドを実行した上で、デプロイするという超便利機能があるのですが、このビルドを回すのに時間の制約があり、

無料民だと月300分となっております。(それ以上は月xドル課金すれば問題なく使えます。課金も経験済み)

300分あれば大丈夫そう、とそう思う気もしなくなくなくなくなくもないですが、複数レポジトリにわたってNetlifyを使っていたり、Gatsby.jsで画像をたくさん使っていてsharpのリサイズに時間がかかったり、dependabotで定期的にPRが出てpreview deployが発生したりすると
案外ぎりぎりだったりします。

![img](https://i.imgur.com/y7ixbEG.png)

なので、私のような貧民は月末になると、Netlifyのビルド時間が気になってこのブログの記事を書かなくなったり、サイトリファクターのペースが落ちてしまいます。

特にブログ更新は顕著で、例えば今書いている記事も通勤の電車の中でスマホから書いているわけなので、細かくコミットを打って保存したいのですが、コミットを打ってプッシュしてしまうと、ビルドが走ることになるので、WIPでのコミットが億劫になり、結果的に家のようなまとめてプッシュできるような作業スペースがある場所でないと、
ブログを書かなくなってしまいました。

## この悩みGitHub Actionsにお任せください

ということでこの悩み、GitHub Actionsで解決してみたいと思います。

なんか工務店のCMみたいな表現になってしまいました。

`youtube:https://www.youtube.com/embed/DHH1Fhi9qcs`

## Netlifyのビルド時やっていることを洗い出して代替する

基本的にNetlifyがビルド時やってることは、例えばGatsby.jsであれば、gatsby buildコマンドを実行し、特定のディレクトリーに配置されたビルド済みJSをデプロイする動きなので、
それをそっくりGitHub Actionsに移行すればいいのですが、Netlifyがビルド済みJSに対して後処理を実行してるパターンもあります。

私の場合、JSやイメージを最適化してくれるAsset optimizationとFormタグに属性をつければ勝手にFormを作ってくれるForm detectionの二つが設定されていましたのでそれぞれまず無効化します。

![img](https://i.imgur.com/ytjbJQA.png)

![img](https://i.imgur.com/LfL70Br.png)

こちら、Netlifyで実施してくれなくなりますので、こちらで実装し直す必要があります。

## gatsby-plugin-minify

Asset optimizationのうち、JSやCSSのminiferはgatsby-plugin-minifyを使うことでhtmlやJS、CSSをminifyできます。

```
npm install gatsby-plugin-minify
```

使い方はgatsby-config.jsに次のように設定すればできます。

```
    {
      resolve: 'gatsby-plugin-minify',
      options: {
        caseSensitive: false,
        collapseBooleanAttributes: true,
        useShortDoctype: false,
        removeEmptyElements: false,
        removeComments: true,
        removeAttributeQuotes: false,
        minifyCSS: true,
        minifyJS: true,
      },
    },
```

minifyCSSとminifyJSをtrueにすることにより、html以外もminifyされます。また、裏側は[html-minifier](https://github.com/kangax/html-minifier)をgatsby-node.jsでpostbuildで全掛けしているだけなので、細かいオプションはhtml-minifierで設定できる感じです。

ちなみに、気を付けないといけないのがremoveAttributeQuotesのオプションをfalseにすること。これをtrueにすると、HTMLタグ内のアトリビュートにダブルクオートが入らなくなりちょっとファイルが軽くなるのですが、[berss.com](https://berss.com/feed/Find.aspx)のようにサイトのRSSリンクを取得するようなシステムでうまく読み込めなくなってしまい、サイト更新が最悪通知できなくなってしまう現象が発生しました。

RSSのリンクとしてalternateなLinkを仕込んでいる人は要注意です。

## imgurを使うことで、画像ホスティングとリサイズを同時にやっちゃう

imgurというサービスがあります。主にRedditとかGifをあげるための画像ホスティングサービスなのですが、
こちらを使うことで簡単に画像のリサイズとホスティングを実現できるため、このブログではimgurを使ってます。

画像URLの後ろに画像サイズに合わせたキーワードを入れることで実現できます。

例えばこちらのURLの画像を

```
https://i.imgur.com/Wfz9G0B.png
```

160x160にリサイズするには後ろにbをくっつけます。

```
https://i.imgur.com/Wfz9G0Bb.png
```

これで、画像最適化も完了です。

## getform.io

Getform.ioはフォームのバックエンドを提供するすばらしいサービスです。便利なインテグレーションを使うには有料版が必要ですが、
フォームに投稿されたらメール飛ばす、くらいのことであれば無料でできます。

これで、NetlifyのForm detectionを置き換えていきます。

まず、新しいフォームを作ると、FormのAction先URLが発行できます。

Formの作り方はこちらを参照のこと

そのまま、FormタグのactionにこちらのURLを設定してもいいのですが、GetFormは無料版だと、Form投稿後のThanksページが設定できません。

なので、せっかくReactを使ってるので、裏側で上記URLをfetchしながら、actionsでは自分の指定したThanks URLに飛ばすように指定しましょう。

まずは、formにonSubmitを設定します。

```typescript
        <form
              name="contact"
              method="post"
              action="/thanks/"
              onSubmit={this.handleSubmit}
            >
                <label>
                  <span className="icon-user" />&nbsp;Your name<br />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    maxLength="30"
                    minLength="2"
                    required
                    placeholder="Enter your name"
                    onChange={this.handleChange}
                  />
                </label>
              </p>
```

そして、別途にonSubmitで発火する関数を定義します。

```typescript
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    fetch('https://getform.io/f/xxxxxxxxxxxxxxxxxxxxxxxxx', {
      method: 'POST',
      body: Contact.encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
  }
```

ReactではFormで、actionのほか、onSubmitを別に指定することができます。こちらにSubmitが押された際の挙動を記載する形となります。

ただし、onSubmitが押されたタイミングで、Formの入力項目をPostで渡さないといけないので、formのchangeEventごとに、stateとして結果を保存するようにします。

```typescript
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAttachment(e) {
    this.setState({ [e.target.name]: e.target.files[0] });
  }

....

                <label>
                  <span className="icon-user" />&nbsp;Your name<br />
                  <input
                    type="text"
                    name="name"
                    className="form-control"
                    maxLength="30"
                    minLength="2"
                    required
                    placeholder="Enter your name"
                    onChange={this.handleChange}
                  />

                </label>
              </p>
```

また、onSubmitを使ってしまうと、Form規定のactionでは飛ばなくなるので自前でGatsbyのnavigateを使ってPost処理が終わったらThanksページに飛ぶようにします。

```
  handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    fetch('https://getform.io/f/897f187e-876d-42a7-b300-7c235af72e6d', {
      method: 'POST',
      body: Contact.encode({
        'form-name': form.getAttribute('name'),
        ...this.state,
      }),
    })
      .then(() => navigateTo(form.getAttribute('action')))
      .catch((error) => alert(error));
  }
```

これでGetForm無料版でも自前のThanksページを作ることができます。

## GitHub Actionsでビルドとデプロイ

ここまで来たらあとはGitHub Actionsでビルドとデプロイを行います。

masterブランチへのPRでPreviewデプロイ、masterへのコミットで本番デプロイをするように2つactionsを作ります。

まずはPreviewデプロイ

```yaml
name: DeployToNetlifyPreview
on:
  pull_request:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v2
      - name: Cache node_modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.OS }}-build-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.OS }}-build-
            ${{ runner.OS }}
      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: npm install and build
        env:
          GATSBY_GITHUB_CLIENT_SECRET: ${{secrets.GATSBY_GITHUB_CLIENT_SECRET}}
          GATSBY_GITHUB_CLIENT_ID: ${{secrets.GATSBY_GITHUB_CLIENT_ID}}
          GATSBY_ALGOLIA_SEARCH_API_KEY: ${{secrets.GATSBY_ALGOLIA_SEARCH_API_KEY}}
          GATSBY_ALGOLIA_INDEX_NAME: ${{secrets.GATSBY_ALGOLIA_INDEX_NAME}}
          GATSBY_ALGOLIA_APP_ID: ${{secrets.GATSBY_ALGOLIA_APP_ID}}
          GATSBY_ALGOLIA_ADMIN_API_KEY: ${{secrets.GATSBY_ALGOLIA_ADMIN_API_KEY}}
          FAUNADB_SERVER_SECRET: ${{secrets.FAUNADB_SERVER_SECRET}}
        run: |
          npm install
          npm run build
      - name: Deploy to netlify
        run: npx netlify-cli deploy --dir=./public > cli.txt
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
      - name: Cat cli.txt
        run: |
          cat cli.txt
          sed -i -z 's/\n/\\n/g' cli.txt
      - name: Post Netlify CLI Comment
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          URL: ${{ github.event.pull_request.comments_url }}
        run: |
          curl -X POST \
               -H "Authorization: token ${GITHUB_TOKEN}" \
               -d "{\"body\": \"$(cat cli.txt)\"}" \
               ${URL}
```

node setupやnpm install, buildはいつも通りです。デプロイにはnetlify-cliを使います。

ちょっと特徴として、netlify-cliでデプロイが成功すると、デプロイURLが標準出力に出ますので、それをいったんtextに書き出し、
PRコメントにも送るようにしています。

次に本番へのデプロイです。

```yaml
name: DeployToNetlifyPRD
on:
  push:
    branches:
      - master

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout source code
        uses: actions/checkout@v2
      - name: Cache node_modules
        uses: actions/cache@v1
        with:
          path: node_modules
          key: ${{ runner.OS }}-build-${{ hashFiles('**/package-lock.json') }}
          restore-keys: |
            ${{ runner.OS }}-build-
            ${{ runner.OS }}
      - name: Setup Node
        uses: actions/setup-node@v1
        with:
          node-version: 12.x
      - name: npm install and build
        env:
          GATSBY_GITHUB_CLIENT_SECRET: ${{secrets.GATSBY_GITHUB_CLIENT_SECRET}}
          GATSBY_GITHUB_CLIENT_ID: ${{secrets.GATSBY_GITHUB_CLIENT_ID}}
          GATSBY_ALGOLIA_SEARCH_API_KEY: ${{secrets.GATSBY_ALGOLIA_SEARCH_API_KEY}}
          GATSBY_ALGOLIA_INDEX_NAME: ${{secrets.GATSBY_ALGOLIA_INDEX_NAME}}
          GATSBY_ALGOLIA_APP_ID: ${{secrets.GATSBY_ALGOLIA_APP_ID}}
          GATSBY_ALGOLIA_ADMIN_API_KEY: ${{secrets.GATSBY_ALGOLIA_ADMIN_API_KEY}}
          FAUNADB_SERVER_SECRET: ${{secrets.FAUNADB_SERVER_SECRET}}
        run: |
          npm install
          npm run build
      - name: Deploy to netlify
        run: npx netlify-cli deploy --prod --dir=./public
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

ほとんど同じですが、netlify-cliでdeployコマンドに --prodオプションを入れるだけです。

## 結論

これで、Netlifyのビルド時間は0になり、精神的に安心できるようになりました。

![img](https://i.imgur.com/ugdUr9l.png)

リファクタや記事の執筆もはかどっていいですね！！
