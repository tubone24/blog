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
腰が痛い

## Table of Contents

```toc

```

## AWSのステータス確認難しいよね

AWSを使ったことのある人ならばわかると思いますが、公式がAWSの障害情報を掲載する[AWS Service Health Dashboard](https://status.aws.amazon.com/)があまり使いやすくないです。

![img](https://i.imgur.com/XghDulZ.png)

それぞれのリージョンの障害がRSSで配信される形式になっているのですが、わざわざRSSを登録するのもめんどくさいし、Slackとかの連携に乗っけるのもそれはそれで便利なのですが、そもそもSlackを見ていないほかの人でも障害情報を共有したいです。

実は、AWS Service Health Dashboardの情報はJSONで取得することができます。

<https://status.aws.amazon.com/data.json>

こちらのJSONを活用して勉強がてら使いやすいダッシュボードを作っていきます。

## クビになるぞ！

最近、これといった新しい技術に触れておらず、このままだとクビになりそうなので、そろそろ重い腰を上げてNext.jsを勉強することにしました。

また、Next.jsを使う場合はVercelが便利だよーとのことですので、こちらも使っていきます。

## Next.js

Next.jsでは/api配下に格納したコードについては、サーバーサイドとして振る舞います。

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

あと、

## Recoil

Recoilとは
