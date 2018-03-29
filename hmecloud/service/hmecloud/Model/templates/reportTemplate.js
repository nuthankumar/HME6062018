const Sequelize = require('sequelize')
const db = require('../DataBaseConnection/configDb')

const ReportTemplates = db.define(
  'ReportTemplates',
  {
    Id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    AccountId: {
      type: Sequelize.INTEGER
      },
     Stores: {
      type: Sequelize.STRING
      },
      TimeMeasure: {
          type: Sequelize.INTEGER
      },
      FromDate: {
          type: Sequelize.DATE
    },
      ToDate: {
          type: Sequelize.DATE
    },
    OpenTime: {
      type: Sequelize.STRING
    },

    CloseTime: {
      type: Sequelize.STRING
    },
    Type: {
      type: Sequelize.INTEGER
      },
      Open: {
          type: Sequelize.BOOLEAN
      },
      Close: {
          type: Sequelize.BOOLEAN
      },
     Include: {
          type: Sequelize.STRING
    },
    Format: {
      type: Sequelize.INTEGER
    },
    TemplateName: {
      type: Sequelize.STRING
    },
    CreatedBy: {
      type: Sequelize.INTEGER
    },
    UpdatedBy: {
      type: Sequelize.INTEGER
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
    tableName: 'ReportTemplates',
    timestamps: false,
    freezeTableName: true
  }
)

module.exports = ReportTemplates
