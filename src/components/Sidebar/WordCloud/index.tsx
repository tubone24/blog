import React, { useState } from "react";

import * as style from "./index.module.scss";

const placeHolder =
  "data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7";

const LARGE_IMAGE_URL =
  "https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog_large.png";

const WordCloud = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className={style.wordcloud}>
      <p>
        <span className="icon-cloud" />
        &nbsp;WordCloud
      </p>
      <a
        href="#"
        role="button"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <picture>
          <source
            className="lozad"
            media="(min-width: 992px)"
            srcSet={placeHolder}
            data-srcset="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.webp"
            type="image/webp"
          />
          <source
            className="lozad"
            media="(max-width: 991px)"
            srcSet={placeHolder}
            type="image/gif"
          />
          <img
            className="lozad"
            src={placeHolder}
            data-src="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.png"
            alt="wordCloud"
            title="wordCloud"
          />
        </picture>
      </a>
      {open && (
        <div className={style.lightbox} onClick={() => setOpen(false)}>
          <div
            className={style.lightboxContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={style.lightboxClose}
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <img src={LARGE_IMAGE_URL} alt="WordCloud" />
          </div>
        </div>
      )}
    </div>
  );
};

export default WordCloud;
