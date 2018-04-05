const Sequelize = require('sequelize')
const db = require('../DataBaseConnection/Configuration')

const groupdetails = db.define(
  'GroupStore',
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    GroupId: {
      type: Sequelize.INTEGER
    },
    ChildGroupId: {
      type: Sequelize.INTEGER
    },
    StoreId: {
      type: Sequelize.INTEGER
    }
  },
  {
    tableName: 'GroupStore',
    timestamps: false,
    freezeTableName: true
  }
)

groupdetails.associate = models => {
  models.groupdetails.belongsTo(models.Group)
}

module.exports = groupdetails
