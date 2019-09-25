---
slug: 2019/09/24/json-resume
title: JSON Resume + API With GitHubを使って、さくっと職務経歴書チックなもののAPIなど作ってみる
date: 2019-09-24T10:41:02.386Z
description: JSON Resume + API With GitHubを使って、さくっと職務経歴書チックなもののAPIなど作ってみます
tags:
  - JSON Resume
  - GitHub Pages
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# JSON Resumeを使ってさくさくっとそれっぽい職務経歴書を作ってみます

[JSON resume](https://jsonresume.org/)というものがあるようです。

今回はこちらを使って職務経歴を返すAPIを[API with GitHub](https://apiwithgithub.com/)で作りつつ、Resumeを作りたいと思います。

## JSON Resumeとは？
JSON Resumeとは、JSON形式で職務経歴を記載するオープンソースのスキーマー定義です。

OSSプロジェクトですので、[こちら](https://github.com/jsonresume/resume-schema)からIssueやPRを出すことができます。足りないスキーマがあれば積極的にコントリビュートしてみては？

今回は[APIs With GitHubとJSON-Resumeでサクッとプロフィールを返すAPIをつくる](https://qiita.com/kai_kou/items/779bdcdfc7ea5def3dfc)を参考にまずJSON ResumeのAPIを作ろうと思います。

## API With GitHubの設定

API With GitHubはGitHubのJSONファイルの編集画面と、rawgithubusercontent.comを使ってJSONファイルをHTTPで返却するLINKを作成するお手軽Webサービスです。

固定値のJSONを返すだけならこいつでサクサク作っちゃえばええやん。さっそく使っていきます。

[API With GitHub](https://apiwithgithub.com/)にアクセスするとGitHubアカウントとの連携を求められるので同意してしまいます。

そうすると、Repositoryを作る画面に進みますので迷わず新しいレポジトリを作ります。

![Img](https://i.imgur.com/6Lti5I8.png)

あとは普通にレポジトリを新規作成する手順で作っていきます。

![Img](https://i.imgur.com/d4nmRXZ.png)

Make APIボタンを押すと・・・。

![Img](https://i.imgur.com/W3Paou3.png)

新規JSONファイルを作る画面に進みます。

![Img](https://i.imgur.com/vzhzqiI.png)

JSON ResumeのJSONは `resume.json`がデフォルトなので `resume.json`で作ります。

![Img](https://i.imgur.com/ay4H67M.png)

resume.jsonを作ったばかりだと空のオブジェクトしかないのでJSONを作っていきます。

項目追加はAppend, Insertがあり、ObjectとArrayと値(String, Number, Bool)を直感的に入力できます。さてこれでJSON Resumeを作る準備はできました。

## JSON Resumeでがつがつ書いていく

JSON Resumeの公式Docにもスキーマが載っていますが、完全なスキーマはGitHubにあるExamplesを見たほうがよいです。

こんな感じのお手本

```json
{
  "basics": {
    "name": "Richard Hendriks",
    "label": "Programmer",
    "image": "",
    "email": "richard.hendriks@mail.com",
    "phone": "(912) 555-4321",
    "url": "http://richardhendricks.example.com",
    "summary": "Richard hails from Tulsa. He has earned degrees from the University of Oklahoma and Stanford. (Go Sooners and Cardinal!) Before starting Pied Piper, he worked for Hooli as a part time software developer. While his work focuses on applied information theory, mostly optimizing lossless compression schema of both the length-limited and adaptive variants, his non-work interests range widely, everything from quantum computing to chaos theory. He could tell you about it, but THAT would NOT be a “length-limited” conversation!",
    "location": {
      "address": "2712 Broadway St",
      "postalCode": "CA 94115",
      "city": "San Francisco",
      "countryCode": "US",
      "region": "California"
    },
    "profiles": [
      {
        "network": "Twitter",
        "username": "neutralthoughts",
        "url": ""
      },
      {
        "network": "SoundCloud",
        "username": "dandymusicnl",
        "url": "https://soundcloud.example.com/dandymusicnl"
      }
    ]
  },
  "work": [
    {
      "name": "Pied Piper",
      "location": "Palo Alto, CA",
      "description": "Awesome compression company",
      "position": "CEO/President",
      "url": "http://piedpiper.example.com",
      "startDate": "2013-12-01",
      "endDate": "2014-12-01",
      "summary": "Pied Piper is a multi-platform technology based on a proprietary universal compression algorithm that has consistently fielded high Weisman Scores™ that are not merely competitive, but approach the theoretical limit of lossless compression.",
      "highlights": [
        "Build an algorithm for artist to detect if their music was violating copy right infringement laws",
        "Successfully won Techcrunch Disrupt",
        "Optimized an algorithm that holds the current world record for Weisman Scores"
      ]
    }
  ],
  "volunteer": [
    {
      "organization": "CoderDojo",
      "position": "Teacher",
      "url": "http://coderdojo.example.com/",
      "startDate": "2012-01-01",
      "endDate": "2013-01-01",
      "summary": "Global movement of free coding clubs for young people.",
      "highlights": [
        "Awarded 'Teacher of the Month'"
      ]
    }
  ],
  "education": [
    {
      "institution": "University of Oklahoma",
      "area": "Information Technology",
      "studyType": "Bachelor",
      "startDate": "2011-06-01",
      "endDate": "2014-01-01",
      "gpa": "4.0",
      "courses": [
        "DB1101 - Basic SQL",
        "CS2011 - Java Introduction"
      ]
    }
  ],
  "awards": [
    {
      "title": "Digital Compression Pioneer Award",
      "date": "2014-11-01",
      "awarder": "Techcrunch",
      "summary": "There is no spoon."
    }
  ],
  "publications": [
    {
      "name": "Video compression for 3d media",
      "publisher": "Hooli",
      "releaseDate": "2014-10-01",
      "url": "http://en.wikipedia.org/wiki/Silicon_Valley_(TV_series)",
      "summary": "Innovative middle-out compression algorithm that changes the way we store data."
    }
  ],
  "skills": [
    {
      "name": "Web Development",
      "level": "Master",
      "keywords": [
        "HTML",
        "CSS",
        "Javascript"
      ]
    },
    {
      "name": "Compression",
      "level": "Master",
      "keywords": [
        "Mpeg",
        "MP4",
        "GIF"
      ]
    }
  ],
  "languages": [
    {
      "language": "English",
      "fluency": "Native speaker"
    }
  ],
  "interests": [
    {
      "name": "Wildlife",
      "keywords": [
        "Ferrets",
        "Unicorns"
      ]
    }
  ],
  "references": [
    {
      "name": "Erlich Bachman",
      "reference": "It is my pleasure to recommend Richard, his performance working as a consultant for Main St. Company proved that he will be a valuable addition to any company."
    }
  ],
  "projects": [
    {
      "name": "Miss Direction",
      "description": "A mapping engine that misguides you",
      "highlights": [ 
        "Won award at AIHacks 2016",
        "Built by all women team of newbie programmers",
        "Using modern technologies such as GoogleMaps, Chrome Extension and Javascript"
      ],
      "keywords": [
        "GoogleMaps", "Chrome Extension", "Javascript"
      ],
      "startDate": "2016-08-24",
      "endDate": "2016-08-24", 
      "url": "missdirection.example.com",
      "roles": [ 
        "Team lead", "Designer"
      ],
      "entity": "Smoogle",
      "type": "application"
    }
  ],
  "meta": {
    "canonical": "https://raw.githubusercontent.com/jsonresume/resume-schema/master/resume.json",
    "version": "v1.0.0",
    "lastModified": "2017-12-24T15:53:00"
  }
}
```
