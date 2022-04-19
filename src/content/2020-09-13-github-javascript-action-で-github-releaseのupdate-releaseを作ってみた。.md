---
slug: 2020/08/14/github-action
title: GitHub JavaScript Action で GitHub ReleaseのUpdate Releaseを作ってみた。
date: 2020-09-13T12:41:20.699Z
description: GitHub JavaScript Action で GitHub ReleaseのUpdate Releaseを作ってみた。.
tags:
  - GitHub
  - GitHub Actions
headerImage: https://i.imgur.com/kXVhSw7.png
templateKey: blog-post
---
ちょうどいい、**GitHub Actions**がなかったので作ってみました。

## Table of Contents

```toc

```

## なんで？

GitHub Actionsで**uses**を使ったことはありますか？

```yaml
name: Generate Word Cloud

on:
  push:
    branches:
      - master
  schedule:
    - cron: "0 5 * * *"

jobs:
  GenerateWordCloud:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python 3.x
        uses: actions/setup-python@v1
 # ここ
        with:
          python-version: "3.7"
      - uses: actions/cache@v1
 # ここ
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
          restore-keys: |
            ${{ runner.os }}-pip-
```

GitHub Actionsを使うときには何かと便利なやつですが、公式には**actions**というレポジトリにいます。

<https://github.com/actions>

今回は、[
post_twitter_on_work](https://github.com/tubone24/post_twitter_on_work)の開発のなかで、**GitHub ReleasesにGitHub ActionsでBuildしたArtifactsをアップデートしたい**欲求が出てきました。

通常、GitHub ReleasesをGitHub Actionsで使うには、[actions
/
create-release](https://github.com/actions/create-release)を使うことが多いです。

こちらの使い方としては、

1. Git Tagを打ってPushする
2. Pushに反応して、actions
/
create-releaseが動く
3. 出来上がったReleasesに[actions/upload-release-asset](https://github.com/actions/upload-release-asset)でArtifactsを上げる

という感じの使い方になるかと思います。

が、しかし、[post_twitter_on_work](https://github.com/tubone24/post_twitter_on_work)では下記理由でそれができない（やりたくない）のでした。

- Git Tagうつのめんどくさい。
  - GitHub ReleasesからDraft ReleaseでTag打ちたい
- matrixで何度もJobが動く
  - 重複して、Create Releasesできない

## そこで、GitHub JavaScript Action

いいものがないなら作る。それしかないです。

GitHub Actionを作るには2種類の方法があります。

- [Dockerコンテナ](https://docs.github.com/ja/actions/creating-actions/about-actions#docker-container-actions)
- [JavaScript](https://docs.github.com/ja/actions/creating-actions/about-actions#javascript-actions)

Dockerコンテナで作る場合、GitHub ActionsのLinux上でコンテナを起動するので、**WindowsやMacのOSでは動きません**。また、いろんなことができる一方、コンテナが立ち上がるための**時間もかかり**ます。

JavaScriptでは、Node.js 12で動くJSコードを書くだけです。WindowsやMacのOS上でも問題なく動きます。JavaScriptに慣れていて、特定のライブラリや言語を使わないといけない状況でなければJavaScript一択だと思います。

JavaScript　Actionは、公式にテンプレートがありますので、かんたんに作ることができます。

<https://github.com/actions/javascript-action>

さらにTypeScript用のテンプレートもあります。嬉しいですね。

<https://github.com/actions/typescript-action>

今回はJavaScript Action(TypeScript)を使って開発していこうと思います。

## action.yml

GitHub Actionのメタデータとして、**action.yml**を作ります。

名前や説明のほかwithで定義するinputやoutputで使える変数や、ランタイムを定義できます。

inputやoutputは変数名の他、説明とrequiredを定義できます。


また、JavaScript Actionのランタイムはnode12一択です。

```
name: 'Update GitHub Release'
description: 'Update GitHub Release'
author: 'tubone24'
inputs:
  release_name:
    description: 'new release name, if not, take over before name'
    required: false
  body:
    description: 'new body text, if not, take over before text'
    required: false
  draft:
    description: 'new draft, if not, take over before draft'
    required: false
  prerelease:
    description: 'new prerelease, if not, take over prerelease'
    required: false
  is_append_body:
    description: 'If true, append body text, If false, overwrite body text, default is false'
    required: false
  body_path:
    description: 'Path to file with new body text.'
    required: false
outputs:
  id:
    description: 'The ID of the Release'
  html_url:
    description: 'The HTML url of the Release'
  upload_url:
    description: 'The upload url of the Release'
  name:
    description: 'The name of the Release'
  body:
    description: 'The body of the Release'
  published_at:
    description: 'The publish at of the Release'
  tag_name:
    description: 'The tag name of the Release'
runs:
  using: 'node12'
  main: 'dist/index.js'
branding:
  icon: 'tag'
  color: 'green'
```

## tscでビルドNccでバンドル

### tsc

TypeScriptを使って開発したことがある人なら一度は使ったことのある**tsc**。TypeScriptでGitHub Actionを作るにはtscでJavaScriptにビルドしてあげる必要があります。

まず、srcディレクトリのtsファイルをlibディレクリにビルドするので、tsconfig.jsonを書きましょう。

```javascript
{
  "compilerOptions": {
    "target": "es6",
    "module": "commonjs",
    "outDir": "./lib",
    "rootDir": "./src",
    "strict": false,
    "noImplicitAny": false,
    "esModuleInterop": true
  },
  "exclude": ["node_modules", "**/*.test.ts"]
}
```

rootディレクトリはsrc, outディレクトリはlibとなります。strictがfalseでごめんなさい。真面目にTypeScriptやってなくてすみません。

packages.jsonでもbuildはtscで設定してしまいます。

```javascript
{
  "scripts": {
    "build": "tsc"
  },
```

npm run buildすれば、libディレクトリにJavaScriptでビルドされるようになりました。

### ncc

JavaScriptにビルドされたjsファイルを[vercel/ncc](https://github.com/vercel/ncc)というバンドルツールを使って、1ファイルにバンドルしてaction.ymlで定義しているmainのjsファイルとして指定してあげる必要があります。

バンドルツールといえば**Webpack**が有名ですが、それこそVercelでSSRをfunctionに乗っかるJavaScriptをコンパイルするための軽量ツールです。GitHub Actionsでも使えるんですね。

packages.jsonで、

```javascript
  "scripts": {
    "build": "tsc",
    "package": "ncc build lib/main.js -o dist --source-map --license licenses.txt",
  },
```

npm run packageとすることで、さきほどtscでつくったJavaScriptをバンドルできます。

## ソース

### input/output

action.ymlで設定したinputやoutputは **@actions/core** のgetInput, setOutputでかんたんに使うことができます。

```typescript
import {getInput, setFailed, setOutput, info} from '@actions/core'

export const run = async (): Promise<void> => {

    const newReleaseName = getInput('release_name', {required: false})
    const newBody = getInput('body', {required: false})
    const newDraft = getInput('draft', {required: false})
    const newPrerelease = getInput('prerelease', {required: false})
    
    (中略...)
    
    setOutput('id', updatedReleaseId.toString())
    setOutput('html_url', updatedHtmlUrl)
    setOutput('upload_url', updatedUploadUrl)
    setOutput('name', updatedReleaseName)
    setOutput('body', updatedBody)
    setOutput('published_at', updatedPublishAt)
    setOutput('tag_name', tag)
  } catch (error) {
    setFailed(error.message)
  }
}

```

### update releaseは@actions/githubでかんたんに作れました

GitHub ActionでGitHubの機能を使うには便利な**@actions/github**を使えば一発でした。

GitHub Actionsから取れるSecretをenvで渡してあげるだけで使えます。便利。

レポジトリ情報や、Tag情報はcontextから取れます。

updateReleaseはgithub.repos.updateReleaseからできます。

```typescript
import {GitHub, context} from '@actions/github'

export const run = async (): Promise<void> => {
  try {
    const github = new GitHub(process.env.GITHUB_TOKEN)
    const {owner, repo} = context.repo
    const tagName = context.ref
    const tag = tagName.replace('refs/tags/', '')
    const getReleaseResponse = await github.repos.getReleaseByTag({
      owner,
      repo,
      tag
    })

    const {
      data: {
        id: oldReleaseId,
        html_url: oldHtmlUrl,
        upload_url: oldUploadUrl,
        body: oldBody,
        draft: oldDraft,
        name: oldName,
        prerelease: oldPrerelease
      }
    } = getReleaseResponse

    (中略...)

    const updateReleaseResponse = await github.repos.updateRelease({
      owner,
      release_id: oldReleaseId,
      repo,
      body: bodyFileContent || body,
      name,
      draft,
      prerelease
    })

    const {
      data: {
        id: updatedReleaseId,
        body: updatedBody,
        upload_url: updatedUploadUrl,
        html_url: updatedHtmlUrl,
        name: updatedReleaseName,
        published_at: updatedPublishAt
      }
    } = updateReleaseResponse
}
```

## デプロイ、マーケットに公開

デプロイはdistディレクトリを含めた形でpushすればいいだけです。

せっかくなので、distディレクトリのデプロイはGitHub Actionsでpushで動くワークフローでやってます。

```
name: Test and Build

on:
  push:
    branches:
      - '*'
    tags-ignore:
      - 'v*' # version Tag push use release workflow

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1
      - name: Install Dependencies
        run: npm install
      - name: Test and Build
        run: npm run all
      - name: Use Coveralls
        uses: coverallsapp/github-action@master
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
      - name: Setup git
        env:
          GITHUB_TOKEN: ${{ secrets.github_token }}
        run: |
          git config --local user.name GitHubActions
          git remote set-url origin https://${GITHUB_ACTOR}:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git
      - name: Git push, tag, upload assets
        run: |
          git checkout master
          git pull origin master
          git add -A
          DIFF=`git diff --cached --numstat | wc -l`
          if [ $DIFF -eq 0 ]; then
            exit 0
          fi
          git commit -am 'GitHub Actions commit' --allow-empty
          git push origin master
```

pushが終わったらGitHub ReleaseからReleaseを切ってあげることで、marketに公開する形になります。

![img](https://i.imgur.com/5715wbc.png)

うまく公開できると、こんな漢字で、usesで使えるActionとして公開されます。

![img](https://i.imgur.com/kXVhSw7.png)

## 結論

今回のソースコード一式は<https://github.com/tubone24/update_release>に

マーケットプレイスは<https://github.com/marketplace/actions/update-github-release>で公開してます。

GitHub Actionsが徐々に使われるようになってきましたのでビッグウェーブに乗りたいですね。

![img](https://i.imgur.com/rp2VEVO.jpg)
