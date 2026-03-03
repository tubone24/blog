---
slug: 2022/03/20/k6-with-typescript
title: 負荷テストツールK6をTypeScript+Dockerで動かすためのテンプレートを作る
date: 2022-03-20T08:33:17.597Z
description: 高機能なgo製負荷テストツールK6を使って負荷テストを実施する際に環境づくりがめんどくさいのでDocker
  compose化し、さらにシナリオファイルをTypeScriptで実装できるようにすることでテストシナリオを簡単に実装できるようにしたよ、というお話です。
tags:
  - k6
  - 負荷試験
  - Docker
  - TypeScript
headerImage: https://i.imgur.com/YUFdeQr.png
templateKey: blog-post
---
暖かくなったと思ったら寒くなりましたね。

## Table of Contents

```toc

```

## k6とは？

[k6](https://k6.io/) は[Go製](https://go.dev/)のOSS負荷テストツールで普通のHTTPの他、HTTP/2, gRPC, WebSocketなどにも対応した高機能なテストシナリオ作成がJavaScriptで実施できる手軽さと[Grafana](https://grafana.com/)を使ったパフォーマンスレポートが魅力の製品です。

以前はloadimpactと呼ばれていました。こちらのほうが馴染みある人が多いのではないでしょうか？また、K6のクラウド版を使ったことありますー！という方もいらっしゃるのではないでしょうか？

私個人としては、この手の負荷試験ツールは長らく[Locust](https://locust.io/)を愛用してきてそれなりに複雑なテストシナリオを作ってきた経験もあるのですが、時代の流れ的にこっちのほうがいいのではないかと思い浮気することにしました。

## 使い心地

K6をMacやEC2などで作ったLinux上に構築する方法はググればたくさん出てくるのでここでは割愛しますが、まず**非常に簡単に環境が構築できる。** この点はしっかり強調しておきたいです。

MacならHomebrew入っていれば、

```
brew install k6
```

で完了ですからね。環境構築は超簡単です。

シナリオファイルの作成もJavaScript ES6対応&[公式ドキュメント](https://k6.io/docs/)比較的充実しているので、ある程度JavaScript触ったことのある人であればノーストレスで実装できそうです。

また、細かいニーズのシナリオ作成については[GitHubレポジトリのサンプルコード](https://github.com/grafana/k6/tree/master/samples)がかなり参考になります。

なので、正直普通に使う分にはこの記事で紹介することなんてあんまりないのです。ここまで読んでくれた皆さん、ごめんなさい。

## ロマン

### 完全Dockerコンテナ上で実行

とはいえ、これで終わりならわざわざブログを書くこともないので早速ちょっとした改良をしていきます。

まず、完全Dockerコンテナ上での実行です。

開発チームの皆さんがMacを使っている会社さんなら不要な気もしますが中にはWindowsやLinuxを使っている人が混在している開発現場もありそうで、そういった現場で「はい。K6入れておいてね」はちょっと不親切です。かといって、全OSのマニュアルを用意するのもつらいです。

また、負荷テストはネットワークの安定したサーバー上で実行することもしばしばでMacで動くのに負荷テスト用サーバーで動きません！みたいになるのも悲しいです。そもそも専用のサーバーを立てるのもめんどくさいのでDocker Image化してDockerコンテナ管理サービスでサクッと実行させるのが賢そうです。なんならCIに組み込んで、パイプライン上で実行させるとかも面白そうです。

もちろんK6公式もぬかりなく[Docker Image](https://github.com/grafana/k6#docker)を用意してます。ただ、あくまでもこちらのImageはk6単体のImageなのでパフォーマンス可視化をするには別途[InfluxDB](https://www.influxdata.com/)と[Grafana](https://grafana.com/)を立ち上げる必要があります。

なので、まとめて環境をDocker composeしてしまいましょう。

~~もちろん、本来は結果をきちんと残しておくためにInfluxDBとGrafanaを永続化する必要がありますが、今回はテスト実行なのでInfluxDB永続化は行ないません。~~ 永続化することにしました。代わりにInfluxDBのcleanコマンドを実装する形にしました。本格的に負荷テスト環境を作るならAWS ECSであればデータボリュームを[Amazon EFS ボリューム](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/efs-volumes.html)とかで管理すると幸せになれる気がします。

次のような**docker-compose.yml**を作るだけで完成です。楽でいいですねdocker compose。

```yml
version: '3.8'

services:
  influxdb:
    image: influxdb:1.8
    ports:
      - "8086:8086"
    environment:
      - INFLUXDB_DB=k6
    networks:
      - k6net
      - grafanaNet
    volumes:
      - ./influxdb:/var/lib/influxdb

  k6:
    image: grafana/k6:latest
    networks:
      - k6net
    ports:
      - "6565:6565"
    environment:
      - K6_OUT=influxdb=http://influxdb:8086/k6
    volumes:
      - ./tests/scripts:/scripts

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_AUTH_ANONYMOUS_ORG_ROLE=Admin
      - GF_AUTH_ANONYMOUS_ENABLED=true
      - GF_AUTH_BASIC_ENABLED=false
    volumes:
      - ./grafana:/etc/grafana/provisioning/
    networks:
      - grafanaNet
networks:
  k6net:
    driver: bridge
  grafanaNet:
    driver: bridge
```

やっていることは超基本的なこととしてnetworkを切ってサービス名でInfluxDBにアクセスできるようにする点くらいなのですが、k6のenvironmentで、

```
    environment:
      - K6_OUT=influxdb=http://influxdb:8086/k6
```

とやってあげることで実行結果をInfluxDBに出力します。

[公式ドキュメント](https://k6.io/docs/results-visualization/influxdb-+-grafana/#run-the-test-and-upload-the-results-to-influxdb)のように環境変数でなく実行時の引数で設定できます。

これで、<https://localhost:3000>にアクセスすることで**実行結果を可視化**できるようになりました。

![grafana](https://i.imgur.com/sX5HtCG.png)

### TypeScriptでテストシナリオを書けるようにする

加えて、シナリオファイルの**TypeScript化**を実施します。

[公式ドキュメント](https://k6.io/docs/using-k6/javascript-compatibility-mode/)によるとGoのJavaScript VMが**ES5にしか対応してない**のでES6で書いたテストシナリオはどうやらK6のなかでES5に変換してから実行しているらしいです。

K6の[go.mod](https://github.com/grafana/k6/blob/master/go.mod)を見てみると使っているJavaScript VMは[goja](https://github.com/dop251/goja)みたいですね。

逆に、**compatibility-mode=base**というオプションを使ってES5のテストファイルを渡してあげた場合、ES6への変換の手間がなくなるので実行時間とメモリの使用量が改善され、**パフォーマンスが改善**されるとのことです。

じゃあせっかくなら**TypeScript=>ES5のトランスパイル**を実施して実行時はcompatibility-mode=baseオプションを指定すれば、テストシナリオをTypeScriptで実装しつつパフォーマンス面でも有利に働きそうです。

とりあえず[公式に載っている例](https://github.com/grafana/k6-hardware-benchmark)を参考にwebpack.config.jsをゴリっと書くことにしました。

babelってトランスパイルしてしまったのでこれ型チェックとかしないかもな...と思いつつ公式がそうやっているからそのまま真似していくつかplugin追加しただけです。

あと、target webで出力してますがsourcemapを出してしまうとK6で読み込めないよエラーが出るので出力させないです。(ちょっとハマった)

さらに、今回はおそらく使わないと思いましたが[copy-webpack-plugin](https://webpack.js.org/plugins/copy-webpack-plugin/)を使ってテスト用のassetをdistディレクトリにコピーする形にしてます。こうしておくことで、ファイルのアップロードみたいなテストケースも書けるようになりそうです。多分。

と思って色々試行錯誤していたら公式に実装例があり、ほぼやりたいことがそれでできていたので結局それをパクることにしました..。 

[Template to use TypeScript with k6](https://github.com/grafana/k6-template-typescript)

```javascript
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GlobEntries = require('webpack-glob-entries');

module.exports = {
  mode: 'production',
  entry: GlobEntries('./tests/scripts/*.ts'),
  output: {
    path: path.join(__dirname, 'dist'),
    libraryTarget: 'commonjs',
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'web',
  externals: /^(k6|https?\:\/\/)(\/.*)?/,
  stats: {
    colors: true,
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [{
        from: path.resolve(__dirname, 'tests/assets'),
        noErrorOnMissing: true
      }],
    }),
  ],
  optimization: {
    minimize: false,
  },
};
```

tsconfig.jsonも特に特徴はないですが、targetはes5にしてます。

```
{
  "compilerOptions": {
    "target": "es5",
    "moduleResolution": "node",
    "module": "commonjs",
    .....
  }
}
```

これで**webpackコマンド**を実行することできちんとES5に変換されたテストシナリオのJavaScriptファイルがdist配下に出力されるようになりました。

### 実行してみる

Docker composeにしてますので、必要なコンテナをupで立ち上げたのち、k6だけ個別にrunします。runするときにdist配下のテストファイルを標準入力として指定すればOKです。

```
ddocker compose up -f
docker compose run k6 run --compatibility-mode=base - < ./dist/httpGet.js
```

無事実行できました！

```
asset cookieAuthServerSession.js 5.3 KiB [emitted] (name: cookieAuthServerSession)
asset httpGet.js 2.63 KiB [emitted] (name: httpGet)
runtime modules 1.83 KiB 8 modules
orphan modules 451 bytes [orphan] 4 modules
built modules 2.52 KiB [built]
  ./tests/scripts/cookieAuthServerSession.ts + 4 modules 2.38 KiB [not cacheable] [built] [code generated]
  ./tests/scripts/httpGet.ts + 1 modules 141 bytes [not cacheable] [built] [code generated]
webpack 5.35.1 compiled successfully in 619 ms
failed to get console mode for stdin: The handle is invalid.
failed to get console mode for stdin: The handle is invalid.
failed to get console mode for stdin: The handle is invalid.

          /\      |‾‾| /‾‾/   /‾‾/
     /\  /  \     |  |/  /   /  /
    /  \/    \    |     (   /   ‾‾\
   /          \   |  |\  \ |  (‾)  |
  / __________ \  |__| \__\ \_____/ .io

  execution: local
     script: -
     output: InfluxDBv1 (http://influxdb:8086)

  scenarios: (100.00%) 1 scenario, 1 max VUs, 10m30s max duration (incl. graceful stop):
           * default: 1 iterations for each of 1 VUs (maxDuration: 10m0s, gracefulStop: 30s)


running (00m00.9s), 0/1 VUs, 1 complete and 0 interrupted iterations
default ✓ [ 100% ] 1 VUs  00m00.9s/10m0s  1/1 iters, 1 per VU

     data_received..................: 21 kB 24 kB/s
     data_sent......................: 519 B 574 B/s
     http_req_blocked...............: avg=734.31ms min=734.31ms med=734.31ms max=734.31ms p(90)=734.31ms p(95)=734.31ms
     http_req_connecting............: avg=161.49ms min=161.49ms med=161.49ms max=161.49ms p(90)=161.49ms p(95)=161.49ms
     http_req_duration..............: avg=169.36ms min=169.36ms med=169.36ms max=169.36ms p(90)=169.36ms p(95)=169.36ms
       { expected_response:true }...: avg=169.36ms min=169.36ms med=169.36ms max=169.36ms p(90)=169.36ms p(95)=169.36ms
     http_req_failed................: 0.00% ✓ 0        ✗ 1
     http_req_receiving.............: avg=2.71ms   min=2.71ms   med=2.71ms   max=2.71ms   p(90)=2.71ms   p(95)=2.71ms
     http_req_sending...............: avg=49µs     min=49µs     med=49µs     max=49µs     p(90)=49µs     p(95)=49µs
     http_req_tls_handshaking.......: avg=381.41ms min=381.41ms med=381.41ms max=381.41ms p(90)=381.41ms p(95)=381.41ms
     http_req_waiting...............: avg=166.6ms  min=166.6ms  med=166.6ms  max=166.6ms  p(90)=166.6ms  p(95)=166.6ms
     http_reqs......................: 1     1.105208/s
     iteration_duration.............: avg=903.84ms min=903.84ms med=903.84ms max=903.84ms p(90)=903.84ms p(95)=903.84ms
     iterations.....................: 1     1.105208/s

Done in 6.27s.
```

Locustに勝るとも劣らないかなりしっかりとしたレポートが出ますね！

## yarn scriptに何とかして取り込む

まぁこれで完成なのですが、ちょっとまだ不満点があります。 docker compose runコマンドを打つ前にwebpackコマンドを実行しないといけない点です。

どうせならテスト実行一発でトランスパイル=>実行と移ってほしいのでyarn scriptを書いていきます。

今回実装するまで知らなかったのですが、yarn scriptに引数を渡すときコマンドの途中に引数の文字列を入れたいとき、ちょっと難しかったです。サクッとできるかなと思ったのですが。

結局、次のようにshellから0番目の引数を取って実行するという無茶苦茶実装にしました。こうすれば、 **yarn start testFile** で実行できます。

```
start": "sh -c \"webpack && docker compose run k6 run --compatibility-mode=base - < ./dist/${0}.js\"",
```

## GitHub Actionsに組み込んでみる

最後にGitHub Actionsに組み込んでみることにします。

とはいってもGitHub Actionsは普通にdocker composeできるのであまり気にするところはなさそうです。

強いて言えば、docker compose runする際に-Tオプションをつけないと、コンソールが戻ってこないので無限に動いてしまいます。ちょっとだけ詰まりました。

```yaml
name: Test Scenario
on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: 14.x
      - name: setup config
        run: mv tests/config/configExample.ts tests/config/config.ts
      - name: Setup test Env
        run: |
          yarn install
          docker-compose up -d
          yarn build
      - name: run
        # In GitHub Actions, if pseudo-tty is assigned in case of docker compose run,
        # container execution will continue and step will not be completed, so disable it with -T option.
        run: docker compose run -T k6 run --compatibility-mode=base - < ./dist/httpGet.js
```

## 完成

というわけでこちらが完成したテンプレートです。

[K6 with TypeScript on Docker](https://github.com/tubone24/k6_template_with_typescript_on_docker)

これからK6をプロジェクトで導入したいなと思っている人は上記をテンプレートとしてご活用いただければ幸いです。


## 参考

- [k6 documentation](https://k6.io/docs/)
- [k6-hardware-benchmark](https://github.com/grafana/k6-hardware-benchmark)
- [Template to use TypeScript with k6](https://github.com/grafana/k6-template-typescript)
