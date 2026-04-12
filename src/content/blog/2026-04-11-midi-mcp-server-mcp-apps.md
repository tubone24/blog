---
slug: 2026/04/11/midi-mcp-server-mcp-apps
title: "MCP AppsでMIDIの譜面をリアルタイムに可視化する"
date: 2026-04-11
description: "MCP Appsの仕様を活用して、AIが作曲したMIDI楽曲のピアノロール譜面をClaude.ai上でリアルタイムに可視化するMCPサーバーを作りました。MCP Appsのアーキテクチャやライフサイクル、ontoolinputpartialによるプログレッシブレンダリング、Viewからの双方向通信（callServerTool・readServerResource・sendMessage）の仕組みを仕様レベルで解説しつつ、Cloudflare Workersへのデプロイ方法も紹介します。"
tags:
  - MCP
  - MIDI
  - MCP Apps
headerImage: /images/blog/mcp-apps-dakrmode.png
templateKey: blog-post
useAi: false
---

桜も散ってしまい、センチメンタルな曲が聞きたくなりました。

## Table of Contents

```toc
```

## 忙しい人向け

今回作ったリモートMCPサーバーのURLはこちらです。

<https://midi-mcp-server.tubone24.workers.dev>

[Claude.ai](https://claude.ai)から使う場合は、 **設定 → コネクタ → カスタムコネクタを追加** から、上記URLを貼り付けるだけで接続できます。認証なども不要です。

```text
https://midi-mcp-server.tubone24.workers.dev
```

接続後の使い方や実際の動作イメージは [Claude.aiで使ってみる](#claudeaiで使ってみる) セクションを参照してください。

## はじめに

ちょうど1年くらい前に、[MCPについてLTで登壇した](https://slide-tubone24.pages.dev/slides/cline/1)ことがありました（といっても浅い内容でお恥ずかしい限りですが）。

時が経つのは早いですね...。こわいです。

そのときはStdIOベースのMIDI MCP Serverを作って[Cline](https://cline.bot/)と連携させる話だったのですが、MCPの世界はそこからさらに広がっていきました。

<https://www.youtube.com/live/Daew0TUEmR4?t=2199>

その1つが、2026年1月にリリースされた[MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)という拡張仕様です。

これは従来のテキスト応答に加えて、**チャットUI上にインタラクティブなHTML画面を直接埋め込める**というものです。はじめて知ったときは、Googleが主導する[A2UI](https://a2ui.org/)（Agent-to-User Interface）と何が違うのか？と思って、自分の理解力では追いつけず、**正直あまり向き合っていませんでした**。

ですが、実際に触ってみるとこれがかなり面白いんですよね。

もともとギターを弾いていた（下手の横好きですが）こともあり、MIDIには馴染みがありました。MIDIファイルを生成するだけなら[Skills](https://github.com/tubone24/midi-agent-skill)でもできますが、**AIが作曲した楽曲をその場でピアノロール譜面として可視化し、さらにUI上のボタンからサーバーのツールを呼び出したり、Claudeに「続きを作って」とリクエストしたりできる**としたら、MCP Appsの仕様を広くデモできるのでは...と考えたのがきっかけです。

そこで作った(大幅に作り変えた)のが[midi-mcp-server](https://github.com/tubone24/midi-mcp-server)です。自分の手作りで粗削りなところも多いですが、よければお付き合いください。

::github{repo="tubone24/midi-mcp-server"}

![MIDI MCP Serverを使ってユーロビートを作る過程](/images/blog/mcp-apps-demo1.gif)

以下では、midi-mcp-serverの実装を題材にしつつ、MCP Appsの仕様を実際の画面とコードで追っていきます。

## MCP Appsとは

### 従来のMCPツールとの違い

[@modelcontextprotocol/sdk](https://github.com/modelcontextprotocol/typescript-sdk)の `server.registerTool()` でMCPサーバーを作ったことがある方なら、MCPサーバーでツールを作り、AIエージェントが単なるテキスト生成を超えた仕事をこなすことができることは想像できるでしょう。

プレゼンテーションの資料を作り、出来上がった資料をメールに添付して送信...。なんてことも可能になるわけです。

しかし、**この方式には限界があります**。それは、**MCPホスト上のチャットUIから体験が離れてしまう**ということです。

例えばデータの可視化をしたい場合、テキストで数値を並べても直感的ではありません。

チャートやグラフを使って表現したいですが、従来のチャットUIにそれらを表示させることは難しいので、**生成したチャートやグラフを画像化し、それらをダウンロードさせて確認してもらう**、という体験になります。

以前のmidi-mcp-serverやその進化系Skillsのmidi-agent-skillでも、生成したMIDIやWAVファイルをclaude.aiの画面からダウンロードし、それを自分で再生ソフトを用いて再生する、という体験になってました。

![Skillでは作成物をダウンロードさせ、自分で再生させる必要がある](/images/blog/mcp-apps-beforeskill.png)

[MCP Apps](https://modelcontextprotocol.io/extensions/apps/overview)はこのような課題を解決するためのアイディアです。

**MCPサーバーがサンドボックス化されたiframe内にインタラクティブなHTML UIを直接配信できる仕組み**で、専用のAIエージェントを一から作らなくても、既存のチャットクライアント（Claude.aiなど）上で、シームレスにリッチな体験を作ることができます。

### なぜWebアプリではなくMCP Appsなのか

「別にWebアプリを作ってリンクを送ればいいのでは？」という疑問もあるかもしれません。まぁそうですよね。

MCP Appsを使う利点は、**会話のコンテキスト内にUIが存在する**点にあります。

ユーザーは**ブラウザのタブを切り替えることなく**、テキストでは表現しきれない情報にアクセスできます。さらにMCP Appsのiframeからサーバーのツールを呼び出したり、ホスト（Claude.ai）にメッセージを送信してモデルに再度推論を依頼できます。**この一貫性が魅力なのです**。

セキュリティ面では、サンドボックスiframeによりホスト側のDOM、Cookie、LocalStorageへのアクセスが制限されているため、サードパーティのMCPサーバーが提供するUIでも安全にレンダリングできるのもポイントです。

なお、今回の記事ではMCPホストはClaude.aiでの動作を前提に進めていきますので他のサービスで利用できるかは調査してないです。

## MCP Appsのアーキテクチャとライフサイクル

MCP Appsのアーキテクチャを、midi-mcp-serverの動作を追いながら見ていきます。

### 全体の流れ

MCP Appsの動作は、大きく4つのフェーズに分けて理解できます（[MCP Apps Specification（2026-01-26）](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx)より）。

まず**Connection & Discoveryフェーズ**では、ホスト（Claude.ai）がMCPサーバーに接続してツールリストを取得します。このとき、ツールの `_meta.ui.resourceUri` フィールドがあれば**このツールはMCP Appsとしてレンダリング可能なUI付きツール**と判断されます。

次の**UI Initializationフェーズ**では、ホストがサンドボックスiframeを作成し、 `ui://` URIスキームで指定されたHTMLリソースをロードします。ここでホストとView間のハンドシェイクが行なわれます。ポイントは、**ツールが実際に呼び出される前にUIリソースを事前に読み込める**ことです。（読み込むかどうかはMCPホスト次第ではあります）これが後述する**プログレッシブレンダリング**を可能にしています。

**Interactive Phase**ではLLMがツールを呼び出すと、ツール入力やツール結果がViewにプッシュされます。そしてLLMがまだツール引数を生成している途中でも、部分的なJSONがViewに逐次プッシュされます。

最後の**Cleanupフェーズ**では、ホストがViewを破棄する前に `onteardown` フックを通じてクリーンアップの通知が送られます。

この一連の流れを今回のmidi-mcp-serverのシーケンス図で表すと次のようになります。

```mermaid
sequenceDiagram
    participant User as ユーザー
    participant Host as ホスト（Claude.ai）
    participant Server as MCPサーバー
    participant View as View（iframe）

    Note over Host,Server: Connection & Discoveryフェーズ
    Host->>Server: ツールリスト取得
    Server-->>Host: create_midi（_meta.ui.resourceUri付き）

    Note over Host,View: UI Initializationフェーズ
    Host->>Server: ui://midi-preview/app.html を取得
    Server-->>Host: バンドル済みHTML
    Host->>View: サンドボックスiframeでロード
    View-->>Host: ui/initialize ハンドシェイク

    Note over User,View: Interactive Phase
    User->>Host: 最近流行りのJ-POPをMIDIで作って
    Host->>Server: tools/call（create_midi）
    Note over Host,View: LLMが引数を生成中
    Host-->>View: ontoolinputpartial（部分JSON）
    Note over View: ピアノロールが段階的に描画
    Host-->>View: ontoolinputpartial（さらにノート追加）
    Server-->>Host: ツール実行結果（MIDI Base64）
    Host-->>View: ontoolinput（完全な入力）
    Host-->>View: ontoolresult（ツール結果）
    Note over View: 最終的な譜面を表示・再生可能に

    User->>View: Chord Analyzerでコードを解析
    View->>Server: callServerTool（parse_chord）
    Server-->>View: コードの構成音

    User->>View: Continueボタンをクリック
    View->>Host: sendMessage（続きを作って）
    Note over Host: Claudeが新しいターンを開始

    Note over Host,View: Cleanupフェーズ
    Host-->>View: onteardown
    Note over View: AudioContext破棄・リソースクリーンアップ
```

### UIリソースの事前読み込み

ツールに `_meta.ui.resourceUri` を設定すると、ホストはツールの呼び出しを待たずにUIリソースを事前読み込みできます。midi-mcp-serverでは [`@modelcontextprotocol/ext-apps`](https://github.com/modelcontextprotocol/ext-apps) パッケージが提供する `registerAppTool` と `registerAppResource` でこの設定を行なっています（[MCP Apps Build Guide](https://modelcontextprotocol.io/extensions/apps/build)より）。

```typescript{file: "src/server.ts"}
const RESOURCE_URI = 'ui://midi-preview/app.html';

// UIリソース（バンドル済みHTML）を登録
registerAppResource(server, 'MIDI Preview', RESOURCE_URI, {}, async () => ({
  contents: [{
    uri: RESOURCE_URI,
    mimeType: RESOURCE_MIME_TYPE,
    text: builtHtml,  // Viteでバンドルした単一HTMLファイル
  }],
}));

// MCP Apps対応ツールを登録
registerAppTool(server, 'create_midi', {
  title: 'Create MIDI',
  description: 'Generate a MIDI file from structured composition data...',
  inputSchema: {
    title: z.string().describe('Title of the composition'),
    composition: z.any().describe('Composition object with bpm, tracks...'),
  },
  outputSchema: {
    midiBase64: z.string(),
    title: z.string(),
    bpm: z.number(),
    trackCount: z.number(),
  },
  _meta: {
    ui: { resourceUri: RESOURCE_URI },
  },
}, async ({ title, composition: rawComposition }) => {
  const composition = preprocessComposition(rawComposition);
  const midiBase64 = generateMidiBase64(composition);
  return {
    content: [
      { type: 'text', text: `MIDI file "${title}" generated successfully.` },
    ],
    structuredContent: {
      midiBase64,
      title,
      bpm: composition.bpm,
      trackCount: composition.tracks.length,
    },
  };
});
```

`registerAppResource` で登録したHTMLリソースは、**ホストからのリクエストに応じて配信**されます。このHTMLは[Vite](https://vite.dev/)の[vite-plugin-singlefile](https://www.npmjs.com/package/vite-plugin-singlefile)で単一ファイルにバンドルされたもので、CSS・JavaScriptがすべてインラインに含まれています。

ちなみに、MCP Apps対応でないツールは従来どおり `server.registerTool()` で登録すればOKです。UIを持つツールだけ `registerAppTool` を使い分けます。

midi-mcp-serverではUIリソースとは別に、7つの音楽理論リソース（和声法、コード進行、対位法、モード・スケール、オーケストレーション、リズムパターン、ボイスリーディング）を `server.registerResource()` で登録しています。ここでいう`Resource`はMCP AppsのUIリソースではなく、[MCPのプリミティブのリソース](https://modelcontextprotocol.io/docs/learn/server-concepts#resources)です（紛らわしい...。）。

これらはチャットUIから直接呼び出すことはできませんが、リソースUI(以降Viewと呼ぶ)のJavaScriptから `readServerResource` を使ってアクセスもできます。

例えば、**Music Theory Reference**というパネルでは、7つの音楽理論リソースをタブ切り替えで参照できるようにしていますが、表示しているMarkdownの内容はMCPサーバーのリソース（プリミティブ）から取得したものです。

![Music Theory ReferenceをAppsから表示する](/images/blog/mcp-apps-show-resource.png)

このように既存のMCPプリミティブとも組み合わせて使えるのもMCP Appsの魅力の1つです。

## プログレッシブレンダリング

**MCP Appsで一番「おお...」となる仕様がこれです。** 自分の拙い説明で伝わるか不安ですが、がんばって書いてみます。

ご自身でWeb画面をもったAIエージェントアプリを作ったことがある方ならピンとくるかもしれませんが、**AIがツール引数のJSONを生成している途中の段階をあたかも作っていますよ〜と可視化する体験って結構難しくないでしょうか**？

テキストであれば、ストリーミングで逐次文字を出すことによって、それらは簡単に実現できますが、リッチなUIでこれを実現しようとすると難しさがあります。

なぜならLLMがツール引数のJSONを生成しているとき、**まだJSONは途中までしかできていません**。普通に考えれば構文エラーのJSONなのでパースできないはずです。なので、生成途中のJSONを使って何かをする、ということは基本的にはできないわけです。

ところがMCP Appsのホストは、この不完全なJSONを**常にvalidな形にヒール**（閉じられていない `]` や `}` などのブラケット・ブレースを閉じて、構文的に有効なJSONを生成）して、Viewに逐次プッシュしてくれます。このLLMのストリーミングに合わせて段階的にUIを描画することをプログレッシブレンダリングと呼びます。

これが `ontoolinputpartial` フックで受け取れるデータです。

```typescript{file: "src/mcp-app.ts"}
app.ontoolinputpartial = (params) => {
  try {
    const args = params.arguments as unknown as ToolInput;
    if (args?.composition?.tracks) {
      loadComposition(args);  // 部分データでも描画を試みる
    }
  } catch (_e) {
    // まだデータが不完全な場合は無視
  }
};
```

midi-mcp-serverでは、AIが1つ目のトラックの音符を生成し始めた瞬間からピアノロールが描画され始め、音符が追加されるたびにリアルタイムで譜面が更新されていきます。**テキストが1文字ずつ表示されるストリーミングのピアノロール版と思っていただければわかりやすいでしょう。**

![プログレッシブレンダリングによってピアノロールがリアルタイムに作られていく図](/images/blog/mcp-apps-progressive-render.gif)

実装上の工夫として、 `args?.composition?.tracks` の存在チェックをしています。ヒール済みとはいえ、まだ `tracks` プロパティが存在しないタイミングもあるため、描画可能な状態になるまではスキップしています。

そして引数の生成が完了すると `ontoolinput` フックが発火し、完全なデータで最終描画とMIDI生成を行ないます。

```typescript{file: "src/mcp-app.ts"}
app.ontoolinput = (params) => {
  loadComposition(params.arguments as unknown as ToolInput, { generateMidi: true });
};
```

`ontoolinputpartial` との違いは `{ generateMidi: true }` オプションです。部分データの段階ではMIDI生成を行なわず（どうせまだ不完全なので）、 `ontoolinput` で完全なデータが揃ってから生成する、という使い分けです。

プログレッシブレンダリングを実装するときの定型パターンとして覚えておくと便利です。

## Appクラスのフックでライフサイクルを管理する

[`@modelcontextprotocol/ext-apps`](https://github.com/modelcontextprotocol/ext-apps) の `App` クラスには6つのフックがあり、 **`connect()` を呼ぶ前にすべて登録する**必要があります。先ほどの `ontoolinputpartial` と `ontoolinput` に加えて、残り4つのフックも見ていきましょう。

### ontoolresult

サーバーでツールの実行が完了すると `ontoolresult` が発火します。midi-mcp-serverでは、サーバーが生成したMIDI base64データをここで取得しています。

```typescript{file: "src/mcp-app.ts"}
app.ontoolresult = (params) => {
  if (params.isError || currentMidiBase64) return;
  // structuredContent から取得（LLMにトークンを消費させない）
  const sc = params.structuredContent;
  if (sc?.midiBase64 && typeof sc.midiBase64 === 'string') {
    currentMidiBase64 = sc.midiBase64;
    btnDownload.disabled = false;
    return;
  }
};
```

ここでのポイントは、サーバーが返したMIDI base64データを **`structuredContent` 経由** で取得している点です。 `content` ではなく `structuredContent` を使うことで、**LLMにbase64の大量トークンを消費させずにView側だけにデータを渡せる**のがうれしいところです。 `structuredContent` の詳細は後述しますが、MIDIのbase64は数KB〜数十KBに及ぶため、 `content` で返してしまうとLLMが毎ターンこの塊を読み続けることになってしまい、もったいないわけです。

また、MCP AppsのViewはサンドボックスiframe内で動作するため、 `<a download>` のような通常のダウンロード手法が使えません。代わりに、ここで取得したBase64データを後述の `app.downloadFile()` に渡してホスト経由でダウンロードさせる仕組みになっています。

![MCP Appsから直接ファイルのダウンロードはできないので、ホスト経由でダウンロードさせる](/images/blog/mcp-apps-download-midi.gif)

### ontoolcancelledとonteardown

ユーザーがツール呼び出しをキャンセルしたり、チャットを閉じたりした場合のクリーンアップも重要です。

```typescript{file: "src/mcp-app.ts"}
app.ontoolcancelled = (_params) => {
  player.stop();
  btnPlay.disabled = true; btnStop.disabled = true;
  btnDownload.disabled = true;
  statusText.textContent = 'Cancelled';
};

app.onteardown = (_params, _e) => {
  player.destroy();  // AudioContext破棄、キャッシュクリア
  return {};
};
```

`ontoolcancelled` はユーザーがツール呼び出しを中断した場合に発火し、 `onteardown` はホストがView自体を破棄する際に発火します。midi-mcp-serverでは音声再生の停止や[AudioContext](https://developer.mozilla.org/ja/docs/Web/API/AudioContext)の破棄を行なっています。**リソースリークを防ぐためにも、この2つのフックは忘れずに実装しておきたいところです。**

### onhostcontextchanged

ホスト環境が変化したとき（ダークモード/ライトモードの切り替え等）に発火するフックです。

```typescript{file: "src/mcp-app.ts"}
app.onhostcontextchanged = (params) => {
  if (params.context) {
    applyHostStyleVariables(params.context);
    applyDocumentTheme(params.context);
    applyHostFonts(params.context);
    if (params.context.displayMode) updateFsBtn(params.context.displayMode);
    if (currentComposition) renderNotation(currentComposition, notationDiv);
  }
};
```

`@modelcontextprotocol/ext-apps` が提供する `applyHostStyleVariables` ・ `applyDocumentTheme` ・ `applyHostFonts` を呼ぶだけでホストのスタイル変数・テーマ・フォントを反映できます。テーマが変わったらピアノロールも再描画して、グリッド線やテキストの色を合わせるようにしています。

![テーマ変更に合わせてUIの色も変わる](/images/blog/mcp-apps-dakrmode.png)

さらに `params.context.displayMode` で現在の表示モード（後述する `fullscreen` 等）も取得できるため、表示モード変更時のUI更新もここで行なえます。

### フック登録とconnect()

これらのフックはすべて `app.connect()` の前に登録する必要があります。 `connect()` が成功すると `getHostContext()` でホストの初期状態を取得できます。

```typescript{file: "src/mcp-app.ts"}
const app = new App({ name: 'midi-preview', version: '0.3.0' }, {});

// ↑ この後にフックを登録（前述の6つ）

app.connect()
  .then(() => {
    const ctx = app.getHostContext();
    if (ctx) {
      applyHostStyleVariables(ctx);
      applyDocumentTheme(ctx);
      applyHostFonts(ctx);
    }
  })
  .catch(() => {
    statusText.textContent = 'Standalone mode — waiting for data…';
  });
```

`connect()` が失敗した場合（スタンドアロンでHTMLを開いた場合など）のフォールバックも入れておくと開発時に便利です。

## Viewからの双方向通信

MCP Appsが**単なる表示するだけのUI**ではなく**アプリケーション**と呼ばれる所以が、この双方向通信の仕組みです。 `App` クラスはフック以外にも、**View側からホストやサーバーと対話するためのメソッド**を提供しています。

midi-mcp-serverではこれらのメソッドをフル活用（ただ使いたくて詰め込んだだけ）しているので、1つずつ実際の動作と合わせて見ていきましょう。

### callServerTool

View側（iframe内のUI）からMCPサーバーのツールを直接呼び出せます。midi-mcp-serverでは、**Chord Analyzerパネル**でこの仕組みを使っています。

```typescript{file: "src/mcp-app.ts"}
async function analyzeChord() {
  const chord = chordInput.value.trim();
  const octave = parseInt(chordOctave.value, 10);
  try {
    const result = await app.callServerTool({
      name: 'parse_chord',
      arguments: { chord, octave },
    });
    const data = JSON.parse(result.content[0].text);
    chordResult.innerHTML = `
      <div class="chord-name">${data.chord}</div>
      <div class="chord-notes">Notes: <strong>${data.noteNames.join(' – ')}</strong></div>
      <div class="chord-midi">MIDI: ${data.midiNumbers.join(', ')}</div>
    `;
  } catch (e) {
    // エラー表示
  }
}
```

ユーザーがChord Analyzerにコード名（例: `Cmaj7`）を入力してAnalyzeボタンを押すと、View側から `parse_chord` ツールが呼び出されます。**このやり取りはLLMを介さず、View→サーバー間で直接行なわれる**のがポイントです。LLMのターンを消費せず、レスポンスも高速です。

![Chord Analyzerを実行している様子](/images/blog/mcp-apps-parse-chord.png)

サーバー側の `parse_chord` ツールは通常の `server.registerTool()` で登録したMCP Apps非対応のツールプリミティブですが、View側から `callServerTool` で呼び出せます。つまり、**UIを持たない既存のツールでもView側から利用できる**ので再利用性が高いです。

### readServerResource

MCPサーバーが公開しているプリミティブのリソースをMCP AppsのView側から直接読み取ることもできます。前述しましたがmidi-mcp-serverでは、サーバーに登録した7つの音楽理論リソースを**Music Theory Referenceパネル**から参照できるようにしています。

```typescript{file: "src/mcp-app.ts"}
theorySelect.addEventListener('change', async () => {
  const uri = theorySelect.value;  // e.g. 'music-theory://harmony'
  if (!uri) return;
  try {
    const result = await app.readServerResource({ uri });
    theoryContent.innerHTML = renderMarkdown(result.contents[0]?.text ?? '');
  } catch (e) {
    theoryContent.innerHTML = `<p class="error">Failed: ${e.message}</p>`;
  }
});
```

サーバー側では `server.registerResource()` で通常のMCPリソースとして登録しているだけです。

```typescript{file: "src/server.ts"}
for (const res of MUSIC_THEORY_RESOURCES) {
  const content = loadResource(res.file);
  server.registerResource(
    res.name,
    res.uri,  // e.g. 'music-theory://harmony'
    { description: res.description, mimeType: 'text/markdown' },
    async () => ({
      contents: [{ uri: res.uri, mimeType: 'text/markdown', text: content }],
    })
  );
}
```

これは `registerAppResource`（UIリソース用）とは別で、通常のMCPリソース登録です。MCP Appsのツールでないリソースでも、リソースUI側から `readServerResource` で読めるということを意味しています。チャット画面を離れることなく、AI作曲のバックグラウンド知識を参照できるわけです。

### sendMessage

`sendMessage` はチャットにメッセージを送信し、**モデルに即座に新しいターンを開始させる**メソッドです。midi-mcp-serverでは**Continueボタン**で使っています。

```typescript{file: "src/mcp-app.ts"}
btnAskClaude.addEventListener('click', async () => {
  if (!currentComposition) return;
  const title = titleEl.textContent || 'this piece';
  const bpm = currentComposition.bpm;
  const tracks = currentComposition.tracks.map((t) => t.name || 'unnamed').join(', ');
  await app.sendMessage({
    role: 'user',
    content: [{
      type: 'text',
      text: `Please continue "${title}" by adding 8 more bars. ` +
            `Keep the same key, tempo (${bpm} BPM), and style. Tracks: ${tracks}.`,
    }],
  });
});
```

ボタンを押すと、現在の楽曲情報を含んだメッセージがClaudeに送られ、Claudeが新しいターンとして**続きの8小節**を作曲し始めます。**UIの操作がそのままAIへの指示になる**という、MCP Appsならではの体験です。

![Continueボタンで続きを生成させる](/images/blog/mcp-apps-continue-claude.gif)

### downloadFileとrequestDisplayMode

先述の `ontoolresult` で触れたとおり、MCP AppsのViewはサンドボックスiframe内で動作するため、通常の `<a download>` によるファイルダウンロードが使えません。 `downloadFile` はこの制約を回避するメソッドで、ホストにBase64データを渡して代わりにダウンロードしてもらう仕組みです。midi-mcp-serverではMIDIファイルのダウンロードに使っています。

```typescript{file: "src/mcp-app.ts"}
await app.downloadFile({
  contents: [{
    type: 'resource',
    resource: {
      uri: `file:///${filename}`,
      mimeType: 'audio/midi',
      blob: currentMidiBase64,
    },
  }],
});
```

`requestDisplayMode` はViewの表示モードを切り替えるメソッドです。midi-mcp-serverでは全画面表示の切り替えに使っています。 `getHostContext()` で現在の表示モードと利用可能なモードを取得し、 `inline` と `fullscreen` を切り替えます。ピアノロールのような視覚的なUIは全画面で見たくなるので、地味にこの機能はありがたいです。

```typescript{file: "src/mcp-app.ts"}
btnFullscreen.addEventListener('click', async () => {
  const ctx = app.getHostContext();
  const current = ctx?.displayMode ?? 'inline';
  const next = current === 'fullscreen' ? 'inline' : 'fullscreen';
  await app.requestDisplayMode({ mode: next });
});
```

![シームレスにFullScreenになる](/images/blog/mcp-apps-fullscreen.gif)

ここまで見てきたように、 `App` クラスのメソッドにより、MCP Appsは**ホスト・サーバー・Viewの三者間で双方向にデータをやり取りできるアプリケーション基盤**として機能します。

## ツール結果のデータ経路とVisibility

### content, structuredContent, _metaの使い分け

MCP Appsのツール結果には3つのデータ経路があり、用途によって使い分けます（[MCP Apps Build Guide](https://modelcontextprotocol.io/extensions/apps/build)より）。

`content` はLLMに公開されるデータです。テキストレスポンスや生成結果のサマリーなど、モデルが次のターンで参照するべき情報を入れます。midi-mcp-serverでは `MIDI file generated successfully. 2 track(s), 120 BPM.` のようなテキストを返しています。

`structuredContent` はViewのレンダリング用に渡す構造化データです。ホストの実装によってはLLMのコンテキストに渡らないよう制御されるため、大量のデータをUIに渡しつつトークン消費を抑えたい場合に便利です。midi-mcp-serverでも、**まさにこの仕組みを使ってMIDI base64データをViewに渡しています**。MIDIのbase64は数KB〜数十KBに及ぶため、これを `content` で返してしまうとLLMが大量のトークンを消費してしまいますが、 `structuredContent` 経由ならダウンロード用にView側でのみ利用できます。波形データや詳細な分析結果など、人間向けの表示データを大量に渡すケースでも同様に活用できます。

![レスポンスには文字情報が入るけどBase64は入らない](/images/blog/mcp-apps-response.png)

`structuredContent` を返すには、ツール定義時に `outputSchema` を宣言しておく必要があります。先ほどの `registerAppTool` の例でも、 `midiBase64` ・ `title` ・ `bpm` ・ `trackCount` のスキーマを定義しておくことで、型付きの `structuredContent` を返せるようにしています。

`_meta` はタイムスタンプやバージョンなどのメタデータ用で、LLMには非公開です。

この使い分けは、MCP Appsを設計するうえでかなり重要です。**UIの表示にしか使わないデータは `structuredContent` に逃がす**のが定番で、 `content` に大量のデータを詰めるとトークンを消費してしまいます。

## Claude.aiで使ってみる

midi-mcp-serverをClaude.aiから使うには、設定画面でリモートMCPサーバーのURLを追加するだけです。

```text
https://midi-mcp-server.tubone24.workers.dev
```

![claude.aiのコネクタからリモートMCPサーバーのアドレスを追加するだけ](/images/blog/mcp-apps-setting.png)

接続ができたら、あとはシンプルに頼むだけです。

> 最近流行りのJ-POPをMIDIで作って

これだけで、AIが `create_midi` ツールを呼び出し、BPM、トラック、ノート情報を構造化データとして生成し始めます。

もし、もう少し音楽理論に沿って作曲してほしければ、MCPのリソースプリミティブで展開されている**Music Theory Reference**を+ボタンから選択し、コンテキストに追加するのも便利です。

![claude.aiのコンテキストにMusic Theory Referenceを追加している様子](/images/blog/mcp-apps-resource-connector.png)

そして、AIがツール引数のJSONを生成している最中、 `ontoolinputpartial` フックによって部分的なデータがViewに逐次送られます。

最初のトラックの最初の数音が生成された時点で、ピアノロール上にノートが現れ始めます。AIが音符を追加するたびに譜面がリアルタイムに更新されていく様子は、**未来を感じざるをえません**（あばれるくん）！

![プログレッシブレンダリングによってピアノロールがリアルタイムに作られていく図](/images/blog/mcp-apps-progressive-render.gif)

トラック情報パネルにはトラック名、GM instrument番号、ノート数が表示されるので、AIがどんな構成で楽曲を作ったのかも一目でわかります。

Chord Analyzerでコードの構成音を調べたり、Music Theory Referenceで和声法やコード進行の基本を参照しながら、Continueボタンで「あと8小節追加して」とClaudeにリクエストする...という一連の流れが、すべてチャット画面を離れることなく完結します。

これがMCP Appsの魅力なのです。（ぜひ使ってみてください）

## 最後に

MCP Appsを使って、AIが作曲したMIDI楽曲をピアノロール譜面としてリアルタイムに可視化するMCPサーバーを作ってみました。

正直、 `ontoolinputpartial` による段階的な譜面描画は、想像していた以上に「おお...」となる体験でした。テキストのストリーミング表示とはまた違った没入感があります。そして `callServerTool` や `sendMessage` を組み合わせることで、単なるビジュアライザーではなく、**サーバーのツールを呼び出したりモデルに再指示を出したりできるインタラクティブなアプリケーション**になるのは、MCP Appsの本領発揮だと感じます。

`@modelcontextprotocol/ext-apps` の[examplesディレクトリ](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples)を眺めると、3DモデルビューアやPDFリーダー、QRコード生成器など、すでに面白い事例がたくさん出てきています。MCP Appsはまだ登場して間もない仕様ですが、自分のような実装力に自信のない人間でもそれなりに形にできたので、データ可視化やフォーム入力、メディアプレビューなど、テキストだけでは表現しきれないユースケースに可能性を感じます。

自分の理解がまだまだ浅いのはさておき、MCPもまた触ると楽しいですね、というこの頃です。
