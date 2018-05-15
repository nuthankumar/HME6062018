const dateUtils = require('../Common/DateUtils')
const moment = require('moment')

/**
 * validator validate method to validate the arguments which has been passed
 * to controller is valida or not
 * @param  {endpoint} generateReports webservice name
 * @param  {inputValidator} inputValidator validation the input
 * @param  {dateRange} dateRange Check the DateRange
 * @param  {reportValidator} reportValidator check report filters
 * @param  {request} request  from  user request
 * @public
 */
const validator = function (request) {
  this.request = request
}

validator.prototype.inputValidator = function () {
  let output = {}
  let reportName
  if (this.request.body.deviceIds.length > 0) {
    if (this.request.body.deviceIds.length > 250) {
      output.key = 'storeSelectionInvalid'
      output.status = false
      return output
    }
    if (this.request.body.toDate > dateUtils.getAdvancedSelectionMaxDate(93, this.request.body.fromDate)) {
      output.key = 'advancedDateRangeInvalid'
      output.status = false
      return output
    }
    // If date range is null
    if (!this.request.body.fromDate || !this.request.body.toDate) {
      output.key = 'dateCannotbeEmpty'
      output.status = false
      return output
    }
    let fromDate = moment(this.request.body.toDate)
    let toDate = moment(this.request.body.fromDate)
    let daysDifferent = fromDate.diff(toDate, 'days')
    if (daysDifferent < 0) {
      output.key = 'fromDateGreaterThanToDate'
      output.status = false
      return output
    }
    if (this.request.body.timeMeasure === 1) {
      reportName = 'day'
      return reportName
    } else if (this.request.body.timeMeasure === 2) {
      reportName = 'daypart'
      return reportName
    } else if (this.request.body.timeMeasure === 3) {
      reportName = 'week'
      return reportName
    } else if (this.request.body.timeMeasure === 4) {
      reportName = 'rawcardata'
      return reportName
    }
  } else {
    output.key = 'invalidDeviceId'
    output.status = false
    return output
  }
}
validator.prototype.dateRange = function (date) {
  let output = {}
  if (!this.request.body.advancedOptions && this.request.body.toDate > dateUtils.getAdvancedSelectionMaxDate(date.dateRangeOne, this.request.body.fromDate)) {
    output.key = date.errorKey
    output.status = false
    return output
  } else if (this.request.body.advancedOptions &&
              this.request.body.deviceIds.length > 100 &&
              this.request.body.deviceIds.length < 250 &&
                  this.request.body.toDate > dateUtils.getAdvancedSelectionMaxDate(date.dateRangeTwo, this.request.body.fromDate)) {
    output.key = date.advanceErrorKey
    output.status = false
    return output
  } else {
    output.status = true
    return output
  }
}
validator.prototype.reportValidator = function (isReportName) {
  let date = {}
  if (isReportName === 'day') {
    date.dateRangeOne = 31
    date.dateRangeTwo = 31
    date.errorKey = 'dayInvalidDateRange'
    date.advanceErrorKey = 'advancedDayInvalidDateRange'
  } else if (isReportName === 'daypart') {
    date.dateRangeOne = 14
    date.dateRangeTwo = 21
    date.errorKey = 'dayPartInvalidDateRange'
    date.advanceErrorKey = 'advancedDateRangeDayPartInvalid'
  } else if (isReportName === 'week') {
    date.dateRangeOne = 62
    date.dateRangeTwo = 21
    date.errorKey = 'weekInvalidDateRange'
    date.advanceErrorKey = 'advancedDateRangeWeekInvalid'
  }
  let checkDateRange = this.dateRange(date)
  if (checkDateRange.status === false) {
    return checkDateRange
  } else {
    let output = {}
    output.reportName = isReportName
    output.status = true
    return output
  }
}

module.exports = validator
