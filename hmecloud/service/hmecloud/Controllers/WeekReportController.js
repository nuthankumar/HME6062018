const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const repository = require('../Repository/StoresRepository')
const dataExportUtil = require('../Common/DataExportUtil')
const reportsUtils = require('../Common/ReportGenerateUtils')
const storeInfo = require('../Common/WeekReportUtils')
const dateFormat = require('dateformat')
const messages = require('../Common/Message')
const Pdfmail = require('../Common/PDFUtils')
/**
 * The method can be used to execute Pagination Details
 */
const pagination = (weekReports, request, input) => {
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
  let totalRecordCount = {}
  totalRecordCount.NoOfPages = lastPage
  weekReports.totalRecordCount = totalRecordCount
  return weekReports
}
/**
 * The method can be used to execute preaping the input to database
 */
const repositoryInput = (request, input) => {
  let inputTransform = {
    Device_IDs: input.ReportTemplate_DeviceIds.toString(),
    StoreStartDate: input.ReportTemplate_From_Date,
    StoreEndDate: input.ReportTemplate_To_Date,
    StartDateTime: dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time),
    EndDateTime: dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time),
    CarDataRecordType_ID: 11,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1,
    longestTime: input.longestTime,
    systemStatistics: input.systemStatistics,
    UserUID: request.userUid,
    UserEmail: request.UserEmail
  }
  return inputTransform
}
/**
 * The method can be used to execute SingleStore function based on input
 */
const SingleStore = (weekReports, result, input) => {
  reportsUtils.prepareStoreDetails(weekReports, result.data[3], input)
  let colors = result.data[4]
  let goalstatisticsDetails = result.data[2]
  let goalSettings = _.filter(goalstatisticsDetails, group => group['Menu Board - GoalA'])
  storeInfo.singleStoreinfo(weekReports, result.data[0], colors, goalSettings, input.ReportTemplate_Format)
  if (input.longestTime) {
    reportsUtils.prepareLongestTimes(weekReports, result.data[1], input.ReportTemplate_Format)
  }
  let getGoalTime = result.data[5]
  const dayPartTotalObject = _.last(result.data[0])
  let totalCars
  if (dayPartTotalObject) {
    totalCars = dayPartTotalObject['Total_Car']
    let dataArray = []
    dataArray = reportsUtils.getGoalStatistic(goalstatisticsDetails, getGoalTime, dataArray, totalCars, input.ReportTemplate_Format, colors)
    weekReports.goalData = dataArray
  } else {
    weekReports.goalData = []
  }

  if (input.systemStatistics) {
    let systemStatisticsLane
    let systemStatisticsGenral
    systemStatisticsLane = result.data[6]
    systemStatisticsGenral = result.data[5]
    if (systemStatisticsLane && systemStatisticsGenral) {
      reportsUtils.prepareStatistics(weekReports, systemStatisticsLane, systemStatisticsGenral)
    }
  }
  return weekReports
}
/**
 * The method can be used to execute multipleStore function based on input
 */
const multipleStore = (weekReports, result, input) => {
  reportsUtils.prepareStoreDetails(weekReports, result.data[3], input)
  let colors = result.data[4]
  let goalStatistics = result.data[2]
  storeInfo.multipleStoreInfo(weekReports, result.data[0], colors, goalStatistics, input.ReportTemplate_Format)
  return weekReports
}
/**
 * The method can be used to execute report converting json to CSV and sending mail
 */
const generateCSVTriggerEmail = (request, input, result, reportType, callBack) => {
  let csvInput = {}
  csvInput.type = `${messages.COMMON.CSVTYPE}`
  csvInput.reportName = `${messages.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
  csvInput.email = input.UserEmail
  csvInput.subject = `${messages.COMMON.WEEKREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, reportType, csvResults => {
    callBack(csvResults)
  })
}
/**
 * The method can be used to execute weekReportController to genearate week repots
 * @param  {result} result form database
 * @param  {input} input form validator
 * @param  {func} calback calback the result
 * @public
 */
const weekReportController = (request, input, callback) => {
  let weekReports = {}
  pagination(weekReports, request, input)
  let inputData = repositoryInput(request, input)
  repository.getWeekReport(inputData, (result) => {
    if (result.status === true) {
      if (!_.isUndefined(input.reportType) && (input.reportType.toLowerCase().trim() === 'csv' || input.reportType.toLowerCase().trim() === 'pdf')) {
        if (input.reportType.toLowerCase().trim() === 'csv') {
          let reportName ='week'
          generateCSVTriggerEmail(request, input, result, reportName)
        } else if (input.reportType.toLowerCase().trim() === 'pdf') {
          let pdfInput = {}
          pdfInput.type = `${messages.COMMON.PDFTYPE}`
          pdfInput.reportName = `${messages.COMMON.WEEKREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
          pdfInput.email = input.UserEmail
          pdfInput.subject = `${messages.COMMON.WEEKREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
          if (input.ReportTemplate_DeviceIds.length === 1) {
            let weekRecords = SingleStore(weekReports, result, input)
            let data = []
            data = weekRecords
            data.storeDetails = weekRecords.timeMeasure
            Pdfmail.singleStore(data, pdfInput)
          } else if (input.ReportTemplate_DeviceIds.length > 1) {
            let weekRecords = multipleStore(weekReports, result, input)
            let data = []
            data = weekRecords
            data.storeDetails = weekRecords.timeMeasure
            Pdfmail.mutipleStore(data, pdfInput)
          }
        }
      } else if (input.ReportTemplate_DeviceIds.length === 1) {
        let weekRecords = SingleStore(weekReports, result, input)
        weekRecords.status = true
        callback(weekRecords)
      } else if (input.ReportTemplate_DeviceIds.length > 1) {
        let weekRecords = multipleStore(weekReports, result, input)
        weekRecords.status = true
        callback(weekRecords)
      }
    } else {
      let output = {}
      output.key = 'noDataFound'
      output.status = false
      callback(output)
    }
  })
}
module.exports = {
  weekReportController
}
