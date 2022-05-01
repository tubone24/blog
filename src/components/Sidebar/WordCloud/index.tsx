import React from "react";
import { Link, withPrefix } from "gatsby";

import * as style from "./index.module.scss";

const placeHolder =
  "data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7";

const WordCloud = () => (
  <div className={style.wordcloud}>
    <p>
      <span className="icon-cloud" />
      &nbsp;WordCloud
    </p>
    <Link to={withPrefix("about#wordcloud")}>
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
    </Link>
  </div>
);

export default WordCloud;
