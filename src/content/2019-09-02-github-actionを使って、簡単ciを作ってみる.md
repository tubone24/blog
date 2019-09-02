---
slug: 2019-09-02-github-action
title: Github Actionを使って、簡単CIを作ってみる
date: 2019-09-02T11:33:53.870Z
description: 最近Github Actionを使って簡単Ciを作ってみました。
tags:
  - Github
  - GithubAction
  - CI
headerImage: 'https://imgur.com/V2Aobi8.png'
templateKey: blog-post
---
# CIマニアと化したtubone

最近Github Actionを触って便利さに気がついてしまったのでご紹介します。

## Github Actionとは？

Github Actionとは、 ***built by you, run by us*** です。[（公式より）](https://github.blog/2018-10-17-action-demos/)

詰まるところGithub製のCIです。

結構簡単に使えたのでご紹介します。

## Github Actionのプレビューに応募する

Github Action自体はまだプレビュー版ですので、[こちらのサイト](https://github.com/features/actions)から
利用申請をする必要があります。

私は申し込みから一週間くらいで使えるようになりました。

無事利用できるようになりますと、レポジトリにActionボタンが
出てきます。

![Img](https://i.imgur.com/ZYya5eA.png)

## Workflowを設定する

Github ActionはほかのCIと同じくYAMLファイルで定義します。

今回はPythonのPytestでテストを回します。

下記のようにPython環境の設定、のパッケージBuild、Pytestまでを設定します。

```yaml{numberLines: 1}
name: Python package

on: [push]

jobs:
  build:

    runs-on: ubuntu-latest
    strategy:
      max-parallel: 4
      matrix:
        python-version: [3.6, 3.7]

    steps:
    - uses: actions/checkout@v1
    - name: Set up Python ${{ matrix.python-version }}
      uses: actions/setup-python@v1
      with:
        python-version: ${{ matrix.python-version }}
    - name: Install dependencies
      run: |
        python -m pip install --upgrade pip
        pip install -r requirements.txt
    - name: Setup ebook-homebrew
      run: |
        python setup.py install
    - name: Test with pytest
      run: |
        pip install pytest
        pip install -r requirements-test.txt
        pytest --it
    - name: Lint check
      run: |
        black ebook_homebrew setup.py --check
```

### Trigger設定

今回はpush時に動くようにしますので

```yaml{numberLines: 1}{3}
name: Python package

on: [push]

jobs:
  build:
```


