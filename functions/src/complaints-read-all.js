/* Import faunaDB sdk */
const faunadb = require('faunadb')
const q = faunadb.query

exports.handler = (event, context) => {
  console.log('Function `read-all` invoked')
  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SERVER_SECRET
  })
  return client.query(q.Paginate(q.Match(q.Ref('indexes/all_complaints'))))
    .then((response) => {
      const complaintsRefs = response.data
      console.log('Complains refs', complaintsRefs)
      console.log(`${complaintsRefs.length} Complaints found`)
      const getAllComplaintsDataQuery = complaintsRefs.map((ref) => {
        return q.Get(ref)
      })
      // then query the refs
      return client.query(getAllComplaintsDataQuery).then((ret) => {
        return {
          statusCode: 200,
          body: JSON.stringify(ret)
        }
      })
    }).catch((error) => {
      console.log('error', error)
      return {
        statusCode: 400,
        body: JSON.stringify(error)
      }
    })
}
