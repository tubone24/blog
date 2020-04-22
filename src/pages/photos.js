import React from 'react';
import FlickrLightbox from 'react-flickr-lightbox';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';
import Header from '../components/Header';

import { config } from '../../data';
import ShareBox from '../components/ShareBox';

const {
  url, name, iconUrl,
} = config;

const shareURL = `${url}/photos`;

export default () => (
  <div className="container">
    <div
      className="row"
      style={{
        margin: 30,
      }}
    >
      <Sidebar />
      <div
        className="photos col order-1 col-md-offset-3"
      >
        <h1>Photos</h1>
        <FlickrLightbox
          api_key="89f4752b9b3a8dffcbf94ca144719883"
          user_id="184992580@N06"
        />
      </div>
    </div>
    <ShareBox url={shareURL} />
    <SEO
      title="Photos"
      url="https://blog.tubone-project24.xyz/github/"
      siteTitleAlt="tubone BOYAKI"
      isPost={false}
      description="Photos"
      tag=""
      image="https://i.imgur.com/M795H8A.jpg"
    />
  </div>
);
