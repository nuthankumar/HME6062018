const Sequelize = require('sequelize')
const db = require('../DataBaseConnection/ConfigDb')

const TimeMeasure = db.define(
  'TimeMeasure',
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    GroupId: {
      type: Sequelize.STRING
    }
  },
  {
    tableName: 'GroupStore',
    timestamps: false,
    freezeTableName: true
  }
)

module.exports = TimeMeasure
