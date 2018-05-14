const messages = require('../Common/Message')
const _ = require('lodash')
const ReportValidator = require('../Validators/ReportValidator')
const ReportsPagination = require('../Common/ReportPagination')
const repository = require('../Repository/ReportRepository')
const GetDeviceSingleStore = require('../Common/SingleStoreReport')
const GetDeviceMultipleStores = require('../Common/MultipleStoreReports')
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
reports.prototype.deviceDataPreparation = function (reportResult, filter, totalPages) {
  let colors
  let goalSetting
  let reportFilter = filter.reportName
  reportFilter === 'daypart' ? colors = reportResult.data[1] : colors = reportResult.data[4]
  goalSetting = reportResult.data[2]
  let deviceValues = {}
  if (this.isSingleStore) {
    const deviceRecords = new GetDeviceSingleStore(reportResult.data[0], colors, goalSetting, this.request, reportFilter)
    deviceValues = deviceRecords.getStoreInfo(this.request, reportFilter)
    deviceValues.timeMeasureType = deviceRecords.getSingleStoreValues()
    // goal
    let deviceGoalInfo = reportResult.data[5]
    const getLastRecord = _.last(reportResult.data[0])
    let totalCars
    if (getLastRecord !== undefined) {
      totalCars = getLastRecord['Total_Car']
    } else {
      totalCars = 0
    }
    let goalHeader
    reportFilter === 'daypart' ? goalHeader = reportResult.data[9] : goalHeader = reportResult.data[8]
    let deviceHeaders
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
    if (deviceHeaders[0].EventNames !== null) {
      let eventHeaders = deviceHeaders[0].EventNames.split('|$|')
      if (reportFilter === 'daypart') {
        eventHeaders = ['Daypart', ...eventHeaders]
      } else if (reportFilter === 'day') {
        eventHeaders = ['Day', ...eventHeaders]
      } else if (reportFilter === 'week') {
        eventHeaders = ['Week', ...eventHeaders]
      }
      deviceValues.eventList = eventHeaders
    } else {
      deviceValues.eventList = []
    }
    deviceValues.totalRecordCount = totalPages
    return deviceValues
  } else {
    // MutipleReport
    deviceValues.deviceIds = this.request.body.deviceIds
    deviceValues.totalRecordCount = totalPages
    if (reportResult.data[0] && reportResult.data[0].length > 0) {
      let getDevices = new GetDeviceMultipleStores(reportResult.data[0], colors, goalSetting, this.request, reportFilter)
      deviceValues.timeMeasureType = getDevices.multipleStore()
    }
    if (reportResult.data[6] && reportResult.data[6][0].EventNames !== null) {
      let eventHeaders = reportResult.data[6][0].EventNames.split('|$|')
      eventHeaders = ['Groups', 'Stores', ...eventHeaders]
      deviceValues.eventList = eventHeaders
    } else {
      deviceValues.eventList = []
    }
    return deviceValues
  }
}
// create Report
reports.prototype.createReports = function (response) {
  let isValidation = this.validation()
  if (isValidation.status === true) {
    let totalPages = this.pagination(isValidation.reportName)
    repository.createReport(this.request, isValidation.reportName, reportResult => {
      try {
        if (reportResult.status) {
          let Output = this.deviceDataPreparation(reportResult, isValidation, totalPages)
          Output.status = true
          if (Output.status === true) {
            response.status(200).send(Output)
          } else {
            response.status(400).send(Output)
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    })
  } else {
    return isValidation
  }
}
module.exports = reports
