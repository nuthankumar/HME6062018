const validate = require('validator')
const storeController = require('../Controllers/StoreController')
const dayReportController = require('../Controllers/DayReportController')
const dayPartReportController = require('../Controllers/DayPartReportController')
const weekReportController = require('../Controllers/WeekReportController')

const reportValidator = (request, callback) => {
  let output = {}
  console.log('report validator', request.body.selectedStoreIds)
  if (request.body.selectedStoreIds) {
    const input = {
      ReportTemplate_StoreIds: request.body.selectedStoreIds, //  [] array of object
      ReportTemplate_Advanced_Op: request.body.advancedOptions, // boolean
      ReportTemplate_Time_Measure: request.body.timeMeasure, // number
      ReportTemplate_From_Date: request.body.fromDate, // string date
      ReportTemplate_To_Date: request.body.toDate, // string date
      ReportTemplate_From_Time: request.body.openTime, // hours:min AM/PM
      ReportTemplate_To_Time: request.body.closeTime, // hours:min AM/PM
      ReportTemplate_Open: request.body.open, // boolean
      ReportTemplate_Close: request.body.close, // boolean
      ReportTemplate_Type: request.body.type, // number
      Include: request.body.include, // [] array
      longestTime: request.body.longestTime, // boolean
      // systemStatistics: request.body.systemStatistics, // boolean
      // ReportTemplate_Format: request.body.format, // number
      // Hours1: request.body.Hours,
      // Minutes1: request.body.Minutes,
      // AMPM1: request.body.AMPM,
      // Hours2: request.body,
      // Minutes2: request.body,
      // AMPM2: request.body.AMPM,
      reportType: request.query.reportType,
      UserEmail: request.UserEmail,
      CarDataRecordType_ID: request.UserPreferenceValue
    }
    // if advance option true and open/ close is true report type can be 2=TC
    // longest and system statistic disalbled and should be false
    if (input.ReportTemplate_Advanced_Op && (input.ReportTemplate_Open || input.ReportTemplate_Close)) {
      if (input.ReportTemplate_Type === 1) {
        input.ReportTemplate_Type = 'TC'
      }
      input.longestTime = false
      input.systemStatistics = false
    }
    if (input.ReportTemplate_Type === 2) {
      input.ReportTemplate_Type = 'AC'
    }
    // If date range is null
    if (!input.ReportTemplate_From_Date || !input.ReportTemplate_To_Date) {
      output.error = request.t('REPORTSUMMARY.DateCannotbeEmpty')
      output.status = false
      callback(output)
    }
    console.log(input.ReportTemplate_Time_Measure)
    // report time measure day data
    if (input.ReportTemplate_Time_Measure === 1) {
      dayReportController.generateDayReport(input, result => {
        callback(result)
      })
      // report time measure day part data
    } else if (input.ReportTemplate_Time_Measure === 2) {
      dayPartReportController.generateDaypartReport(input, result => {
        callback(result)
      })
      // report time measure week data
    } else if (input.ReportTemplate_Time_Measure === 3) {
      weekReportController.generateWeekReport(input, result => {
        callback(result)
      })
      // report time measure raw car data
    } else if (input.ReportTemplate_Time_Measure === 4) {
      storeController.getRawCarDataReport(input, result => {
        callback(result)
      })
    }
  } else {
    output.error = request.t('REPORTSUMMARY.InvalidStoreId')
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
    output.error = request.t('REPORTSUMMARY.InvalidEmail')
    output.status = false
    callback(output)
  }
}
module.exports = {
  reportValidator,
  csvValidator

}