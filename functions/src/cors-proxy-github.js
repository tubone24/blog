const axios = require('axios')

exports.handler = (event, context) => {
  const body = JSON.parse(event.body);
  const headers = {
    accept: 'application/json',
  };
  axios.post('https://github.com/login/oauth/access_token', body, {headers: headers}).then((response) => {
    console.log(response.data)
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: response.data.access_token, token_type: response.data.token_type, scope: response.data.scope}),
    };
  }).catch((error) => {
    return {
      statusCode: 500,
      body: JSON.stringify({error: error})
    }
  })
};
