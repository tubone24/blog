import React from 'react';
import { Link, withPrefix } from 'gatsby';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// import './index.scss';

const WordCloud = () => (
  <div className="wordcloud">
    <p><FontAwesomeIcon icon={['fas', 'cloud']} />&nbsp;WordCloud</p>
    <Link to={withPrefix('about#wordcloud')} href={withPrefix('about#wordcloud')} >
      <picture>
        <source srcSet="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.webp" type="image/webp" />
        <img src="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.png" alt="wordCloud" title="wordCloud" />
      </picture>
    </Link>
  </div>
);

export default WordCloud;
