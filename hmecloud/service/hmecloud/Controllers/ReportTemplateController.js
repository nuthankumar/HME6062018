/**
 * Sample CURD application in report templets Page in summary report
 */

const reportTemplates = require('../Model/ReportTemplate')
// Config messages
const messages = require('../Common/Message')
const dataBase = require('../DataBaseConnection/Configuration')
const templateRepository = require('../Repository/ReportTemplateRepository')
const sqlQuery = require('../Common/DataBaseQueries')

// List all templates

const getAllReportTemplates = (input, callback) => {
  let output = {}
  templateRepository.getAllReportTemplates(input, (result) => {
    if (result.length > 0) {
      output.data = result
      output.status = true
      callback(output)
    } else {
      output.error = messages.LISTGROUP.notfound
      output.status = false
      callback(output)
    }
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
