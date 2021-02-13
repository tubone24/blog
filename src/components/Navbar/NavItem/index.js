import React from 'react';
import { Link, navigate, withPrefix } from 'gatsby';
import ReactGA from 'react-ga';

import './index.scss';

const NavItem = ({ url, name }) => (
  <Link
    className="nav-btn btn btn-link"
    href={url}
    to={url}
    onClick={() => {
      ReactGA.event({
        category: 'User',
        action: `Click nav-menu: ${name}`,
      });
      navigate(withPrefix(url));
    }}
  >
    {name}
  </Link>
);

export default NavItem;
