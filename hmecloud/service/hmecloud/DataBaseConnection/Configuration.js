const Sequelize = require('sequelize')
const sql = require('mssql')

const db = new Sequelize('hmeCloud', 'sa', 'nous@123', {
<<<<<<< HEAD
   host: '192.168.27.87',
=======
  host: 'NIBC1329',
>>>>>>> b19199fa8550b13d87b855d8f5964b6c4e4c1735
  dialect: 'mssql',
  operatorsAliases: false
  // multipleStatements: true
})

const sqlConfig = {
  user: 'sa',
  password: 'nous@123',
  server: 'NIBC1329',
  database: 'hmeCloud',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
}

module.exports = { db: db, sqlConfig: sqlConfig }

// module.exports = db
