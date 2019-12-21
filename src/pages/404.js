/* eslint-disable react/prop-types */
import React from 'react';

import { Link, graphql } from 'gatsby';
import { Profile, Repository } from 'react-github-info';


const NotFoundPage = ({ data }) => (
  <div className="container">
    <div className="row">
      <div className="col">
        <Profile username="wonism" />
        <Repository username="wonism" repos="til" />
      </div>
    </div>
  </div>
);

export const pageQuery = graphql`
  query getAllPages {
    allSitePage {
      edges {
        node {
          path
        }
      }
    }
  }
`;

export default NotFoundPage;
