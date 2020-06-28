const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'riskprofile.cfma4sm8bl1v.us-east-1.rds.amazonaws.com',
  database: 'user',
  password: 'P0stgres',
  port: 5432,
})

module.exports = pool;