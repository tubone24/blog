#!/usr/bin/env bash
set -euo pipefail

# stop-typecheck.sh - Stop hook (Completion Gate)
# TS/TSXファイルが変更された場合にTypeScript型チェックを実行する
# stop_hook_activeフラグでループを防止

input="$(cat)"
SESSION_ID="$(jq -r '.session_id // "unknown"' <<< "$input")"

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/kagadminmac/project/blog}"
cd "$PROJECT_DIR" || exit 0

FLAG="/tmp/claude-stop-typecheck-${SESSION_ID}"

# ループ防止: フラグがあれば今回はスキップし、フラグを削除（次回は再実行可能）
if [ -f "$FLAG" ]; then
  rm -f "$FLAG"
  exit 0
fi

# 変更されたファイルを確認
CHANGED=$(git diff --name-only 2>/dev/null || true)
STAGED=$(git diff --cached --name-only 2>/dev/null || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)
ALL_CHANGED=$(printf '%s\n%s\n%s' "$CHANGED" "$STAGED" "$UNTRACKED")

TS_CHANGED=$(echo "$ALL_CHANGED" | grep -E '\.(ts|tsx|astro)$' || true)
if [ -z "$TS_CHANGED" ]; then
  exit 0
fi

# フラグを立てる（テスト実行前に。失敗時にフラグが残りループ防止になる）
touch "$FLAG"

ERRORS=$(npx tsc --noEmit 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "TypeScript type check failed. Fix these errors:" >&2
  echo "$ERRORS" >&2
  exit 2
fi

# 成功したらフラグ削除（次回のStopでも実行可能にする）
rm -f "$FLAG"
exit 0
