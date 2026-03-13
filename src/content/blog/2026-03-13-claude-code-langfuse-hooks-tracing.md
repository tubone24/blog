---
slug: 2026/03/13/claude-code-langfuse-hooks-tracing
title: "Claude CodeのHooksとLangfuseで、コーディングエージェントの動きを丸裸にする"
date: 2026-03-13
description: Claude Codeの全イベントをLangfuseにトレースする仕組みをHooksとシェルスクリプトで構築しました。OTELでは取りきれないLLMの入出力やツール実行の詳細まで、泥臭く可視化する方法を紹介します。
tags:
  - Claude Code
  - Langfuse
  - LLMOps
headerImage: https://i.imgur.com/6B7WC7D.jpg
templateKey: blog-post
useAi: true
---

暖かくなってきましたね。桜の季節です。花粉もすごいです。

## Table of Contents

```toc

```

## はじめに

[Claude Code](https://docs.anthropic.com/en/docs/claude-code/overview)を毎日のように使っていると、ふと気になることってありませんか？「今の開発セッションで、こいつはどれだけのトークンを消費して、何回ツールを呼んで、どんな思考プロセスを経て、最終的にあの回答にたどり着いたんだろう？」と。

[Max plan](https://www.anthropic.com/pricing)を使っているので、コスト面ではそこまで気にしてないんですが、それでもやっぱり一回の開発でどれくらいのリソースが使われているのか、どのツールがどんな頻度で呼ばれているのかは知りたくなるんですよね。そして何より、Claude Codeの内部の動きを観察することは、**自分がこれから作るAIエージェントの設計にめちゃくちゃ参考になる**はずです。

で、今回はそういうモチベーションから、[Langfuse](https://langfuse.com/)とClaude Codeの[Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)機能を組み合わせて、コーディングエージェントのオブザーバビリティを確保する仕組みを構築してみました。

## Claude Codeをトレースしたくなった理由

そもそもなんでClaude Codeをトレースしたいのかという話なんですが、理由はいくつかあります。

まず、**ツール呼び出しのパターンを知りたかった**。Claude Codeは `Read` や `Bash` 、 `WebSearch` など多数のツールを駆使しますが、どのツールがどのタイミングで、どんな入力で呼ばれているのかを俯瞰できると、エージェントの振る舞いへの理解がぐっと深まります。結局これが自分でエージェントを作るときの一番の参考になるんですよね。

あとは、[Extended Thinking](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)の挙動も気になっていました。エフォートレベルを上げたときにthinkingがどう変わるのか、サブエージェントを使ったときのインプットとアウトプットがどうなっているのかを観察して、コンテキストウィンドウの制約があるなかでも質の高い出力ができる設計を自分のエージェントにも取り入れたいなと。

そして、**自分のプロンプトの癖を振り返りたかった**というのもあります。最近は `/insights` コマンドやスキル機能が充実してきましたが、どういう指示の出し方をしたときにうまくいって、どういうときにコケているのかを体系的に振り返るには、やっぱりLLMOpsツールの力を借りるのが一番です。

## LangfuseとOpenTelemetryの現状

### Langfuseとは

[Langfuse](https://langfuse.com/)は、LLMアプリケーション向けのオープンソースのオブザーバビリティプラットフォームです。トレーシング、評価、プロンプト管理、データセット機能を提供していて、OSSなのでセルフホストもできます。LLMOpsが好きすぎてこのツール群にハマった私が言うので間違いないです。

Langfuseについては過去に[AWSマネージドサービスでLangfuse v3を構築する記事](/2024-12-30/building-langfuse-v3-with-aws-managed-services/)や[Langfuse v3を安く運用する方法](/2025-02-16/cost-effective-langfuse-v3-deployment/)を書いてますので、基盤構築の話はそちらを参照ください。

### Claude CodeのOTELサポート

Claude Codeには[OpenTelemetry](https://opentelemetry.io/)（OTEL）のネイティブサポートが組み込まれています（[公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/monitoring)より）。環境変数を設定するだけでテレメトリデータを送信できます。

```bash
export CLAUDE_CODE_ENABLE_TELEMETRY=1
export OTEL_METRICS_EXPORTER=otlp
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4317
```

OTELで取得できるメトリクスは以下のようなものがあります。

| メトリクス | 内容 |
|-----------|------|
| `claude_code.session.count` | セッション開始数 |
| `claude_code.token.usage` | トークン使用量（input/output/cache別） |
| `claude_code.cost.usage` | コスト（USD） |
| `claude_code.lines_of_code.count` | コード変更行数 |
| `claude_code.code_edit_tool.decision` | 編集ツールの許可/拒否数 |

イベント（ログ）としては `claude_code.tool_result` や `claude_code.api_request` なども取得可能で、運用メトリクスとしてはかなり充実しています。

### OTELだけでは足りなかった理由

ところが、いざOTELでLangfuseに直接送ろうとすると困ったことになります。

**Claude CodeのOTELは「メトリクス」と「ログ/イベント」をエクスポートしますが、「トレース（Spans）」はエクスポートしません。**一方で、LangfuseのOTELエンドポイントは「トレース（Spans）」しか受け入れません。つまり、Claude Codeが出すデータ形式とLangfuseが受け入れるデータ形式が噛み合わないんです（[GitHub Issue #9584](https://github.com/anthropics/claude-code/issues/9584)で機能要望中）。困りましたね。

「じゃあOTELコレクターを間に挟めばいいのでは？」と思うかもしれませんが、ログをトレースに変換する標準的な方法がないので、これでも解決しません。

さらに根本的な課題として、OTELではLLMのレスポンス内容（assistant output）やthinkingの内容、ツール実行の入出力の詳細が取れません。 `tool_result_size_bytes` のようなサイズ情報はあっても、実際にどんなコマンドが打たれて何が返ってきたかまでは見えないんですよね。

| 情報 | OTEL | Hooks |
|------|------|-------|
| トークン使用量・コスト | 取得可能 | transcript経由で取得可能 |
| LLMのレスポンス内容 | 取得不可 | transcript経由で取得可能 |
| thinking内容 | 取得不可 | transcript経由で一部取得可能 |
| ツール入力の詳細 | 一部のみ | 完全なJSON取得可能 |
| ツール出力の詳細 | サイズのみ | 完全なJSON取得可能 |
| セッションの会話履歴 | 取得不可 | transcript経由で取得可能 |

**ならば、Hooksを使って泥臭くやるしかない。**そう決めて、シェルスクリプトでLangfuseのIngestion APIを直接叩く方針に切り替えました。

## データモデルの設計

さて、ここからが設計の話です。Claude Codeの概念をLangfuseのデータモデルにどうマッピングするか、というやつですね。

Langfuseのデータモデルは**Session → Trace → Observation**の3層構造になっています。Observationの基本的な種類として**Span**（期間のある汎用操作）、**Generation**（LLM呼び出し専用）、**Event**（単発イベント）の3つがあり、今回のマッピングではこれらを使います。Generationは `model` や `usageDetails` 、 `costDetails` といったLLM固有のフィールドを持っているのがミソです。

この構造をClaude Codeの動きに対応させると、こんな感じになります。

```mermaid
flowchart TD
    subgraph Langfuse
        S[Session<br/>Claude Codeセッション]
        T1[Trace: turn-1<br/>ユーザープロンプト1]
        T2[Trace: turn-2<br/>ユーザープロンプト2]
        SP1[Span: tool:Bash<br/>ツール実行]
        SP2[Span: tool:Read<br/>ツール実行]
        SP3[Span: subagent:Explore<br/>サブエージェント]
        SP4[Span: tool:Grep<br/>子ツール実行]
        G1[Generation: llm:streaming<br/>ストリーミング出力]
        G2[Generation: llm:tool_use<br/>ツール呼び出し判断]
        G3[Generation: llm:end_turn<br/>最終回答]
        E1[Event: notification<br/>通知]
        E2[Event: response_complete<br/>応答完了]

        S --> T1
        S --> T2
        T1 --> SP1
        T1 --> SP2
        T1 --> SP3
        SP3 --> SP4
        T1 --> G1
        T1 --> G2
        T1 --> G3
        T1 --> E1
        T1 --> E2
    end
```

| Claude Codeの概念 | Langfuseのデータ型 | 説明 |
|-------------------|-------------------|------|
| セッション（ `session_id` ） | Session | Claude Code起動から終了まで |
| ユーザープロンプト | Trace | 1つの質問・指示が1つのトレース |
| ツール実行 | Span | `PreToolUse` で開始、 `PostToolUse` で完了 |
| サブエージェント | Span（親） | 子ツールの `parentObservationId` として機能 |
| LLM呼び出し | Generation | transcript解析で `stop_reason` ごとに生成 |
| 通知・コンパクション | Event | 単発イベントとして記録 |

## Hooksとシェルスクリプトによる実装

### Hooksの設定

[Claude Code Hooks](https://docs.anthropic.com/en/docs/claude-code/hooks)は、Claude Codeのライフサイクルイベントに応じてユーザー定義のシェルコマンドを実行できる機能です。ツール実行前後やセッションの開始・終了など、いろんなタイミングにフックを仕込めます。前回の記事で紹介した[Slack通知の仕組み](/2026/03/05/claude-code-remote-control-slack-notification/)もこのHooksを使っています。

で、今回のアプローチでは、**すべてのHookイベントに同一のシェルスクリプト `langfuse-logger.sh` を登録**するというなかなかの力技なことをしています。 `settings.json` の設定はこんな感じです。

```json{file: "~/.claude/settings.json"}
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "bash ~/.claude/hooks/scripts/langfuse-logger.sh", "timeout": 10 }]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "bash ~/.claude/hooks/scripts/langfuse-logger.sh", "timeout": 10 }]
      }
    ],
    "Stop": [
      {
        "matcher": "",
        "hooks": [{ "type": "command", "command": "bash ~/.claude/hooks/scripts/langfuse-logger.sh", "timeout": 10 }]
      }
    ]
  }
}
```

実際にはこれだけでなく、 `SessionStart` 、 `SessionEnd` 、 `UserPromptSubmit` 、 `PostToolUseFailure` 、 `SubagentStart` 、 `SubagentStop` 、 `Notification` 、 `PreCompact` 、 `PermissionRequest` 、 `InstructionsLoaded` 、 `ConfigChange` の全イベントに登録しています。 `matcher` を空文字列にすることですべてのツール・イベントにマッチするようにしています。

Hookスクリプトには標準入力を通じてJSON形式のコンテキスト情報が渡されます。全イベント共通のフィールドとして `session_id` 、 `hook_event_name` 、 `transcript_path` 、 `cwd` 、 `permission_mode` があり、さらにツール系イベント（`PreToolUse` / `PostToolUse` 等）では `tool_name` や `tool_input` といったイベント固有のフィールドも含まれます。これらを解析してLangfuseに送信するわけです。

### セッションとトレースの管理

`SessionStart` イベントが発火すると、セッションの初期化を行ないます。Claude Codeの `session_id` をそのままLangfuseのSession IDとして使い、初期トレースを作成します。同時にGit情報（ブランチ名、コミットハッシュ）も取得してメタデータに含めます。

```bash{file: "~/.claude/hooks/scripts/langfuse-logger.sh"}
SessionStart)
    TRACE_ID="${SESSION_ID}-init"
    echo "$TRACE_ID" > "$STATE_DIR/current-trace-id"

    # Git情報をキャプチャ
    capture_git_info "$CWD"
    # （中略）
    send "$PAYLOAD"
    ;;
```

ユーザーがプロンプトを入力すると `UserPromptSubmit` イベントが発火し、**新しいトレースを作成**します。ターンカウンターをインクリメントして `{session_id}-turn-{n}` というIDを振り、ユーザーの入力をトレースの `input` に記録します。

```bash{file: "~/.claude/hooks/scripts/langfuse-logger.sh"}
UserPromptSubmit)
    TURN=$(next_turn)
    TRACE_ID="${SESSION_ID}-turn-${TURN}"
    echo "$TRACE_ID" > "$STATE_DIR/current-trace-id"

    PROMPT=$(echo "$INPUT" | jq -r '.prompt // ""' | head -c 10240)
    echo "$PROMPT" > "$STATE_DIR/prompt"
    # （中略）
    ;;
```

状態管理には `/tmp/claude-langfuse/{session_id}/` ディレクトリを使っています。現在のトレースID、ターン番号、モデル名、Gitブランチなどをファイルとして保存し、イベント間で共有する仕組みです。めちゃくちゃ泥臭いですが、シェルスクリプトで状態を持つにはこれが一番シンプルなんですよね。すみません。

### ツール実行の記録

ツールの実行は `PreToolUse` と `PostToolUse` のペアで記録します。

`PreToolUse` が発火するとSpanを作成して、ツール名や入力パラメータを記録します。ちょっと工夫しているのが、 `tool_input` からキーフィールドを抽出して `input_summary` としてメタデータに入れているところです。Bashならコマンド文字列、Readならファイルパス、WebSearchならクエリ文字列を抜き出しておくことで、Langfuse上でパッと見てどんな操作だったかわかるようにしてあります。これ、地味に便利です。

```bash{file: "~/.claude/hooks/scripts/langfuse-logger.sh"}
INPUT_SUMMARY=$(echo "$INPUT" | jq -c '{
    file_path: .tool_input.file_path,
    command: (.tool_input.command // .tool_input.description),
    pattern: .tool_input.pattern,
    url: .tool_input.url,
    query: .tool_input.query,
    prompt: (.tool_input.prompt // null | if . then .[0:200] else null end),
    skill: .tool_input.skill
} | with_entries(select(.value != null))' 2>/dev/null || echo '{}')
```

`PostToolUse` ではSpanを更新して `endTime` とツールのレスポンスを記録します。 `PreToolUse` と `PostToolUse` のペアリングには `tool_use_id` を使っています。Claude Codeはツールを並列に呼び出すことがあるので、ツール名だけではどのSpanに対応するかが一意に決まらないためです。

`PostToolUseFailure` が発火した場合は、Spanのレベルを `ERROR` に設定してエラーメッセージを記録します。これがあるおかげで、Langfuse上でセッションやトレースをざっと眺めたときに、**どこでエラーが起きたかが一目で分かる**ようになっています。

ちなみに、Claude Codeはサンドボックス機能を持っていて、特定のディレクトリやネットワークホストへのアクセスを制限できます。たまにサンドボックスを無効化しなければならない場面があるんですが、その場合は `dangerouslyDisableSandbox: true` というフラグが `tool_input` に含まれるので、それもメタデータとして記録しています。

### サブエージェントの追跡

Claude Codeには[サブエージェント](https://docs.anthropic.com/en/docs/claude-code/sub-agents)という機能があります。メインで動くエージェントの子供になるエージェントを作って、コンテキストを分離したり並列で実行したりできるやつです。これがまた強力なんですよ。

サブエージェントもSpanとして記録しています。 `SubagentStart` でSpanを作成し、そのSpan IDを `subagent-{agent_id}` というファイルに保存します。サブエージェント内でツールが呼ばれると、 `agent_id` フィールドが標準入力に含まれるので、それを使って親のSpan IDを探し、 `parentObservationId` として設定します。これにより、Langfuse上でサブエージェントのなかでどんなツールが呼ばれたかが親子構造で表示されます。

`SubagentStop` ではSpanを更新して、 `last_assistant_message` をアウトプットに記録します。サブエージェントのインプットについてはエージェントの種類（`agent_type`）くらいしか取れる情報がないんですが、アウトプットはかなり参考になります。サブエージェントがどんな分析をして何を出しているのかが見えるので、エージェント設計の勉強になります。

### Generationの取得――最大の難所

さて、ここまで読んできた方のなかには「肝心なことを忘れていないか？」と気づいた方もいらっしゃるんじゃないかなと思います。

**LLMの入出力、つまりGenerationのデータです。**

Langfuseの真価って、LLMに何を入力して何が出力されたかを記録する**Generation**にあるんですよね。普通のオブザーバビリティツールとの違いはまさにこの部分です。ところが、残念ながらClaude CodeのHooksからはLLMの入出力を直接取得する手段がありません。

そもそもHooksは何のための機能かというと、Claude Codeを安全に・便利に運用するための仕掛けです。ツールを使うときに事前チェックを入れたり、 `.env` ファイルへのアクセスをブロックしたり、セッション終了時に通知を飛ばしたり。**LLMが何を考えて何を出したか**をキャプチャする用途は、そもそもHooksの設計思想にないわけです。LLMが何かしようとしたときに何かを動かすための仕組みであって、LLMそのものの出力を見るためのものじゃない、というやつですね。

じゃあどうするかというと、ちょっと面倒くさいことをします。**Stopフックのタイミングでtranscriptファイルを読みに行く**のです。

Claude Codeはセッションの履歴をJSONL形式のtranscriptファイルとして `~/.claude/projects/` 配下に保存しています（[公式ドキュメント](https://docs.anthropic.com/en/docs/claude-code/monitoring)より）。このファイルには、ユーザーの入力、アシスタントの応答、ツール呼び出しとその結果、thinkingブロックなど、セッションの全情報が含まれています。

`Stop` フックが発火するのは、LLMがトークンの出力を止めたタイミングです。このタイミングでtranscriptファイルの差分（`UserPromptSubmit` 以降に追加された行）を読み取り、 `type: "assistant"` のメッセージからGenerationを構築します。

```bash{file: "~/.claude/hooks/scripts/langfuse-logger.sh"}
# ターン内の全LLM呼び出しを個別 Generation として記録
TURN_LINES=$(tail -n +"$((TRANSCRIPT_OFFSET + 1))" "$TRANSCRIPT_PATH" 2>/dev/null \
    | tr -d '\000-\011\013\014\016-\037')

GENERATION_BATCH=$(echo "$TURN_LINES" \
    | jq -sc --arg traceId "$TRACE_ID" \
      --argjson pInput "$P_INPUT" --argjson pOutput "$P_OUTPUT" \
      --argjson pCacheRead "$P_CACHE_READ" --argjson pCacheCreate "$P_CACHE_CREATE" '
      [.[] | select(.type == "assistant" and .message.usage != null)] |
      # （中略：thinking-onlyメッセージのマージ、generation batchへの変換）
    ')
```

ここで重要なのが、Generationを `stop_reason` によって分類しているところです。transcriptのassistantメッセージには `stop_reason` フィールドがあり、主に `null` 、 `"tool_use"` 、 `"end_turn"` の3つの値を取ります。

| `stop_reason` | 意味 | Generationの種類 |
|---------------|------|-----------------|
| `null` | 中間メッセージ | `llm:streaming` ：Extended Thinkingの中間状態や進捗報告テキスト |
| `"tool_use"` | ツール呼び出しで応答終了 | `llm:tool_use` ：どのツールを呼ぶか判断した結果 |
| `"end_turn"` | 自然に応答完了 | `llm:end_turn` ：ユーザーへの最終回答 |

実際のtranscriptを眺めると、 `stop_reason: null` のメッセージが最も多く、全体の6〜7割を占めます。Extended Thinkingの思考フェーズ中のメッセージや、エージェント間の調整用メッセージ（進捗報告など）がこれに該当します。その後のツール実行指示が `tool_use` 、ユーザーへの最終回答が `end_turn` になります。

`end_turn` のGenerationには、ツールの実行結果を踏まえた上でのインプット（`tool_results`）とアウトプット（ユーザーに表示されるテキスト）が含まれるので、**LLMがどんな情報をもとに最終回答を組み立てたか**が見えるようになります。

### セッション全体のコスト集計

さて、ここからはコストの話です。 `SessionEnd` フックでは、セッション全体のトークン使用量とコストを集計してGenerationとして記録しています。transcriptファイルの全行からusage情報を集計して、モデル別の価格テーブルを使ってコストを算出します。

```bash{file: "~/.claude/hooks/scripts/langfuse-logger.sh"}
get_model_pricing() {
    local model="$1"
    case "$model" in
        *opus*)
            # Opus 4.6: Input$5/Output$25/CacheRead$0.50/CacheWrite(5min)$6.25 per MTok
            echo "0.000005 0.000025 0.0000005 0.00000625"
            ;;
        *haiku*)
            # Haiku 4.5: Input$1/Output$5/CacheRead$0.10/CacheWrite(5min)$1.25 per MTok
            echo "0.000001 0.000005 0.0000001 0.00000125"
            ;;
        *)
            # Sonnet 4.6/4.5 (default): Input$3/Output$15/CacheRead$0.30/CacheWrite(5min)$3.75 per MTok
            echo "0.000003 0.000015 0.0000003 0.00000375"
            ;;
    esac
}
```

キャッシュの読み込み（`cache_read_input_tokens`）やキャッシュの作成（`cache_creation_input_tokens`）も考慮して、非キャッシュ分のinputトークン、キャッシュ読み込み分、キャッシュ作成分をそれぞれの単価で計算しています。 `awk` でコスト計算をしているのはシェルスクリプトの制約上の工夫ですね。

この `session-total-usage` Generationのおかげで、Langfuse上でセッション単位のコスト感がパッと把握できるようになっています。「今日の開発セッション、意外とトークン使ったな」とか「キャッシュヒット率が高いな」とか、そういうのが見えるのが地味にうれしいです。

## thinkingテキストが見えなくなった話

ここで1つ、ちょっと残念な話をさせてください。

以前はtranscriptファイルにExtended Thinkingの内容がそのまま記録されていたんです。LLMが英語でどんな思考プロセスを経たかが丸見えでした。たとえば「The user wants me to run a task that exercises subagents, tools, and thinking mode...」のようなテキストが `thinking` フィールドに入っていて、これをLangfuseのGenerationの `input` に含めることで、**LLMの思考過程まで可視化**できていました。

ところが、ある日を境にClaude Codeのバージョンアップで、transcriptのthinkingフィールドが**空文字列**になりました。thinkingブロック自体は残っているんですが、中身のテキストが記録されなくなったのです。

おそらくは、プロンプトインジェクションなどの攻撃に対して脆弱にならないよう、思考プロセスの内容を外部に露出させないためのセキュリティ上の判断だと思います。手の内を明かさないということですね。

一方で、thinkingブロックの `signature` フィールドは依然として含まれています。[公式ドキュメント](https://docs.anthropic.com/en/docs/build-with-claude/extended-thinking)によると、これは "verify the integrity of the thinking block"（thinkingブロックの完全性を検証する）ためのフィールドで、マルチターン会話でthinkingブロックを再送する際に改ざんされていないことを保証する仕組みです。

signatureが存在すること自体が「このターンでthinkingが行なわれた」という証拠になるので、現在のシェルスクリプトではsignatureの有無をメタデータに `has_thinking: true` として記録しています。thinkingの中身は見えなくなりましたが、「thinkingしたかどうか」という事実は分かるわけです。

将来的にこの制限が緩和されるとめちゃくちゃうれしいんですけどね...。

## 実際のトレース結果

せっかくなので、実際にこの仕組みで記録されたトレースを見てみましょう。ちょうど桜の季節なので、「横浜の桜の開花日を予測して」というプロンプトをClaude Codeに投げてみました。

### トレースの全体像

このプロンプトに対して、Claude Codeは以下のような動きをしました。

まず、最初のGeneration（`llm:streaming`）で「横浜の桜の開花日を予測するために、複数の調査を並行して実施します。」というテキストが出力されます。これがストリーミングのGenerationです。

続いて、 `research-analyst` タイプのサブエージェントが起動されます。Langfuse上ではサブエージェントがSpanとして表示され、その内部で実行されたツールが子Spanとしてぶら下がる形になります。

（ここにトレース全体像のキャプチャを挿入）

### サブエージェント内のツール呼び出し

サブエージェント内では、大量の `WebSearch` と `WebFetch` が呼び出されていました。気象庁のデータ、ウェザーニュース、日本気象協会のtenki.jpなど、複数の情報源から過去の開花日データ、積算気温、2026年春の気温予想を収集しています。

たとえば `WebSearch` のSpanには、入力として `"query": "横浜 桜 ソメイヨシノ 開花日 過去データ 一覧 2005年〜2025年"` が、出力としてWeb検索の結果が記録されています。 `WebFetch` のSpanには、気象庁のデータページのURLと、そこから抽出された開花日の一覧が記録されています。

（ここにサブエージェント内のSpan詳細キャプチャを挿入）

### Generationの記録

最終的な `llm:end_turn` のGenerationを見ると、3つのサブエージェントの調査結果がインプットとして渡されており、アウトプットにはそれらを統合した「**予測: 3月20日〜22日（最有力は3月21日）**」という結論が記録されていました。過去の傾向、2026年の気象条件、積算気温法則による検証、各機関の最新予報を組み合わせた分析です。

こういった一連の流れがLangfuse上でトレース → Span → Generationの単位で可視化されるのは、エージェントの動きを理解する上でとても有用です。

（ここにGeneration詳細キャプチャを挿入）

### イベントの記録

ツールの実行以外にも、 `PermissionRequest`（ツール実行の承認待ち）や `notification`（通知）、 `response_complete`（応答完了）といったイベントもLangfuse上に記録されています。たとえばサブエージェントがファイルを書き込もうとした際に `PermissionRequest` が発生しており、ユーザーに承認を求めた事実が残っています。

（ここにイベント記録のキャプチャを挿入）

## 今後やりたいこと

トレースデータは蓄積できるようになったので、次にやりたいのは**Evaluation**です。

Langfuseには[LLM-as-a-Judge](https://langfuse.com/docs/scores/model-based-evals)という機能があります。記録されたトレースの入出力をLLMに渡して、自動で品質評価やスコアリングを実行してくれる機能です。人間のレビュアーとの一致度が80〜90%に達するらしく、かなり実用的な精度です。

これをClaude Codeのトレースに適用すると、自分のプロンプトが適切なアウトプットにつながっているか、ツールの利用が十分か、逆に無駄なツール呼び出しがないかを自動で評価できるようになります。

具体的には、トレース単位でEvaluatorを設定して、「このプロンプトに対してツールの選択は適切だったか」「最終回答は入力の意図を正しく反映しているか」みたいな観点でスコアリングするイメージです。サンプリング比率も設定できるので、全トレースを評価せずにコストを抑えることもできます。

まだ実装できてないんですが、これができればClaude Codeの使い方を体系的に改善していけるはずです。自分の「Claude Code術」をデータドリブンに磨いていけるというのは、かなり楽しみにしています。

## 最後に

Claude CodeのHooksとLangfuseのIngestion APIを組み合わせて、コーディングエージェントのオブザーバビリティを確保する仕組みを作ってみました。OTELでは取りきれないLLMの入出力やツール実行の詳細まで、シェルスクリプトで泥臭く可視化するアプローチです。

正直、transcriptファイルの解析やstop_reasonによるGeneration分類など、Claude Code内部の仕様に依存している部分が多くて、バージョンアップのたびに結果が変わることもあります。thinkingテキストが見えなくなったのもその一例ですし、毎日のように仕様が変わるのが逆に面白くもあります。

ただ、**自分が使っているエージェントの内側が見える**というのは思った以上に楽しい体験でした。Claude Codeがどんなツールをどんな順序で呼んでいるか、サブエージェントにどんな指示を出してどんな結果を受け取っているか。それを眺めていると、自分のエージェント設計にも活かせるヒントがゴロゴロ転がっています。

Evaluationがうまくいけばプロンプトの改善ループも回せるようになるはずなので、引き続きLLMOpsを楽しんでいきたいこの頃です。
