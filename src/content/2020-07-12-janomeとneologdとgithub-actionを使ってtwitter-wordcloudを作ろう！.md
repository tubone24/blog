---
slug: 2020/07/13/wordcloud
title: JanomeとNeologdとGitHub Actionを使ってTwitter WordCloudを作ろう！
date: 2020-07-12T16:36:12.777Z
description: JanomeとNeologdとGitHub Actionを使って定期更新Twitter WordCloudを作ろう！
tags:
  - GitHub
  - WordCloud
  - Neologd
  - Janome
headerImage: https://i.imgur.com/XZHKPXO.png
templateKey: blog-post
---
GitHub Actionのcron機能を使って定期更新するTwitter WordCloudを作ってみたお話です。

## Table of Contents

```toc

```

## WordCloudとは？

WordCloudとはタグクラウドとも呼ばれており、出現単語を雲のように集めて可視化する視覚的記述です。単語の頻度に応じて単語の大きさを大きくするのが一般的です。

![img](https://i.imgur.com/laOMoYk.png)

斬新なワードクラウドはもはやアートだと思います。

## PythonでWordCloudを作るには？

PythonでWordCloudを作るには[WordCloud](https://amueller.github.io/word_cloud/index.html)というライブラリが便利です。

使い方はかんたんで、

```python
words = self.__word_count()
text = " ".join(words)
if mask == "rect":
    mask = None
elif mask:
    mask = np.array(Image.open(mask))
else:
    x, y = np.ogrid[:450, :900]
    mask = ((x - 225) ** 2 / 5 ** 2) + ((y - 450) ** 2 / 10 ** 2) > 40 ** 2
    mask = 255 * mask.astype(int)

if alpha:
    wordcloud = WordCloud(background_color=None,
                      colormap="viridis",
                      font_path=FONT_PATH,
                      mode="RGBA",
                      mask=mask
                      ).generate(text)
    wordcloud.to_file(filename)
else:
    wordcloud = WordCloud(background_color="white",
                      colormap="viridis",
                      font_path=FONT_PATH,
                      mask=mask
                      ).generate(text)
    wordcloud.to_file(filename)
```