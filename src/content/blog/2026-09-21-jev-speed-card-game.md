---
slug: 2026/09/21/jev-speed-card-game
title: "Jevとトランプのスピードで勝負して絶望した"
date: 2026-09-21
description: TypeSafe AIが公開したテキストを書かないモデルJevを、トランプのスピードのCPUの頭脳にしてみました。noul / choice / scoreという型付きの質問をどう組み立て、どんなレスポンスが返ってきて、その判断をルール検証器でどう答え合わせしているか。Jevの誤判定をあえて場に出すお手付きルールと、1手あたりのトークン課金を抑える工夫まで、実装ベースで書いています。
tags:
  - Jev
  - TypeSafe AI
  - Three.js
headerImage: https://i.imgur.com/6B7WC7D.jpg
templateKey: blog-post
useAi: false
---

夏がようやく終わってくれました。

## Table of Contents

```toc
```

## 忙しい人向け

トランプのスピードを、[TypeSafe AI](https://typesafe.ai/)の[Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev)をCPUとした対戦ゲームとして遊べるようにしました。

<https://jev-speed.tubone24.workers.dev/>

::github{repo="tubone24/jev-practice-speed"}

（ここにプレイ画面のGIFを挿入）

Jevが出たとき、その判断速度を体感したかったのと、ルールベースには及ばない正答率がユースケースとしてどんなものがあるか考えていました。

ゲームの形でデモにしたら面白いと思って作ってみました。**ボコボコにされて悔しがってね**。

## はじめに

2026年9月15日に、TypeSafe AIというところがJev（ジェブ）というモデルをearly accessで出しました。

これが**文章もコードも推論の説明も一切書かない**という、面白いモデルです。あらかじめ型で定義した質問を投げると、答えと確率だけが返ってきます。

なんか作りたい....。ということで、題材にトランプのスピードを作りました。**スピードは、細かい二択をひたすら高速に捌き続けるゲーム**です。

この手札はこの台札に重ねられるのか、重ねるとしてどれを出すべきか。それを瞬時に判断していくわけで、速くて型付きの判断しか返さないモデルの性格がそのまま出るだろうと思ったからです。

あともう1つ、人間がJevにコテンパンにやられる様子を演出したかったという動機もあります。せっかく速いモデルなんだから、~~速さに絶望する画面を作りたいじゃないですか~~。

Jevというモデルそのものの解説は、すでにいろいろな方が書かれているのでそちらにお任せします。この記事では、**リクエストとレスポンス**に絞って、だからアプリがどう動くのかというところを書いていきます。

## スピードの局面をJevへの質問に変換する

ここからが本題です。

スピードのルール自体はシンプルで、場にある台札の一番上のカードと順番が1つだけ離れたカードだけを台札に重ねられます。AとKは隣接している扱いで、循環し、同じ数字のカードは重ねられません（[任天堂のスピードの遊び方](https://www.nintendo.com/jp/others/playing_cards/howtoplay/speed/index.html)より）。

配り方は1人26枚(黒札と赤札)で、台札に1枚、場札5枚、残り20枚を伏せた山にしています。

### 手札5枚 × 台札2枚を1リクエストにまとめる

CPUの手番で聞きたいことは、**いま出せる手はどれで**、**そのうちどれを出すべきか**、ということだけです。

手札が5枚、台札が2枚なので、候補手は最大**10通り**になります。手札と台札を総当たりして、それぞれに `m0` から `m9` までのキーを振ります。

![手札5枚と台札2枚から候補手10通りを作る](/images/blog/jev-speed/fig2-candidates.svg)

この10通りそれぞれに対して `noul` で重ねられるか、`choice` でどれを出すべきか、`score` でこの局面がどれくらい苦しいかを問い合わせています。

**合計12個の質問を、1リクエストにまとめて投げています。**

![リクエストボディはstateとquestionsの2つだけ](/images/blog/jev-speed/fig3-request.svg)

実際に投げているリクエストがこちらです。`m1` 以降の質問は、カード名と台札名が入れ替わるだけの同じ形なので省略しています。

```json
{
  "state": {
    "game": "Speed (Japanese card game)",
    "rule": "A card may be stacked on a pile only if its rank is exactly one higher or one lower than the pile's top card. Ace(1) and King(13) are adjacent (wrap-around). Equal ranks may NOT be stacked.",
    "piles": [
      { "index": 0, "top": "5 of clubs", "value": 5 },
      { "index": 1, "top": "9 of clubs", "value": 9 }
    ],
    "hand": [
      { "slot": 0, "card": "Q of spades", "value": 12 },
      { "slot": 1, "card": "4 of spades", "value": 4 },
      { "slot": 2, "card": "4 of clubs",  "value": 4 },
      { "slot": 3, "card": "6 of spades", "value": 6 },
      { "slot": 4, "card": "K of spades", "value": 13 }
    ],
    "candidates": [
      { "key": "m0", "hand_slot": 0, "card": "Q of spades", "pile": 0, "pile_top": "5 of clubs" },
      { "key": "m1", "hand_slot": 0, "card": "Q of spades", "pile": 1, "pile_top": "9 of clubs" },
      { "key": "m2", "hand_slot": 1, "card": "4 of spades", "pile": 0, "pile_top": "5 of clubs" }
      // 中略。m9 まで、手札5枚 × 台札2枚のすべての組み合わせが並ぶ
    ]
  },
  "questions": {
    "m0": {
      "type": "noul",
      "instructions": "In the card game Speed, a card may be stacked onto a pile only if its rank is exactly one step away from the rank of the pile's top card. Ace and King are adjacent (King -> Ace -> 2 wraps around). Two cards of the same rank can NEVER be stacked.\n\nQuestion: can the Q of spades be legally stacked onto pile 0, whose top card is currently the 5 of clubs?",
      "criteria": {
        "true":  "Yes — the two ranks are exactly one step apart (including the King/Ace wrap-around).",
        "false": "No — the ranks are the same, or they are two or more steps apart."
      }
    },
    // 中略。m1 から m9 まで、カード名と台札名だけ差し替えた同じ質問が並ぶ
    "best": {
      "type": "choice",
      "instructions": "... You are playing Speed against a human opponent in real time. Pick the single best move to play right now. Only pick a move that is legal. If no move is legal, pick \"pass\".",
      "criteria": {
        "m0": "Play the Q of spades onto pile 0 (top card: 5 of clubs).",
        // 中略
        "pass": "Play nothing — no card in hand can legally be stacked on either pile."
      }
    },
    "pressure": {
      "type": "score",
      "instructions": "How tight is this position for the player — how few options do they have?",
      "criteria": ["Many good options", "A few options", "Only one option", "No legal move at all"]
    }
  }
}
```

`noul` の `criteria` に `true` と `false` の説明を両方書いているのがポイントで、ここが曖昧だと確率が中央に寄ってしまいます。

`choice` の選択肢には `m0` 〜 `m9` に加えて `pass` を入れてあります。出せる手がないときに無理やり何かを選ばせないためです。

### 返ってくるもの

さっきのリクエストに対して、実際に返ってきたレスポンスがこちらです。

```json
{
  "ok": true,
  "model": "jev-1.13.0",
  "answers": {
    "m0": { "type": "noul", "noul": 0.08 },
    "m1": { "type": "noul", "noul": 0.1 },
    "m2": { "type": "noul", "noul": 0.99 },
    "m3": { "type": "noul", "noul": 0.1 },
    "m4": { "type": "noul", "noul": 0.99 },
    "m5": { "type": "noul", "noul": 0.1 },
    "m6": { "type": "noul", "noul": 0.99 },
    "m7": { "type": "noul", "noul": 0.11 },
    "m8": { "type": "noul", "noul": 0.12 },
    "m9": { "type": "noul", "noul": 0.11 },
    "best": {
      "type": "choice",
      "choice": "m6",
      "confidence": 0.52,
      "probabilities": {
        "m6": 0.56, "m2": 0.36, "m4": 0.07, "pass": 0.01,
        "m0": 0, "m1": 0, "m3": 0, "m5": 0, "m7": 0, "m8": 0, "m9": 0
      }
    },
    "pressure": {
      "type": "score",
      "score": 1,
      "confidence": 0.95,
      "legend": {
        "0": "Many good options",
        "1": "A few options",
        "2": "Only one option",
        "3": "No legal move at all"
      },
      "probabilities": { "0": 0.02, "1": 0.96, "2": 0.02, "3": 0 }
    }
  },
  "usage": { "input_tokens": 2964, "output_tokens": 289 },
  "latencyMs": 228,
  "mock": false
}
```

![返ってくるのは確率だけ](/images/blog/jev-speed/fig4-response.svg)

この局面を人間の目で見てみましょう。台札は5♣と9♣で、手札はQ♠ / 4♠ / 4♣ / 6♠ / K♠でした。

5♣に重ねられるのは4♠（m2）、4♣（m4）、6♠（m6）の3つです。9♣のほうは8か10が要るのに手札にないので、台札1に出せる手はありません。

**今回Jevはこの10問を全部当てました。** 重ねられる3つに0.99を返して、残りの7つは0.08〜0.12まで落としています。`pressure` も選択肢が少しだけあることを指す1で、confidenceは0.95。ちゃんと当たっています。

面白いのは `best` です。選ばれたのは `m6`、6♠を5♣に重ねる手ですが、confidenceは0.52しかありません。`probabilities` を見るとm2にも0.36が乗っていて、**どれを出してもルール違反ではないから迷っている**のがそのまま数字に出ています。

そしてレイテンシは228ms。公称の70〜500msにきっちり収まっていました。

`usage` も見ておくと、入力2,964トークンに対して出力が289トークン。**出力トークンが0にならない**のはちょっと意外でしたが、ここは課金されないので気にしなくて大丈夫です。

アプリ側では `noul` が0.5以上なら、Jevが台札に重ねられると判断したものとみなしています。`choice` のほうは `confidence` が0.35を下回ったら採用をやめて、`noul` が最大の手にフォールバックするようにします。

言い換えると、こういうことをやっています。

![Jevが返す値を人の言い方に置き換えると](/images/blog/jev-speed/fig9-human-analogy.svg)

## Jevもそこそこ間違える

分類器として使う以上、**Jevの判定の根拠はブラックボックスですし、精度も100%ではありません**。だからこそ、出力を信じきらずにルールエンジンを作り、お手付きなどをしていないかはちゃんとみましょう。

アプリ側では、Jevの言い分と `rules.js` の `isStackable()` が出した機械的な正解を毎回突き合わせて、食い違いをfalse positiveとfalse negativeに振り分けています。

![Jevの言い分と機械的な正解の突き合わせ](/images/blog/jev-speed/fig5-validator.svg)

## お手付きルールでゲームとして成立させる

正直に言うと、**この処理は全部ルールベースで書くのが一番正解です**。

ランク差を計算して、合法手の中からランダムに選んで、適当なウェイトを入れて出すだけです。それで正しく、無料で、0msで動くCPUができあがります。Jevを呼ぶ理由はゲームとしては1つもありません。

じゃあなんでJevに判断させているのかというと、**Jevが一定の割合で間違えるからです**。

速いのに間違えるんですよね。ここがこのゲームの面白さになっています。

### ペナルティの出典について

念のため書いておくと、**スピードに公式のお手付きルールはありません**。
｀
任天堂の遊び方ページにも、[Pagat - Spit/Speedのルール](https://www.pagat.com/patience/spit.html)にも、反則に対する罰則の記載はありません。Pagatにあるのは、一度出したカードは引っ込められないという規定だけです。

なので今回のロックアウト方式は独自ルールです。参考にしたのは、同じくリアルタイム性のある[Egyptian Ratscrew](https://en.wikipedia.org/wiki/Egyptian_Ratscrew)の誤スラップ罰則です。カードを1枚山の底に送るバーンや、手を山の下に置かされて次に誰かがスラップするまで手を出せなくなるハウスルールが知られています。

カードを奪われる方式も考えたんですが、Jev相手のリアルタイム戦だと1回のミスがそのまま詰みに直結してしまうのでやめました。

Jevに負け続けて定数をいじる日々を送りそうな予感がするこの頃です。
