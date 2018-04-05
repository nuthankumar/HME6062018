const validate = require('validator')
const storeController = require('../Controllers/StoreController')

const reportValidator = (request, callback) => {
   
  if (request.body.reportTemplateStoreId) {
    const input = {
      ReportTemplate_StoreId: request.body.reportTemplateStoreId,
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
      ReportTemplate_Format: request.body.reportTemplateFormat,
      reportType: request.query.reportType
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
    let output = {}
    output.error = request.t('CREATEGROUP.invalidRequestBody')
    output.status = false
    callback(output)
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
    output.error = request.t('CREATEGROUP.invalidRequestBody')
    output.status = false
    callback(output)
  }
}
module.exports = {
  reportValidator,
  csvValidator

}
