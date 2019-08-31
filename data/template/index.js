const config = require('./config');

const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

console.log(githubClientId);

module.exports = {
  config,
  githubClientId,
  githubClientSecret,
};
