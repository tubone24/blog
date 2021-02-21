const axios = require('axios')

exports.handler = (event, context) => {
  const body = JSON.parse(event.body);
  axios.post('https://github.com/login/oauth/access_token', body).then((response) => {
    console.log(response.data)
    return {
      statusCode: 200,
      body: JSON.stringify({access_token: response.data.access_token}),
    };
  }).catch((error) => {
    return {
      statusCode: 500,
      body: JSON.stringify({error: error})
    }
  })
};
