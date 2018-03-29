const Sequelize = require('sequelize')
const db = new Sequelize('hmeCloud', 'sa', 'nous@123', {
    host: 'NIBC1329',
    dialect: 'mssql',
    operatorsAliases: false
});

module.exports = db