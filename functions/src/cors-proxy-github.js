import axios from 'axios'

exports.handler = (event, context) => {
  const body = JSON.parse(event.body);
  axios.post('https://github.com/login/oauth/access_token', body).then((response) => {
    return {
      statusCode: 200,
      body: JSON.stringify(response.data),
    };
  })
};
