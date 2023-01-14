---
slug: 2021/01/11/vercel-next
title: Next.jsとVercelとRecoilとMaterial Tableを使ってAWSのステータスダッシュボードを作ってみた話
date: 2021-01-11T13:20:51.060Z
description: Next.jsとVercelとRecoilとMaterial Tableを使ってAWSのステータスダッシュボードを作ってみた話です。
tags:
  - JavaScript
  - Next.js
  - Vercel
  - Recoil
headerImage: https://i.imgur.com/XblRysI.png
templateKey: blog-post
---
腰が痛い.

## Table of Contents

```toc

```

## AWSのステータス確認難しいよね

AWSを使ったことのある人ならばわかると思いますが、公式がAWSの障害情報を掲載する[AWS Service Health Dashboard](https://status.aws.amazon.com/)があまり使いやすくないです。

![img](https://i.imgur.com/XghDulZ.png)

それぞれのリージョンの障害がRSSで配信される形式になっているのですが、わざわざRSSを登録するのもめんどくさい。Slackとかの連携に乗っけるのもそれはそれで便利なのですが、そもそもSlackを見ていないほかの人でも障害情報を共有したいです。

実は、AWS Service Health Dashboardの情報はJSONで取得できます。

<https://status.aws.amazon.com/data.json>

こちらのJSONを活用して勉強がてら使いやすいダッシュボードを作っていきます。

## クビになるぞ！

最近、これといった新しい技術に触れておらず、このままだとクビになりそうなので、そろそろ重い腰を上げてNext.jsを勉強することにしました。

また、Next.jsを使う場合はVercelが便利だよーとのことですので、こちらも使っていきます。

## Next.js

Next.jsではpages/api配下に格納したコードについては、サーバーサイドとして振る舞います。

クライアントから直接status情報がかかれたJSONを読みとってもよかったのですが、HTMLの面倒なサニタイジング処理やら、値の補完など面倒なことはサーバーサイドに持ってこようということで、
statusJSONを取得して、フロントに返却するサーバーコードを書いていきます。

次のようなコードになりました。

```typescript
import { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export interface AwsStatusResp {
  archive: AwsStatusArchive[]
}

export interface AwsStatusArchive {
  service_name: string
  summary: string
  date: string
  status: string
  details: string
  description: string
  service: string
}

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  axios
    .get<AwsStatusResp>('https://status.aws.amazon.com/data.json')
    .then((resp) => {
      const handlerResp = resp.data.archive.map((x) => ({
        // eslint-disable-next-line @typescript-eslint/camelcase
        service_name: x.service_name,
        summary: x.summary,
        region: x.service.includes('management-console')
          ? 'global'
          : x.service.split('-').slice(1).join('-') === ''
          ? 'global'
          : x.service.split('-').slice(1).join('-'),
        date: x.date,
        status: x.status,
        details: x.details,
        service: x.service.includes('management-console')
          ? 'management-console'
          : x.service.split('-')[0],
        description: x.description
          .replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '')
          .replace(/&nbsp;/g, '\n'),
      }))
      res.statusCode = 200
      // eslint-disable-next-line no-console
      console.log(handlerResp)
      res.json(handlerResp)
    })
    .catch((error) => {
      console.error(error.response)
      res.statusCode = error.response.status || 500
      res.statusMessage = error.response.statusText || 'InternalServerError'
      res.json({ error: error.response.statusText || 'InternalServerError' })
    })
}

export default handler
```

注意点として、必ずハンドラーはexport defaultを指定してあげないこと以外はいたって直感的なコードとなっております。

Vercelに載っけるとわかるのですが、こちらのコード、Lambdaにデプロイされることになります。たしかに見覚えある感じですね。

また、Next.jsと関係ないのですが、axiosのレスポンスに型がつけられるって知ってましたか？

```typescript
export interface AwsStatusResp {
  archive: AwsStatusArchive[]
}

export interface AwsStatusArchive {
  service_name: string
  summary: string
  date: string
  status: string
  details: string
  description: string
  service: string
}

  axios
    .get<AwsStatusResp>('https://status.aws.amazon.com/data.json')
    .then((resp) => { ..........
```

## Material Table

Material UI準拠のテーブルとして、Material Tableなるものがありましたので今回採用することにしました。

```typescript
import MaterialTable from 'material-table'
import tableIcons from '../components/tableIcons'

<MaterialTable
          icons={tableIcons}
          columns={[
            { title: 'Service Name', field: 'service_name' },
            { title: 'Service', field: 'service', width: 10 },
            { title: 'Region', field: 'region', lookup: regionNameMapping },
            { title: 'Summary', field: 'summary' },
            {
              title: 'Date (' + dayjs.tz.guess() + ')',
              field: 'date',
              render: (rowData) => (
                <div>
                  {dayjs
                    .unix(Number(rowData.date))
                    .format('YYYY-MM-DDTHH:mm:ssZ[Z]')}
                </div>
              ),
              defaultSort: 'desc',
              type: 'string',
            },
            {
              title: 'Status',
              field: 'status',
              lookup: statusMapping,
            },
          ]}
          data={aws}
          detailPanel={[
            {
              tooltip: 'Details',
              render: (rowData) => {
                return (
                  <>
                    <div className="title">{rowData.summary}</div>
                    <div className="description">
                      {dayjs
                        .unix(Number(rowData.date))
                        .format('YYYY-MM-DDTHH:mm:ss')}{' '}
                      {rowData.service_name}
                    </div>
                    <div className="code">{rowData.description}</div>
                  </>
                )
              },
            },
          ]}
          options={{
            filtering: true,
            grouping: true,
            exportButton: true,
            exportFileName: 'exported',
            headerStyle: {
              backgroundColor: '#e77f2f',
              color: '#FFF',
            },
          }}
          isLoading={loading}
          actions={[
            {
              // Issue: https://github.com/mbrn/material-table/issues/51
              //@ts-ignore
              icon: tableIcons.BarChartIcon,
              tooltip: 'Show Bar Chart',
              isFreeAction: true,
              disabled: loading,
              onClick: async () => {
                setShowGraph(!showG)
              },
            },
            {
              // Issue: https://github.com/mbrn/material-table/issues/51
              //@ts-ignore
              icon: tableIcons.Refresh,
              tooltip: 'Refresh Data',
              isFreeAction: true,
              disabled: loading,
              onClick: async () => {
                setLoading(true)
                await getAwsStatus()
              },
            },
          ]}
          title={
            <div className="header">
              <img src="/awslogo.png" />
              <a href="https://aws-health-dashboard.vercel.app/">
                AWS Health Dashboard
              </a>
            </div>
          }
        />
```

使い方もシンプルかつ比較的高機能でいい感じです。

いい感じですが後述するRecoilとの相性問題とDatetimeの扱いが微妙なのがツラミでした。

本当はDate型を渡してあげるとSearchableの際、カレンダーでの絞り込みができるのかなと思ったのですが、こちらがうまくいきませんでした。

あと、微妙に型もおかしく例えば、actionsはactionを複数指定できるはずですが、型チェックで怒られるので、仕方なくts-ignoreしてます。

あなたが直せばいいじゃんアゼルバイジャンって言われそうですが、めんどくさくなってしまいIssueだけあげてしまいました。申し訳ねぇ...。

<https://github.com/mbrn/material-table/issues/2762>


## Recoil

RecoilとはReactの新しい状態管理ライブラリで、いわゆるReact HooksでGlobal Storeを作ろうというものです。

基本的な使い方はまず、storeとしてatomという共有ステートを作成します。

atomのkeyはプロジェクトで一意にする必要がありますが、今回はそこまで大規模なプロジェクトではないのでawsとかいう適当な名をつけてます。

storeなので、store/aws.tsとして格納します。

```typescript
import { atom } from 'recoil'

const awsState = atom({
  key: 'aws',
  default: [
    {
      // eslint-disable-next-line @typescript-eslint/camelcase
      service_name: 'Auto Scaling (N. Virginia)',
      summary: '[RESOLVED] Example Error',
      date: '1542849575',
      status: '1',
      details: '',
      description:
        'The issue has been resolved and the service is operating normally.',
      service: 'autoscaling',
      region: 'us-east-1',
    },
  ],
  dangerouslyAllowMutability: true,
})

export default awsState
```

次にステートを共有したいコンポーネントのルートにRecoilRootを設置します。

Next.jsの場合、_app.tsxが全ページのルートにあたるのでここに置けばいいですね。

```typescript
import { AppProps } from 'next/app'
import Head from 'next/head'
import { RecoilRoot } from 'recoil'
import React from 'react'

const App = ({ Component, pageProps }: AppProps) => (
  <>
    <RecoilRoot>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>AWS Health Dashboard</title>
      </Head>
      <Component {...pageProps} />
    </RecoilRoot>
  </>
)

export default App
```

そして、利用するときはuseRecoilStateをReact Hooksのように利用するだけです。簡単ですね。

```typescript
import React, { useState, useEffect } from 'react'
import { useRecoilState } from 'recoil'
import awsState from '../store/aws'
import showGraph from '../store/showGraph'
import axios from 'axios'
import dayjs from 'dayjs'

dayjs.extend(utc)
dayjs.extend(timezone)

const Alert = (props: AlertProps) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />
}

export const Table = (): JSX.Element => {
  // 20200112: dangerouslyAllowMutabilityでできた
  const [aws, setAws] = useRecoilState(awsState)
  const [showG, setShowGraph] = useRecoilState(showGraph)
  const [loading, setLoading] = useState(true)
  const [slackBarOpen, setSlackBarOpen] = React.useState(false)
  const [apiErrorMsg, setApiErrorMsg] = React.useState('')
  useEffect(() => {
    getAwsStatus()
    setLoading(false)
  }, [])
  const getAwsStatus = () => {
    axios
      .get('/api/aws')
      .then((resp) => {
        setAws(resp.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error(error.response)
        setSlackBarOpen(true)
        setApiErrorMsg(error.response.statusText || 'Error')
        setAws([])
        setLoading(false)
      })
  }
```

stateの読み込みはgetterから、書き込みはsetterから行ないます。

React Hooksに慣れていれば簡単ですね。


## 思わぬ落とし穴 Material TablesでRecoilが使えない

Recoilのatomは基本値の書き換えはset stateを使うことが求められます。ですが、material tablesはテーブルを作るときにdataにIDの書き込みが発生するようでそのままだと怒られてしまいます。

```
Cannot add property tableData, object is not extensible
```

これの解決策はRecoilにstateへの直接的な書き換えを許可することです。こちらはatomのoptionでdangerouslyAllowMutabilityを有効にすることで解決できます。



```typescript
import { atom } from 'recoil'

const awsState = atom({
  key: 'aws',
  default: [
    {

    },
  ],
  dangerouslyAllowMutability: true,
})
```


これがわかるのに半日くらい使っちまいました。

## Chart.js

さて、無事にRecoilでstateの共有ができたのでせっかくなので別コンポーネントも作ります。

意味があるかどうか不明ですが、AWSの障害発生状況を可視化してみようと思います。

ということで、採用したのがChart.js。

次のようにデータを渡すだけできれいめなグラフを書いてくれます。


```typescript
import { useRecoilValue } from 'recoil'
import awsState from '../store/aws'
import React from 'react'
import {
  regionNameMapping,
} from './const'
import BarGraph from './barGraph'

export const AlertPerRegion = (): JSX.Element => {

  const aws = useRecoilValue(awsState)
  const labels = Array.from(
    new Set(aws.map((data) => regionNameMapping[data.region]))
  )
  const data = []
  for (const r of labels) {
    data.push(
      aws
        .map((data) => regionNameMapping[data.region])
        .reduce((total, x) => {
          return x === r ? total + 1 : total
        }, 0)
    )
  }
  return (
    <div className="container">
      <BarGraph labels={labels} data={data} title="Alert per region" />
    </div>
  )
}
```



どうでもいい実装ですが、各グラフを一覧で見れる画面を用意し、実際のグラフは遷移先で表示するようにしてます。



![img](https://i.imgur.com/tfnpq4w.png)

![img](https://i.imgur.com/hpJ70fR.png)



## Vercelにデプロイ

さて、実装ができたので後はVercelにあげるだけです。

もうここはほとんど書くことがないのですが、Next.jsで作ったアプリケーションはVercelでレポジトリと使っているフレームワークを設定するだけで簡単にデプロイできてしまいます。

これはすごい。


## 完成

ということで、AWS Health Dashboardが完成しました。

アクセスすると、Next.jsのapiをコールし、AWSのstatusを取得加工したものを返却します。

フロントでは受け取ったデータをRecoilのatomに格納しつつ、material tableで表として描画します。

また右上のグラフボタンを押すことで色々な切り口の可視化を行なうことができます。

<https://aws-health-dashboard.vercel.app/>

できれば使う場面にならないことを祈りつつ、ご活用いただければとおもいます。


## まとめ

食わず嫌いでやらなかったNext.js+Recoilをやってみましたが、楽しく実装ができました。


## 2021/02/20追記

2021/02/19～20にかけて起きた[AWS EC2障害](https://status.aws.amazon.com/rss/ec2-ap-northeast-1.rss)ですが、本ダッシュボードでは更新がされませんでした。

どうやら、data.jsonはRSSとは違い、同期的に更新されないようです。

大変ご迷惑をおかけしました。改めて、改修しRSS更新にも対応できるように頑張ります。








