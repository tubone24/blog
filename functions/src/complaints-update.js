const faunadb = require('faunadb');
const getId = require('./utils/getId');

const q = faunadb.query;

exports.handler = (event, context) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET,
  });
  const data = JSON.parse(event.body);
  const id = getId(event.path);
  console.log(`update id: ${id}`);
  return client.query(q.Update(q.Ref(`classes/complaints/${id}`), { data }))
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
