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

そして、それらの間にはRedisをキューとして挟むことでイベントの書き込みを非同期化しています。

![Redisをキューとして挟むことでトレースの書き込みを非同期化](https://i.imgur.com/RciSsWv.png)

こうすることで、PostgreSQLのIOPS上限を超えることなくイベントの書き込みを行なうことができるようになりました。

### OLAPとしてのClickhouse導入とレコードの更新処理

Langfuse v3ではOLAPとしてClickHouseを導入しています。ClickHouseはOLAPに特化したデータベースで、分析ワークロードにおいてPostgreSQLに比べ効率的に処理できることが特徴です。
