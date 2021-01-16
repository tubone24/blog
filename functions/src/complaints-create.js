const faunadb = require('faunadb');

const q = faunadb.query;

exports.handler = async (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = JSON.parse(event.body);
  console.log('complaint-create', data);
  const complaintItem = {
    data,
  };
  return client.query(q.Create(q.Ref('classes/complaints'), complaintItem))
    .then((response) => {
      console.log('success', response);
      return {
        statusCode: 200,
        body: JSON.stringify(response),
      };
    }).catch((error) => {
      console.log('error', error);
      return {
        statusCode: 400,
        body: JSON.stringify(error),
      };
    });
};
