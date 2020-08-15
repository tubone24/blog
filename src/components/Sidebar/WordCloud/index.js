import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import './index.scss';


const WordCloud = () => (
  <div className="wordcloud">
    <p><FontAwesomeIcon icon={['fas', 'cloud']} />&nbsp;WordCloud</p>
    <img src="https://raw.githubusercontent.com/tubone24/auto_tweet_wordcloud/master/word_cloud_blog.png" alt="wordCloud" title="wordCloud" />
  </div>
);

export default WordCloud;
