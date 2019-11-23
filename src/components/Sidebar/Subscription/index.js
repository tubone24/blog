import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Subscription = () => (
  <div className="subscription">
    <a href="/rss.xml" className="btn btn-warning" role="button">


      SUBSCRIBE RSS&nbsp;
      <span className="fa-layers fa-fw fa-1x">
        <FontAwesomeIcon icon={['fas', 'rss']} />
      </span>
    </a>
  </div>
);

export default Subscription;
