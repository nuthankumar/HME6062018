const Sequelize = require('sequelize')
const db = require('../DataBaseConnection/Configuration')

const group = db.define(
  'Group',
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    ParentGroup: {
      type: Sequelize.INTEGER
    },
    GroupName: {
      type: Sequelize.STRING
    },
    Description: {
      type: Sequelize.STRING
    },
    AccountId: {
      type: Sequelize.INTEGER
    },
    CreatedBy: {
      type: Sequelize.STRING
    },
    UpdatedBy: {
      type: Sequelize.STRING
    },
    CreatedDateTime: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    },
    UpdatedDateTime: {
      type: Sequelize.DATEONLY,
      defaultValue: Sequelize.NOW
    }
  },
  {
    tableName: 'Group',
    timestamps: false,
    freezeTableName: true
  }
)

group.associate = models => {
  models.group.hasMany(models.groupdetails, {
    onSave: 'cascade',
    onDelete: 'cascade',
    hooks: true,
    constraints: true
  })
}

module.exports = group
