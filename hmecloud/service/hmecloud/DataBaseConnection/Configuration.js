const Sequelize = require('sequelize')

const db = new Sequelize('db_qsrdrivethrucloud_dev', 'sa', 'nous@123', {
  host: '192.168.27.87',
  dialect: 'mssql',
  operatorsAliases: false
  // multipleStatements: true
})

const sqlConfig = {
  user: 'sa',
  password: 'nous@123',
  server: 'RS4311',
  database: 'db_qsrdrivethrucloud_dev',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
}

const ods = {
  user: 'sa',
  password: 'nous@123',
  server: 'RS4311',
  database: 'db_qsrdrivethrucloud_ods_dev',
  options: {
    encrypt: true // Use this if you're on Windows Azure
  }
}
module.exports = { db: db, sqlConfig: sqlConfig, ods: ods }

// module.exports = db
