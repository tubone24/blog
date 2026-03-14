#!/usr/bin/env bash
set -euo pipefail

# stop-test.sh - Stop hook (Completion Gate)
# テストファイルまたはソースが変更された場合にJestを実行する
# stop_hook_activeフラグでループを防止

input="$(cat)"
SESSION_ID="$(jq -r '.session_id // "unknown"' <<< "$input")"

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/kagadminmac/project/blog}"
cd "$PROJECT_DIR" || exit 0

FLAG="/tmp/claude-stop-test-${SESSION_ID}"

# ループ防止: フラグがあれば今回はスキップし、フラグを削除
if [ -f "$FLAG" ]; then
  rm -f "$FLAG"
  exit 0
fi

# 変更されたファイルを確認
CHANGED=$(git diff --name-only 2>/dev/null || true)
STAGED=$(git diff --cached --name-only 2>/dev/null || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)
ALL_CHANGED=$(printf '%s\n%s\n%s' "$CHANGED" "$STAGED" "$UNTRACKED")

SPEC_CHANGED=$(echo "$ALL_CHANGED" | grep -E '\.(spec|test)\.(ts|tsx|js|jsx)$' || true)
SRC_CHANGED=$(echo "$ALL_CHANGED" | grep -E '^src/.*\.(ts|tsx|js|jsx)$' | grep -vE '\.(spec|test)\.' || true)

if [ -z "$SPEC_CHANGED" ] && [ -z "$SRC_CHANGED" ]; then
  exit 0
fi

# フラグを立てる
touch "$FLAG"

if [ -n "$SPEC_CHANGED" ]; then
  ERRORS=$(npx jest --bail --passWithNoTests $SPEC_CHANGED 2>&1)
elif [ -n "$SRC_CHANGED" ]; then
  ERRORS=$(npx jest --bail --passWithNoTests --findRelatedTests $SRC_CHANGED 2>&1)
fi
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "Jest tests failed. Fix these errors:" >&2
  echo "$ERRORS" >&2
  exit 2
fi

rm -f "$FLAG"
exit 0
