const Sequelize = require('sequelize')
const sql = require('mssql')

const db = new Sequelize('hmeCloud', 'sa', 'nous@123', {
    host: '192.168.27.87',
  dialect: 'mssql',
  operatorsAliases: false
  // multipleStatements: true
})

const sqlConfig = {
  user: 'sa',
  password: 'nous@123',
  server: '192.168.27.87',
  database: 'hmeCloud',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
}

module.exports = {db, sqlConfig}

// module.exports = db
