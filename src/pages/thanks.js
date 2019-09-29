import React from 'react';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

export default () => (
  <div className="container">
    <div
      className="row"
      style={{
        margin: 15,
      }}
    >
      <Sidebar />
      <div className="col order-2">
        <h1>Thank you!</h1>
        <p>This is a custom thank you page for form submissions</p>
      </div>
    </div>
    <SEO
      title="Contacts Thanks"
      url="/thanks/"
      siteTitleAlt="tubone BOYAKI"
      isPost={false}
      description="Contact Thanks Page"
      image="https://i.imgur.com/M795H8A.jpg"
    />
  </div>
);
