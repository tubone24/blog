---
slug: 2020/07/12/github-profile
title: GitHub ProfileにREADMEをつけよう！
date: 2020-07-11T15:48:09.482Z
description: "GitHubの隠し機能「GitHub Profile README」の作り方を解説します。ユーザー名と同じリポジトリを作成し、README.mdを編集するだけで自分のプロフィールページをカスタマイズできます。画像リンクの注意点やraw.githubusercontent.comの活用法も紹介。"
tags:
  - GitHub
  - README.md
headerImage: /images/blog/kmBmedG.png
templateKey: blog-post
---
GitHubのfeatureであるGitHub ProfileにREADMEをつける機能を使って、自分のGitHub Profileを充実させましょう。

## Table of Contents

```toc

```

## なんだこれ!?

<https://dev.to/>を見ると面白い記事がありました。

[Design GitHub profile using README.md](https://dev.to/web/design-github-profile-using-readme-md-8al)

![dev.toのGitHub Profile READMEに関する記事のサムネイル](https://res.cloudinary.com/practicaldev/image/fetch/s--FhpF6q0t--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://res.cloudinary.com/practicaldev/image/fetch/s--BWQmzCli--/c_imagga_scale%2Cf_auto%2Cfl_progressive%2Ch_420%2Cq_auto%2Cw_1000/https://dev-to-uploads.s3.amazonaws.com/i/c5hjkmvrl9rgss5gt27h.jpeg)

GitHub ProfileにGitHub README.mdをつけられるらしいです。ちなみに、GitHubといえば[Arctic Code Vault Contributorになったらしい](/2020/07/18/arctic-code-vault/)という面白い話もあるのでぜひご覧ください。

## 作り方

作り方はとっても簡単で、自分のユーザー名と同じレポジトリを作り、README.mdを編集するだけです。

私の場合、[GitHubに毎日草を生やし続けて](/2019/09/27/github-weed/)いるGitHubのユーザー名は**tubone24**なので[tubone24/tubone24](https://github.com/tubone24/tubone24)というレポジトリを作ります。

![ユーザー名と同じリポジトリを作成するとspecial repositoryと表示される画面](/images/blog/6b43Rf2.png)

このような形で、ユーザー名のレポジトリは**special repository**と書いてありますね。

あとはGitHubのREADMEを編集するようにMarkdownを書いていくだけです。

![GitHub Profile READMEのMarkdown編集画面](/images/blog/eA5ztKm.png)

ちなみに、GitHubの普通のレポジトリのREADME.mdだと、レポジトリ内ファイルの相対関係でリンクや画像を指定できますが、それをすると残念ながら、GitHub Profile上で表示すると変な画像リンクに置き換わってしまいます。

![相対パスで指定した画像がProfile上で壊れて表示される例](/images/blog/cimtxsd.png)

画像の場合は**raw.githubusercontent.com**を使うことで解決します。

```html

<p align='center'>
<a href="https://twitter.com/meitante1conan"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/twitter.png"></a>&nbsp;&nbsp;
<a href="https://soundcloud.com/user-453736300"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/soundcloud.png"></a>&nbsp;&nbsp;
<a href="https://www.slideshare.net/tubone24"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/share.png"></a>&nbsp;&nbsp;
<a href="https://500px.com/tubone24"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/photography.png"></a>&nbsp;&nbsp;
<a href="https://tubone-project24.xyz"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/blog.png"></a>&nbsp;&nbsp;
<a href="https://tubone24.github.io/resume/"><img height="30" src="https://raw.githubusercontent.com/tubone24/tubone24/master/resume.png"></a>&nbsp;&nbsp;
</p>

```

## 出来上がった

いい感じ！

![完成したGitHub Profileページの表示例](/images/blog/kmBmedG.png)
