const _ = require('lodash')
const messages = require('../Common/Message')
const ReportValidator = require('../Validators/ReportValidator')
const ReportsPagination = require('../Common/ReportPagination')
const repository = require('../Repository/ReportRepository')
const GetDeviceSingleStore = require('../Common/SingleStoreReport')
const GetDeviceMultipleStores = require('../Common/MultipleStoreReports')
const dateFormat = require('dateformat')
const dataExportUtil = require('../Common/DataExportUtil')

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
    if (reportResult.data[0] && reportResult.data[0].length > 0 && reportResult.data[0] !== null && reportResult.data[0] !== undefined) {
      deviceValues.timeMeasureType = deviceRecords.getSingleStoreValues()
    } else {
      deviceValues.timeMeasureType = []
    }
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
    if (deviceHeaders && deviceHeaders.length > 0 && deviceHeaders[0].EventNames !== null) {
      let eventHeaders = deviceHeaders[0].EventNames.split('|$|')
      if (reportFilter === 'daypart') {
        eventHeaders = ['Daypart', ...eventHeaders]
      } else if (reportFilter === 'day') {
        eventHeaders = ['Day', ...eventHeaders]
      } else if (reportFilter === 'week') {
        eventHeaders = ['Week', ...eventHeaders]
      }
      eventHeaders.push('Total Cars')
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
    if (reportResult.data[0] && reportResult.data[0].length > 0 && reportResult.data[0] !== null && reportResult.data[0] !== undefined) {
      let getDevices = new GetDeviceMultipleStores(reportResult.data[0], colors, goalSetting, this.request, reportFilter)
      deviceValues.timeMeasureType = getDevices.multipleStore()
    } else {
      deviceValues.timeMeasureType = []
    }
    if (reportResult.data[6] && reportResult.data[6].length > 0 && reportResult.data[6][0].EventNames !== null) {
      let eventHeaders = reportResult.data[6][0].EventNames.split('|$|')
      eventHeaders = ['Groups', 'Stores', ...eventHeaders]
      eventHeaders.push('Total Cars')
      deviceValues.eventList = eventHeaders
    } else {
      deviceValues.eventList = []
    }
    return deviceValues
  }
}
reports.prototype.createCSVReport = function (reportResult, reportName) {

}
// create Report
reports.prototype.createReports = function (response) {
  let isValidation = this.validation()
  if (isValidation.status === true) {
    let totalPages = this.pagination(isValidation.reportName)
    repository.getReport(this.request, isValidation.reportName, reportResult => {
      if (reportResult.status) {
        let Output = this.deviceDataPreparation(reportResult, isValidation, totalPages)
        if (!_.isUndefined(this.request.query.reportType) && (this.request.query.reportType.toLowerCase().trim() === 'csv' || this.request.query.reportType.toLowerCase().trim() === 'pdf')) {
          if (this.request.query.reportType.toLowerCase().trim() === 'csv') {
            this.createCSVReport(reportResult, isValidation)
            // generateCSVTriggerEmail(request, input, result, isMailSend => {
            //   console.log('ISMAIL', isMailSend)
            //   callback(isMailSend)
            // })
          }
        }
        Output.status = true
        if (Output.status === true) {
          response.status(200).send(Output)
        } else {
          response.status(400).send(Output)
        }
      } else {
        response.status(400).send(reportResult)
      }
    })
  } else {
    return isValidation
  }
}
module.exports = reports
