const Sequelize = require('sequelize')
const db = new Sequelize('test', 'admin','digitalpwd', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
    port:23306
  });

module.exports = db