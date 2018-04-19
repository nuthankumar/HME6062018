const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')
const dataExportUtil = require('../Common/DataExportUtil')
const dateFormat = require('dateformat')
const message = require('../Common/Message')

const generateWeekReportByDate = (request, input, callback) => {
  let pageStartDate = input.ReportTemplate_From_Date
  let pageEndDate = input.ReportTemplate_To_Date
  let lastPage = 0
  let currentPage = input.pageNumber

  if (currentPage === 0) {
    lastPage = 0
    pageStartDate = input.ReportTemplate_From_Date
    pageEndDate = input.ReportTemplate_To_Date
  } else if (input.ReportTemplate_DeviceIds.length > 1) {
    let daysDiff = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
    lastPage = Math.ceil((daysDiff + 1) / 14)
    if (currentPage !== 1) {
      pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 14), pageStartDate)
    }
    pageEndDate = dateUtils.getAdvancedSelectionMaxDate(13, pageStartDate)
    if (pageEndDate > input.ReportTemplate_To_Date) {
      pageEndDate = dateUtils.getAdvancedSelectionMaxDate(6, pageStartDate)
    }
  } else {
    let daysDiff = dateUtils.dateDifferenceMonths(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
    lastPage = Math.ceil((daysDiff + 1))
    if (currentPage !== 1) {
      pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 31), pageStartDate)
    }
    pageEndDate = dateUtils.getAdvancedSelectionMaxDate(27, pageStartDate)
    if (pageEndDate > input.ReportTemplate_To_Date) {
      pageEndDate = input.ReportTemplate_To_Date
    }
  }
  input.ReportTemplate_From_Date = pageStartDate
  input.ReportTemplate_To_Date = pageEndDate
  generateWeekReport(request, input, result => {
    if (result) {
      let totalRecordCount = {}
      totalRecordCount.NoOfPages = lastPage
      result.totalRecordCount = totalRecordCount
    }
    callback(result)
  })
}
const generateWeekReport = (request, input, callback) => {
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  const inputDate = {
    Device_IDs: (input.ReportTemplate_DeviceIds).toString(),
    StoreStartDate: input.ReportTemplate_From_Date,
    StoreEndDate: input.ReportTemplate_To_Date,
    StartDateTime: fromDateTime,
    EndDateTime: toDateTime,
    CarDataRecordType_ID: input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1,
    longestTime: input.longestTime,
    systemStatistics: input.systemStatistics,
    UserUID: request.userUid,
    UserEmail: request.UserEmail
  }

  repository.getWeekReport(inputDate, (result) => {
    if (result.length > 0) {
      const repositoryData = result
      let reportData = {}
      let data = {}
      data.timeMeasure = 3
      data.selectedStoreIds = input.ReportTemplate_DeviceIds
      data.startTime = moment(fromDateTime).format('LL')
      data.stopTime = moment(toDateTime).format('LL')
      let colors = _.filter(repositoryData, val => val.ColourCode)
      let reportName = 'Week'
      // Single Store
      if (!_.isUndefined(input.reportType) && (input.reportType.toLowerCase().trim() === 'csv' || input.reportType.toLowerCase().trim() === 'pdf')) {
        if (input.reportType.toLowerCase().trim() === 'csv') {
          generateCSVOrPdfTriggerEmail(request, input, result)
        } else {
          let isMethod = 'PDF'
          const pdf = jsonFromateChange(request, data, input, result, reportName, isMethod)
          if (pdf) {
            let output = {}
            output.data = input.UserEmail
            output.status = true
            callback(output)
          } else {
            let output = {}
            output.key = 'pdfNotificationFailed'
            output.status = false
            callback(output)
          }
        }
      } else if (input.ReportTemplate_DeviceIds.length === 1) {
        let isMethod = 'singleReport'
        const singleReport = jsonFromateChange(request, data, input, result, reportName, isMethod)
        reportData = singleReport
        reportData.status = true
        callback(reportData)
      } else if (input.ReportTemplate_DeviceIds.length > 1) {
        let isMethod = 'multipleReport'
        const multipleReport = jsonFromateChange(request, data, input, result, reportName, isMethod)
        //  multipleReports.totalRecordCount = _.find(repositoryData, totalRecords => totalRecords.TotalRecCount)
        console.log('multipleReport', multipleReport)
        reportData = multipleReport
        reportData.status = true

        callback(reportData)
      }
    } else {
      let output = {}

      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}

function generateCSVOrPdfTriggerEmail (request, input, result, callBack) {
  let csvInput = {}
  csvInput.type = `${message.COMMON.CSVTYPE}`
  csvInput.reportName = `${message.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`

  csvInput.email = input.UserEmail
  csvInput.subject = `${message.COMMON.WEEKREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, csvResults => {
    callBack(csvResults)
  })
}
const jsonFromateChange = (request, data, input, result, reportName, isMethod) => {
  let pdfInput = {}
  pdfInput.type = `${message.COMMON.PDFTYPE}`
  pdfInput.reportName = `${message.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
  pdfInput.email = input.UserEmail
  pdfInput.subject = `${message.COMMON.WEEKREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  return dataExportUtil.prepareJson(data, input, result, reportName, pdfInput, isMethod)
}

module.exports = {
  generateWeekReport,
  generateWeekReportByDate
}
