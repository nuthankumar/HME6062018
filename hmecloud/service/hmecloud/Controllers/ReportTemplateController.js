
const messages = require('../Common/Message')
const repository = require('../Repository/ReportTemplateRepository')

/**
 * The method can be used to execute create Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const createReportTemplate = (reportTemplate, callback) => {
  let output = {}
  const values = {
    AccountId: reportTemplate.AccountId,
    Stores: (reportTemplate.body.selectedList).toString(),
    TimeMeasure: reportTemplate.body.timeMeasure,
    FromDate: reportTemplate.body.fromDate,
    ToDate: reportTemplate.body.toDate,
    OpenTime: reportTemplate.body.openTime,
    CloseTime: reportTemplate.body.closeTime,
    Type: reportTemplate.body.type,
    Open: reportTemplate.body.open,
    Close: reportTemplate.body.close,
    Include: (reportTemplate.body.include).toString(),
    Format: reportTemplate.body.format,
    TemplateName: reportTemplate.body.templateName,
    CreatedBy: reportTemplate.body.CreatedBy,
    UpdatedBy: reportTemplate.body.UpdatedBy,
    CreatedDateTime: reportTemplate.body.CreatedDateTime,
    UpdatedDateTime: reportTemplate.body.UpdatedDateTime
  }
  repository.create(values, (result) => {
    if (result) {
      output.data = messages.REPORTSUMMARY.createSuccess
      output.status = true
      callback(output)
    } else {
      output.error = messages.REPORTSUMMARY.createFail
      output.status = false
      callback(output)
    }
  })
}

/**
 * The method can be used to execute get Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */

const getReportTemplate = (reportTemplate, callback) => {
  let output = {}
  repository.get(reportTemplate, (result) => {
    if (result) {
      const Stores = result.Stores.split(',')
      const Include = result.Include.split(',')
      output.data = result
      output.data.selectedList = Stores
      output.data.include = Include
      output.status = true
      callback(output)
    }
  })
}
const getAllReportTemplates = (input, callback) => {
  let output = {}
  repository.getAll(input.AccountId, input.CreatedBy, (result) => {
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
const deleteReportTemplate = (input, callback) => {
  let output = {}
  repository.deleteById(input, (result) => {
    if (result) {
      output.data = messages.REPORTSUMMARY.deleteSuccess
      output.status = true
      callback(output)
    } else {
      output.error = messages.REPORTSUMMARY.deteleFail
      output.status = false
      callback(output)
    }
  })
}

module.exports = {
  createReportTemplate,
  deleteReportTemplate,
  getReportTemplate,
  getAllReportTemplates
}
