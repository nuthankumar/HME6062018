const validate = require('validator')
const storeController = require('../Controllers/StoreController')
const dayReportController = require('../Controllers/DayReportController')
const dayPartReportController = require('../Controllers/DayPartReportController')
const weekReportController = require('../Controllers/WeekReportController')
const dateUtils = require('../Common/DateUtils')

const reportValidator = (request, callback) => {
  let output = {}

  if (request.body.selectedStoreIds.length > 0) {
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
      longestTime: request.body.longestTime, // boolean
      systemStatistics: request.body.systemStatistics, // boolean
      ReportTemplate_Format: request.body.format, // number
      reportType: request.query.reportType,
      userUid: process.env.USERUID,
      UserEmail: request.UserEmail,
      CarDataRecordType_ID: request.UserPreferenceValue,
      recordPerPage: request.body.recordPerPage,
      pageNumber: request.body.pageNumber
    }

    // if advance option true and open/ close is true report type can be 2=TC
    // longest and system statistic disalbled and should be false
    if (input.ReportTemplate_StoreIds.length > 250) {
      output.error = request.t('REPORTSUMMARY.StoreSelectionInvalid')
      output.status = false
      callback(output)
    }

    if (input.ReportTemplate_Advanced_Op &&
          (input.ReportTemplate_Open || input.ReportTemplate_Close)) {
      if (input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(93, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.AdvancedDateRangeInvalid')
        output.status = false
        callback(output)
      }

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

    if (input.ReportTemplate_From_Date > input.ReportTemplate_To_Date) {
      output.error = request.t('REPORTSUMMARY.FormDateGreaterThanToDate')
      output.status = false
      callback(output)
    }

    // report time measure day data
    if (input.ReportTemplate_Time_Measure === 1) {
      if (!input.ReportTemplate_Advanced_Op && input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(31, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.DayInvalidDateRange')
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
              input.ReportTemplate_StoreIds.length > 100 &&
              input.ReportTemplate_StoreIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(31, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.AdvancedDayInvalidDateRange')
        output.status = false
        callback(output)
      }
        dayReportController.generateDayReportByDate(request, input, result => {
        callback(result)
      })
      // report time measure day part data
    } else if (input.ReportTemplate_Time_Measure === 2) {
      if (!input.ReportTemplate_Advanced_Op && input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(14, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.DayPartInvalidDateRange')
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
              input.ReportTemplate_StoreIds.length > 100 &&
              input.ReportTemplate_StoreIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(21, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.AdvancedDateRangeDayPartInvalid')
        output.status = false
        callback(output)
      }
      console.log('start');
      dayPartReportController.generateDaypartReport(request, input, result => {
        callback(result)
      })
      // report time measure week data
    } else if (input.ReportTemplate_Time_Measure === 3) {
      if (!input.ReportTemplate_Advanced_Op &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(62, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.WeekInvalidDateRange')
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_Advanced_Op &&
              input.ReportTemplate_StoreIds.length > 100 &&
              input.ReportTemplate_StoreIds.length < 250 &&
              input.ReportTemplate_To_Date > dateUtils.getAdvancedSelectionMaxDate(21, input.ReportTemplate_From_Date)) {
        output.error = request.t('REPORTSUMMARY.AdvancedDateRangeWeekInvalid')
        output.status = false
        callback(output)
      }
        weekReportController.generateWeekReportByDate(input, result => {
        callback(result)
      })
      // report time measure raw car data
    } else if (input.ReportTemplate_Time_Measure === 4) {
      if (input.ReportTemplate_StoreIds.length > 1) {
        output.error = request.t('REPORTSUMMARY.InvalidRawCarStoreLength')
        output.status = false
        callback(output)
      }
      if (input.ReportTemplate_To_Date !== input.ReportTemplate_From_Date) {
        output.error = request.t('REPORTSUMMARY.DateRangeInvalid')
        output.status = false
        callback(output)
      }
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
