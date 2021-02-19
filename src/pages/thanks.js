import React from 'react';
import { Link, withPrefix } from 'gatsby';
import Sidebar from '../components/Sidebar';
import SEO from '../components/SEO';

const Thanks = () => (
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
        <p>This is thank you page for form submissions</p>
        <Link to={withPrefix('/')} href={withPrefix('/')} title="BackToIndex"> Back to Index</Link>
      </div>
    </div>
    <SEO
      title="Contacts Thanks"
      url="https://blog.tubone-project24.xyz/thanks/"
      siteTitleAlt="tubone BOYAKI"
      isPost={false}
      description="Contact Thanks Page"
      tag=""
      image="https://i.imgur.com/M795H8A.jpg"
    />
  </div>
);

export default Thanks