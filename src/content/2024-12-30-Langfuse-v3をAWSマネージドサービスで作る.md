---
slug: 2024-12-30/Langfuse-v3をAWSマネージドサービスで作る
title: "Langfuse v3をAWSマネージドサービスで作る"
date: 2024-12-30T02:35:41+0000
description: Langfuse v3をAWSマネージドサービスで作る
tags:
  - fixme
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

AWSはマネージドサービスがやっぱりいいですよね。

## Table of Contents

```toc

```

## Langfuse v3がついにGAしました

皆さま年の瀬ですが、いかがお過ごしでしょうか？

LLMそのものにはあまり興味が持てなかった私ですが、案件で使って依頼、Langfuse、もといLLMOpsのツール群が大好きになった私。

2024年12月9日に[Langfuse v3がついにGA](https://langfuse.com/changelog/2024-12-09-Langfuse-v3-stable-release)してから、早く使ってみたいという気持ちからあろうことか年末の忙しい時期にLangfuse v3のアーキテクチャをAWSマネージドサービスで作ってみました。

良い子の皆さんは、大掃除や年越し準備をしている時期ですが、私はLangfuse v3をAWSマネージドサービスで作っていました.....。よろしくない。

## Langfuseとは

まずおさらいですが、[Langfuse](https://langfuse.com/)はLLMアプリケーション向けのオープンソースの監視と分析プラットフォームです。

端的に言えば、LLMアプリケーションに対してどんな入力が行なわれ、どんな推論が走り、途中にどんなツール呼び出しが行なわれ、どんな出力があったかを可視化・分析するためのツールです。

似たようなアプリケーションとしては、[LangSmith](https://www.langchain.com/langsmith)がありますが、LangfuseはOSS版が公開されており、ライセンス料を払わず自前の環境にセルフホステッドで構築できます。

このセルフホステッドができることがLangfuseの強みであり、長らく案件でLangfuseを使ってLLMOpsを実施してきました。

## 我々のLangfuse v2アーキテクチャ

話が遅くなりましたが、現在の案件ではAWSを活用したアプリケーション開発を中心にやっているため当然LangfuseもAWS上に構築していました。

Langfuse v2は、Next.jsで構築されたLangfuse Serverとトレースデータやプロンプトマネジメント用のデータを格納するPostgreSQLのシンプルな2コンポーネント構成でしたので、次のようなアーキテクチャで構築していました。

![Langfuse v2 Architecture AWS](https://i.imgur.com/RWzEbMz.jpg)

特徴として、Langfuse ServerはAWS App Runnerでデプロイしており、データベースはAmazon Aurora serverless v2で構築、それぞれのつなぎ込みはVPC Connectorを利用するというかなりシンプルな構成にしていました。

ラッキーなことにLangfuse v2はNext.jsでリクエストベースでコンテナが実行されればよいため、（常駐する必要がないため）コスト最適化の観点でもAWS App Runnerでデプロイしておりました。

また、PostgreSQLはAmazon Aurora serverless v2で構築し、App Runnerと合わせてインフラ管理をできるだけ最小限にするAWSマネージドサービスを組み合わせて運用できてました。

開発者も限られていることや強くインフラを意識してしまうのは本質的でないと考え、このような構成にしてましたが私はこの構成が好きでした。

## Langfuse v3のアーキテクチャと移行の課題

Langfuse v3がGAしたということでしたが、Langfuse v3はLangfuse v2とは全く異なるアーキテクチャになっていました。

アーキテクチャの比較をLangfuse公式ドキュメントから引用します。

まずv2がこちらです。

![Langfuse v2 Architecture](https://i.imgur.com/3pYyKr7.png)

そしてv3がこちらです。

![Langfuse v3 Architecture](https://i.imgur.com/IIFnpvS.png)

Langfuse v3は、Langfuse Web Server, Async Worker、Langfuse OLTP(PostgreSQL)、Langfuse Cache、Langfuse Blob Storage、Langfuse OLAP Databaseの6つのコンポーネントで構成されています。

大幅に必要なコンポーネントが増えてしまったのです！

これではApp Runnerのイメージを更新する形で対応ができないではありませんか...。

## Langfuse v3のアーキテクチャが解決したいこと

ちょっと文句が出てきそうですが、v3のアーキテクチャはLangfuse v2のアーキテクチャが解決したい課題を解決していると感じました。

Langfuseの中の人ではないので課題を正しく捉えていないかもですが[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)を参考に自分なりの考察とともに抜粋しまとめていきます。

### 近年のLLMアプリケーションの需要増加とObservation特性

LLMアプリケーション自体の数が増えたり、利用者が増えたことによりLangfuse自体の利用も増えてきたことからLangfuse Cloudでのスケーラビリティが問題になってきたと[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)で言及されています。

  <blockquote>
    <p>Initial Pain Point: By summer 2023, spiky traffic patterns led to response times on our ingestion API spiking up to 50 seconds.</p>
    <p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
  </blockquote>

また、昨今のLLMアプリケーションは、単純な入力とLLMの出力だけで構成されるアプリケーションではなく、複数のツールを呼び出し、複数のデータストアを参照し、複数の出力を返す複雑なアプリケーションが増えてきています。

加えて、それらを並列・非同期で処理することも増えてきたため1回の回答生成（Langfuseではこの単位をTraceと呼ぶ）に対していくつものイベント(Observation)が同時発生することが増えてきました。

結果として、Langfuse v2のアーキテクチャではスケーラビリティが追いつかなくなってきたということです。

![昨今のLLMアプリケーションのObservation特性](https://i.imgur.com/W0NoiX1.png)

### プロンプトマネジメントAPIの低レイテンシー要件

Langfuseにはプロンプトマネジメント機能があります。LLMアプリケーションの再デプロイをせずともバージョン管理されたプロンプトを画面から任意のタイミングで差し替えできる機能でLLMアプリケーション開発にはなくてはならない機能となってきました。

先ほど挙げたTrace/Observationに比べて、こちらはレイテンシーがより深刻です。

Trace/Observationは例えばJavaScriptなら本線のアプリケーション動作のなかでLangfuseへのIngestionを非同期・ノンブロッキングで解決することで、アプリの作りとしてユーザー影響を最小限に抑えることができます。（データ欠損など問題はありえますが）

しかしながら、プロンプトマネジメントはLLMアプリケーションの動作起点になる処理でレイテンシーが高いとユーザー体験に直結してしまいます。

この点も[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)で言及されています。

  <blockquote>
    <p>While tracing is asynchronous and non-blocking, prompts are in the critical path of LLM applications. This made a seemingly straightforward functionality a complex performance challenge: During high ingestion periods, our p95 latency for prompt retrieval spiked to 7 seconds. The situation demanded an architectural solution that could maintain consistent low-latency performance, even under heavy system load from other operations.</p>
    <p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
  </blockquote>

### 高度な分析要件と立ちはだかる巨大なデータ

繰り返しになりますが、LangfuseはLLMアプリケーションのトレースデータを分析するためのツールです。

分析ということは大量のトレースデータを処理することになります。

昨今のLLMがロングコンテキストな文章を扱うことができるようになったことやマルチモーダルLLMの台頭により、トレースデータ自体のサイズが増えてきています。

高度分析を行なうためにはPostgreSQLのようなOLTPより、OLAPなデータウェアハウスが必要になってきています。

後ほど説明しますがLangfuse v2ではPostgreSQLを使っていましたが、OLAPとしてLangfuse v3ではClickHouseを使っています。

  <blockquote>
    <p> With LLM analytical data often consisting of large blobs, row-oriented storage was too heavy on disk when scanning through millions of rows. The irony wasn’t lost on us - the very customers who needed our analytics capabilities the most were experiencing the worst performance. This growing pain signaled that our initial architecture, while perfect for rapid development, needed a fundamental rethink to handle enterprise-scale analytical workloads.</p>
    <p><cite><a href="https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution">From Zero to Scale: Langfuse's Infrastructure Evolution</a> by Steffen Schmitz and Max Deichmann</cite></p>
  </blockquote>

## Langfuse v3のアーキテクチャDeep Dive

さて、そんな課題を解決するためにLangfuse v3のアーキテクチャはどのようになっているのでしょうか？

少し[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)からDeeo Diveしてみます。

（ここでは記載を省きますが、Langfuse Cloudとして取り組んだプロンプトマネジメントAPIをALBのターゲットグループで分けるなどのアーキテクチャ改善のお話もとてもおもしろいのでぜひ[公式ブログ](https://langfuse.com/blog/2024-12-langfuse-v3-infrastructure-evolution)をくまなく読んでいただくことをおすすめします）

### イベントのOLTP書き込み非同期化

散々Langfuse v3のアーキテクチャを見てきたので知った話かもしれませんが、v3ではWeb/Workerの2つのコンポーネントに分かれています。

そして、それらの間にはRedisをキューとして挟むことでイベントをOLTPであるPostgreSQLに書き込みしています。

書き込みをすべてworkerで行なうことで、イベントがスパイクで発生したとしてもWorkerでリミットを設けて、PostgreSQLのIOPS上限を超えることがないようにしています。

![Redisをキューとして挟むことでトレースの書き込みを非同期化](https://i.imgur.com/jkLzM8V.png)

### OLAPとしてのClickhouse導入とレコードの更新処理

（ここは個人的にLangfuse v3のアーキテクチャのなかで一番興味深い部分です）

Langfuse v3ではOLAPとしてClickHouseを導入しています。ClickHouseはOLAPに特化したデータベースで、分析ワークロードにおいてPostgreSQLに比べ効率的に処理できることが特徴です。

前述したイベントのOLTP書き込みと同様に、ClickHouseに対してもイベントの書き込みはWorkerで非同期で行なっています。

ここでポイントになることはOLAPの1行レコード更新はOLTPに比べてかなり遅い（書き込み後の読み取りの一貫性が保証されるまでの時間が長い）ということです。

LangfuseはTraceやObservationがすべて一意のIDを持っているため、同じIDに対してイベントが発生した場合にはレコードの更新処理を実施する必要があります。

しかしながら書き込み後の読み取りの一貫性が保証されるまでの時間が長いClickHouseでは、読み込み時にまだ更新処理が終わっていないレコードを読み込んでしまう可能性があります。

ここを深ぼっていくにはClickhouseのReplacingMergeTreeの仕組みを理解する必要がありますのでしばしお付き合いください。

#### ReplacingMergeTree

ClickHouseのReplacingMergeTreeは、MergeTreeの一種で、データの挿入時に重複がある場合に古いデータを置き換えることができるテーブルエンジンです。

例えば、以下のようなテーブルがあるとします。

```sql
CREATE TABLE events
(
    id UInt64,
    text String
)
ENGINE = ReplacingMergeTree()
```

まず、このテーブルにIDが1のレコードを挿入します。

![IDが1のレコードを挿入](https://i.imgur.com/iSJWa6Ul.png)

次に、IDが2のレコードを挿入します。ここまでは特に問題のない挿入だと思います。

![IDが2のレコードを挿入](https://i.imgur.com/MbJm52Ll.png)

では、次にIDが1のレコードをText wowに更新してみましょう。ClickhouseでReplacingMergeTreeを使っている場合、まず更新分のレコードが重複した形で挿入されます。

![IDが1のレコードを更新](https://i.imgur.com/DPSiFTVl.png)

その後、バックグラウンドタスクで古いレコードが削除され、新しいレコードが残ることで更新処理が完了します。これがClickhouseのReplacingMergeTreeの仕組みです。

![IDが1のレコードを更新後の状態](https://i.imgur.com/kISGmIll.png)

この動作をすることで、Clickhouseの各ノードで更新処理が独立して実施でき、更新のパフォーマンスが向上するのですが、バックグラウンドタスクのタイミングを制御しきれないため、レコード更新後の読み取りの一貫性が保証されるまでの時間が長くなるという問題があります。

（※正確にはselect_sequential_consistencyを使うことで一貫性を保証することはできますが、パフォーマンスに影響するので使えません。）

## Langfuse v3ではReplacingMergeTreeをどのように使っているのか

Langfuse v3では、この問題をWorkerでのマージ処理によって解決しています。

Workerはひとまとまりのイベントを処理する際に、Clickhouseに書き込みをする前に内部的にマージ処理を行ない、レコードの一貫性を保つ状態を作り出し、Clickhouseに書き込みを行なっています。少し複雑なので図にて説明します。

![Workerでのマージ処理によるレコードの一貫性の保持](https://i.imgur.com/m5qsPe9.png)

イベントのOLTP書き込み非同期化にて記載の通り、イベントの書き込みはRedisをキューとして挟むことで非同期化されていますが、正確にはS3にイベント全データをJSONで格納し、RedisにはイベントのIDのみを格納しています。これはLLMへのコンテキストや生成結果をRedisに保存してしまうとRedisの容量が足りなくなるためです。（①②）

WorkerはイベントのIDをRedisから取得し、S3からイベント全データを取得します。（③④）

そして、イベント全データをまずOLTPであるPostgreSQLに書き込み（⑤）

一回のClickhouse書き込み時にWorker内部でレコードの更新状態になるように同一のIDでのイベントをマージ処理を行ない、Clickhouseへの書き込みキューに登録します。（⑥⑦）

そして、Clickhouseに書き込みを行ないます。（⑧）

こうすることで、ClickhouseのReplacingMergeTreeの仕組みを使いつつ、Worker内部でのマージ処理によってレコードの一貫性を保つことができるようになっています。

## ここまでのまとめ

Langfuse v3のアーキテクチャはLangfuse v2のアーキテクチャが抱えていたスケーラビリティの課題を解決するために、さまざまな工夫があったことがわかりました。

しかしながら、セルフホステッドで適用する場合、Langfuse v2のアーキテクチャよりも複雑になってしまったため、その構築ハードルが高くなってしまったのもまた事実です。

次の章では、冒頭でご紹介したLangfuse v2で構築したAWSマネージドサービスを活用したアーキテクチャからLangfuse v3のアーキテクチャに如何に移行していったかをご紹介します。

## 先に構成図

先に結論からですが、こちらが新しく作成したLangfuse v3のAWSマネージドサービスの構成図です。

![Langfuse v3 Architecture AWS](https://i.imgur.com/umLZxXJ.jpg)

まず、従来通りLangfuse Server(Web)はAWS App Runnerでデプロイしています。

次に、Langfuse OLTP(PostgreSQL)も従来通りAmazon Aurora serverless v2で構築しています。

Langfuse Cache/QueueはAmazon ElastiCacheを使っています。Valkeyもサポートされているため少しでもインフラ代を浮かせるためにエンジンはValkeyを使っています。

Langfuse Blob StorageはAmazon S3を使っています。

Langfuse WorkerはAWS ECS Fargateでデプロイしています。

Langfuse OLAP DatabaseもECS Fargateでデプロイしていますが、データの永続化のためにAmazon EFSを使っています。また、ClickhouseへWeb、Workerが内部的にアクセスできるようにCloud MapのService DiscoveryでプライベートDNSを設定しています。

ざっくりとした構成図ですが、Langfuse v3のアーキテクチャをAWSマネージドサービスで構築するためにはどのような工夫が必要だったかを次章でご紹介します。（Try&Errorの構築秘話みたいなものが続くので読み飛ばしてもらって大丈夫です）

## Langfuse v2の最新バージョンまでアップデート

まずv2->v3の移行については[Migrate Langfuse v2 to v3](https://langfuse.com/self-hosting/upgrade-guides/upgrade-v2-to-v3)を参考にしました。

Langfuse v3.0.0の1つ前のv2バージョンがv2.93.7でしたので、まずはLangfuse v2.93.7を最新バージョンにアップデートしました。

これは、万が一v3に移行した際、動かなかったときに速やかにv2に戻すため、OLTPの切り戻しのマイグレーションスクリプト(LangfuseはORMにPrismaを採用しているのでdown.sqlの実行)を期待してのことです。

しかしながら、確認して気がついたのですが、Langfuseのマイグレーションファイル一式にはdown.sqlが存在していませんでした。

（理由は推測になりますが、往々にしてdown.sqlを利用したマイグレーションの切り戻しはデータの損失が発生する可能性があるため、自動のマイグレーションスクリプトには含めないということかもしれません。私も過去のプロジェクトで似たような判断をしたことがあります。）

この場合、万が一のときは切り戻しのためのマイグレーションスクリプトを自分で作成、もしくは直接DBの書き換えを行なう必要がありますので覚悟を決めました。

一応、Langfuse [v2.93.7 -> v3.0.0の差分](https://github.com/langfuse/langfuse/compare/v2.93.7...v3.0.0)を確認し下記2つの簡単なマイグレーションのみが存在することを確認したため、万が一の切り戻しも問題ないと判断しました。

packages/shared/prisma/migrations/20241124115100_add_projects_deleted_at/migration.sql

```sql
-- AlterTable
ALTER TABLE "projects" ADD COLUMN "deleted_at" TIMESTAMP(3);
```

packages/shared/prisma/migrations/20241206115829_remove_trace_score_observation_constraints/migration.sql

```sql
-- DropForeignKey
ALTER TABLE "job_executions" DROP CONSTRAINT "job_executions_job_output_score_id_fkey";

-- DropForeignKey
ALTER TABLE "traces" DROP CONSTRAINT "traces_session_id_project_id_fkey";
```
