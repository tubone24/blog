#!/usr/bin/env bash
set -euo pipefail

# pre-edit-protect-config.sh - PreToolUse hook for Edit|Write
# リンター・フォーマッター・ビルド設定ファイルの編集をブロックする
# エージェントが「設定を変えてテストを通す」パターンを構造的に防止

input="$(cat)"
file="$(jq -r '.tool_input.file_path // .tool_input.path // empty' <<< "$input")"

if [ -z "$file" ]; then
  exit 0
fi

# basename取得
basename="$(basename "$file")"

# 保護対象ファイル一覧
PROTECTED_FILES=(
  ".eslintrc.js"
  ".eslintrc.json"
  ".eslintrc.yml"
  "eslint.config.js"
  "eslint.config.mjs"
  ".prettierrc.json"
  ".prettierrc.js"
  "prettier.config.js"
  "tsconfig.json"
  "stylelint.config.js"
  ".stylelintrc.js"
  ".stylelintrc.json"
  ".textlintrc.js"
  ".textlintrc.json"
  ".markdownlint.json"
  ".markdownlint-cli2.jsonc"
  "astro.config.mjs"
  "astro.config.ts"
)

for protected in "${PROTECTED_FILES[@]}"; do
  if [ "$basename" = "$protected" ]; then
    cat >&2 <<EOF
BLOCKED: $file is a protected config file.

WHY: エージェントがリンター/フォーマッター設定を変更してエラーを回避するパターンを防止するため。
     設定ファイルの変更はプロジェクトの品質基準を低下させる可能性がある。
FIX: 設定を変更するのではなく、コード側を修正してlintルールに準拠させてください。
     どうしても設定変更が必要な場合は、ユーザーに確認を取ってください。
EOF
    exit 2
  fi
done

# .husky/ 配下も保護
if [[ "$file" == *".husky/"* ]]; then
  cat >&2 <<EOF
BLOCKED: $file is a protected husky hook file.

WHY: Git hookの設定変更は品質ゲートを無効化する可能性がある。
FIX: husky設定の変更が必要な場合は、ユーザーに確認を取ってください。
EOF
  exit 2
fi

exit 0
