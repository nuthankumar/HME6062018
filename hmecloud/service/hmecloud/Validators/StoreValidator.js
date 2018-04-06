const validate = require('validator')
const storeController = require('../Controllers/StoreController')

const reportValidator = (request, callback) => {
  let output = {}
  if (request.body.reportTemplateStoreIds) {
    const input = {
      ReportTemplate_StoreIds: request.body.reportTemplateStoreIds,
      ReportTemplate_Advanced_Op: request.body.reportTemplateAdvancedOp,
      ReportTemplate_Time_Measure: request.body.reportTemplateTimeMeasure,
      ReportTemplate_From_Date: request.body.reportTemplateFromDate,
      ReportTemplate_To_Date: request.body.reportTemplateToDate,
      ReportTemplate_From_Time: request.body.reportTemplateFromTime,
      ReportTemplate_To_Time: request.body.reportTemplateToTime,
      ReportTemplate_Open: request.body.reportTemplateOpen,
      ReportTemplate_Close: request.body.reportTemplateClose,
      ReportTemplate_Type: request.body.reportTemplateType,
      ReportTemplate_Include_Longs: request.body.reportTemplateIncludeLongs,
      ReportTemplate_Include_Stats: request.body.ReportTemplateIncludeStats,
      ReportTemplate_Format: request.body.reportTemplateFormat,
      Hours1: request.body.Hours,
      Minutes1: request.body.Minutes,
      AMPM1: request.body.AMPM,
      Hours2: request.body,
      Minutes2: request.body,
      AMPM2: request.body.AMPM,
      reportType: request.query.reportType
    }

    if (input.ReportTemplate_Advanced_Op === 1 && (input.ReportTemplate_Open !== 1 || input.ReportTemplate_Close !== 1)) {
      input.ReportTemplate_Type = 'TC'
      input.ReportTemplate_Include_Longs = null
      input.ReportTemplate_Include_Stats = null
    }

    if (!input.ReportTemplate_From_Date || !input.ReportTemplate_To_Date) {
      output.error = request.t('REPORTSUMMARY.DateCannotbeEmpty')
      output.status = false
      callback(output)
    }
    if (!input.ReportTemplate_Time_Measure === 'Raw Data Report') {
      storeController.generateReport(input, result => {
        callback(result)
      })
    } else {
      storeController.getRawCarDataReport(input, result => {
        callback(result)
      })
    }
  } else {

  }
}

const csvValidator = (request, callback) => {
  let output = {}
  const input = {
    email: request.email,
    subject: request.subject,
    attachment: request.attachment
  }
  const emailId = validate.isEmail(input.email)

  if (emailId) {
    storeController.generateCsv(input, result => {
      callback(result)
    })
  } else {
    output.error = request.t('REPORTSUMMARY.InvalidEmail')
    output.status = false
    callback(output)
  }
}
module.exports = {
  reportValidator,
  csvValidator

}
