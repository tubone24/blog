import React from 'react';
import ReactGA from 'react-ga';
import { Link, withPrefix } from 'gatsby';

const Tag = ({ name, count }) => (
  <Link
    to={withPrefix(`/tag/${name}`)}
    href={withPrefix(`/tag/${name}`)}
    className="header-tag"
    title={name}
    onClick={() => ReactGA.event({ category: 'Tag', action: `push Tag ${name}` })}
  >
    {name}
    &nbsp;
    {count}
  </Link>
);

Tag.defaultProps = {
  count: '',
};

export default Tag;
