const axios = require('axios')

exports.handler = (event, context) => {
  const body = JSON.parse(event.body);
  const clientId = event.queryStringParameters.client_id
  const redirect_uri = event.queryStringParameters.redirect_uri
  const scope = event.queryStringParameters.scope
  axios.post('https://github.com/login/oauth/access_token', body, {params: {clientId, redirect_uri, scope}}).then((response) => {
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  }).catch((error) => {
    return {
      statusCode: 500,
      body: JSON.stringify({error: error})
    }
  })
};
