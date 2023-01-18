import ReactGA from "react-ga4";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/command-line/prism-command-line.css";
import "./src/styles/global.scss";
// Use bootstrap dropdown menu
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dropdown } from "bootstrap/dist/js/bootstrap";
const config = require("./src/config/index.json");

const isLocalDevelopment = () =>
  window &&
  window.location &&
  window.location.origin !== "https://blog.tubone-project24.xyz";

if (isLocalDevelopment() === false) {
  ReactGA.initialize(config.gaMeasurementId);
  Sentry.init({
    dsn: "https://097c36a02dd64e139ba2952e8882046d@sentry.io/1730608",
    release: `tubone-boyaki@${process.env.GATSBY_GITHUB_SHA}`,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [new Integrations.BrowserTracing(), new Sentry.Replay()],
    tracesSampleRate: 1.0,
  });
}

export const onRouteUpdate = () => {
  if (isLocalDevelopment() !== true) {
    ReactGA.send("pageview");
  }
};

export const onServiceWorkerUpdateReady = () => {
  window.location.reload(true);
};
