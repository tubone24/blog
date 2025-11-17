import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://a01a46773c8342dfa4d199c36a30fc28@o302352.ingest.sentry.io/6347154",
  tracesSampleRate: 1.0,
});

const transaction = Sentry.startTransaction({
  op: "blog",
  name: "github cors transaction",
});

exports.handler = async (event, context) => {
  console.log(context);
  const body = JSON.parse(event.body);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(body),
      },
    );
    const data = await response.json();

    console.log({
      access_token: `${data.access_token.substring(0, 3)}xxxxxxxxxxxxxxxxx`,
      token_type: data.token_type,
      scope: data.scope,
    });

    transaction.finish();

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: data.access_token,
        token_type: data.token_type,
        scope: data.scope,
      }),
    };
  } catch (error) {
    Sentry.captureException(error);
    transaction.finish();
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
