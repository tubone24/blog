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
headerImage: https://i.imgur.com/fJTJeKD.png
templateKey: blog-post
---

日々の喧噪から解放されたい。

## Table of Contents

```toc

```

## Netlify

みなさんもご存じ超便利ありがたサービスNetlifyですが、**無料で使ってる貧民**には毎月とある悩みがでてきます。

*今月のビルド時間は残り○○分*

![img](https://i.imgur.com/TSm24w0.png)

NetlifyはGitHubのレポジトリと連携して、フロントのビルドを実行したうえで、デプロイするという超便利機能があるのですが、このビルドを回すのに時間の制約があり、

無料民だと月300分となっております。(それ以上はPro版月19ドル課金すれば問題なく使えます。課金も経験済み)

300分あれば大丈夫そう、とそう思う気もしなくなくもないですが、

![img](https://i.imgur.com/7gtZWX5.jpg)

複数レポジトリにわたってNetlifyを使っていたり、Gatsby.jsで画像をたくさん使っていて**Sharp**の画像リサイズに時間がかかったり、**Dependabot**で定期的にPRが出てPreview deployが発生したりすると
案外ぎりぎりだったりします。

![img](https://i.imgur.com/y7ixbEG.png)

なので、私のような貧民は月末になると、Netlifyのビルド時間が気になって**このブログの記事を書かなくなったり**、**サイトリファクターのペースが落ちて**しまいます。

特にブログ更新は顕著で、例えば今書いている記事も通勤の電車のなかでスマートフォンから書いているわけなので、細かくコミットを打って保存したいのですが、コミットを打ってプッシュしてしまうと、ビルドが走ることになるので、WIPでのコミットが億劫になり、結果的に家のようなまとめてプッシュできるような作業スペースがある場所でないと、
ブログを書かなくなってしまいました。

せっかく[Netlify CMS化](https://blog.tubone-project24.xyz/2019-09-01-netlify-and-gatsby#cms%E3%81%AE%E7%AE%A1%E7%90%86%E7%94%BB%E9%9D%A2%E3%82%92%E8%A8%AD%E5%AE%9A%E3%81%99%E3%82%8B)した意味がないですね。

## この悩みGitHub Actionsにお任せください

ということでこの悩み、GitHub Actionsで解決してみたいと思います。

なんか工務店のCMみたいな表現になってしまいました。

![ojisan](https://i.imgur.com/JlvUJ4zl.png)

## Netlifyのビルド時やっていることを洗い出して自前でやってみる

基本的にNetlifyがビルド時やってることは、例えばGatsby.jsであれば、gatsby buildコマンドを実行し、特定のディレクトリー(大概は./public)に配置されたビルド済みJSをデプロイする動きなので、
それをそっくりGitHub Actionsに移行すればいいのですが、Netlifyがビルド済みJSに対して後処理(PostProcess)してるパターンもあります。

私の場合、JSやイメージを最適化してくれる**Asset optimization**とFormタグに属性をつければ勝手にFormを作ってくれる**Form detection**の2つが設定されていましたのでそれぞれまず無効化します。

Form detectionの解説は[こちら](https://blog.tubone-project24.xyz/2019/09/30/netlify-form)を参照ください。

![img](https://i.imgur.com/ytjbJQA.png)

![img](https://i.imgur.com/LfL70Br.png)

こちら、Netlifyで実施してくれなくなりますので、こちらで実装し直す必要があります。

## gatsby-plugin-minify

Asset optimizationのうち、JSやCSSのminiferは[gatsby-plugin-minify](https://www.gatsbyjs.com/plugins/gatsby-plugin-minify/)を使うことでHTMLやJS、CSSをminifyできます。

インストールはいつも通りNPM(yarn)から、

```
npm install gatsby-plugin-minify
```

使い方はgatsby-config.jsのpluginsに次のように設定すればできます。

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

minifyCSSとminifyJSをtrueにすることにより、CSSについては[clean-CSS](https://github.com/jakubpawlowicz/clean-css)、JSについては[UglifyJS](https://github.com/mishoo/UglifyJS)を使って一緒にminifyされます。また、gatsby-plugin-minifyの裏側は[HTML-minifier](https://github.com/kangax/html-minifier)をgatsby-node.jsでpostbuildで全掛けしているだけなので、細かいオプションは[HTML-minifier](https://github.com/kangax/html-minifier#options-quick-reference)で設定できる感じです。

ちなみに、気を付けないといけないのが**removeAttributeQuotes**のオプションをfalseにすること。

これをtrueにすると、HTMLタグ内のアトリビュートにダブルクオートが入らなくなりちょっとファイルが軽くなるのですが、[berss.com](https://berss.com/feed/Find.aspx)のようにサイトのRSSリンクを取得するようなシステムでうまく読み込めなくなってしまい、サイト更新が最悪通知できなくなってしまう現象が発生しました。

これで1日使ってしまった...。

RSSのリンクをページのLinkとして仕込んでいる人は要注意です。

## imgurを使うことで、画像ホスティングとリサイズを同時にやっちゃう

[imgur](https://imgur.com/)というサービスがあります。

主にRedditとかGIFをあげるための画像ホスティングサービスとして有名なのですが、こちらを使うことで簡単に画像のリサイズとホスティングを実現できるため、このブログではimgurを使ってます。

画像URLの後ろに画像サイズに合わせたキーワードを入れることで実現できます。

例えばこちらのURLの画像を、

```
https://i.imgur.com/Wfz9G0B.png
```

160x160にリサイズするには後ろに**b**をくっつけます。

```
https://i.imgur.com/Wfz9G0Bb.png
```

これで、画像最適化も完了です。

## getform.io

[Getform.io](https://getform.io/)はフォームのバックエンドを提供するすばらしいサービスです。

便利なインテグレーションを使うには有料版が必要ですが、フォームに投稿されたら指定したメールアドレスに通知メール飛ばす、くらいのことであれば無料でできます。

これで、NetlifyのForm detectionを置き換えていきます。

まず、新しいフォームを作ると、FormのAction先URLが発行できます。

Formの作り方は下記のブログにわかりやすく纏めてあったので参照いただければと思います。

<https://blog.nakamu.life/posts/getform-io>

さて、Formができたらチュートリアルに沿ってそのまま、FormタグのactionにこちらのURLを設定してもいいのですが、GetFormは無料版だと、**Form投稿後のThanksページが設定**できません。

```html
<!--
* Add your getform endpoint into "action" attribute
* Set a unique "name" field
* Start accepting submissions
-->
<form action="{getform-endpoint}" method="POST">

  <input type="text" name="name">
  <input type="email" name="email">
  <button type="submit">Send</button>

</form>
```

![img](https://i.imgur.com/sT5vhFE.png)

まぁこれでも十分なのですが、せっかく**React**を使ってるので、裏側でgetform.ioのURLをPOST fetchしながら、actionsで定義した自分のThanks URLに飛ばすように指定しましょう。

まずは、Formに**onSubmit**を設定します。

```typescript{numberLines: 1}{5}
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

Formの送信なので、fetchでは[FormData](https://developer.mozilla.org/ja/docs/Web/API/FormData)に要素をappendしたものを送信しないといけません。

```
  static encode(data) {
    const formData = new FormData();
    // eslint-disable-next-line no-restricted-syntax
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
    return formData;
  }
```

繰り返しになりますがReactではFormで、actionのほか、onSubmitを関数としてできます。

ただし、onSubmitが押されたタイミングで、Formの入力項目をPOST Fetchで渡さないといけないので、Formの入力で発生するchangeEventごとに、Formの値をstateとして保存しておくようにします。

```typescript{numberLines: 1}{1-7,21}
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }

  handleAttachment(e) {
    this.setState({ [e.target.name]: e.target.files[0] });
  }
  
  (中略)

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

```typescript{numberLines: 1}{11-12}
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

![img](https://i.imgur.com/gumRkbF.png)

## GitHub Actionsでビルドとデプロイ

ここまで来たらあとはGitHub Actionsでビルドとデプロイを行なうだけです。

masterブランチへのPRでPreviewデプロイ、masterへのコミットで本番デプロイをするように2つactionsを作ります。

まずはPreviewデプロイ.

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

Node.js setupやnpm install, buildはいつも通りです。

GitHub ActionsではSecretを指定できますので、Algolia searchやFaunaDBのAPIキーはシークレットとしてビルド時の環境変数で渡してます。

ちなみに、環境変数で**GATSBY_XXXX**としておくと、ビルドされたJSにも環境変数が入る形になります。（JSから環境変数を使う場合はこれを忘れないこと。）これ結構詰まるポイント。

デプロイには[netlify-cli](https://docs.netlify.com/cli/get-started/)を使います。

必要な環境変数はサイトIDとAUTH TOKENです。

ちょっと特徴として、netlify-cliでデプロイが成功すると、**デプロイURLが標準出力**に出ますので、それをいったん適当なtextファイルに書き出し、

PRコメントにもURLを送るようにしています。

GitHub Actionsの素晴らしいところは、GitHub TOKENについては、特に設定しなくてもsecrets.GITHUB_TOKENで取り出すことができますので簡単にPRコメントに送信できます。

```yaml
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

ほとんど同じですが、netlify-cliでdeployコマンドに --prodオプションを入れることで、本番環境へデプロイされます。

```yaml
      - name: Deploy to netlify
        run: npx netlify-cli deploy --prod --dir=./public
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 結論

これで、Netlifyのビルド時間は0になり、精神的に安心できるようになりました。

![img](https://i.imgur.com/ugdUr9l.png)

リファクタや記事の執筆もはかどっていいですね!!
