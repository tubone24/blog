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

このままだと**胡散臭いビジネス書みたいな**宣伝文句になってしまってますが、安心してください。そんなに胡散臭い内容は出てこないはずです。(ほぼGitHub ActionsのTipsみたいな記事です。)

## 最強のToDoリストとは？

まずは、世の中のToDoリストアプリについて分析していきましょう。

世の中には玉石混交のToDoリストアプリで溢れかえってますが、筆者が思うに**ネイティブアプリ専用のToDoリスト**はまず開かなくなります。

そもそもパソコンで仕事してるケースが多いのでパソコンでもスマートフォンでも操作できないと使わなくなります。それにスマートフォン開いたらTwitter見ちゃうでしょ。

また、タスク期日や依存関係、カテゴリ、タグなど、1つのToDoを書くためにやたら記載欄が多いToDoアプリも適当になりがちなでおすすめできません。後々の振り返り分析なんかにはいいんですが、めんどくさいですよね。

またタスクの期日に応じたリマインダー機能があると続ける気になりそうです。ただ、リマインドはSlackに送らないと意味がありません。Gmailはまず見ません。

まとめると、

1. パソコンでもスマートフォンでも使える
2. 入力欄がシンプル(わかりきっていることは自動で入力してほしい)
3. リマインダーがある(Slack)

となります。

## 選ばれたのはGitHub Projectでした。

ということで今回私に選ばれたのは[GitHub Project](https://docs.github.com/ja/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards)でした。

え？　それって**カンバンでプロジェクト管理するソフトウェア開発のタスク管理ツール**でしょ？コードを書かないような個人のToDoに使えるの？と思ったあなた。

**その通りです。使えません。**

**そのままでは使い勝手が悪すぎます。**

が、GitHub Projectには**GitHub Actions**という最強のCIがついてますのでこちらを使うことで劇的に使いやすいToDoアプリになります。

まず、GitHub Projectはパソコンでもスマートフォンでも利用可能なので、何も実装しなくても **1. パソコンでもスマートフォンでも使える** はクリアとなります。ありがたい。

今回はGitHub Issueを基軸に運用したいのでProjectのテンプレートは[Automated Kanban](https://docs.github.com/ja/issues/organizing-your-work-with-project-boards/managing-project-boards/about-project-boards#templates-for-project-boards)を選択しました。これで、**Issueがクローズされた際にProject側でもタスクを勝手にDone**にしてくれます。

![img](https://i.imgur.com/fWMy7hV.png)

## カスタマイズ1 IssueとProjectを自動で紐づける

GitHub ProjectはGitHub IssueおよびPull Requestと紐づけして運用できるのですが、**Issueを切った際にProjectのToDoに自動紐づけされません。** (Automated KanbanではIssue CloseでDoneにしてくれるのに逆のことはしてくれないんだ...)

Issueを切った際**手動**で、指定したProjectに紐づけを行なう必要があります。1つのRepositoryに対して複数のProjectが存在するケースがあるのである意味ソフトウェア開発的には正当な動きと思いますが、個人ToDoには荷が重すぎます。わざわざ毎回手動で紐づけるのはつらすぎます。

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

使い方は公式のREADMEを見てもらえればと思いますが、ポイントとしては、on句にはIssueのOpenを指定することとrepo-tokenはGitHub Actionsでデフォルトで使える**secrets.GITHUB_TOKEN**だとProjectの操作権限がないので**admin:orgのR/W権限**をつける必要があります。

(専用に[PAT](https://docs.github.com/ja/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)を再発行してsecretsに設定する必要があります。)

これで、New IssueからIssueを切るだけで、Project管理ができるようになりました！

## カスタマイズ2 ラベルを活用する

GitHub Issues, Projectには[Label](https://docs.github.com/ja/issues/using-labels-and-milestones-to-track-work/managing-labels)という概念があります。

よく、BugとかFeatureとかついているあれです。

![label](https://i.imgur.com/zeWmlIk.png)

これをToDoに活用することでToDo管理をやりやすくします。

![img](https://i.imgur.com/RsOQAlV.png)

このようにLabel管理することで、タスクの優先度や作業場所のカテゴライズを行ないやすくできました！

## カスタマイズ3 期日を管理したい

ある意味GitHub Project ToDoアプリ利用最大の欠点だとおもいますが、**期日の管理**がやりにくいです。

一応Milestoneという機能を使ってリリース日を設定し、そちらにIssueを紐づけることでプロジェクト管理ができるようになっておりますが、**Milestoneを毎回作って紐づける**のはとても大変です。(やはりGitHub ActionsでToDo管理は無理があったと感じざるを得ません。)

![img](https://i.imgur.com/ZXzTyx3.png)

Milestoneを設定さえすれば、期日表示ができますし後々実施しようと思っているリマインダーにも活用できそうです。

今回はカスタマイズ2で専用の期限Labelを作ったのでこちらを活用していきます。

次のようなワークフローを考えます。

1. 期限Labelをつける
2. Labelをつけた時刻からラベルの対象期限を算出し、Milestoneを作る
3. 作ったMilestoneをIssueにつける

で、これもGitHub Actionsで作ることができます。

今回はちょっと勉強のために[actions/github-script](https://github.com/marketplace/actions/github-script)を使って実装しました。

GitHub ScriptはデフォルトでGitHubのContextやEventを取得、IssueやMilestoneを更新できる[Octokit](https://octokit.github.io/rest.js/v18)がimport不要でそのまま使えるのでかなり便利なのですが、GitHub ActionsのYAML上でコードを書くことになり、YAML上ではGitHub Script(JavaScript)の**エディターの補完**が効かず開発体験が悪すぎて発狂仕掛けたので複雑な実装をするときはまじで利用をおすすめしません!!!普通にスクリプト書いてcheckoutしたほうがマシです。

あと、GitHub Scriptのドキュメントが少なすぎです。

なんのAPIがあるのかまるでわかりません。[Octokit](https://octokit.github.io/rest.js/v18)のAPIと同じだろうと思って使おうとするとそんなメソッドありませんエラー出るしいちいちインスタンスをconsole.logして実装されているメソッドを確認する作業で時間を浪費しました...。

```yaml
name: Create Milestone For Labeled
on:
  issues:
    types:
      - labeled

jobs:
  create_milestone:
    runs-on: ubuntu-latest
    steps:
      - name: create milestone
        uses: actions/github-script@v3
        with:
          github-token: ${{ secrets.GH_TOKEN }}
          script: |
            const label = context.payload.label.name
            const date = new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000));
            const nextDayOffset = 7 - date.getDay()
            let due_on
            let endDate
            if(label.indexOf('Today') !== -1) {
              due_on = date.toISOString()
              endDate = (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate()
            } else if(label.indexOf('Tommorrow') !== -1) {
              date.setDate(date.getDate() + 1)
              due_on = date.toISOString()
              endDate = (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate()
            } else if(label.indexOf('NextWeekend') !== -1) {
              date.setDate(date.getDate() + 7 + nextDayOffset)
              due_on = date.toISOString()
              endDate = (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate()
            } else if(label.indexOf('Weekend') !== -1) {
                date.setDate(date.getDate() + nextDayOffset)
                due_on = date.toISOString()
                endDate = (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate()
            } else if(label.indexOf('NextMonth') !== -1) {
              date.setDate(date.getDate() + 30)
              due_on = date.toISOString()
              endDate = (date.getFullYear()) + "/" + (date.getMonth() + 1) + "/" + date.getDate()
            } else {
              // nothing to do
              return
            }
            let milestoneNumber
            try {
              const result = await github.issues.createMilestone({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: endDate,
              due_on: due_on,
              description: endDate + 'までに片付ける'
              })
              milestoneNumber = result.data.number
            } catch(e) {
              console.log(e)
              if (e && e.errors && e.errors[0].resource === 'Milestone' && e.errors[0].code === 'already_exists') {
                console.log('skip create milestone')
                const resp = await github.issues.listMilestones({
                  owner: context.repo.owner,
                  repo: context.repo.repo,
                  sort: 'due_on',
                  direction: 'desc',
                  per_page: 100,
                })
                if (resp.data.filter(m => m.title === endDate).length !== 0) {
                  milestoneNumber = resp.data.filter(m => m.title === endDate)[0].number
                } else {
                  console.log(resp)
                }
              } else {
                console.log(e)
                throw(e)
              }
            }
            await github.issues.update({
              owner: context.repo.owner,
              repo: context.repo.repo,
              issue_number: context.issue.number,
              milestone: milestoneNumber,
            })
```

かなり愚直ですが、on句でIssueがlabeledの際にLabel名を取得し、ToDayとかNextWeekendとかキーワードを拾い上げ現在時刻からMilestone期限を算出します。

その後作成したMilestoneをIssueに紐づけるわけですが、すでに同名のMilestoneを作成しているとき、つまり同一日の期限タスクをすでに作っている場合もあるのでそこらへんのハンドリングがややこしい感じになっています。

繰り返しになりますが、**10行以上の処理を記載するときはGitHub Script使わず、きっちり実装したほうが色々幸せになれます。**

ともかく、このGitHub Actionsのおかげで期限ラベルを設定するだけで、Milestoneも設定されるようになりました！

### 余談

余談ですが、上記のコード、elseに何もしないってコメントしているのにreturnしてますね。💦💦💦💦

```javascript
} else {
  // nothing to do
  return
}
```

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">なんだこれ <a href="https://t.co/SyHgBW3VAp">pic.twitter.com/SyHgBW3VAp</a></p>&mdash; K.Saito (@SightSeekerTw) <a href="https://twitter.com/SightSeekerTw/status/1479362069422292992?ref_src=twsrc%5Etfw">January 7, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

というTweetも話題になりましたが、結構自分は何もしないelse書いたりします。がそこらへんの議論は宗教戦争なのでなんとも穏やかにいきたいものです。

今回の私の実装はreturnしているのでコメントからしてだめですけどね..。

## カスタマイズ4 溜まってしまったMilestoneを定期的にCloseする

カスタマイズ3で期限タスクが発生するたびにMilestoneを作る運用にしてしまったことで、Milestoneに過去の不要な日付のものがOpenし続ける状態になってしまいました。

視認性も悪く精神衛生上も悪いので、期日を過ぎていてかつ、紐づくタスクすべてDoneになっているMilestoneは自動的にCloseするようにします。

こちらもGitHub Actionsで実装します。ただし、今回は前回の反省を活かし[actions/github-script](https://github.com/marketplace/actions/github-script)は使いません。Pythonで作りました。

まずはPythonのコードですが、GitHubへのアクセスは[PyGithub](https://github.com/PyGithub/PyGithub)を使いました。

```python
import os
from datetime import datetime, timedelta
from github import Github

ACCESS_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = os.getenv("GITHUB_REPOSITORY")
g = Github(ACCESS_TOKEN)

repo = g.get_repo(REPO)
open_milestones = repo.get_milestones(state="open")
yesterday = datetime.now() - timedelta(days=1)

should_close_milestone = []
for milestone in open_milestones:
    print(milestone)
    if milestone.due_on < yesterday and milestone.open_issues == 0:
        should_close_milestone.append(milestone)
        milestone.edit(title=milestone.title, state="closed")

print(should_close_milestone)
```

といった感じでopenしているmilestoneを取得して、昨日までの期日のMilestoneでopenしているIssueが0件のものをclosedにしていくシンプルスクリプトです。

GitHub Scriptに比べて、IDEで型アノテーションが効いており、開発体験よかったです。

次にGitHub Actionsですがただon scheduleでこちらのPythonを実行しているだけなので貼り付けは割愛します。

## カスタマイズ5 日報&リマインダー機能の作成

さて、ラストになりましたがリマインダー機能を作っていきます。

こちらちょっと趣向を凝らして**日報&リマインダー**にすることにしました。

一日一回、Markdown形式で日報を作りレポジトリにpushすると同時にSlack通知し日報の中に明日期限のタスクも合わせて記載する、という方法を採用しました。


```python
import os
from datetime import datetime, timedelta
import string
from github import Github
import requests
import json

TEMPLATE = """# ${date} の日報
## やったこと
${today_closed_issues_string}
## 今日やろうと思ったこと
${today_open_issues_string}
## 明日までにやらないといけないこと
${tommorrow_due_to_issues_string}
"""

TEMPLATE_SLACK = """*${date} の日報*
*やったこと*
${today_closed_issues_mrkdwn_string}
*今日やろうと思ったこと*
${today_open_issues__mrkdwn_string}
*明日までにやらないといけないこと*
${tommorrow_due_to_issues__mrkdwn_string}
"""

ACCESS_TOKEN = os.getenv("GITHUB_TOKEN")
REPO = os.getenv("GITHUB_REPOSITORY")
SLACK_WEB_HOOK = os.environ.get("SLACK_WEB_HOOK")
g = Github(ACCESS_TOKEN)

repo = g.get_repo(REPO)
open_issues = repo.get_issues(state="open")
closed_issues = repo.get_issues(state="closed")
today = datetime.now()
tommorrow = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) + timedelta(days=2)

today_closed_issues = []
today_open_issues = []
due_to_issues = []
today_closed_mrkdwn_issues = []
today_open_mrkdwn_issues = []
due_to_mrkdwn_issues = []
for issue in closed_issues:
    if issue.closed_at.strftime("%Y-%m-%d") == today.strftime("%Y-%m-%d"):
        today_closed_issues.append(f"[{issue.title}]({issue.html_url})")
        today_closed_mrkdwn_issues.append(f"<{issue.html_url}|{issue.title}>")
for issue in open_issues:
    print(issue)
    if issue.created_at.strftime("%Y-%m-%d") == today.strftime("%Y-%m-%d"):
        today_open_issues.append(f"[{issue.title}]({issue.html_url})")
        today_open_mrkdwn_issues.append(f"<{issue.html_url}|{issue.title}>")
    if issue.milestone is not None:
        if issue.milestone.due_on < tommorrow:
            due_to_issues.append(f"[{issue.title}]({issue.html_url})")
            due_to_mrkdwn_issues.append(f"<{issue.html_url}|{issue.title}>")
template_text = string.Template(TEMPLATE)
result = template_text.safe_substitute(
    {"date": today.strftime("%Y-%m-%d"),
     "today_closed_issues_string": "- " + "\n- ".join(today_closed_issues),
     "today_open_issues_string": "- " + "\n- ".join(today_open_issues),
     "tommorrow_due_to_issues_string": "- " + "\n- ".join(due_to_issues),
     }
)

template_slack_text = string.Template(TEMPLATE_SLACK)
result_slack = template_slack_text.safe_substitute(
    {"date": today.strftime("%Y-%m-%d"),
     "today_closed_issues_mrkdwn_string": "* " + "\n* ".join(today_closed_mrkdwn_issues),
     "today_open_issues__mrkdwn_string": "* " + "\n* ".join(today_open_mrkdwn_issues),
     "tommorrow_due_to_issues__mrkdwn_string": "* " + "\n* ".join(due_to_mrkdwn_issues),
     }
)

os.makedirs(f"daily_report/{today.strftime('%Y')}/{today.strftime('%m')}", exist_ok=True)
with open(f"daily_report/{today.strftime('%Y')}/{today.strftime('%m')}/{today.strftime('%d')}.md", "w") as f:
    f.write(result)

payload = {"text": result_slack}
requests.post(SLACK_WEB_HOOK, json.dumps(payload))
```

大したことをやっていないスクリプトなのですが、GitHubのMarkdownと[SlackのMarkdown](https://slack.com/intl/ja-jp/help/articles/202288908-%E3%83%A1%E3%83%83%E3%82%BB%E3%83%BC%E3%82%B8%E3%81%AE%E6%9B%B8%E5%BC%8F%E8%A8%AD%E5%AE%9A)が異なっており、妙な分岐を入れる必要がありました。

GitHubにpushすることでMarkdownとして日報を管理します。

![img](https://i.imgur.com/KXALJYW.png)

また、Slackへのリマインダーも実施します。

![img](https://i.imgur.com/4petOz9.png)

これで日報&リマインダー機能もできました。

## まとめ

![img](https://i.imgur.com/LnpjYNN.png)

これで快適にToDoを記載できるようになったのですが、肝心なToDoがあまりないのでこの仕組みをいつまで使い続けるのか不安になってきました。
