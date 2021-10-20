import ReactGA from 'react-ga';
import * as Sentry from '@sentry/browser';
import { Integrations } from '@sentry/tracing';

import 'prismjs/themes/prism-solarizedlight.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import './src/styles/global.scss';

const isLocalDevelopment = () => window && window.location && window.location.origin !== 'https://blog.tubone-project24.xyz';

if (isLocalDevelopment() === false) {
  ReactGA.initialize('UA-146792080-1');
  Sentry.init({
    dsn: 'https://097c36a02dd64e139ba2952e8882046d@sentry.io/1730608',
    release: `tubone-boyaki@${process.env.GATSBY_GITHUB_SHA}`,
    integrations: [new Integrations.BrowserTracing()],
    tracesSampleRate: 1.0,
  });
}

export const onRouteUpdate = (state) => {
  if (isLocalDevelopment() !== true) {
    ReactGA.pageview(state.location.pathname);
  }
};

export const onServiceWorkerUpdateReady = () => {
  window.location.reload(true);
};
