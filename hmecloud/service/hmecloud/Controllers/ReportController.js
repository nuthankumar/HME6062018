const _ = require('lodash')
const messages = require('../Common/Message')
const ReportValidator = require('../Validators/ReportValidator')
const ReportsPagination = require('../Common/ReportPagination')
const repository = require('../Repository/ReportRepository')
const GetDeviceSingleStore = require('../Common/SingleStoreReport')
const GetDeviceMultipleStores = require('../Common/MultipleStoreReports')
const GetDeviceRawCarDataReport = require('../Common/RawCarDataReport')
const dateFormat = require('dateformat')
const CSVReport = require('../Common/DataExportUtil')
const Pdfmail = require('../Common/PDFUtils')

// Constructor method
const reports = function (request) {
  this.request = request
  if (this.request.body.deviceIds.length === 1) {
    this.isSingleStore = true
  } else {
    this.isSingleStore = false
  }
  if (!_.isUndefined(this.request.query.reportType) && (this.request.query.reportType.toLowerCase().trim() === 'csv')) {
    this.isCSV = true
  }
  if (!_.isUndefined(this.request.query.reportType) && (this.request.query.reportType.toLowerCase().trim() === 'pdf')) {
    this.isPDF = true
  }
  if (this.request.query.reportType === 'reports') {
    this.isReports = true
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
  let storeInfo
  let reportFilter = filter.reportName
  reportFilter === 'daypart' ? colors = reportResult.data[1] : colors = reportResult.data[4]
  reportFilter === 'daypart' ? goalSetting = reportResult.data[3] : goalSetting = reportResult.data[2]
  
  let deviceValues = {}
  if (this.isSingleStore) {
    let Colors
    reportFilter === 'daypart' ? Colors = reportResult.data[1] : Colors = reportResult.data[4]
    const deviceRecords = new GetDeviceSingleStore(reportResult.data[0], Colors, goalSetting, this.request, reportFilter)
    reportFilter === 'daypart' ? storeInfo = reportResult.data[4] : storeInfo = reportResult.data[3]
    deviceValues = deviceRecords.getStoreInfo(this.request, storeInfo)
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
      if (deviceHeaders && deviceHeaders.length > 0 && deviceHeaders[0].EventNames !== null && deviceHeaders[0].EventNames !== undefined) {
        let eventHeaders = deviceHeaders[0].EventNames.split('|$|')
        reportFilter === 'daypart' ? deviceLongestTimes = reportResult.data[2] : deviceLongestTimes = reportResult.data[1]
        let getLongestTime = deviceRecords.getLongestTime(deviceLongestTimes, eventHeaders)
        if (getLongestTime.length > 0) {
          deviceValues.LongestTimes = getLongestTime
        } else {
          deviceValues.LongestTimes = []
        }
      }
    }
    if (this.request.body.systemStatistics) {
      let DeviceSystemInfo = reportResult.data[6]
      let DeviceLaneInfo = reportResult.data[7]
      deviceValues.systemStatistics = deviceRecords.getSystemStatistics(DeviceSystemInfo, DeviceLaneInfo)
    }
    if (deviceHeaders && deviceHeaders.length > 0 && deviceHeaders[0].EventNames !== null && deviceHeaders[0].EventNames !== undefined) {
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
    if (reportFilter === 'daypart') {
      deviceValues.totalRecordCount = reportResult.data[10][0]
    } else {
      deviceValues.totalRecordCount = totalPages
    }
    deviceValues.localTime = this.request.body.localTime
    return deviceValues
  } else {
    // MutipleReport
    deviceValues.deviceIds = this.request.body.deviceIds
    if (reportFilter === 'daypart') {
      deviceValues.totalRecordCount = reportResult.data[5][0]
    } else {
      deviceValues.totalRecordCount = totalPages
    }
    if (reportResult.data[0] && reportResult.data[0].length > 0 && reportResult.data[0] !== null && reportResult.data[0] !== undefined) {
      let getDevices = new GetDeviceMultipleStores(reportResult.data[0], colors, goalSetting, this.request, reportFilter)
      deviceValues.timeMeasureType = getDevices.multipleStore()
    } else {
      deviceValues.timeMeasureType = []
    }
    let eventNames
    reportFilter === 'daypart' ? eventNames = reportResult.data[4] : eventNames = reportResult.data[6]
    if (eventNames && eventNames.length > 0 && eventNames[0].EventNames !== null) {
      let eventHeaders = eventNames[0].EventNames.split('|$|')
      eventHeaders = ['Groups', 'Stores', ...eventHeaders]
      eventHeaders.push('Total Cars')
      deviceValues.eventList = eventHeaders
    } else {
      deviceValues.eventList = []
    }
    deviceValues.timeMeasure = this.request.body.timeMeasure
    deviceValues.startTime = this.request.body.fromDate
    deviceValues.endTime = this.request.body.toDate
    deviceValues.localTime = this.request.body.localTime
    return deviceValues
  }
}
reports.prototype.getRawCarDataReport = function (reportResult) {
  let deviceValues = {}
  const devicesDetails = new GetDeviceRawCarDataReport(reportResult, this.request)
  let deviceStoreInfo = devicesDetails.storeInfo()
  deviceValues = deviceStoreInfo

  if (reportResult.data[0] && reportResult.data[0].length > 0 && reportResult.data[0] !== null && reportResult.data[0] !== undefined) {
    deviceValues.rawCarData = devicesDetails.generateReports(reportResult.data[0])
  } else {
    deviceValues.rawCarData = []
  }
  if (deviceValues.rawCarData.length > 0) {
    let events = []
    if (reportResult.data[1] && reportResult.data[1].length > 0 && reportResult.data[1] !== null && reportResult.data[1] !== undefined) {
      events = reportResult.data[1][0].EventTypeName.split('|$|')
      deviceValues.eventList = ['DepartureTime', 'EventName', 'CarsInQueue', ...events]
    } else {
      deviceValues.eventList = []
    }
  } else {
    deviceValues.key = 'ReportsNoRecordsFound'
  }
  return deviceValues
}
reports.prototype.generateCSV = function (reportResult, filter, totalPages, response) {
  let csvInput = {}
  let DeviceDetails = {}
  let eventHeaders = []
  csvInput.type = `${messages.COMMON.CSVTYPE}`
  if (filter.reportName === 'week') {
    csvInput.reportName = `${messages.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    csvInput.subject = `${messages.COMMON.WEEKREPORTTITLE} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  } else if (filter.reportName === 'daypart') {
    csvInput.reportName = `${messages.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    csvInput.subject = `${messages.COMMON.DAYPARTREPORTNAME} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  } else if (filter.reportName === 'day') {
    csvInput.reportName = `${messages.COMMON.DAYREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    csvInput.subject = `${messages.COMMON.DAYREPORTNAME} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  }
  csvInput.email = this.request.UserEmail
  if (filter.reportName === 'rawcardata') {
    let rawCarReports = this.getRawCarDataReport(reportResult)
    DeviceDetails = rawCarReports.rawCarData
    eventHeaders = []
  } else {
    let getReports = this.deviceDataPreparation(reportResult, filter, totalPages)
    DeviceDetails = getReports.timeMeasureType
    let deviceHeaders
    if (this.isSingleStore) {
      filter.reportName === 'daypart' ? deviceHeaders = reportResult.data[8] : deviceHeaders = reportResult.data[9]
    } else {
      filter.reportName === 'daypart' ? deviceHeaders = reportResult.data[4] : deviceHeaders = reportResult.data[6]
    }
    if (deviceHeaders && deviceHeaders.length > 0 && deviceHeaders[0].EventNames !== null && deviceHeaders[0].EventNames !== undefined) {
      eventHeaders = deviceHeaders[0].EventNames.split('|$|')
    } else {
      eventHeaders = []
    }
  }
  CSVReport.generateCSVReport(DeviceDetails, this.request, csvInput, filter, eventHeaders, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
}
reports.prototype.generatePDF = function (reportResult, filter, totalPages, response) {
  let pdfInput = {}
  let DeviceDetails
  pdfInput.type = `${messages.COMMON.PDFTYPE}`
  if (filter === 'week') {
    pdfInput.reportName = `${messages.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    pdfInput.subject = `${messages.COMMON.WEEKREPORTTITLE} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  } else if (filter === 'daypart') {
    pdfInput.reportName = `${messages.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    pdfInput.subject = `${messages.COMMON.DAYPARTREPORTNAME} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  } else if (filter === 'day') {
    pdfInput.reportName = `${messages.COMMON.DAYREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
    pdfInput.subject = `${messages.COMMON.DAYREPORTNAME} ${this.request.body.openTime} ${this.request.body.toDate + (this.request.body.format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  }
  pdfInput.email = this.request.UserEmail
  if (this.isSingleStore) {
    let singleStore = this.deviceDataPreparation(reportResult, filter, totalPages)
    if (singleStore.eventList.length > 0) {
      singleStore.goalHeaders = singleStore.goalData
    } else {
      singleStore.goalHeaders = []
    }
    Pdfmail.singleStore(singleStore, pdfInput, isMailSent => {
      if (isMailSent) {
        response.status(200).send(isMailSent)
      } else {
        response.status(400).send(isMailSent)
      }
    })
  } else {
    let multipleStore = this.deviceDataPreparation(reportResult, filter, totalPages)
    Pdfmail.mutipleStore(multipleStore, pdfInput, isMailSent => {
      if (isMailSent) {
        response.status(200).send(isMailSent)
      } else {
        response.status(400).send(isMailSent)
      }
    })
  }
}
// create Report
reports.prototype.createReports = function (response) {
  let isValidation = this.validation()
  if (isValidation.status === true) {
    let totalPages = this.pagination(isValidation.reportName)
    repository.getReport(this.request, isValidation.reportName, reportResult => {
      let Output
      if (reportResult.status) {
        if (isValidation.reportName === 'rawcardata') {
          if (this.isCSV) {
            Output = this.generateCSV(reportResult, isValidation.reportName, totalPages)
            if (Output.status === true) {
              response.status(200).send(Output)
            } else {
              response.status(400).send(Output)
            }
          } else if (this.isReports) {
            Output = this.getRawCarDataReport(reportResult)
            Output.status = true
            if (Output.status === true) {
              response.status(200).send(Output)
            } else {
              response.status(400).send(Output)
            }
          }
        } else {
          if (this.isPDF) {
            this.generatePDF(reportResult, isValidation, totalPages, response)
          } else if (this.isCSV) {
            this.generateCSV(reportResult, isValidation, totalPages, response)
          } else {
            Output = this.deviceDataPreparation(reportResult, isValidation, totalPages)
            Output.status = true
            if (Output.status === true) {
              response.status(200).send(Output)
            } else {
              response.status(400).send(Output)
            }
          }
        }
      } else {
        response.status(400).send(reportResult)
      }
    })
  } else {
    response.status(400).send(isValidation)
  }
}
module.exports = reports
