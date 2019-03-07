const { Pool } = require('pg')
const cred = require('../credentials')

const pool = new Pool(cred.dbConfig)

module.exports = {
  query: async (text, params) => {
    try {
      const client = await pool.connect()
      const result = await client.query(text, params)
      client.release()

      return result.rows
    
    } catch (err) {
      return {erro: err}
    }
  }
}

