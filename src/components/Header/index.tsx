import React, { useState } from "react";
import * as style from "./index.module.scss";

import ReactGA from "react-ga4";

const CopyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const Header = ({
  img = "",
  title = "",
  subTitle = "",
  authorImage = true,
  authorName = "",
  showCopyMd = false,
}: {
  img?: string;
  title?: string;
  subTitle?: string;
  authorImage?: boolean;
  authorName?: string;
  showCopyMd?: boolean;
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const md = (window as unknown as Record<string, string>).__RAW_MD__;
    if (!md) return;
    navigator.clipboard.writeText(md).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div
      className="col-12 header"
      style={{ padding: 0 }}
      id="header"
      data-testid="header"
    >
      <div
        className={style.imgContainer}
        style={{
          backgroundImage: `linear-gradient( rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2) ), url(${img})`,
        }}
      >
        {title && (
          <h1 className={style.uTitle}>
            {title}
            {showCopyMd && (
              <button
                className={`${style.copyMd} ${copied ? style.copyMdDone : ""}`}
                onClick={handleCopy}
                title={copied ? "コピーしました" : "記事をMarkdownでコピー"}
                type="button"
                aria-label="記事をMarkdownでコピー"
              >
                {copied ? <CheckIcon /> : <CopyIcon />}
              </button>
            )}
          </h1>
        )}
        {subTitle && (
          <div className={style.uSubtitle}>
            <div className={style.mLeft}>
              {authorImage && (
                <picture>
                  <source
                    className={style.authorImage}
                    srcSet="/assets/avater.webp"
                    type="image/webp"
                    onClick={() =>
                      ReactGA.event({
                        category: "User",
                        action: "push tubone Avatar",
                      })
                    }
                  />
                  <img
                    className={style.authorImage}
                    src="/assets/avater.png"
                    alt={authorName}
                    {...{ fetchpriority: "high" }}
                    onClick={() =>
                      ReactGA.event({
                        category: "User",
                        action: "push tubone Avatar",
                      })
                    }
                  />
                </picture>
              )}
              <span className={style.authorName}>{authorName}</span>
            </div>
            <span className={style.text}>{subTitle}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
