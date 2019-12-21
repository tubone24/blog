import React from 'react';
import FlickrLightbox from 'react-flickr-lightbox';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';


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
        className="col order-1 col-md-offset-3"
        style={{
          justifyContent: 'center',
          flexDirection: 'row',
        }}
      >
        <h2>Photos</h2>
        <FlickrLightbox
          api_key="89f4752b9b3a8dffcbf94ca144719883"
          user_id="184992580@N06"
        />
      </div>
    </div>
    <SEO
      title="GitHub Repos"
      url="https://blog.tubone-project24.xyz/github/"
      siteTitleAlt="tubone BOYAKI"
      isPost={false}
      description="GitHub Repos list"
      image="https://i.imgur.com/M795H8A.jpg"
    />
  </div>
);
