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
      body: JSON.stringify(response.data),
    };
  }).catch((error) => {
    return {
      statusCode: 500,
      body: JSON.stringify({error: error})
    }
  })
};
