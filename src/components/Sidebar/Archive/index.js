import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


import './index.scss';


const Archive = () => (
  <div className="archive">
    <p><FontAwesomeIcon icon={['far', 'calendar-alt']} />&nbsp;Archives</p>
    <a href="/2020/">2020</a>
    <a href="/2019/">2019</a>
    <a href="/2018/">2018</a>
    <a href="/2017/">2017</a>
  </div>
);

export default Archive;
