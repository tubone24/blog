---
slug: 2019/12/03/nuxt-toast
title: Nuxt.jsのmodulesをCompositionAPIで使ってみる(@nuxtjs/toast編)
date: 2019-12-02T23:43:19.895Z
description: Nuxt.jsのわかりにくい機能の一つ、modulesを使ってみます。
tags:
  - Nuxt.js
  - Vue.js
  - modules
  - toast
  - CompositionAPI
headerImage: 'https://i.imgur.com/QmIHfeR.jpg'
templateKey: blog-post
---
# わからん

最近[Nuxt.js](https://ja.nuxtjs.org/)と戯れるようにしてますが、Nuxt.jsと[Vue.js](https://jp.vuejs.org/index.html)の新しいAPIである[CompositionAPI](https://vue-composition-api-rfc.netlify.com/)の相性があまりよくないのか色々苦戦してます。

いよいよツラミもわかってきた頃合いなので一つずつまとめていこうかと思います。

## そもそもCompositionAPIとは？

[CompositionAPI](https://vue-composition-api-rfc.netlify.com/)とは、Vue3.x系から正式採用される新しいVue.jsの使い方です。

公式的には

> a set of additive, function-based APIs that allow flexible composition of component logic. （コンポーネントロジックの構成を柔軟にできる関数ベースな追加API）

とのこと。

ここら辺はだんだん使っていけば何となく良いところが見えてきますが、そちらのまとめはまた今度。

CompositionAPIを使おうと思ったのは、Vue3.xで採用されるというのと、もはやTypeScriptで書かないと現場でいじめられてしまうこの世の中で、VueもTypeScriptで書くことが急務になりつつある状況の中、Vue + TypeScriptで一定のデファクトスタンダードを勝ち得た[ClassAPI](https://github.com/vuejs/vue-class-component)という使い方が、色々問題になっているようだったので採用しました。

詳しくは（リンク）を御確認ください。

ざっくりと書き方の違いとしては

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
CompositionAPIで書くパターン

```javascript
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
    const res = await axios.get(backendURL + 'data/upload/list');
    if (res.status === 200) {
      state.uploadList = res.data.fileList;
    }
    console.log(JSON.stringify(state.uploadList));
  };
  const downloadPDF = async (filePath: string): Promise<Blob> => {
    const res = await axios.post(backendURL + 'convert/pdf/download', { uploadId: filePath, },
      {responseType: 'blob'}).catch((err) => {
      if (err.response.status === 404) {
        throw new PdfFileNotFoundError('PdfFileNotFound');
      } else {
        throw err;
      }
    },
    );
    return new Blob([res.data], {type: 'application/pdf'});
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
    //setup()で初めてVueインスタンス化されるのでinjectされたものはsetup内でしかとれない。
    setup (props: Props, ctx) {

      // propsをsetup内ローカル変数で再設定
      const propsHello = props.propHello;

      //Contextをsetupで受け取ることができ、module化されたものはroot要素からとれる
      const toast = ctx.root.$root.$toast;

      //setup内でもmethods作成可能。Context rootから取得するものを使わないといけない場合、setup内で実装するしか道はなさそう
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
          if (e instanceof PdfFileNotFoundError) {
            //先ほど取り出したtoast
            toast.show('No File!!', options)
          } else {
            toast.show('UnknownError!!', options)
          }
        }
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

Nuxt.jsとの相性を考えると色々ツラミがあるのですが、ロジックをVueインスタンスから切り離した形で実装、テストができるのでそれはそれでうれしい気もします。

そこらへんの考察は別機会にまたやります。

## Nuxt.jsのモジュールがCompositionAPIで使いたいんだが

ここからが本題なのですが、よくあるNuxt.jsのmodulesを使う例は全くといっていいほどCompositionAPIでやってるものがないので、Nuxt.jsの動き方を逐次確認しながらmodulesを使ってみます。

例えば、ClassAPI（またはDataAPI）の場合よくあるNuxt.jsモジュールの例はaxiosです。
