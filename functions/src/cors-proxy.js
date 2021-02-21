

exports.handler = (event, context) => {
  console.log(`Read Read id: ${id}`);
  return {
    statusCode: 200,
    body: JSON.stringify(event),
  };
};
