#!/usr/bin/env bash
set -euo pipefail

# stop-e2e.sh - Stop hook (Completion Gate)
# 実装完了時にCypress e2eテストを実行する
# stop_hook_activeフラグでループを防止

input="$(cat)"
SESSION_ID="$(jq -r '.session_id // "unknown"' <<< "$input")"

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-/Users/kagadminmac/project/blog}"
cd "$PROJECT_DIR" || exit 0

FLAG="/tmp/claude-stop-e2e-${SESSION_ID}"

# ループ防止: フラグがあれば今回はスキップし、フラグを削除
if [ -f "$FLAG" ]; then
  rm -f "$FLAG"
  exit 0
fi

# src/ 配下のファイルが変更されていなければe2eは不要
CHANGED=$(git diff --name-only 2>/dev/null || true)
STAGED=$(git diff --cached --name-only 2>/dev/null || true)
UNTRACKED=$(git ls-files --others --exclude-standard 2>/dev/null || true)
ALL_CHANGED=$(printf '%s\n%s\n%s' "$CHANGED" "$STAGED" "$UNTRACKED")

SRC_CHANGED=$(echo "$ALL_CHANGED" | grep -E '^src/' || true)
if [ -z "$SRC_CHANGED" ]; then
  exit 0
fi

# フラグを立てる
touch "$FLAG"

ERRORS=$(yarn test:e2e:ci 2>&1)
EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
  echo "E2E tests failed:" >&2
  echo "$ERRORS" >&2
  exit 2
fi

rm -f "$FLAG"
exit 0
