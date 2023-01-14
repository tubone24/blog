---
slug: 2019/12/04/nuxt-toast
title: Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast編)
date: 2019-12-04T23:43:19.895Z
description: Nuxt.jsのわかりにくい機能の一つ、modulesを使ってみます。
tags:
  - JavaScript
  - TypeScript
  - Nuxt.js
  - Vue.js
  - modules
  - toast
  - CompositionAPI
headerImage: 'https://i.imgur.com/29nafu5.png'
templateKey: blog-post
---
わからん。

最近[**Nuxt.js**](https://ja.nuxtjs.org/)と戯れるようにしてますが、Nuxt.jsと[Vue.js](https://jp.vuejs.org/index.html)の新しいAPIである[**CompositionAPI**](https://vue-composition-api-rfc.netlify.com/)の相性があまりよくないのか色々苦戦してます。

いよいよツラミもわかってきた頃合いなので1つずつまとめていこうかと思います。

今回は**Nuxt.js**の**modules**を**CompositionAPI**でどう使っていくかを書きます。

## Table of Contents

```toc

```

## 先に結論

**実装方法だけ見たい人は下記に進んでください。**

[CompositionAPIだとVueインスタンスにアクセスできるのはsetup内のみ](#compositionapi%E3%81%A0%E3%81%A8vue%E3%82%A4%E3%83%B3%E3%82%B9%E3%82%BF%E3%83%B3%E3%82%B9%E3%81%AB%E3%82%A2%E3%82%AF%E3%82%BB%E3%82%B9%E3%81%A7%E3%81%8D%E3%82%8B%E3%81%AE%E3%81%AFsetup%E5%86%85%E3%81%AE%E3%81%BF)

また、本実装を施したWebアプリを作ってみました。

[ebook-homebrew-nuxt-with-typescript-client](https://github.com/tubone24/ebook-homebrew-nuxt-with-typescript-client)

[該当のComponent](https://github.com/tubone24/ebook-homebrew-nuxt-with-typescript-client/blob/master/components/FileList.vue#L28)

![img](https://i.imgur.com/29nafu5.png)

## そもそもCompositionAPIとは？

[CompositionAPI](https://vue-composition-api-rfc.netlify.com/)とは、**Vue3.x系**から正式採用される新しいVue.jsの使い方です。

公式的には、

> a set of additive, function-based APIs that allow flexible composition of component logic. （コンポーネントロジックの構成を柔軟にできる関数ベースな追加API）

とのこと。

ここら辺はだんだん使っていけば何となく良いところが見えてきますが、そちらのまとめはまた今度。

CompositionAPIを使おうと思ったのは、Vue3.xで採用されるというのと、もはや**TypeScript**で書かないと現場で**いじめられてしまう**この世のなかで、VueもTypeScriptで書くことが急務になりつつある状況の中、Vue + TypeScriptで一定のデファクトスタンダードを勝ち得た[ClassAPI](https://github.com/vuejs/vue-class-component)という使い方が、色々問題になっているようだったのでそのツラミを取り除いたらしいCompositionAPIを採用しました。

上記のツラミ・スゴミについて詳しくは下記のプレゼンがすごくわかりやすかったです。

<https://speakerdeck.com/jiko21/composition-api-typescripthavue-dot-jsfalsemeng-wojian-ruka>

ざっくりと書き方の違いとしては、

ClassAPI(decoratorを使ったパターン)

```javascript
<script lang="ts">
import axios from 'axios';
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {

  // props
  @Prop() private propHoge!: string;

  // data
  message: string = "Hoge";
  hogeCount: number = 0;

  // computed
  get double() {
    return this.hogeCount* 2;
  }

  // mounted
  mounted() {
    this.gethoge();
  }

  // methods
  getData() {
    axios
      .get("https://hogehoge.com")
      .then(response => (this.message = response));
  }
}
</script>
```

CompositionAPIで書くパターンは、

```typescript
<script lang="ts">
  import {
    createComponent,
    reactive,
    onBeforeMount,
    onMounted,
    computed,
    ref
  } from '@vue/composition-api';
  import axios from 'axios';
  import toast from '@nuxtjs/toast';
  import {PdfFileNotFoundError} from "~/types/error";
  const backendURL = 'https://ebook-homebrew.herokuapp.com/';

  // data
  // ref,またはreactiveとして設定するとTemplateでreactiveに変更が反映される
  // setup()の外でも中でもOK
  const state = reactive<{
    uploadList: Array<Map<string, string>>
  }>({
    uploadList: []
  });

  // methods
  const updateFileList = async (): Promise<void> => {
     (ロジック)
  };

  const downloadPDF = async (filePath: string): Promise<Blob> => {
　　　(ロジック)
  };
  
  // typeまたはinterfaceでpropsの型指定
  type Props = {
    propHello: string;
  };
  
  //createComponet内でprops, components, layoutなどを設定
  export default createComponent({
    //props
    props: {
      propHello: {
        type: String
      }
    },
    //setup()ではじめてVueインスタンス化されるのでinjectされたものはsetup内でしかとれない。
    setup (props: Props, ctx) {

      // propsをsetup内ローカル変数で再設定
      const propsHello = props.propHello;

      //Contextをsetupで受け取ることができ、module化されたものはroot要素からとれる
      const toast = ctx.root.$root.$toast;

      //setup内でもmethods作成可能。Context rootから取得するものを使わないといけない場合、setup内で実装するしか道はなさそう
      const doDownload = async (filePath: string): Promise<void> => {
         (ロジック)
      };
      //ライフサイクルはsetup内で記載、またライフサイクル自体も従来と異なる
      onBeforeMount( async () => {
        await updateFileList()
        }
      );
      //setupのreturnで返したものがtemplateで使える変数
      return {
        state,
        propsHello,
        doDownload
      };
    }
  });
</script>
```

となります。

ぜんぜんかきっぷり違ってびっくり！

ぱっと見**ClassAPI**のデコレーターの方が**コード量少なくて**見通しはいい気がしますが、ロジック、ステート、レンダリングを好きなように（究極別ファイルに切り出しも可）宣言して、setupでまとめ上げるのは確かに見通しよいかもしれませんね。

まだ、ここらへんは自分のなかでのベストプラクティスができあがってないので今後考察します。

あと、**テストコード**はまだ書いてないのですが、毎回Vueインスタンスを**shallowMount**して頑張って書く感じから解放されそうでテストコード的なメリットはありそうです。

## Nuxt.jsとの相性

CompositionAPIとNuxt.jsの**相性**は今のところ**よくない**と思います。

その一例が**modules**だと思うので検証がてら考察していきます。

## Nuxt.jsのmodulesがCompositionAPIで使いたいんだが

ここからが本題なのですが、よくあるNuxt.jsのmodulesを使う実装例のなかで全くといっていいほどCompositionAPIでやってるものがないので、Nuxt.jsの動き方を逐次確認しながらmodulesを使ってみます。

例えば、ClassAPI（またはOptionsAPI）の場合よくあるNuxt.jsモジュールの例はaxiosです。

次のようなお困りごとを解決する使い方が例によく出ます。

- HeadlessCMSなど他コンテンツURIをProxyしている場合などで、APIコール時に**HTTP Statusチェック**し、**404**だった場合は別ページを表示させる

こういったケースだとOptionsAPIでは下記のような実装例があります。

```javascript
//あらかじめnuxt.config.jsにmodules: ['@nuxtjs/axios']を宣言し、同configにplugins: ['~/plugins/axios'] も宣言しておく
//@/plugins/axios.js

// modulesのaxiosを呼び出す際の共通のエラー処理を記載
export default function ({ $axios, redirect }) {

    $axios.onError(err => {
        const statusCode = parseInt(err.response && err.response.status)
        if (statusCode === 404) {
            redirect('/not-found-page')
 
        }
    })

}
```

```javascript
//利用側components: hoge.vue

export default {
  methods: {
    async sendRequest() {
 //methods内では this.$axios
      const response = await this.$axios.$get('https://hoge.com');
      res = response.headers.Accept;
    }
  },
  async asyncData({ $axios }) {
 //asyncData, fetchなどでは $axiosで取得
    const hoges= await $axios.$get("https://hoge/hoge",{
        params: {
          userId: "hoon"
        }
      }
    )
    return { hoges };
  }
};

```

共通のエラーハンドリングを**plugins**に記載するだけで**冗長なハンドリング**を回避できるのはすごいですね。

ポイントはmodulesで宣言した`@nuxtjs/axios`は書くpage, componentで利用可能でVueインスタンス内では`this.$axios`で取得できるということです。

## CompositionAPIだとVueインスタンスにアクセスできるのはsetup内のみ

ということは先ほど話したとおりなのですがそうするとmodulesの利用側はsetup内でのみ使えることになります。

ということを頭に入れながら`@nuxtjs/toast`を実装していきます。

まずnuxt.config.ts
にmodulesを設定していきます。

```typescript
//nuxt.config.ts

(中略)
modules: [
    '@nuxtjs/toast',
  ],
```

toastの利用側のコンポーネントではsetup内で使います。

ただ、できるだけ**ロジックをsetup内にごちゃごちゃ書きたくないので**、**エラーハンドリング**を使いながら頑張ります。

```typescript
<script lang="ts">
  import {
    createComponent,
    reactive,
    onBeforeMount,
    onMounted,
    computed,
    ref
  } from '@vue/composition-api';
  import axios from 'axios';
  import toast from '@nuxtjs/toast';

  // 独自エラー(404 NotFound)を作ってtoastを出しわける
  class PdfFileNotFoundError extends Error {
    constructor(e?: string) {
      super(e);
      this.name = new.target.name;
      Object.setPrototypeOf(this, new.target.prototype);
    }  
  }

  const backendURL = 'https://ebook-homebrew.herokuapp.com/';

  // ロジック
  const downloadPDF = async (filePath: string): Promise<Blob> => {
    const res = await axios.post(backendURL + 'convert/pdf/download', { uploadId: filePath, },
      {responseType: 'blob'}).catch((err) => {
      if (err.response.status === 404) {
        throw new PdfFileNotFoundError('PdfFileNotFound');
 //404 NotFoundだったら独自エラーをthrow
      } else {
        throw err;
      }
    },
    );
    return new Blob([res.data], {type: 'application/pdf'});
  };

  export default createComponent({

    setup (ctx) {
 //setupでContextを受け取れるので受け取る
      
      //modulesはContextのrootから取れる
      const toast = ctx.root.$root.$toast;
      const doDownload = async (filePath: string): Promise<void> => {
        const options = {
          position: 'top-center',
          duration: 2000,
          fullWidth: true,
          type: 'error',
        } as any;
        try{
          const blob = await downloadPDF(filePath);
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'result.pdf';
          link.click();
        } catch (e) {
          //errorをキャッチ
          if (e instanceof PdfFileNotFoundError) {
            toast.show('No File!!', options)
 //エラーハンドリングでtoast呼び出し
          } else {
            toast.show('UnknownError!!', options)
          }
        }
      };
      return {
        state,
        doDownload
      };
    }
  });
</script>

```

とまぁ、結局のところmodulesはsetupで使うのですが、stateの処理やAPIコール部分はなるべく外だししました。

## 結論

むずかしい。
