
const messages = require('../Common/Message')
const repository = require('../Repository/ReportTemplateRepository')

const createReportTemplate = (reportTemplate, callback) => {
  let output = {}
  const values = {
    AccountId: reportTemplate.AccountId,
    Stores: (reportTemplate.selectedList).toString(),
    TimeMeasure: reportTemplate.timeMeasure,
    FromDate: reportTemplate.fromDate,
    ToDate: reportTemplate.toDate,
    OpenTime: reportTemplate.openTime,
    CloseTime: reportTemplate.closeTime,
    Type: reportTemplate.type,
    Open: reportTemplate.open,
    Close: reportTemplate.close,
    Include: (reportTemplate.include).toString(),
    Format: reportTemplate.format,
    TemplateName: reportTemplate.templateName,
    CreatedBy: reportTemplate.CreatedBy,
    UpdatedBy: reportTemplate.Updatedby
  }
  repository.create(values, (result) => {
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
const getReportTemplate = (reportTemplate, callback) => {
  let output = {}
  repository.getReportTemplate(reportTemplate, (result) => {
    if (result) {
      const Stores = result.Stores.split(',')
      const Include = result.Include.split(',')
      output.data.accountId = result.AccountId
      output.data.selectedList = Stores
      output.data.timeMeasure = result.TimeMeasure
      output.data.fromDate = result.FromDate
      output.data.toDate = result.ToDate
      output.data.openTime = result.OpenTime
      output.data.closeTime = result.CloseTime
      output.data.templateName = result.TemplateName
      output.data.open = result.Open
      output.data.close = result.Close
      output.data.type = result.Type
      output.data.include = Include
      output.data.format = result.Format
      output.status = true
      callback(output)
    } else {
      output.error = messages.LISTGROUP.notfound
      output.status = false
      callback(output)
    }
  })
}
const getAllReportTemplates = (input, callback) => {
  let output = {}
  console.log("INPUT",input)
  repository.getAll(input, (result) => {
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

module.exports = {
  createReportTemplate,
  deleteReportTemplate,
  getReportTemplate,
  getAllReportTemplates
}
