#!/usr/bin/env node

/**
 * IndexNow API送信スクリプト
 * デプロイ後に実行して、Bing/Yandex等に新しいURLを即時通知する
 *
 * 使い方:
 *   node scripts/indexnow.mjs              # サイトマップの全URLを送信
 *   node scripts/indexnow.mjs --recent 5   # 最新5件のみ送信
 */

import { readFileSync } from "fs";

const API_KEY = "b4fac17c-2dfe-46cf-93b0-c54933a186ee";
const HOST = "tubone-project24.xyz";
const SITE_URL = `https://${HOST}`;

function getUrlsFromSitemap() {
  const sitemap = readFileSync("dist/sitemap-posts.xml", "utf-8");
  const urls = [];
  const regex = /<loc>(.*?)<\/loc>/g;
  let match;
  while ((match = regex.exec(sitemap)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

async function submitToIndexNow(urls) {
  const body = JSON.stringify({
    host: HOST,
    key: API_KEY,
    keyLocation: `${SITE_URL}/${API_KEY}.txt`,
    urlList: urls.slice(0, 10000),
  });

  const response = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body,
  });

  console.log(`IndexNow response: ${response.status} ${response.statusText}`);
  return response.status;
}

const args = process.argv.slice(2);
const recentIdx = args.indexOf("--recent");
const recentCount = recentIdx !== -1 ? parseInt(args[recentIdx + 1], 10) : 0;

const allUrls = getUrlsFromSitemap();
const urls = recentCount > 0 ? allUrls.slice(0, recentCount) : allUrls;

console.log(`Submitting ${urls.length} URLs to IndexNow...`);
await submitToIndexNow(urls);
console.log("Done!");
