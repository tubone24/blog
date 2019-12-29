import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ReactGA from 'react-ga';

import './index.scss';

const Subscription = () => (
  <div className="subscription">
    <a href="/rss.xml" className="btn btn-danger subrss" role="button" onClick={() => ReactGA.event({ category: 'User', action: 'push RSS Button' })}>


      SUBSCRIBE RSS&nbsp;
      <span className="fa-layers fa-fw fa-1x">
        <FontAwesomeIcon icon={['fas', 'rss']} />
      </span>
    </a>
  </div>
);

export default Subscription;
