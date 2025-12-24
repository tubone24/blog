import React from "react";
import { Helmet } from "react-helmet-async";
import config from "@/config/index.json";

type Props = {
  url: string;
  title?: string;
  siteTitleAlt: string;
  isPost: boolean;
  image: string;
  tag: string;
  description: string;
  noindex?: boolean;
  datePublished?: string;
  dateModified?: string;
  author?: string;
  keywords?: string[];
};

const schemaOrgJSONLD = ({
  url,
  title,
  siteTitleAlt,
  isPost,
  image,
  tag,
  description,
  datePublished,
  dateModified,
  author,
}: {
  url: string;
  title: string;
  siteTitleAlt: string;
  isPost: boolean;
  image: string;
  tag: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  author?: string;
}) => {
  const returnJson = [];

  // WebSite schema
  returnJson.push({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${config.siteUrl}/#website`,
    url: config.siteUrl,
    name: config.siteTitle,
    description: config.description,
    publisher: {
      "@id": `${config.siteUrl}/#person`,
    },
    inLanguage: "ja-JP",
  });

  // Person schema
  returnJson.push({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${config.siteUrl}/#person`,
    name: author || config.author,
    url: `${config.siteUrl}/about`,
    image: {
      "@type": "ImageObject",
      "@id": `${config.siteUrl}/#personImage`,
      url: `${config.siteUrl}/favicons/android-chrome-512x512.png`,
      width: 512,
      height: 512,
      caption: config.author,
    },
    sameAs: ["https://github.com/tubone24", "https://twitter.com/tubone24"],
    jobTitle: "Software Engineer",
  });

  if (isPost) {
    // Enhanced BreadcrumbList
    returnJson.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": config.siteUrl,
            name: "ホーム",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": `${config.siteUrl}/tags`,
            name: "タグ一覧",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": `${config.siteUrl}/tag/${tag}`,
            name: tag,
          },
        },
        {
          "@type": "ListItem",
          position: 4,
          name: title,
        },
      ],
    });

    // Enhanced BlogPosting
    returnJson.push({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "@id": `${url}#article`,
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": url,
      },
      url,
      name: title,
      headline: title,
      description,
      image: {
        "@type": "ImageObject",
        url: image,
        width: 1200,
        height: 630,
      },
      datePublished: datePublished || new Date().toISOString(),
      dateModified: dateModified || datePublished || new Date().toISOString(),
      author: {
        "@type": "Person",
        "@id": `${config.siteUrl}/#person`,
      },
      publisher: {
        "@type": "Person",
        "@id": `${config.siteUrl}/#person`,
      },
      inLanguage: "ja-JP",
      keywords: tag,
    });
  }
  return returnJson;
};

const SEO = ({
  url,
  title = config.siteTitle,
  description,
  image,
  siteTitleAlt,
  isPost,
  tag,
  noindex = false,
  datePublished,
  dateModified,
  author,
  keywords = [],
}: Props) => {
  const ogpImageLink = `https://tubone-project24.xyz/ogp.png?title=${encodeURI(
    title,
  )}`;

  // 日本語キーワードの自動追加
  const japaneseKeywords = [
    "技術ブログ",
    "プログラミング",
    "開発",
    "エンジニアリング",
  ];
  const allKeywords = [...keywords, ...japaneseKeywords, tag]
    .filter(Boolean)
    .join(", ");

  return (
    <Helmet>
      <title>{title}</title>

      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />
      <meta name="keywords" content={allKeywords} />
      <meta name="author" content={author || config.author} />
      {noindex && <meta name="robots" content="noindex, follow" />}

      {/* カノニカルURL */}
      <link rel="canonical" href={url} />

      {/* 電話番号自動認識の無効化 */}
      <meta name="format-detection" content="telephone=no" />

      {/* Apple固有のメタタグ */}
      <meta name="apple-mobile-web-app-title" content={title} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta
        name="apple-mobile-web-app-status-bar-style"
        content="black-translucent"
      />

      {/* Microsoft固有のメタタグ */}
      <meta name="application-name" content={title} />
      <meta name="msapplication-TileColor" content="#33b546" />
      <meta
        name="msapplication-TileImage"
        content="/favicons/mstile-150x150.png"
      />

      {/* Schema.org tags */}
      <script type="application/ld+json">
        {JSON.stringify(
          schemaOrgJSONLD({
            url,
            title,
            siteTitleAlt,
            isPost,
            image,
            description,
            tag,
            datePublished,
            dateModified,
            author,
          }),
        )}
      </script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={config.siteTitle} />
      {isPost ? (
        <meta property="og:type" content="article" />
      ) : (
        <meta property="og:type" content="website" />
      )}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogpImageLink} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:locale" content="ja_JP" />
      <meta property="fb:app_id" content="280941406476272" />

      {/* Article specific tags */}
      {isPost && (
        <>
          <meta
            property="article:published_time"
            content={datePublished || new Date().toISOString()}
          />
          <meta
            property="article:modified_time"
            content={dateModified || datePublished || new Date().toISOString()}
          />
          <meta property="article:author" content={author || config.author} />
          <meta property="article:section" content={tag} />
          <meta property="article:tag" content={tag} />
        </>
      )}

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@tubone24" />
      <meta name="twitter:creator" content="@tubone24" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogpImageLink} />
      <meta name="twitter:image:alt" content={title} />
    </Helmet>
  );
};

export default SEO;
