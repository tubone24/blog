#!/usr/bin/env bash
set -euo pipefail

# post-edit-lint.sh - PostToolUse hook for Edit|Write
# 自動修正を先に実行し、残ったlintエラーをWHY/FIX付きでClaudeにフィードバックする

input="$(cat)"
file="$(jq -r '.tool_input.file_path // empty' <<< "$input")"

if [ -z "$file" ] || [ ! -f "$file" ]; then
  exit 0
fi

ext="${file##*.}"
PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/kagadminmac/project/blog}"
cd "$PROJECT_DIR" || exit 0

diag=""
lint_type=""

case "$ext" in
  ts|tsx|js|jsx)
    lint_type="ESLint"
    # 自動修正を先に実行
    npx eslint --fix "$file" >/dev/null 2>&1 || true
    # 残ったエラーを確認
    diag="$(npx eslint "$file" 2>&1 | head -30)" || true
    ;;
  scss|sass|css)
    lint_type="Stylelint"
    npx stylelint --fix "$file" >/dev/null 2>&1 || true
    diag="$(npx stylelint "$file" 2>&1 | head -30)" || true
    ;;
  md)
    if [[ "$file" == *"src/content/"* ]]; then
      lint_type="textlint"
      npx textlint --fix "$file" >/dev/null 2>&1 || true
      diag="$(npx textlint "$file" 2>&1 | head -30)" || true
    else
      lint_type="markdownlint"
      npx markdownlint-cli2 --fix "$file" >/dev/null 2>&1 || true
      diag="$(npx markdownlint-cli2 "$file" 2>&1 | head -30)" || true
    fi
    ;;
  *)
    exit 0
    ;;
esac

# 残った診断結果がなければ成功
if [ -z "$diag" ]; then
  exit 0
fi

# WHY/FIX付きのエラーメッセージを構築
case "$lint_type" in
  ESLint)
    why="ESLintルールはこのプロジェクトのコード品質基準（airbnb + prettier）を強制している。自動修正で直らない違反はコードのロジック修正が必要。"
    fix="エラーメッセージのルール名を確認し、コード側を修正してください。eslint-disableコメントは原則使わず、ルールに準拠するコードを書いてください。設定ファイル(.eslintrc.js)の変更は禁止されています。"
    ;;
  Stylelint)
    why="Stylelintはこのプロジェクトのrecess-orderに基づくCSSプロパティ順序とSCSS規約を強制している。"
    fix="プロパティの順序を修正するか、SCSSの記法を規約に合わせてください。stylelint.config.jsの変更は禁止されています。"
    ;;
  textlint)
    why="textlintはブログ記事の日本語品質（表記揺れ、不適切な表現、AI文章パターン）を検出している。"
    fix="指摘された表現をより自然な日本語に修正してください。技術用語のスペルは公式表記に従ってください。.textlintrc.jsの変更は禁止されています。"
    ;;
  markdownlint)
    why="markdownlintはMarkdownの構造的な正しさ（見出しレベル、空行、リスト形式）を強制している。"
    fix="Markdownの構文を修正してください。.markdownlint.jsonの変更は禁止されています。"
    ;;
esac

# WHY/FIX付きメッセージをadditionalContextとしてJSON返却
message=$(cat <<EOF
ERROR: ${lint_type} violations in ${file} (auto-fix済み、残った違反):
${diag}

WHY: ${why}
FIX: ${fix}
EOF
)

jq -Rn --arg msg "$message" '{
  hookSpecificOutput: {
    hookEventName: "PostToolUse",
    additionalContext: $msg
  }
}'
