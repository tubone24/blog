import axios from "axios";
import * as Sentry from "@sentry/node";
import "@sentry/tracing";
import { ProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://a01a46773c8342dfa4d199c36a30fc28@o302352.ingest.sentry.io/6347154",
  tracesSampleRate: 1.0,
  integrations: [new ProfilingIntegration()],
  profilesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "blog",
  name: "github cors transaction",
});

exports.handler = (event, context) => {
  console.log(context);
  const body = JSON.parse(event.body);
  const headers = {
    accept: "application/json",
  };
  return axios
    .post("https://github.com/login/oauth/access_token", body, { headers })
    .then((response) => {
      console.log({
        access_token: `${response.data.access_token.substring(
          0,
          3
        )}xxxxxxxxxxxxxxxxx`,
        token_type: response.data.token_type,
        scope: response.data.scope,
      });
      transaction.finish();
      return {
        statusCode: 200,
        body: JSON.stringify({
          access_token: response.data.access_token,
          token_type: response.data.token_type,
          scope: response.data.scope,
        }),
      };
    })
    .catch((error) => {
      Sentry.captureException(error);
      transaction.finish();
      return {
        statusCode: 500,
        body: JSON.stringify({ error }),
      };
    });
};
