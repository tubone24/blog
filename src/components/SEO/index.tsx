import React from "react";
import Helmet from "react-helmet";
import config from "@/config/index.json";

type Props = {
  url: string;
  title?: string;
  siteTitleAlt: string;
  isPost: boolean;
  image: string;
  tag: string;
  description: string;
};

const schemaOrgJSONLD = ({
  url,
  title,
  siteTitleAlt,
  isPost,
  image,
  tag,
  description,
}: {
  url: string;
  title: string;
  siteTitleAlt: string;
  isPost: boolean;
  image: string;
  tag: string;
  description: string;
}) => {
  const returnJson = [];

  returnJson.push({
    "@context": "http://schema.org",
    "@type": "WebSite",
    url,
    name: title,
    alternateName: siteTitleAlt || config.siteTitle,
  });

  if (isPost) {
    returnJson.push({
      "@context": "http://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@id": "https://blog.tubone-project24.xyz",
            name: "tubone BOYAKI",
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@id": `https://blog.tubone-project24.xyz/tag/${tag}`,
            name: "tubone BOYAKI",
          },
        },
        {
          "@type": "ListItem",
          position: 3,
          item: {
            "@id": url,
            name: title,
            image,
          },
        },
      ],
    });

    returnJson.push({
      "@context": "http://schema.org",
      "@type": "BlogPosting",
      url,
      name: title,
      alternateName: siteTitleAlt || "",
      headline: title,
      image: {
        "@type": "ImageObject",
        url: image,
      },
      description,
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
}: Props) => {
  const ogpImageLink = `https://blog.tubone-project24.xyz/ogp.png?title=${encodeURI(
    title
  )}`;
  return (
    <Helmet>
      <title>{title}</title>

      {/* General tags */}
      <meta name="description" content={description} />
      <meta name="image" content={image} />

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
          })
        )}
      </script>

      {/* OpenGraph tags */}
      <meta property="og:url" content={url} />
      {isPost ? (
        <meta property="og:type" content="article" />
      ) : (
        <meta property="og:type" content="website" />
      )}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="ja_JP" />
      <meta property="fb:app_id" content="280941406476272" />

      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:creator" content="@meitante1conan" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogpImageLink} />
    </Helmet>
  );
};

export default SEO;
