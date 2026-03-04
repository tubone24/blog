# Google Search Console Sitemap 認識問題 調査レポート

**調査対象:** tubone-project24.xyz のsitemap.xml がSearch Consoleで認識されない問題
**調査日:** 2026-03-04

---

## エグゼクティブサマリー

現在のsitemap.xmlの**XMLフォーマット自体は正しい**。問題の根本原因は以下2点の可能性が高い：

1. **netlify.toml に `sitemap.xml` の `Content-Type` ヘッダーが明示指定されていない**（`llms.txt` のみ設定済み）
2. **netlify.toml の `/*` → `/404.html` キャッチオールリダイレクトが静的XMLファイルに干渉している可能性**

---

## 調査結果詳細

### 1. 現在のsitemap.xml の評価

`src/pages/sitemap.xml.ts` の実装を確認した結果：

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://tubone-project24.xyz/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  ...
</urlset>
```

**評価: 合格点**

| チェック項目 | 状態 | 詳細 |
| --- | --- | --- |
| XML宣言 `<?xml version="1.0" encoding="UTF-8"?>` | OK | 記述あり |
| `xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"` | OK | 正しいnamespace |
| `<loc>` タグ | OK | 絶対URLで記述 |
| `<lastmod>` タグ | OK | 記事URLには日付あり |
| UTF-8エンコーディング | OK | 指定あり |
| URL数 | OK | 50,000件未満 |
| XMLエスケープ関数 | OK | `xmlEscape()` 実装あり |
| Content-Type ヘッダー（コード側） | OK | `application/xml; charset=utf-8` |

### 2. Netlify設定の問題（最有力原因）

`netlify.toml` の現状：

```toml
# sitemap.xml のContent-Typeヘッダー設定が存在しない！

[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

**問題点A: `sitemap.xml` の明示的なContent-Typeヘッダーがない**

Netlifyは通常、.xmlファイルに自動で `application/xml` を付与するが、明示的に設定されていない。
比較対象のportfolio.tubone-project24.xyzで認識されているsitemapがどのように設定されているかが鍵。

**問題点B: キャッチオールリダイレクト `from = "/*"` が悪影響する可能性**

Netlifyでは通常、静的ファイルはリダイレクトより優先されるが：

- Astroの `output: static` モードではビルド時に `sitemap.xml` が `dist/` に生成される
- 正しく生成されていれば `/*` リダイレクトより静的ファイルが優先されるはず
- ただし、何らかの理由でGooglebotがこのリダイレクトに引っかかる可能性もゼロではない

### 3. Google Search Console でsitemapが認識されない一般的な原因

| 原因 | 本サイトへの該当可能性 |
| --- | --- |
| robots.txtによるブロック | 低（robots.txtに`Allow: /`があり、`/admin`と`/preview/`のみDisallow） |
| 誤ったURL提出 | 要確認（HTTPSプロパティに正しく提出されているか） |
| Content-Type: text/html で配信 | 中（明示設定なしの場合Netlifyの挙動次第） |
| XMLフォーマットエラー | 低（コード上は問題なし） |
| HTTPエラー（404/500） | 低（サイトはアクセス可能） |
| サイトに手動アクション適用 | 低（通常は対象外） |
| Google側の一時的なキャッシュ問題 | 可能性あり |

### 4. Google公式のsitemap要件（2026年時点）

- **XML形式が推奨**（テキスト形式も可）
- **必須タグ:** `<urlset>`、`<url>`、`<loc>`
- **任意タグ:** `<lastmod>`（ただし正確な日付なら有効）、`<changefreq>`、`<priority>`
- **重要:** Googleは `<priority>` と `<changefreq>` の値を**無視する**（参考程度）
- **`<lastmod>`** は正確に設定すれば効果的。不正確な日付は逆効果
- **Content-Type:** `application/xml` が期待される（Googleは柔軟だが明示推奨）
- **XML宣言:** 技術的には任意だが、記述を推奨
- **URLは絶対パスで記述すること**

---

## 推奨される修正

### 修正1（推奨）: netlify.toml に `sitemap.xml` のContent-Typeヘッダーを追加

```toml
[[headers]]
  for = "/sitemap.xml"
  [headers.values]
    Content-Type = "application/xml; charset=utf-8"
```

### 修正2（任意）: キャッチオールリダイレクトの前に sitemap.xml を明示許可

```toml
# sitemap.xml を明示的にパススルー
[[redirects]]
  from = "/sitemap.xml"
  to = "/sitemap.xml"
  status = 200
  force = false

# 既存のキャッチオール（順序はこの後）
[[redirects]]
  from = "/*"
  to = "/404.html"
  status = 404
```

ただし、Astro静的ビルドで `dist/sitemap.xml` が生成されていれば、Netlifyは静的ファイルを優先するため修正1のみで十分な可能性が高い。

### 修正3（確認事項）: Search Console のプロパティ設定確認

- `https://tubone-project24.xyz` (wwwなし、HTTPS) のプロパティにsitemapが提出されているか確認
- 提出URL: `https://tubone-project24.xyz/sitemap.xml`
- URLインスペクションツールで `https://tubone-project24.xyz/sitemap.xml` をテストする

---

## robots.txt の状態（問題なし）

```text
User-agent: *
Allow: /
Disallow: /admin
Disallow: /preview/

Sitemap: https://tubone-project24.xyz/sitemap.xml
Host: https://tubone-project24.xyz
```

sitemap.xmlのパスがrobots.txtに正しく記述されており、クローラーブロックもない。

---

## 参考リンク

- [Google: Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: Manage sitemaps report](https://support.google.com/webmasters/answer/7451001)
- [Netlify: Headers configuration](https://docs.netlify.com/routing/headers/)
- [Netlify Forum: Sitemap Couldn't Fetch](https://answers.netlify.com/t/sitemap-xml-couldnt-fetch/18610)
- [Yoast: lastmod in XML sitemaps](https://yoast.com/lastmod-xml-sitemaps-google-bing/)
- [Astro: Manual sitemap creation](https://byandrev.dev/en/blog/how-to-create-sitemap-manually-in-astro-ssr/)
