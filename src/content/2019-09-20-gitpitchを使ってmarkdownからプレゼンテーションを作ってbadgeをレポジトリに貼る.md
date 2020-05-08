---
slug: 2019/09/20/gitpitch
title: GitPitchを使ってMarkdownからプレゼンテーションを作ってBadgeをレポジトリに貼る
date: 2019-09-19T15:26:30.987Z
description: GitPitchを使ってMarkdownからプレゼンテーションを作ってBadgeをレポジトリに貼る
tags:
  - GitPitch
  - GitHub
  - GitHub Badges
  - Azusa Colors
headerImage: 'https://i.imgur.com/CBPn3gW.png'
templateKey: blog-post
---
とりあえずBadge増やしたい

[GitPitch](https://gitpitch.com/)を使って、[Ebook Homebrew](https://github.com/tubone24/ebook_homebrew)の紹介プレゼンを作りたいと思います。

## Table of Contents

```toc

```

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

- 区切り線で次のスライドへ
- 見出しはMarkdownの#そのまま
- 画像やリンクもMarkdown形式そのまま

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

### デフォルトの設定

デフォルトの設定は`PITCHME.yaml`に書きます。

今回は[Azusa Colors](http://sanographix.github.io/azusa-colors/)を参考に配色を決めさせていただきました！

Azusaは結構LTとかで使わせてもらっています。

```yaml
title : "What is Ebook Homebrew"

theme: template

theme-background: [ "#FFF5E3" ]
theme-headline: [ "Raleway", "#01BBD4", "none" ]
theme-byline: [ "Raleway", "#464E70", "none" ]
theme-text: [ "Ubuntu", "#464E70", "none" ]
theme-links: [ "#5289F7", "#5254F7" ]
theme-code: [ "Source Code Pro" ]
theme-controls: [ "#464E70" ]
theme-margins: [ "0", "15px" ]

logo: assets/gitpitch/img/logo.png

highlight: monokai

slide-number: true

footnote: "© 2019 tubone-project24"


vertical-center: true

theme-override: assets/gitpitch/css/main.css

transition: concave
```

また、独自でCSSを当てることもできます。 `theme-override`で設定できます。

### 背景色を変える

背景色を変えるのは区切り線にパラメータをつけるだけです。

```
---?color=#B867C6
```

![Img](https://i.imgur.com/tJFkIB5.png)

### 背景に画像をつける

背景に画像をつけるのも背景色を変えるようなイメージで区切り線にパラメータを入れます。

```
---?image=assets/gitpitch/img/journey.jpg
```

![Img](https://i.imgur.com/UE6a3e1.png)

### フォント、色などを変える

こんな感じで `@snap` `@snapend` で囲った範囲が適用されます。 

```
@snap[silver-fox text-italics]
Ebook Homebrew's journey is not over yet..
@snapend
```

![Img](https://i.imgur.com/YlJxm1U.png)

### 引用文

引用文は`@quote[hoge](fuga)` 

hogeが引用文、fugaが人

```
## Think about..

@img[clip-img clean-img span-20](assets/gitpitch/img/author.png)

@quote[I want to learn more!](tubone)
```

![Img](https://i.imgur.com/v9iyA2y.png)

## 結論

そのままのMarkdownでもそれなりなプレゼンテーションができますが、カスタマイズも結構できます。LT用に作ってみようかなぁ・・。
