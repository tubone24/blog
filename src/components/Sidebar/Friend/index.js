import React from 'react';

import ExternalLink from '../../ExternalLink';

import { config } from '../../../../data';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './index.scss';

const { friends = [] } = config;

const Friend = () => (
  <div className="friend">
    <p><FontAwesomeIcon icon={['fas', 'link']} />&nbsp;Links</p>
    {friends.map(friend => (
      <ExternalLink
        href={friend.href}
        title={friend.title}
        key={friend.title}
        rel="noopener"
      />
    ))}
  </div>
);

export default Friend;
