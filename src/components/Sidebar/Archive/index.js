import React from 'react';
import { Link, withPrefix } from 'gatsby';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';
import ReactGA from 'react-ga';
import dayjs from 'dayjs';

const yearLink = ({ year }) => (
  <Link to={withPrefix(`/${year}/`)} href={withPrefix(`/${year}/`)} title={`Articles written in ${year}`} onClick={() => ReactGA.event({ category: 'Archive', action: `push Archive ${year}` })}>{year}</Link>
);

const Archive = ({ allPosts }) => {
  const yearList = Array.from(new Set(allPosts.map((data) => dayjs(data.node.frontmatter.date).format('YYYY')))).sort((a, b) => ((a < b ? 1 : -1)));
  return (
    <div className="archive">
      <p><FontAwesomeIcon icon={['far', 'calendar-alt']} />&nbsp;Archives</p>
      {yearList.map((year) => (yearLink({ year })))}
    </div>
  );
};

export default Archive;
