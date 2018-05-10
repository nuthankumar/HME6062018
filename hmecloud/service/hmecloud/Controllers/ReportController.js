const messages = require('../Common/Message')
const _ = require('lodash')
const ReportValidator = require('../Validators/ReportValidator')
const ReportsPagination = require('../Common/ReportPagination')
const repository = require('../Repository/ReportRepository')
const GetDeviceDetails = require('../Common/SingleStoreReport')
/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status) => {
  let output = {}
  output.key = message
  output.status = status
  return output
}

// Constructor method
const reports = function (request) {
  this.request = request
  if (this.request.body.deviceIds.length === 1) {
    this.isSingleStore = true
  } else {
    this.isSingleStore = false
  }
}
// validation methods
reports.prototype.validation = function () {
  const Validator = new ReportValidator(this.request)
  let result = Validator.inputValidator()
  if (result.status === false) {
    return result
  }
  return Validator.reportValidator(result)
}
// calcuate pagination
reports.prototype.pagination = function (isReportName) {
  let totalPages = new ReportsPagination(this.request, isReportName)
  return totalPages.noOfPages()
}
// get devices values
// result, colors, goalSettings, format
reports.prototype.deviceDataPreparation = function (reportResult, filter, totalPages) {
  let colors
  let goalSetting
  let reportFilter = filter.reportName
  reportFilter === 'daypart' ? colors = reportResult.data[1] : colors = reportResult.data[4]
  goalSetting = reportResult.data[2]
  let deviceValues = {}
  if (this.isSingleStore) {
    const deviceRecords = new GetDeviceDetails(reportResult.data[0], colors, goalSetting, this.request, reportFilter)
    deviceValues = deviceRecords.getStoreInfo(this.request, reportFilter)
    deviceValues.timeMeasureType = deviceRecords.getSingleStoreValues()
    // goal
    let deviceGoalInfo = reportResult.data[5]
    const getLastRecord = _.last(reportResult.data[0])
    let totalCars = getLastRecord['Total_Car']
    let goalHeader
    let deviceHeaders

    reportFilter === 'daypart' ? goalHeader = reportResult.data[9] : goalHeader = reportResult.data[8]
    reportFilter === 'daypart' ? deviceHeaders = reportResult.data[8] : deviceHeaders = reportResult.data[9]
    let goalStatistics = deviceRecords.getGoalStatistics(goalSetting, deviceGoalInfo, totalCars, goalHeader, deviceHeaders)
    deviceValues.goalData = goalStatistics
    if (this.request.body.longestTime) {
      let deviceLongestTimes
      reportFilter === 'daypart' ? deviceLongestTimes = reportResult.data[2] : deviceLongestTimes = reportResult.data[1]
      let getLongestTime = deviceRecords.getLongestTime(deviceLongestTimes)
      if (getLongestTime.length > 0) {
        deviceValues.LongestTimes = getLongestTime
      } else {
        deviceValues.LongestTimes = []
      }
    }
    if (this.request.body.systemStatistics) {
      let DeviceSystemInfo = reportResult.data[6]
      let DeviceLaneInfo = reportResult.data[7]
      deviceValues.systemStatistics = deviceRecords.getSystemStatistics(DeviceSystemInfo, DeviceLaneInfo)
    }
    let eventHeaders = deviceHeaders[0].EventNames.split('|$|')
    if (reportFilter === 'daypart') {
      eventHeaders.push('Daypart')
    } else if (reportFilter === 'day') {
      eventHeaders.push('Day')
    } else if (reportFilter === 'week') {
      eventHeaders.push('Week')
    }
    deviceValues.eventList = eventHeaders
    deviceValues.totalRecordCount = totalPages
    return deviceValues
  }
}
// create Report
reports.prototype.createReports = function (response) {
  let isValidation = this.validation()
  if (isValidation.status === true) {
    let totalPages = this.pagination(isValidation.reportName)
    repository.createReport(this.request, isValidation.reportName, reportResult => {
      if (reportResult.status) {
        let Output = this.deviceDataPreparation(reportResult, isValidation, totalPages)
        Output.status = true
        if (Output.status === true) {
          response.status(200).send(Output)
        } else {
          response.status(400).send(Output)
        }
      } else {
        console.log('db error')
      }
    })
  } else {
    return isValidation
  }
}
module.exports = reports
