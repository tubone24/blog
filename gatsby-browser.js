/* eslint-disable import/prefer-default-export */
import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';
import { config } from './data';

import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import './src/styles/global.scss';

Sentry.init({
  dsn: 'https://097c36a02dd64e139ba2952e8882046d@sentry.io/1730608',
  release: `tubone-boyaki@${process.env.COMMIT_REF}`,
  integrations: [new Integrations.BrowserTracing()],
  tracesSampleRate: 1.0,
});

const {
  url, gaTrackId, gaOptimizeId,
} = config;

const isLocalDevelopment = () => window && window.location && window.location.origin !== url;

window.addEventListener('lazybeforeunveil', (e) => {
  const bg = e.target.getAttribute('data-bg');
  if (bg) {
    e.target.style.backgroundImage = `url(${bg})`;
  }
});

if (isLocalDevelopment() === false) {
  ReactGA.initialize(gaTrackId);

  // Google Optimizer
  if (gaOptimizeId) {
    ReactGA.ga('require', gaOptimizeId);
  }
}

export const onRouteUpdate = (state) => {
  if (isLocalDevelopment() !== true) {
    ReactGA.pageview(state.location.pathname);
  } else {
    console.log('isLocalDevelopment is true, so ReactGA is not activated');
  }
};

export const onServiceWorkerUpdateReady = () => {
  // if (reloadCount <= 1) {
  //   window.location.reload(true);
  //   reloadCount++;
  // }
  // // const answer = window.confirm(
  // //   'ブログ更新を検知しました. 更新しますか?',
  // // );
  // //
  // // if (answer === true) {
  // //   window.location.reload();
  // // }
};
