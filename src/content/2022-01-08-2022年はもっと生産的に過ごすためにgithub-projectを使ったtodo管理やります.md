---
slug: 2022/01/08/personal-task
title: 2022年はもっと生産的に過ごすためにGitHub Projectを使ったToDo管理やります!!!
date: 2022-01-08T09:06:06.213Z
description: GitHub Projectを使ったToDo管理でちょっとカスタマイズすることで大幅に使いやすくなったのでそのご紹介。
tags:
  - GitHub
  - GitHubActions
  - ToDo
headerImage: https://i.imgur.com/LnpjYNN.png
templateKey: blog-post
---
あけましておめでとうございます。

## Table of Contents

```toc

```

## ToDo書いて生産的な生活になろう

あけましておめでとうございますー。昨年は色々な人にお世話になりましたので今年は人に貢献していきたいと思っている筆者です。

そのためにも時間の捻出が重要になってくるかと思いますが、より生産性の高い日常を送るためにはやはり**ToDoリスト**なのではないでしょうか？

みなさん、**ToDoリスト**、使ってますか？

かれこれ筆者は、何度もToDoリストを作って生産的な生活を送ろうとしてますが、うまくいった試しがありません。

そんな筆者がなぜToDoリストが続かないのかを分析し自分にぴったりのToDoアプリを作り、運用します。

このままだと胡散臭いビジネス書みたいな宣伝文句になってしまってますが、安心してください。そんなに胡散臭い内容は出てこないはずです。(ほぼGitHub ActionsのTipsみたいな記事です。)

## 最強のToDoリストとは？

まずは、世の中のToDoリスト(アプリ)について分析していきましょう。

世の中には玉石混交のToDoリストアプリで溢れかえってますが、筆者が思うに**ネイティブアプリ専用のToDoリスト**はまず開かなくなります。

そもそもパソコンで仕事してるケースが多いのでパソコンでもスマホでも操作できないと使わなくなります。それにスマホ開いたらTwitter見ちゃうでしょ。

また、タスク期日や依存関係、カテゴリ、タグなど、一つのToDoを書くためにやたら記載欄が多いToDoアプリも適当になりがちなでおすすめできません。後々の振り返り分析なんかにはいいんですが、めんどくさいですよね。

またタスクの期日に応じたリマインダー機能があると続ける気になりそうです。ただ、リマインドはSlackに送らないと意味がありません。Gmailはまず見ません。

まとめると

1. パソコンでもスマホでも使える
2. 入力欄がシンプル
3. リマインダーがある(Slack)

となります。

## 選ばれたのはGitHub Projectでした。

ということで今回私に選ばれたのは**GitHub Project**でした。

え？ それってカンバンでプロジェクト管理するソフトウェア開発のタスク管理ツールでしょ？コードを書かないような個人のToDoに使えるの？と思ったあなた。

**その通りです。使えません。**

そのままでは使い勝手が悪すぎます。

が、GitHub ProjectにはGitHub Actionsという最強のCIがついてますのでこちらを使うことで劇的に使いやすいToDoアプリになります。

まず、GitHub Projectはパソコンでもスマホでも利用可能なので、 **1. パソコンでもスマホでも使える** はクリアとなります。

今回はGitHub Issueを基軸に運用したいのでProjectのテンプレートはAutomated Kanbanを選択しました。これで、Issueがクローズされた際にProject側でも勝手にDoneにしてくれます。

## カスタマイズ1 IssueとProjectを自動で紐付ける

Github ProjectはGitHub IssueおよびPull Requestと紐付けして運用することができるのですが、**Issueを切った際にProjectのToDoに自動紐付けされません。** (Automated KanbanでIssue CloseでDoneにしてくれるのに...)

手動で、指定したProjectに紐付けを行う必要があります。一つのRepositoryに対して複数のProjectが存在するケースがあるのである意味ソフトウェア開発的には正当な動きと思いますが、個人ToDoには荷が重すぎます。わざわざ毎回手動で紐付けるのはつらすぎます。

そこで僕はGitHub Actions。 (もこみち風)

ちょっとWeb上で探したところ、なんとすでに[alex-page/github-project-automation-plus](https://github.com/marketplace/actions/github-project-automation)という便利なActionsが用意されているので、こちらをGitHub Actionsで使えばかんたんに実現できます。ありがとうございます。

```yaml
name: Move new issues into MyToDo
on:
  issues:
    types: [opened]

jobs:
  automate-project-columns:
    runs-on: ubuntu-latest
    steps:
      - uses: alex-page/github-project-automation-plus@v0.3.0
        with:
          project: MyToDo
          column: To do
          repo-token: ${{ secrets.GH_TOKEN }}
```

使い方は公式のREADMEを見てもらえればと思いますが、ポイントとしては、on句にはIssueのOpenを指定することとrepo-tokenはGitHub Actionsでデフォルトで使える**secrets.GITHUB_TOKEN**だとProjectの操作権限がないのでadmin:orgのR/W権限をつける必要があります。(専用に[PAT](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)を再発行してsecretsに設定する必要があります。)

これで、New IssueからIssueを切るだけで、Project管理ができるようになりました！

## カスタマイズ2 ラベルを活用する

GitHub Issues, Projectにはラベルという概念があります。

よく、BugとかFeatureとかついているあれです。

## カスタマイズ2 期日を管理したい

ある意味GitHub Project最大の欠点だとおもいますが期日の管理がやりにくいです。一応Milestoneという機能を使ってリリース日を設定し、そちらにIssueを紐付けることでプロジェクト管理ができるようになっておりますが、Milestoneを毎回作るのも大変です。















