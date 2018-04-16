var user = process.env.DatabaseUserId || 'sa'
var password = process.env.DatabasePassword || 'nous@123'
var database = process.env.Database || 'hmecloud'
var server = process.env.DatabaseServer || '192.168.27.87'

const dbConfig = {
  user: user,
  password: password,
  server: server,
  database: database,
  options: {
    encrypt: true
  }
}

module.exports = dbConfig
