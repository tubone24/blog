import React from 'react';

const Tag = ({ name, count }) => (
  <a href={`/tag/${name}`} className="header-tag">
    {name}
    &nbsp;
    {count}
  </a>
);

Tag.defaultProps = {
  count: '',
};

export default Tag;
