const axios = require('axios');

exports.handler = (event, context) => {
  console.log(context);
  const body = JSON.parse(event.body);
  const headers = {
    accept: 'application/json',
  };
  return axios.post('https://github.com/login/oauth/access_token', body, { headers }).then((response) => {
    console.log({ access_token: `${response.data.access_token.substring(0, 3)}xxxxxxxxxxxxxxxxx`, token_type: response.data.token_type, scope: response.data.scope });
    return {
      statusCode: 200,
      body: JSON.stringify({ access_token: response.data.access_token, token_type: response.data.token_type, scope: response.data.scope }),
    };
  }).catch((error) => ({
    statusCode: 500,
    body: JSON.stringify({ error }),
  }));
};
