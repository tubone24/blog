import * as Sentry from "@sentry/node";
import "@sentry/tracing";

Sentry.init({
  dsn: "https://aa2f31c272db4f8494e3903a43cc5ca6@o302352.ingest.sentry.io/4504433289986048",
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "blog",
  name: "csp report",
});

exports.handler = (event, context) => {
  console.log(event, context);
  if (!event.body) {
    Sentry.captureException(new Error(JSON.stringify(event)));
    transaction.finish();
    return {
      statusCode: 400,
      body: JSON.stringify({ status: "Bad Request" }),
    };
  }
  const body = JSON.parse(event.body);
  Sentry.captureException(new Error(JSON.stringify(body)));
  transaction.finish();
  return {
    statusCode: 200,
    body: JSON.stringify({ status: "ok" }),
  };
};
