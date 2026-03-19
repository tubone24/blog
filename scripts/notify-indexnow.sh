#!/bin/bash
# IndexNow - Notify search engines about updated URLs
# Usage: ./scripts/notify-indexnow.sh [url1] [url2] ...
# If no URLs specified, notifies about the homepage

SITE_URL="https://tubone-project24.xyz"
INDEXNOW_KEY="b3a8d4e2f1c7a9b0"
INDEXNOW_ENDPOINT="https://api.indexnow.org/indexnow"

if [ $# -eq 0 ]; then
  URLS='["'"$SITE_URL"'/"]'
else
  URLS=$(printf '"%s",' "$@" | sed 's/,$//')
  URLS="[$URLS]"
fi

curl -s -X POST "$INDEXNOW_ENDPOINT" \
  -H "Content-Type: application/json; charset=utf-8" \
  -d '{
    "host": "tubone-project24.xyz",
    "key": "'"$INDEXNOW_KEY"'",
    "keyLocation": "'"$SITE_URL"'/'"$INDEXNOW_KEY"'.txt",
    "urlList": '"$URLS"'
  }'

echo ""
echo "IndexNow notification sent!"
