import React from "react";
import ReactGA from "react-ga4";
import * as Sentry from "@sentry/browser";
import { Integrations } from "@sentry/tracing";
import { HelmetProvider } from "react-helmet-async";

import "prismjs/themes/prism-okaidia.css";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/command-line/prism-command-line.css";
import "./src/styles/global.scss";
// Use bootstrap dropdown menu
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Dropdown } from "bootstrap/dist/js/bootstrap";
const config = require("./src/config/index.json");

const isLocalDevelopment = () =>
  typeof window !== "undefined" &&
  window.location &&
  (window.location.origin !== "https://tubone-project24.xyz" ||
    window.location.origin !== "https://tubone-project24.xyz");

// Initialize only in browser environment
if (typeof window !== "undefined" && isLocalDevelopment() === false) {
  ReactGA.initialize(config.gaMeasurementId);
  Sentry.init({
    dsn: "https://097c36a02dd64e139ba2952e8882046d@sentry.io/1730608",
    release: `tubone-boyaki@${process.env.GATSBY_GITHUB_SHA}`,
    replaysSessionSampleRate: 0.05,
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
  if (typeof window !== "undefined") {
    window.location.reload(true);
  }
};

export const wrapRootElement = ({ element }) => {
  return <HelmetProvider>{element}</HelmetProvider>;
};
