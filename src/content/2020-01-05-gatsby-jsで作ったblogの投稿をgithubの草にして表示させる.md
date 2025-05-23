---
slug: 2020/1/5/github-heatmap-blog
title: Gatsby.jsで作ったBlogの投稿をGitHubの草にして表示させる
date: 2020-01-05T07:44:06.927Z
description: Blogへ投稿すると、草を生やすことができるようにしました。
tags:
  - JavaScript
  - Gatsby.js
  - React
  - React Calendar Heatmap
headerImage: 'https://i.imgur.com/o6tnakg.png'
templateKey: blog-post
---
自分のブログのRecent post欄に、面白い工夫をしてみたいと思い実装してみました。

## Table of Contents

```toc

```

## 中国エンジニアの技術ブログがかっこいい！

と思った**正月**でした。多くのエンジニアが使っていたBlog技術要素が[**Hexo**](https://hexo.io/)だったのですが、そのなかでもひときわかっこいいデザインのThemeを使っている人が多数おりました。

そのThemeこそ、[hexo-theme-matery](https://github.com/blinkfox/hexo-theme-matery)です。

Theme Demoページは[こちら](https://blinkfox.github.io/)

Themeのなかで特にかっこいいなぁと思ったのは、Blogの投稿日、投稿数に応じてGitHubの草(Heatmap)を表現するところです。

![img](https://i.imgur.com/X2ehG18.png)

~~Demoページは全然草生えてませんが・・・。~~

自分のブログにも導入したい!!ということで早速作ってみることにします。

## ReactでGitHub Heat mapを作る

このブログは**Gatsby.js**というフレームワークで実装しているので要素技術は**React**なのでReactでGitHubのHeat mapを作る方法を探していきます。

見つけました。

[Kevin Qi](kevinqi.com)さんが[React Calendar Heatmap](https://github.com/kevinsqi/react-calendar-heatmap)というものを提供してくれていました。

さっそく使っていきます。

### Component作成

まずは何はともあれインストール。

```bash
npm install --save react-calendar-heatmap
```

使い方はとっても簡単で[react-calendar-heatmap#usage](https://github.com/kevinsqi/react-calendar-heatmap#usage)に載っているとおり、

```javascript
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

<CalendarHeatmap
  startDate={new Date('2016-01-01')}
  endDate={new Date('2016-04-01')}
  values={[
    { date: '2016-01-01', count: 12 },
    { date: '2016-01-22', count: 122 },
    { date: '2016-01-30', count: 38 },
    // ...and so on
  ]}
/>
```

という具合で、propsにstartDate, endDate, valuesを指定すれば最低限OK。

今回はValuesをGatsby.jsのGraphQLに対応させたいので、**React Component**を作っていきます。

Componentでは、**StaticQuery**を使って、全記事の日付を取得し、日付ごとにカウントを取りカウントをreact-calendar-heatmapに渡してあげることまでが役割とします。

サイドバーで使う場合、1年分の長さのheatmapだと長すぎるのでpropsで長さを直近から5ヶ月までと1年分と切り替えられるようにしたいと思います。

ということで実装したものが下記です。

```javascript
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import React from "react";
import ReactTooltip from 'react-tooltip';
import {graphql, StaticQuery} from "gatsby";

import {gotoPage} from '../../api/url';

const getLastYearDate = () => {
    const today = new Date();
    today.setFullYear( today.getFullYear() - 1 );
    return today
};

const getLast5MonthDate = () => {
    const today = new Date();
    today.setMonth( today.getMonth() - 5 );
    return today
};

const getSlug = (value) => {
    if (!value || !value.date) {
        return null;
    }

    const {slug} = value;
    gotoPage(slug);
};

const getTooltipDataAttrs = (value) => {
    if (!value || !value.date) {
        return null;
    }

    if (value.count === 1) {
        return {
            'data-tip': `${value.date} has ${value.count} post`,
        };
    } else {
        return {
            'data-tip': `${value.date} has ${value.count} posts`,
        };
    }

};

const Heatmap = ({data, minify=false}) => {
    const {allMarkdownRemark} = data;
    const mapping = {};
    const slugs = {};
    const values = [];

    let startDate;

    if (minify) {
        startDate = getLast5MonthDate()
    } else {
        startDate = getLastYearDate()
    }

    allMarkdownRemark.edges.forEach(({node}) => {
        const {date, slug} = node.frontmatter;
        if (mapping[date]) {
            mapping[date] += 1;
        } else {
            mapping[date] = 1;
        }
        slugs[date] = slug;
    });

    Object.keys(mapping).forEach( (date) => {
        values.push({date: date, count: mapping[date], slug: slugs[date]})
    });

    return (
      <>
       <CalendarHeatmap
        startDate={startDate}
        endDate={new Date()}
        values={values}
        showMonthLabels={true}
        showWeekdayLabels={true}
        onClick={getSlug}
        tooltipDataAttrs={getTooltipDataAttrs}
      />
      <ReactTooltip />
    </>)
};

export default props => (
    <StaticQuery
        query={graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "YYYY-MM-DD")
              slug
              title
            }
          }
        }
      }
    }
    `}
        render={data => <Heatmap data={data} {...props} />}
    />
)
```

要素ごとにお話すると、Gatsby.js templateでGraphQLを実行するわけではないので、GraphQLは**StaticQuery**を使わないといけません。下記のようなクエリにすれば全記事の日付が取得できます。

```graphql
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "YYYY-MM-DD")
              slug
              title
            }
          }
        }
      }
    }
    `}
```

簡単ですね。さらにGraphQLのデータを渡し、renderしたものを別componentに渡すために、

```javascript
export default props => (
    <StaticQuery
        query={graphql`
    query {
      allMarkdownRemark {
        edges {
          node {
            frontmatter {
              date(formatString: "YYYY-MM-DD")
              slug
              title
            }
          }
        }
      }
    }
    `}
        render={data => <Heatmap data={data} {...props} />}
    />
)
```

としてやっているのです。

肝心なreact-carender-heatmap部分はL47〜ですが、基本的にはGraphQLから取得した日付のカウントを取りつつvaluesに渡しているだけです。

heatmapクリック時には該当記事へジャンプする機能と**Tooltip**を表示させる機能を実現するためにCalendarHeatmapにonClickとtooltipDataAttrs propsを設定し、関数を設定してあげています。 

また、tooltip利用には[ReactTooltip](https://www.npmjs.com/package/react-tooltip)を用意してあげる必要があります。

Reactではcomponentが複数要素を返すことが基本的にはできないので、**React.fragment**を使ってCalendarHeatmapとReactTooltipの2要素をreturnしてあげます。

<> </>はfragmentの短縮形です。

```javascript

    return (
      <>
       <CalendarHeatmap
        startDate={startDate}
        endDate={new Date()}
        values={values}
        showMonthLabels={true}
        showWeekdayLabels={true}
        onClick={getSlug}
        tooltipDataAttrs={getTooltipDataAttrs}
      />
      <ReactTooltip />
    </>)
```

またComponentのpropsを使ってstartDateはサイドバー用は5ヶ月前、ページに埋め込む用は1年と変更できるようにしています。

残念ながらゴミコードです。

```javascript
    let startDate;

    if (minify) {
        startDate = getLast5MonthDate()
    } else {
        startDate = getLastYearDate()
    }
```

## 導入してみた

作ったComponentをサイドバーに導入してみました。

![img](https://i.imgur.com/pxHQuYf.png)

お、なかなかいい感じ。

## 結論

今年もかっこいいWeb勉強していきたいですね。よろしくお願いします。













