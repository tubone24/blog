---
slug: 2023-01-15/Owasp-ZAPのFull-ScanでGlobal-Filterを当てる方法
title: "Docker版Owasp ZAPのFull ScanでAlert Filtersを当てる方法"
date: 2023-01-15T12:53:50+0000
description: Docker版Owasp ZAPのFull ScanでAlert Filtersを当てる方法
tags:
  - Owasp ZAP
  - GitHub Actions
headerImage: https://i.imgur.com/QmIHfeR.jpg
templateKey: blog-post
---

Owasp ZAPでGlobal Filtersを使い、Alert Filtersを適用することでより正確な脆弱性診断をおこないます。

## Table of Contents

```toc

```

## Alert Filters

前回の記事でもちらっとお話しましたが、Owasp ZAPを実行すると、結構誤検知(False positive)が出ます。

![false positive](https://i.imgur.com/FnGbBym.png)

例えば上記のレポートではInformation Disclosure - Debug Error Messagesや Private IP Disclosureが出てますが、こちらはブログ記事やロゴのSVGに含まれる文字列を引っ張って検知してしまった誤検知です。


