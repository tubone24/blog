import React from 'react';
import { Link, withPrefix } from 'gatsby';

import './index.scss';

const WordCloud = () => (
  <div className="wordcloud">
    <p><span className="icon-cloud" />&nbsp;WordCloud</p>
    <Link to={withPrefix('about#wordcloud')} href={withPrefix('about#wordcloud')} >
      <picture>
        <source className="lozad" media="(min-width: 992px)" srcSet="data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7" data-srcset="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.webp" type="image/webp" />
        <source className="lozad" media="(max-width: 991px)" srcSet="data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7" type="image/gif" />
        <img className="lozad" src="data:image/gif;base64,R0lGODlhAQABAGAAACH5BAEKAP8ALAAAAAABAAEAAAgEAP8FBAA7" data-src="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.png" alt="wordCloud" title="wordCloud" />
      </picture>
    </Link>
  </div>
);

export default WordCloud;
