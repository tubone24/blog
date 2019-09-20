---
slug: 2019/09/20/gitpitch
title: GitPitchを使ってMarkdownからプレゼンテーションを作ってBadgeをレポジトリに貼る
date: 2019-09-19T15:26:30.987Z
description: GitPitchを使ってMarkdownからプレゼンテーションを作ってBadgeをレポジトリに貼る
tags:
  - GitPitch
headerImage: 'https://i.imgur.com/CBPn3gW.png'
templateKey: blog-post
---
# とりあえずBadge増やしたい

[GitPitch](https://gitpitch.com/)を使って、[Ebook Homebrew](https://github.com/tubone24/ebook_homebrew)の紹介プレゼンを作りたいと思います。

## GitPitchとは？

GitPitchとは、GitHubのレポジトリにMarkdownで書いたファイルを置いておくだけで勝手にかっちょいいプレゼンが作れるサービスです。

```markdown
### テスト


これはテストスライド


---


### 2スライド


---


### 3スライド


---


### おわり
```

こんな感じでよくあるMarkdownの形式で書いてもちゃんとそれっぽいプレゼンが作れます。

またGitPitch専用の形式もあるので、そちらで書くことで色味やレイアウトも細かく設定できます。

[Documentはこちら](https://gitpitch.com/docs)

## 実際に作ってみた

まずは実際に作ってみたプレゼンを見てください！かっこいいでしょ。

<https://gitpitch.com/tubone24/ebook_homebrew/master?grs=github#/>


このプレゼンを作るためのMarkdownはこんな感じです。

```markdown
# Ebook Homebrew

---

## What is Ebook Homebrew?

Ebook homebrew is ...

---?color=#FF9000

### My Studies

This repo is my Python and more languages studies materials.

---

## ～2018

First commits, Ebook homebrew is changing file name 
to only digit name like 001.jpg and make e-book format files.

Command Line tool to make with `Python`.

---?color=#FF9000

### Features

@ul[list-square-bullets list-spaced-bullets](false)
- Rename file to only digit name like `001.jpg`
- Convert Image to PDF
- Make Zip
@ulend

Examples..

---

```bash
$ ebookhomebrew auto -s ./tests -d 3,4 -e jpg -f test.pdf
```

---

## Think about..

@img[clip-img clean-img span-20](assets/gitpitch/img/author.png)

@quote[I want to learn more!](tubone)

---?color=#FF9000

## Now..

---

### Evolution

- Awesome REST API with Open API |
- Read The Docs |
- Perfect Tests(UT/IT/E2E) |
- CI/CD |
- PyPI |
- Heroku |
- **More Client** |

---?color=#FF3F80

### Awesome REST API

[DEMO SITE](https://ebook-homebrew.herokuapp.com/#/)

![openapi](assets/gitpitch/img/openapi.png)

---?color=#B867C6

### Read The Docs

[Make Docs, Read the docs](https://ebook-homebrew.readthedocs.io/en/latest/)

![readthedoc](assets/gitpitch/img/readthedocs.png)

---

### Perfect Tests

Perfect Test with Pytest.

Awesome test! coverage 98%! Write UT and IT.

![coverage98](assets/gitpitch/img/coverage98.png)

---?color=#02A8F4

### CI/CD

Many Badges!!

![morebadges](assets/gitpitch/img/morebadges.png)

---

#### And AutoDeploy!

Auto Deploy using CI/CD

![autodeploy](assets/gitpitch/img/autodeploy.png)

---

### PyPI

Auto Deploy PyPI with CI/CD

`pip install ebook-homebrew`

![pypi](assets/gitpitch/img/pypi.png)

---?color=#B867C6

### Heroku

Heroku Deploy!

![heroku](assets/gitpitch/img/heroku.png)

---?color=#FF9000

### More Client

- Flutter (Android & iOS App) |
- Nim Client |
- Rust Client |
- Vue Client |

---

### Flutter

![Flutter](assets/gitpitch/img/flutter-android.gif)

---

### Vue Client

![vue](assets/gitpitch/img/vue.png)

---?image=assets/gitpitch/img/journey.jpg

@snap[silver-fox text-italics]
Ebook Homebrew's journey is not over yet..
@snapend
```
