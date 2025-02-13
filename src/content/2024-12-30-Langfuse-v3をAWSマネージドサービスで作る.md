---
slug: 2024-12-30/Langfuse-v3をAWSマネージドサービスで作る
title: "Langfuse v3はv2からどのように変わったのかを噛み締めながらAWSマネージドサービスでLangfuse v3を作りきる"
date: 2024-12-31T02:35:41+0000
description: Langfuse v3のアーキテクチャが大幅に変わったことから、Langfuse v3のアーキテクチャをDeepDiveしながらAWSマネージドサービスで作る際の課題と解決策を噛み締めて解説します。
tags:
  - AWS
  - Langfuse
  - ClickHouse
headerImage: https://i.imgur.com/umLZxXJ.jpg
templateKey: blog-post
---

AWSはマネージドサービスがやっぱりいいですよね。

## Table of Contents

```toc

```

## Langfuse v3がついにGAしました

皆さま年の瀬ですが、いかがお過ごしでしょうか？

LLMそのものにはあまり興味が持てなかった私ですが、案件で使って依頼[Langfuse](https://langfuse.com/)、もとい**LLMOps**のツール群が大好きになった私。

2024年12月9日に[Langfuse v3がついにGA](https://langfuse.com/changelog/2024-12-09-Langfuse-v3-stable-release)してから、早く使ってみたいという気持ちからあろうことか年末の忙しい時期にLangfuse v3のアーキテクチャをAWSマネージドサービスで作ってみました。

良い子の皆さんは、大掃除や年越し準備をしている時期ですが、私はLangfuse v3をAWSマネージドサービスで作っていました.....。よろしくない。

## だいぶ長い記事なので先に結論

Langfuse v3のアーキテクチャをAWSマネージドサービスで作りたい場合はぜひ拙作のTerraformモジュールをご利用ください。

<a href="https://github.com/tubone24/langfuse-v3-terraform"><img src="https://github-link-card.s3.ap-northeast-1.amazonaws.com/tubone24/langfuse-v3-terraform.png" width="460px"></a>

## Langfuseとは

まずおさらいですが、[Langfuse](https://langfuse.com/)とは**LLMアプリケーション向けのオープンソースの監視と分析プラットフォーム**です。

端的に言えば、LLMアプリケーションに対して**どんな入力**が行なわれ、**どんな推論**が走り、途中にどんな**ツール呼び出しが行なわれ**、結果ユーザーに**どんな出力**があったかを**可視化・分析**するためのツールです。

似たようなプラットフォームとしては、代表的なものに[LangSmith](https://www.langchain.com/langsmith)がありますが、Langfuseは**OSS版が公開されており**、**ライセンス料を払わず自前の環境にセルフホステッドで構築**できます。

このセルフホステッドができることがLangfuseの強みであり、長らく案件でLangfuseを使ってLLMOpsを実施してきました。

## 我々のLangfuse v2アーキテクチャ

前置きの話が長くなりましたが、現在の案件ではAWS上にLLMアプリケーションを開発しているため当然ながら、**LangfuseもAWS上に構築**していました。

[Langfuse v2](https://langfuse.com/self-hosting/v2)は、[Next.js](https://nextjs.org/)で構築された**Langfuse Server**とTrace/Observationデータやプロンプトマネジメント用のデータを格納する**データベース**([PostgreSQL](https://www.postgresql.org/))のシンプルな2コンポーネント構成でしたので、次のようなアーキテクチャで構築していました。

![Langfuse v2 Architecture AWS](https://i.imgur.com/RWzEbMz.jpg)

特徴として、**Langfuse Server**は[AWS App Runner](https://aws.amazon.com/jp/apprunner/)でデプロイしており、データベースは[Amazon Aurora serverless v2](https://docs.aws.amazon.com/ja_jp/AmazonRDS/latest/AuroraUserGuide/aurora-serverless-v2.html)で構築、それぞれのつなぎ込みは[VPC Connector](https://docs.aws.amazon.com/ja_jp/apprunner/latest/dg/network-vpc.html)を利用するというかなりシンプルな構成にしていました。

ありがたいことにLangfuse v2はNext.jsで構築されていることから**リクエストベースでコンテナが実行されればよいため**、(常駐する必要がないため)コスト最適化の観点でも**AWS App Runner**でデプロイしておりました。

また、データベース(PostgreSQL)もAmazon Aurora serverless v2で構築することでApp Runnerと合わせてインフラ管理をできるだけ最小限にするAWSマネージドサービスを組み合わせて運用できてました。

開発者も限られていることや強くインフラを意識してしまうのは本質的でないと考え、このような構成にしてましたが私はこの構成が**シンプルかつAWSらしい構成**でとても好きでした。

## Langfuse v3のアーキテクチャと移行の課題

さて、話をLangfuse v3に戻します。

[Langfuse v3がGA](https://langfuse.com/changelog/2024-12-09-Langfuse-v3-stable-release)したということで、早く使ってみたい気持ちがはやりますが、**すぐに移行できる代物ではなかった**のです。

Langfuse v3はLangfuse v2とは全く異なるアーキテクチャになっていました。

アーキテクチャの比較を[Langfuse公式ドキュメント](https://langfuse.com/self-hosting/upgrade-guides/upgrade-v2-to-v3)から引用します。

まずv2がこちらです。

![Langfuse v2 Architecture](https://i.imgur.com/3pYyKr7.png)

そしてv3がこちらです。

![Langfuse v3 Architecture](https://i.imgur.com/IIFnpvS.png)

Langfuse v3は、従来の**Langfuse Web Server**、**Langfuse OLTP(PostgreSQL)** に加え**Async Worker**、**Langfuse Queue/Cache(Redis)**、**Langfuse Blob Storage(S3など)**、**Langfuse OLAP Database(ClickHouse)** の6つのコンポーネントで構成されています。

**大幅に必要なコンポーネントが増えてしまったのです！**

これでは単純にAWS App Runnerのイメージをv3に更新する形で移行ができないではありませんか...。困った困った。

## Langfuse v3のアーキテクチャが解決したいこと

ちょっとぶーぶーと文句が出てきそうですが、調べていくとv3のアーキテクチャは**v2のアーキテクチャが解決したい課題を愚直に解決していると感じました。**

Langfuseの開発に直接携わっているわけではないので課題を正しく捉えていないかもですが[リアーキに関する公式ブログ記事](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)と[実際のコード](https://github.com/langfuse/langfuse)を参考に自分なりの考察とともに抜粋しまとめていきます。

### 近年のLLMアプリケーションの需要増加とObservation特性

LLMアプリケーション自体の数が増えたり、利用者が増えたことによりLangfuse自体の利用も増えてきたことからLangfuse Cloudでのスケーラビリティが問題になってきたと[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)で言及されています。

<blockquote>
<p>Initial Pain Point: By summer 2023, spiky traffic patterns led to response times on our ingestion API spiking up to 50 seconds.</p>
<p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
</blockquote>

ここからは私の私見ですが上記に加えて、昨今のLLMアプリケーションは**単純な入力とLLMの出力**だけで構成されるアプリケーションではなく、**複数のツールを呼び出し**、**RAGのように複数のデータストアを参照**し、**より複雑な出力**を返すアプリケーションが増えてきています。

また、よりよい顧客体験のため時間のかかる推論を**並列・非同期で処理することも増えてきたため**1回の回答生成(Langfuseではこの単位をTraceと呼びます)に対していくつもの中間生成結果(Observation)が同時発生することが増えてきました。

結果として、Langfuse v2のアーキテクチャでは増えゆく需要に対して、**スケーラビリティが追いつかなくなってきた**ということです。

![昨今のLLMアプリケーションのObservation特性](https://i.imgur.com/gJGFk0v.png)

### プロンプトマネジメントAPIの低レイテンシー要件

Langfuseには[プロンプトマネジメント機能](https://langfuse.com/docs/prompts/get-started)があります。

プロダクションコードからプロンプトを切り出すことで、LLMアプリケーションの**再デプロイをせずとも**バージョン管理されたプロンプトを画面から任意のタイミングで差し替えできる機能のことで**近年のLLMアプリケーション開発にはなくてはならない機能**となってきました。

[近年のLLMアプリケーションの需要増加とObservation特性](#%E8%BF%91%E5%B9%B4%E3%81%AEllm%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%81%AE%E9%9C%80%E8%A6%81%E5%A2%97%E5%8A%A0%E3%81%A8observation%E7%89%B9%E6%80%A7)で取り上げたTrace/Observationの記録(Ingestion)に比べて、プロンプトマネジメントは**レイテンシーの増加がより深刻な結果**をもたらします。

Ingestionはプロダクションコードのなかで**非同期・ノンブロッキング**の手法を用いることで、エンドユーザーに**レイテンシーを与えない**作りができるため影響を最小限に抑えることができます。(とはいえデータ欠損など問題はありえますが...)

このあたりの知見はLLMOpsが始まる以前の一般的なWebアプリケーションのObservationの文脈でもよく取り上げられる話なので解決策を出すことに苦労はさほどしないはずです。

しかしながら、**プロンプトマネジメント**はLLMアプリケーションの**動作起点**になる処理のためレイテンシーが高いとユーザー体験に直結してしまいます。

この点も[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)で言及されています。

<blockquote>
<p>While tracing is asynchronous and non-blocking, prompts are in the critical path of LLM applications. This made a seemingly straightforward functionality a complex performance challenge: During high ingestion periods, our p95 latency for prompt retrieval spiked to 7 seconds. The situation demanded an architectural solution that could maintain consistent low-latency performance, even under heavy system load from other operations.</p>
<p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
</blockquote>

![プロンプトマネジメントAPIの低レイテンシーが必要な理由](https://i.imgur.com/9G3pUC7.png)

### 高度な分析要件と立ちはだかる巨大なデータ

繰り返しになりますが、LangfuseはLLMアプリケーションのTrace/Observationを **"分析"** するためのツールです。

分析ということは**大量のデータを処理**することになります。

昨今のLLMが**よりロングコンテキストな文章**を扱うことができるようになったことや**マルチモーダルLLM**の台頭により、 **Trace/Observationのデータサイズ**が増えてきています。

大量のデータに対して複雑なクエリを用いて実施する高度な分析を行なうためにはPostgreSQLのような**OLTP(Online Transaction Processing)** より、**OLAP(Online Analytical Processing)** が向いています。

後ほど説明しますがLangfuse v3ではOLTPのPostgreSQLに加え、OLAPとして[ClickHouse](https://ClickHouse.com/jp)を採用しております。

<blockquote>
<p> With LLM analytical data often consisting of large blobs, row-oriented storage was too heavy on disk when scanning through millions of rows. The irony wasn’t lost on us - the very customers who needed our analytics capabilities the most were experiencing the worst performance. This growing pain signaled that our initial architecture, while perfect for rapid development, needed a fundamental rethink to handle enterprise-scale analytical workloads.</p>
<p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
</blockquote>

## Langfuse v3のアーキテクチャDeep Dive

さて、そんな課題を解決するためにLangfuse v3のアーキテクチャはどのようになっているのでしょうか？

少し[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)と[実際のコード](https://github.com/langfuse/langfuse)から**Deep Dive**してみます。

(ここでは記載を省きますが、[Langfuse Cloud版](https://langfuse.com/faq/tag/cloud)として取り組んだプロンプトマネジメントAPIをALBのターゲットグループで分けるなどのアーキテクチャ改善のお話もとてもおもしろいのでぜひ[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)をくまなく読んでいただくことをおすすめします!!!)

### イベントのOLTP書き込み非同期化

散々Langfuse v3のアーキテクチャを見てきたのでもううんざりかもしれませんが、v3ではLangfuseアプリケーションが**Web/Async Worker**の2つのコンポーネントに分かれています。

そして、それらの間には[Redis](https://redis.io/)を**キュー**として挟むことでTrace/ObservationイベントをOLTPであるPostgreSQLにWebコンポーネントから見て**非同期で書き込むことが**できるようになっています。

イベント書き込みをすべてAsync Workerで行なうことで、万が一スパイクアクセスが発生したとしてもアプリケーション全体でリミットを設けながら、PostgreSQLのIOPS上限を超えることがないようにしています。

![Redisをキューとして挟むことでトレースの書き込みを非同期化](https://i.imgur.com/jkLzM8V.png)

また、細かいですが、WebからAsync Workerへのキューイングに[BullMQ](https://docs.bullmq.io/)の[Delaying](https://docs.bullmq.io/patterns/process-step-jobs#delaying)を使うことで、イベントの書き込み順序を保持しつつ、Workerの過度な処理を制御させることができます。

(BullMQについては[Misskey](https://gihyo.jp/article/2023/06/misskey-04)でも採用があり、TypeScriptでのキューイングで一定の地位を築いた感じがありますね。)

このあたりの処理の詳細は[こちらのコード付近](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/packages/shared/src/server/ingestion/processEventBatch.ts#L250)をご参照ください。

### OLAPとしてのClickHouse導入とレコードの更新処理

(ここは個人的にLangfuse v3のアーキテクチャのなかで一番興味深い部分です)

散々繰り返してますが、Langfuse v3ではOLAPとして[ClickHouse](https://ClickHouse.com/jp)を導入しています。ClickHouseはOLAPに特化したデータベースで、分析ワークロードにおいてPostgreSQLに比べ効率的に処理できることが特徴です。

前述したイベントのOLTP書き込みと同様に、ClickHouseに対してもイベントの書き込みは**Async Workerで非同期**で行なっています。

ここでポイントになることは**OLAPの1行レコード更新はOLTPに比べてかなり遅い**(書き込み後の**読み取り一貫性が保証されるまでの時間が長い**)ということです。

LangfuseはTrace/Observationがすべて**一意のIDを持っている**ため、同じIDに対してイベントが発生した場合にはレコードの**更新処理**を実施する必要があります。

しかしながら書き込み後の読み取りの一貫性が保証されるまでの時間が長いOLAPでは、読み込み時に**まだ更新処理が終わっていない古いレコードを読み込んでしまう可能性**があります。

ここを深ぼっていくにはClickHouseの[ReplacingMergeTree](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/replacingmergetree)の仕組みを理解する必要がありますので一度ClickHouseの話をします。

しばしお付き合いください。

#### ReplacingMergeTree

ClickHouseの[ReplacingMergeTree](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/replacingmergetree)は、ClickHouseにおける[MergeTree](https://clickhouse.com/docs/en/engines/table-engines/mergetree-family/mergetree)の一種で、データの挿入時に重複がある場合に古いデータを置き換えることができるテーブルエンジンです。

例えば、以下のようなテーブルがあるとします。

```sql
CREATE TABLE events
(
    id UInt64,
    text String
)
ENGINE = ReplacingMergeTree()
```

まず、このテーブルにIDが**1のレコードを挿入**します。

![IDが1のレコードを挿入](https://i.imgur.com/iSJWa6Ul.png)

次に、IDが**2のレコードを挿入**します。ここまでは特に問題のない挿入だと思います。

![IDが2のレコードを挿入](https://i.imgur.com/MbJm52Ll.png)

では、次にIDが**1のレコードをText=wowに更新**してみましょう。ClickHouseでReplacingMergeTreeを使っている場合、まず更新分のレコードが重複した形で挿入されます。

![IDが1のレコードを更新](https://i.imgur.com/DPSiFTVl.png)

その後、バックグラウンドタスクで**古いレコードが削除**され、**新しいレコードが残る**ことで更新処理が完了します。これがClickHouseのReplacingMergeTreeの仕組みです。

![IDが1のレコードを更新後の状態](https://i.imgur.com/kISGmIll.png)

この動作をすることで、ClickHouseの**各ノード・OLAPキューブ**で更新処理が独立して実施でき、更新のパフォーマンスが向上するのですが、**バックグラウンドタスクのタイミングを制御しきれないため**、レコード更新後の**読み取り一貫性が保証されるまでの時間が長くなる**という問題があります。

(※正確には**select_sequential_consistency**を使うことで一貫性を保証できますが、高コストかつパフォーマンスを犠牲にする運用となってしまいます。)

上記の例ではTextカラムのみの更新でしたが、レコードの**一部カラムを断続的に更新**する場合、一度ClickHouseから**最新のレコードを取得してから更新処理を行なう**必要がでてくるため、レコードの一貫性を保つことが難しくなるというわけです。

![レコードの一部カラムを断続的に更新する場合](https://i.imgur.com/nhx9rwz.png)

## Langfuse v3ではReplacingMergeTreeをどのように使っているのか

Langfuse v3では、この問題をAsync Worker内部での**マージ処理**によって解決しています。

Async Workerはひとまとまりのイベントを処理する際に、ClickHouseに書き込みをする前に**内部的にマージ処理**を行ない、レコードの一貫性を保つ状態を作り出し、ClickHouseに書き込みを行なっています。少し複雑なので図にて説明します。

![Workerでのマージ処理によるレコードの一貫性の保持](https://i.imgur.com/m5qsPe9.png)

イベントのOLTP書き込み非同期化にて記載の通り、イベントの書き込みは**Redisをキューとして挟むことで非同期化**されています。

ただし、正確には**Blob Storage(S3)にイベント全データをJSONで格納**し、Redisには**イベントのIDのみを格納**しています。(①②)

これはLLMへのコンテキストや生成結果をRedisに保存してしまうとRedisの容量が足りなくなるためと公式ブログで語られていました。

その後Async Workerは**イベントのIDをRedisから取得**し、**S3からイベント全データを取得**します。(③④)

そして、イベント全データをまずOLTPであるPostgreSQLに書き込みます。(⑤)

同時にClickHouseへの書き込みも実行されます。 一回のClickHouse書き込み時にAsync Worker内部で**レコードの最終更新状態になるように同一のIDでのイベントをマージ処理**を行ない、ClickHouseへの書き込みキューに登録します。(⑥⑦)

そして、ClickHouseに書き込みを行ないます。(⑧)

こうすることで、ClickHouseの**ReplacingMergeTreeの仕組みを使いつつ**、短時間の断続したレコード更新の際でも、Worker内部でのマージ処理によって**レコードの一貫性を保つ**ことができるようになっています。素晴らしい...。

このあたりの処理は複雑なのでぜひWeb、Async Workerの処理機構を一度コードでじっくり読むと良いでしょう。ざっくり面白いところは下記です。

- [WebでS3へのイベントアップロード処理](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/packages/shared/src/server/ingestion/processEventBatch.ts#L172)
  - [エラーになった場合は連携されたデータすべてをRedis経由で連携している(OLTPのみ)](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/packages/shared/src/server/ingestion/processEventBatch.ts#L271)
- [WebでBullMQを駆使してRedisにイベントIDを登録](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/packages/shared/src/server/ingestion/processEventBatch.ts#L216)
  - **LANGFUSE_INGESTION_QUEUE_DELAY_MS**に従ってDelayingしながら登録している
- [Async Workerのキュー取得エントリーポイント](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/worker/src/queues/ingestionQueue.ts#L38)
  - このなかでS3からデータダウンロード・Redisに連携されたイベントタイプからそれぞれの処理に進んでいる
  - [TraceのAsync Worker処理](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/worker/src/services/IngestionService/index.ts#L208)
  - [ObservationのAsync Worker処理](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/worker/src/services/IngestionService/index.ts#L321)
    - [mergeObservationRecords](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/worker/src/services/IngestionService/index.ts#L462)で⑥の処理を実施している
- [ClickHouseへの書き込みキュー登録処理](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/worker/src/services/ClickhouseWriter/index.ts#L172)

## ここまでのまとめ

Langfuse v3のアーキテクチャはLangfuse v2のアーキテクチャが抱えていた**スケーラビリティの課題を解決**するために、さまざまな工夫があったことがわかりました。

しかしながら、セルフホステッドで適用する場合、Langfuse v2のアーキテクチャよりも複雑になってしまったため、**残念ながら構築ハードルが高くなってしまったのもまた事実**です。

次の章では、冒頭でご紹介した**Langfuse v2アーキテクチャ**から**Langfuse v3アーキテクチャ**に如何に移行していったかをご紹介します。

## 先に構成図

先に結論からですが、こちらが新しく作成したLangfuse v3のAWSマネージドサービスの構成図です。

![Langfuse v3 Architecture AWS](https://i.imgur.com/umLZxXJ.jpg)

- 従来通りLangfuse Server(Web)は**AWS App Runner**でデプロイしています。

- **Langfuse OLTP(PostgreSQL)**も従来通り**Amazon Aurora serverless v2**で構築しています。

- **Langfuse Cache/Queue**は[Amazon ElastiCache](https://aws.amazon.com/jp/elasticache/)を使っています。DBエンジンはRedisのほかに[Valkey](https://valkey.io/)もサポートされているため少しでもインフラ代を浮かせるため、Valkeyを採用しました。

- **Langfuse Blob Storage**は**Amazon S3**を使っています。

- **Langfuse Async Worker**は**AWS ECS Fargate**でデプロイしています。

- **Langfuse OLAP Database**も**ECS Fargate**でデプロイしていますが、**データの永続化**のために**Amazon EFS**を使っています。また、ClickHouseへWeb、Workerが内部的にアクセスできるように**Cloud MapのService Discovery**で**プライベートDNS**を設定しています。

上記の構成は私のGitHubにてTerraform moduleとして公開していますので、興味がある方はぜひご参照ください。

[tubone24/langfuse-v3-terraform](https://github.com/tubone24/langfuse-v3-terraform)

以降の章ではLangfuse v3のアーキテクチャをAWSマネージドサービスで構築するためにはどのような工夫が必要だったかご紹介しますが、Try&Errorの構築秘話みたいなものが続くので読み飛ばしてもらって大丈夫です。

## Langfuse v2の最新バージョンまでアップデート

まずv2->v3の移行については[Migrate Langfuse v2 to v3](https://langfuse.com/self-hosting/upgrade-guides/upgrade-v2-to-v3)を参考にしました。

Langfuse v3.0.0の1つ前のv2バージョンが**v2.93.7**でしたので、まずはLangfuse **v2.93.7**にアップデートしました。

Before
![Langfuse v2.92.0](https://i.imgur.com/IKTkzIK.png)

After
![Langfuse v2.93.7](https://i.imgur.com/o2rx7t9.png)

これは、万が一v3に移行した際、動かなかったときに**速やかにv2に戻す**ため、**OLTPの切り戻し用マイグレーションスクリプト**(LangfuseはORMにPrismaを採用しているのでdown.sqlの実行)を期待してのことです。

しかしながら、確認して気がついたのですが、Langfuseのマイグレーションファイル一式には**down.sqlが存在していませんでした**。

(理由は推測になりますが、往々にしてdown.sqlを利用したマイグレーションの切り戻しはデータの損失が発生する可能性があるため、自動のマイグレーションスクリプトには含めないということかもしれません。私も過去のプロジェクトで似たような判断をしたことがあります。)

この場合、万が一のときは切り戻しのためのマイグレーションスクリプトを自分で作成、もしくは直接DBの書き換えを行なう必要がありますので覚悟を決めました。

一応、Langfuse [v2.93.7 -> v3.0.0の差分](https://github.com/langfuse/langfuse/compare/v2.93.7...v3.0.0)を確認し下記**2つの簡単なマイグレーションのみが存在することを確認したため**、手動での切り戻しも問題ないと判断しました。

[packages/shared/prisma/migrations/20241124115100_add_projects_deleted_at/migration.sql](https://github.com/langfuse/langfuse/blob/485120806ef47d31b52344d0995d32e01c6160f0/packages/shared/prisma/migrations/20241124115100_add_projects_deleted_at/migration.sql)

```sql
-- AlterTable
ALTER TABLE "projects" ADD COLUMN "deleted_at" TIMESTAMP(3);
```

[packages/shared/prisma/migrations/20241206115829_remove_trace_score_observation_constraints/migration.sql](https://github.com/langfuse/langfuse/blob/485120806ef47d31b52344d0995d32e01c6160f0/packages/shared/prisma/migrations/20241206115829_remove_trace_score_observation_constraints/migration.sql)

```sql
-- DropForeignKey
ALTER TABLE "job_executions" DROP CONSTRAINT "job_executions_job_output_score_id_fkey";

-- DropForeignKey
ALTER TABLE "traces" DROP CONSTRAINT "traces_session_id_project_id_fkey";
```

## インフラ構築

[Migrate Langfuse v2 to v3](https://langfuse.com/self-hosting/upgrade-guides/upgrade-v2-to-v3)ではv2とv3の両方のインフラを作成しDNSかEBか何かしらの手段でトラフィックを切り替える作戦を提示されていました。

丁寧に移行するなら**v2のApp Runner**と**v3のApp Runner**を同時に動かし、v3のApp Runnerに**トラフィックを切り替える**のがよいと思いますが、私はめんどくさいので下記の方法を取りました。

- v2の**AWS App Runner**・**Amazon Aurora serverless v2**を動かし続ける
- v3で新規に必要になった各種インフラを作成する
  - WorkerはRedisのキュー契機で動くため、v3のイメージを当てても問題はない。
- v3のすべてのインフラが問題なく動いたことを確認しApp Runnerのイメージをv3に切り替える
  - ここで**OLTP/OLAPのマイグレーション**が走る

図にするとこんな感じです。

![Langfuse v2 Architecture AWS](https://i.imgur.com/kVV2hGJl.png)

こちらに新しいコンポーネントを足し込んでいきます。

![Langfuse v3 Architecture AWS](https://i.imgur.com/CdXzO96l.png)

ここからは実際に検証時にぶつかった課題をご紹介します。

### Web、WorkerからClickHouseへのアクセス経路をどうするか

Langfuse v3のアーキテクチャではWeb、Workerから**ClickHouseへのアクセス経路**をどうするかが課題でした。

ClickHouse自体は**外(VPC外)から直接叩く要件はなく**、かつ**不要なインフラを作りたくなかった**ため、Internet facing / Internal限らず**ALBやNLB**でのエンドポイント化はせず、なんとか**コンテナ間で通信**を行なわせたいと考えました。

やりたいことのイメージはこんな感じです。

![ClickHouseへのアクセス経路](https://i.imgur.com/nrmKKZjl.png)

そこで真っ先に思いついたのは[AWS ECS Service Connect](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/service-connect.html)でした。

[AWS ECS Service Connect](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/service-connect.html)は、Amazon ECSで動かす**コンテナ間での通信**を簡単に行なうための機能です。

Service Connectを使うにはすべてのサービスをECS化する必要があります。これではLangfuse v2のApp Runnerで動かしているLangfuse ServerをECSに置き換えなくてはいけません。

![Langfuse ServerをECS化](https://i.imgur.com/VYbMEY3l.png)

Web Serverはスパイクアクセスにも柔軟に対応させつつ、動いていないときのコストを最小限にしたかったので、なんとかApp Runner構成を残す道を考えました。

そこで、[Amazon ECS Service Discovery](https://docs.aws.amazon.com/ja_jp/AmazonECS/latest/developerguide/service-discovery.html)を使ってClickHouseのプライベートDNSを設定し、Langfuse Web Server、Async Workerは**プライベートDNSの名前解決**を実施することで直接ClickHouseにアクセスできるようにします。

![ClickHouseへのアクセス経路](https://i.imgur.com/kHp2OOth.png)

### ClickHouseのデータ永続化

もう1つの課題は**ClickHouseのデータ永続化**でした。

なるべくインフラをマネージドサービスで構築したかったので、ClickHouseのコンピュートリソースはECS Fargateで構築することにしましたが課題はデータの永続化です。

ECS Fargateの**エフェメラルストレージ**はタスクが終了すると**データが消えてしまう**ため、**ClickHouseのデータの永続化が課題**となりました。

そこで、今回は[Amazon EFS](https://aws.amazon.com/jp/efs/)を使ってClickHouseのデータを永続化することにしました。

![ClickHouseのデータ永続化](https://i.imgur.com/yekxuN3h.png)

#### 余談: EFSのマウント失敗

完全に余談ですが、構築で検証中に**EFSのマウントがうまくできない問題**にぶつかりました。

理由はEFSをマウントする際に、EFSがrootユーザーのアクセス権限のところ、ClickHouseコンテナがClickHouseユーザーでマウントしていたため**アクセス権が不正で怒られていた**ことやEFSの**セキュリティグループがClickHouseサービスのセキュリティグループに許可されていなかった**ことが原因でした。

それ自体は原因さえわかってしまえば修正は大したことはないのですが、いかんせんタスクデプロイのときに出る失敗ログのみで原因にたどり着くのがEFS初心者としてはとても大変でした。

![EFSのマウント失敗](https://i.imgur.com/AuhZn4M.png)

(キャプチャ取り忘れましたが途中**botocoreのインストールをしてね**、という謎のメッセージもでたので苦労しました。EFSで永続化チャレンジするときはエラーメッセージに騙されないようにしましょう！)

```bash
check that your file system ID is correct, and ensure that the VPC has an EFS mount target for this file system ID. See https://docs.aws.amazon.com/console/efs/mount-dns-name for more detail. 
Attempting to lookup mount target ip address using botocore. Failed to import necessary dependency botocore, 
please install botocore first. Traceback (most recent call last): File "/usr/sbin/supervisor_mount_efs", line 52,
in <module> return_code = subprocess.check_call(["mount", "-t", "efs", "-o", opts, args.fs_id_with_path, args.dir_in_container], shell=False) File "/usr/lib64/python3.9/subprocess.py", 
line 373, in check_call raise CalledProcessError(retcode, cmd) subprocess.CalledProcessError: Command '['mount', '-t', 'efs', '-o', 'noresvport', 'fs-0472ff150300da61d:/var/lib/
```

#### 余談: ClickHouseのデータを飛ばしてしまった

これも検証中の余談なのですが、EFSにデータ永続化を試みているときに**誤ってClickHouseのデータを飛ばしてしまいました。**

これがLangfuseでは通常の運用としてはサポートされていないため、**データのリカバリーは自分で行なう必要がありました。**

Langfuse v3にアップデートをすると、v2時代に蓄積されたイベントをv3のClickHouseにマイグレーションする必要がありますので、別途[Background Migrations](https://langfuse.com/self-hosting/background-migrations)という仕組みがLangfuseにあります。

![badge](https://i.imgur.com/j7YZLwB.png)

アップデート後、上記のように[Background Migrations](https://langfuse.com/self-hosting/background-migrations)のステータスを示す**緑色のステータスアイコン**が表示されます。

こちらをクリックすることで、[Background Migrations](https://langfuse.com/self-hosting/background-migrations)の進捗状況を確認できます。

![background migration](https://i.imgur.com/NlPszng.png)

お気づきかもしれませんが、**一度成功したマイグレーションについては再実行ができません！**強制実行もできません！**

上記のキャプチャでは実は永続化前のClickHouseにマイグレーションを実施したあと、永続化に成功したClickHouseに接続し直した直後なのですが、いくつかのマイグレーションが完了しており、もう二度と古いデータにアクセスできなくなってしまったと絶望しました。

解決策としては、Background MigrationsのステータスをOLTP(PostgreSQL)から**直接Failedに変更し、Retryボタンを押せるようにする**ことです。

このあたりの条件は当然ドキュメントに載っていないので、コードから読み取る必要がありますし、自己責任でお願いします！

コードは[ここらへん](https://github.com/langfuse/langfuse/blob/33fddb134450af5c149c8205f42c440abebbe0c1/web/src/features/background-migrations/components/background-migrations.tsx#L74)です。

まず、Background Migrationsテーブルを確認すると、以下のようにstatusが**Success / Active**のレコードが存在してます。

```sql
SELECT * FROM background_migrations;
```

![background migrations](https://i.imgur.com/9RD4od5.png)

ここで、statusがActiveのレコードをFailedに変更します。上記のNext.jsコードを参考にFailedにするにはfailed_at, failed_reasonを設定する形でOKです。

```sql
UPDATE background_migrations SET failed_at = '2024-12-28 12:00:00', failed_reason = 'Simulated failure for testing' WHERE failed_at is NULL;
```

![background migrations failed](https://i.imgur.com/sHiLXMC.png)

すると、**retryボタンが押せる**ようになり、再度マイグレーションを実行できます。

![background migrations retry](https://i.imgur.com/TG6QTAq.png)

これで、ClickHouseデータを飛ばしてしまったときにも**自己責任でデータのリカバリー**ができるようになりました。

(ClickHouseをセルフホステッドからマーケットプレイス経由でCloud版に契約変更する際に参考になるかもしれません。)

## まとめ

大変長くなりましたが、Langfuse v3のアーキテクチャのDeepDiveとAWSマネージドサービスで構築するためにはどのような工夫が必要だったかをご紹介しました。

2025年はもっとLLMを活用したアプリケーション開発が促進されることでしょう。今のうちにLangfuse v3のアーキテクチャを理解・移行しておくことで、よりスムーズなLLMアプリ開発ができることでしょう。

今回のアップデートを身をもって体感し、Langfuseがますます好きになったので、これからもLangfuseのアップデートを楽しみにしています。
