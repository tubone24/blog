const faunadb = require("faunadb");

const insideNetlify = insideNetlifyBuildContext();
const q = faunadb.query;

console.log("Creating your FaunaDB Database...\n");

if (!process.env.FAUNADB_SERVER_SECRET) {
  console.log("Required FAUNADB_SERVER_SECRET enviroment variable not found.");
  if (insideNetlify) {
    process.exit(1);
  }
}

// Has var. Do the thing
if (process.env.FAUNADB_SERVER_SECRET) {
  createFaunaDB(process.env.FAUNADB_SERVER_SECRET).then(() => {
    console.log("Fauna Database schema has been created");
    console.log('Claim your fauna database with "netlify addons:auth fauna"');
  });
}

/* idempotent operation */
function createFaunaDB(key) {
  console.log("Create the fauna database schema!");
  const client = new faunadb.Client({
    secret: key,
  });

  return client
    .query(q.Create(q.Ref("classes"), { name: "complaints" }))
    .then(() =>
      client.query(
        q.Create(q.Ref("indexes"), {
          name: "all_complaints",
          source: q.Ref("classes/complaints"),
        })
      )
    )
    .catch((e) => {
      if (
        e.requestResult.statusCode === 400 &&
        e.message === "instance not unique"
      ) {
        console.log("Fauna already setup! Good to go");
        console.log(
          'Claim your fauna database with "netlify addons:auth fauna"'
        );
        throw e;
      }
    });
}

/* util methods */

// Test if inside netlify build context
function insideNetlifyBuildContext() {
  if (process.env.DEPLOY_PRIME_URL) {
    return true;
  }
  return false;
}
