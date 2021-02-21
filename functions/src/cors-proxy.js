

exports.handler = (event, context) => {
  const path = event.path
  const httpMethod = event.httpMethod
  const queryStringParameters = event.queryStringParameters
  const body = event.body
  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};
