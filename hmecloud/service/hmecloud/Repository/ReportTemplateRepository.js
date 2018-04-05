/**
 * Sample CURD application in report templets Page in summary report
 */

const reportTemplates = require('../Model/ReportTemplate')
const dataBase = require('../DataBaseConnection/Configuration')
const sqlQuery = require('../Common/DataBaseQueries')

// List all templates

const getAllReportTemplates = (input, callback) => {
  dataBase
    .query(sqlQuery.ReportTemplates.getAllReportsTemplates, {
      replacements: { AccountId: input.AccountId, CreatedBy: input.CreatedBy },
      type: dataBase.QueryTypes.SELECT
    })
    .then(result => {
      callback(result)
    })
    .catch(error => {
      callback(error)
    })
}

const createReportTemplate = (input, callback) => {
  reportTemplates
    .create(input)
    .then(result => {
      const output = {}
      if (result) {
        output.data = messages.REPORTSUMMARY.saveTempplateSuccess
        output.status = true
      } else {
        output.data = messages.REPORTSUMMARY.failedSaveTemplate
        output.status = false
      }

      callback(output)
    })
    .catch(error => {
      const output = {
        data: error,
        status: false
      }
      callback(output)
    })
}

const deleteReportTemplate = (input, callback) => {
  const condition = {
    where: {
      AccountId: input.AccountId,
      Id: input.Id
    }
  }
  reportTemplates
    .destroy(condition)
    .then(result => {
      const output = {}
      if (result) {
        output.data = messages.REPORTSUMMARY.DeletedSaveTemplate
        output.status = true
      } else {
        output.data = 'notfound'
        output.status = false
      }

      callback(output)
    })
    .catch(error => {
      const output = {
        data: error,
        status: false
      }
      callback(output)
    })
}

const getReportTemplate = (input, callback) => {
  const output = {}
  const condition = {
    where: {
      AccountId: input.AccountId,
      Id: input.Id
    }
  }
  reportTemplates
    .findOne(condition)
    .then(result => {
      if (result) {
        output.data = result
        output.status = true
      } else {
        output.data = 'notfound'
        output.status = false
      }
      callback(output)
    })
    .catch(error => {
      output.data = error
    })
}

module.exports = {
  createReportTemplate,
  deleteReportTemplate,
  getReportTemplate,
  getAllReportTemplates
}
