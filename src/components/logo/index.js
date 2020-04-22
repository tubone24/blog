import React from 'react';
import Link from 'gatsby-link';

import Mark from '../mark';

import './styles.scss';

const Logo = ({ location }) => {
  const Holder = location.pathname !== '/' ? Link : 'span';
  return (
    <Holder to="/" className="nav-logo">
      <span className="nav-logo-container">
        <Mark />
      </span>
    </Holder>
  );
};

export default Logo;
