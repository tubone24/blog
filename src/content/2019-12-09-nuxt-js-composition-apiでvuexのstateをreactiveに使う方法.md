---
slug: 2019/12/09/nuxt-composition-vuex
title: Nuxt.js + Composition APIでVuexのStateをReactiveに使う方法
date: 2019-12-09T11:41:54.861Z
description: Qiitaにあげた記事Nuxt.js + Composition APIでVuexのStateをReactiveに使う方法の転載です。
tags:
  - JavaScript
  - Nuxt.js
  - Composition API
  - Vue.js
  - TypeScript
  - Vuex
  - ストアパターン
headerImage: 'https://i.imgur.com/BWyjwja.png'
templateKey: blog-post
---

フロントエンド初学者の私が、Vue.jsの新しいAPIである[Composition API](https://vue-composition-api-rfc.netlify.com/#summary)を使って**Nuxt.js**の実装を行なう機会があり、**Vuexを使ったストアで非常につらい思いをした**のでまとめます。

多分、もっとちゃんとしたやり方があるとは思いますがひとまず動いたので記事にしていきます。

とりあえず動いたゴミコードは[こちらのGitHub](https://github.com/tubone24/ebook-homebrew-nuxt-with-typescript-client)にあげてます。

~~結構適当にやってます。~~

なお、Composition-APIについてよくまとまっている記事はVue Advent Calendar 2019に載っていた[**Composition APIってなんだ**](https://qiita.com/ushironoko/items/2aa90f38acea9439c09b)という記事が大変に参考になるかと思いますし、本実装のモチベーションになった記事として[**きたるべきvue-nextのコアを理解する**](https://qiita.com/neutron63zf/items/506c7493a53cea44860e#vue-next%E3%81%AE%E3%83%AA%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%AE%E9%99%A5%E7%A9%BD)という記事の存在があります。

大変参考にさせていただきました！

## Table of Contents

```toc

```

## 前提

今回の検証、というか無理やり実装の前提事項です。

- TypeScriptで実装します
- Composition APIは`@vue/composition-api`をVue.useする形で実装します
- Composition APIでの具体的な実装例(Composition Functionなど)は解説省きます。
  - CreateComponentやSetupなどのお話はさらっとスキップして進めちゃいます。
  - Composition APIの基本的な使い方はこちらが参考になりそうです。[**先取りVue 3.x !! Composition API を試してみる**](https://qiita.com/ryo2132/items/f055679e9974dbc3f977)

### 作りたいもののイメージ

- バックエンドからAPI経由で情報を取得する
- 取得した情報はVuexでステート管理する
- Vuexストアにactionsを作成し、呼び出すことでaxiosを使ってバックエンドのAPIから情報を受け取りストアに格納する
- getterを設定し、getter経由で最新のストア情報が取得できるようにする

### 検証に使うショボAPI

今回はバックエンドAPIとして拙作の下記APIを使います。

本APIからサーバーの**ステータス**と**バージョン**を取得し、**リアクティブに画面**に表現することを目標にします。

APIのリソースはstatusという名前です。詳しくは下記OpenAPIをご参照↓

[Herokuで作ったエンドポイント](https://ebook-homebrew.herokuapp.com/docs)

[ソースGitHub](https://github.com/tubone24/ebook_homebrew)

![img](https://i.imgur.com/9OhZRsB.png "利用するAPIリファレンス")

## Nuxt.jsでのVuexの使い方

Nuxt.jsではVuexのストアを使いたい場合比較的簡単に実装でき`store`ディレクトリの中に、`hoge.ts` のような形でファイルを作ることで、**モジュールモード**というストアモードが利用できるようになります。(素のVuexでいうところのnamespace付のストアですね)

参考: [Vuex ストア](https://ja.nuxtjs.org/guide/vuex-store/)

早速ストアを作っていきます。

### 間違った使い方

まずは間違った例です。

端的に言えばストアがReactiveじゃないので値更新がされません。

詳しくはあとで解説しますが、いたって普通のVuexストアを書いています。

```typescript
import axios from 'axios';

const backendURL = 'https://ebook-homebrew.herokuapp.com/';

 //Stateの型を宣言
export default interface State {
  status: string;
  version: string;
}

//State: 先ほど宣言したState型を使ってます
export const state = (): State => ({
  status: '',
  version: '',
});

//Mutation: stateに新しい値をセットするだけ
export const mutations = {
  setStatus(state: State, status: string) {
    state.status = status;
  },
  setVersion(state: State, version: string) {
    state.version = version;
  },
};

//Action: サーバからステータスなどを取得し、mutation経由で値をセット
//Actionなのでasync awaitな非同期な処理もOK
export const actions = {
  async fetchServerInfo({ commit }): Promise<void> {
    await axios.get(backendURL + 'status').then((response) => {
      commit(setStatus, response.data.status);
      commit(setVersion, response.data.version);
    }).catch((err) => {
      commit(setStatus, 'error');
      commit(setVersion, 'error');
    })
  },
};

//Getter: stateの中身を取り出してreturnする
export const getters = {
  getStatus(state: State): string{
    return state.status;
  },
  getVersion(state: State): string{
    return state.version;
  }
};
```

基本的なことかもしれませんが、Stateの更新はAction, Mutationどちらからでもできます。

ただし、Componentsからの更新は非同期を許容するActionに統一したほうがいいかもです。

![img](https://vuex.vuejs.org/vuex.png "Vuexのライフサイクル")

## VuexのstoreをComposition APIで使う方法

それでは上記で作成したVuexストアをComponentsで使っていきます。

**何度も言っていますがVuexストアを正しく直さないと動きませんよ**。

```typescript
<template>
  <div id="status">
    <!-- actionの呼び出し(※5) -->
    <b-button id="get-status" type="is-primary" @click="fetchStatus(store)">Get Status NOW</b-button>
    <!-- setupのreturnに設定したものはtemplate内で使える(※6)-->
    <p>ServerStatus: <b>{{ store.getters['status/getStatus'] }}</b></p>
    <p>ServerVersion: <b>{{ store.getters['status/getStatus'] }}</b></p>
  </div>
</template>

<script lang="ts">
  import {
    createComponent,
    reactive,
    onBeforeMount,
    onUpdated,
    SetupContext,
    onMounted,
    computed,
    watch,
    ref
  } from '@vue/composition-api';

  const backendURL = 'https://ebook-homebrew.herokuapp.com/';

  type Props = {
    propHello: string;
  };

  const fetchStatus = async (store) => {
   // store.dispatchでActionを呼び出す
   // setupからstoreを受け取る (※4)
    await store.dispatch('status/fetchServerInfo');
  };

  // createComponentする
  export default createComponent({
    props: {
      propHello: {
        type: String
      }
    },

    //setupを呼び出すとSetupContextのrootでVueインスタンス内の要素にアクセスできる
    setup (props: Props, { root }:SetupContext) {
      // props
      const propsHello = props.propHello;
      
      //storeをVueインスタンスから取り出す(※1)
      const store = root.$store;

      //methods
      onBeforeMount( async () => {
        // 当然setup外で設定した関数にもアクセス可能(※4)
        // 関数内でstoreを使うため引数で渡しておく(※2)
        await fetchStatus(store);
      });


      return {
        fetchStatus,
        store, //storeをtemplate内で利用するためにreturn(※3)
        propsHello,
      };
    }
  });
</script>
```

### ストアへのアクセス方法

Composition APIでは**Vuexストアはsetup内でしか取り出せません**。

なぜならComposition APIはsetupしたタイミングでVueインスタンスが利用できるため、いままでのVue.jsでいうところの**this.$store**で取り出すことがsetup内でしか使えないからです。

なので、setupのなかで**root.$store**を取り出して(※1)、Vuexストアを使う別の関数(※2)やtemplateで利用するためsetupのreturnに渡しています。(※3)

### Actionの呼び出し

上記Componentsでは、Vue.jsライフサイクルの**onBeforeMount**と、template内の**get-status**ボタンの押下で**fetchStatus**という関数が呼び出され、同関数でActionがdispatchされる作りです。(※4)(※5)

**fetchStatus**はsetup外に作られた関数なので、**seutupのなかでfetshStatusの引数にstoreを渡して**あげます。

### Getterの呼び出し

(※3)のようにあらかじめVuexストア(store)をsetupのreturnに設定することで(※6)のように **store.getters['status/getStatus']**というVuexモジュールモードのgetterの呼び出しの形でtemplate内でGetterが利用できます。

## 何度も言ってますが動きません

何度も言っておりますが上記のコードでは正しく動きません。

Actionを正しくdispatchしていても、ServerStatus, ServerVersionはtemplateで**更新されません**。

![img](https://i.imgur.com/xihsCyz.png)

なぜなら**VuexストアのステートがReactive**じゃない。つまり、**値更新を検知できない**ためです。

ではVuexのストアをReactiveにしてしまいましょう。

## ReactiveなVuexストアを作る

結論から言えば、VuexストアのStateをReactiveにしちゃえばいいわけなので、 ストアを次のように作り直します。

```typescript
import axios from 'axios';

import {
  reactive,
  Ref,
  toRefs,
} from '@vue/composition-api';

const backendURL = 'https://ebook-homebrew.herokuapp.com/';

// Reactiveなstateを作る(7)
export const state = () => { //型について(※9)
  return toRefs(reactive<{ //toRefsでreturnする(※8)
    status: string;
    version: string;
  }>({
    status: '',
    version: '',
  }))
};

export const mutations = {
    setStatus(state: State, status: string) {
    state.status = status;
  },
    setVersion(state: State, version: string) {
    state.version = version;
  },
};

export const actions = {
  async fetchServerInfo({ commit }): Promise<void> {
    await axios.get(backendURL + 'status').then((response) => {
      commit(SET_STATUS, response.data.status);
      commit(SET_VERSION, response.data.version);
    }).catch((err) => {
      commit(SET_STATUS, 'error');
      commit(SET_VERSION, 'error');
    })
  },
};

// 意味わかんないif文。ここが問題点(※10)
export const getters = {
  getStatus(state): string{
    if (state.status.value === '') {
      return '';
    }else{
      return state.status;
    }

  },
  getVersion(state): string{
    if (state.version.value === '') {
      return '';
    }else{
      return state.version;
    }
  }
};
```

ぶっちゃけこれだけの変更です。

少し細かく見ていきます。

### Composition APIのReactiveについて

そもそもReactiveって何よ？って話は[**きたるべきvue-nextのコアを理解する: そもそも「リアクティブ」とは?**](https://qiita.com/neutron63zf/items/506c7493a53cea44860e#%E3%81%9D%E3%82%82%E3%81%9D%E3%82%82%E3%83%AA%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%81%A8%E3%81%AF)がすさまじくわかりやすいので解説はそちらに譲ります。

Composition APIにはReactiveな値を作り出すことのできる方法として有名どころで**ref**と**reactive**がありますが、VuexストアはStateという自己定義の**オブジェクト**なので**プリミティブのみ許容のrefは使えません**。**reactiveを使います**。

(注7)のように**Stateオブジェクトをreactiveで囲んであげれば**ReactiveなStateになります。

### Reactiveな関係性を引き継ぐtoRefs

StateをReactiveにできました。

ですが、reactiveには**スコープ**が存在しますのでreturnで戻してしまうと**戻り先でReactiveな関係が解消**されてしまいます。

それを解決する方法として**toRefs**というものがあります。

(注8)のようにtoRefsにreactiveな値を引数に設定し、returnすることで**戻り先でもreactiveな変数**として扱えます。

toRefsはどうやら[Composition APIのソース](https://github.com/vuejs/composition-api/blob/master/src/reactivity/ref.ts#L142)を見ると、受け取ったreactiveな値をRefで再定義し、一個一個getter, setterを設定しているproxyらしいです。

インターセプトな動き・・・。なるほどわからん。

```typescript
export function toRefs<T extends Data = Data>(obj: T): Refs<T> {
  if (!isPlainObject(obj)) return obj as any;

  const res: Refs<T> = {} as any;
  Object.keys(obj).forEach(key => {
    let val: any = obj[key];
    // use ref to proxy the property
    if (!isRef(val)) {
      val = createRef<any>({
        get: () => obj[key],
        set: v => (obj[key as keyof T] = v),
      });
    }
    // todo
    res[key as keyof T] = val;
  });

  return res;
}
```

ともかくこれでComponents側でもreactiveな値として扱えますね！

### 問題点1: Stateの型ってどうやって設定するの？(※9)

確かにこれで無事ReactiveなVuexストアができたのですが、少し問題点があります。

間違った旧ストアコードではVuexストアのStateにinterfaceを使ってきちんと型を設定していたかと思いますが新コードではできてません。

```typescript
 //Stateの型を宣言
export default interface State {
  status: string;
  version: string;
}

//State: 先ほど宣言したState型を使ってます
export const state = (): State => ({
  status: '',
  version: '',
});
```

```typescript
 //Stateの型を宣言
export default interface State {
  status: string;
  version: string;
}

export const state = () => { //型がないよ！！
  return toRefs(reactive<{
    status: string;
    version: string;
  }>({
    status: '',
    version: '',
  }))
};
```

#### 解決法

実はStateの型問題はかなりトリッキーというか、Composition APIの深掘れば何とか解決できます。

```typescript
import {
  reactive,
  Ref,
  toRefs,
} from '@vue/composition-api';

declare type Refs<Data> = { //謎のtype
  [K in keyof Data]: Data[K] extends Ref<infer V> ? Ref<V> : Ref<Data[K]>;
};

export default interface State {
  status: string;
  version: string;
}

export const state = ():Refs<State> => { //Refs<State>が型です
  return toRefs(reactive<State>({
    status: '',
    version: '',
  }))
};
```

**declare type Refs<Data>**という超謎なことをしてますが、これは、toRefsの戻り型としてComposition APIのソースそのものに定義されていた型ものそのものです。

Ref型は**@vue/composition-api**からimportで取ってこれるのですが、Refs型は取ってこれないので、取ってこれるRef型からゴリゴリ作って、それを使ってあげるわけです。

これで一応Stateの型が設定できます。

### 問題点2: getterの謎のif文(※10)

新しいgetterは謎のif文がかまされています。

```typescript
export const getters = {
  getStatus(state): string{ //引数の型ないよー
    if (state.status.value === '') { //謎if文
      return '';
    }else{
      return state.status;
    }

  },
  getVersion(state): string{
    if (state.version.value === '') { //謎・・
      return '';
    }else{
      return state.version;
    }
  }
};
```

これは、StateをtoRefs化した弊害によって入れざるを得ないif文です。

Components内でtoRefsを受け取らないことにはRefsのProxyが効かないようで、Computeしたときに返るrefオブジェクトっぽいものが返ってきます。

なので、その場合はvalueで値を取得しなければいけません。

んー。これはどうしようもありませんね・・・。

あと、toRefsがProxy的な動きをするのでTypeScriptに怒られないような型定義がうまくできませんでした(涙)

## 結論

色々試行錯誤しましたが、なんとか動きました。

![img](https://i.imgur.com/BWyjwja.png)

Composition APIとVuexの相性があまりよくないことが分かった気がしますが、それでもdevtool使いたいとかでVuexの需要はあると思うので何か抜け道が発見できればと願うばかりです。

## 参考

- [Composition API RFC](https://vue-composition-api-rfc.netlify.com/#summary)
- [Composition APIってなんだ](https://qiita.com/ushironoko/items/2aa90f38acea9439c09b)
- [きたるべきvue-nextのコアを理解する](https://qiita.com/neutron63zf/items/506c7493a53cea44860e#vue-next%E3%81%AE%E3%83%AA%E3%82%A2%E3%82%AF%E3%83%86%E3%82%A3%E3%83%96%E3%82%B7%E3%82%B9%E3%83%86%E3%83%A0%E3%81%AE%E9%99%A5%E7%A9%BD)
