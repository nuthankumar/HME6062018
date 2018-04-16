const dateUtils = require('../Common/DateUtils')
const reportGenerate = require('../Common/ReportGenerateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')
const dataExportUtil = require('../Common/DataExportUtil')
const dateFormat = require('dateformat')

const generateWeekReportByDate = (input, callback) => {
  let pageStartDate = input.ReportTemplate_From_Date
  let pageEndDate = input.ReportTemplate_To_Date
  let lastPage
  let currentPage = input.pageNumber

  if (currentPage === 0) {
    pageStartDate = input.ReportTemplate_From_Date
    pageEndDate = input.ReportTemplate_To_Date
  } else if (input.ReportTemplate_StoreIds.length > 1) {
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
  generateWeekReport(input, result => {
    let totalRecordCount = {}
    totalRecordCount.NoOfPages = lastPage
    result.totalRecordCount = totalRecordCount
    callback(result)
  })
}

const generateWeekReport = (request, input, callback) => {
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  const inputDate = {
    StoreIDs: (input.ReportTemplate_StoreIds).toString(),
    StoreStartDate: input.ReportTemplate_From_Date,
    StoreEndDate: input.ReportTemplate_To_Date,
    StartDateTime: fromDateTime,
    EndDateTime: toDateTime,
    CarDataRecordType_ID: input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1
  }
  repository.getWeekReport(inputDate, (result) => {
    if (result.length > 0) {
      const repositoryData = result
      let reportData = {}
      let data = {}
      data.timeMeasure = 3
      data.selectedStoreIds = input.ReportTemplate_StoreIds
      data.startTime = moment(fromDateTime).format('LL')
      data.stopTime = moment(toDateTime).format('LL')
      let colors = _.filter(repositoryData, val => val.ColourCode)
      // Single Store
      if (input.reportType.toLowerCase().trim() === 'csv') {
        generateCSVOrPdfTriggerEmail(request, input, result, callback)
      } else if (input.ReportTemplate_StoreIds.length === 1) {
        let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
        const StoreData = reportGenerate.getAllStoresDetails(repositoryData, colors, goalSettings, input.ReportTemplate_Format)
        const groupbyIndex = _.groupBy(StoreData, indexValue => indexValue.index)
        let vals = _.values(groupbyIndex)
        let storesVals = _.flatten(vals)
        let timeMeasureType = []
        let timeMeasureObj = {}
        let timeMeasureArray = []
        timeMeasureObj.data = storesVals
        timeMeasureArray.push(timeMeasureObj)
        data.timeMeasureType = timeMeasureArray
        const carTotals = carTotal(StoreData)
        // goal setings
        let daysingleResult = []
        let goalTimes = _.filter(repositoryData, group => group['Cashier_GoalA'])
        const getGoalsData = reportGenerate.getGoalStatistic(goalSettings, goalTimes, daysingleResult, carTotals, input.ReportTemplate_Format, colors)
        const goalsData = goalData(repositoryData)
        if (input.longestTime) {
          data.LongestTimes = {}
          const longData = reportGenerate.prepareLongestTimes(data, goalsData, input.ReportTemplate_Format)
        }
        if (input.systemStatistics) {
          let resultsLength = repositoryData.length
          if (resultsLength > 0) {
            let systemStatisticsLane = []
            let systemStatisticsGenral = []
            systemStatisticsLane[0] = repositoryData[resultsLength - 1]
            systemStatisticsGenral[0] = repositoryData[resultsLength - 2]
            reportGenerate.prepareStatistics(data, systemStatisticsLane, systemStatisticsGenral)
          }
        }

        // Group Goals
        let goalsGroup = []
        goalsGroup = getGoalsData
        data.goalData = goalsGroup
        reportData = data
        reportData.status = true
        callback(reportData)
      } else if (input.ReportTemplate_StoreIds.length > 1) {
        let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
        const StoreData = reportGenerate.storesDetails(repositoryData, colors, goalSettings, input.ReportTemplate_Format)
        const groupbyIndex = _.groupBy(StoreData, indexValue => indexValue.index)
        let vals = _.values(groupbyIndex)
        let storesVals = _.flatten(vals)
        data.timeMeasureType = storesVals
        data.totalRecordCount = _.find(repositoryData, totalRecords => totalRecords.TotalRecCount)
        reportData = data
        reportData.status = true
        callback(reportData)
      }
    } else {
      let output = {}
      output.error = 'no data'
      output.status = false
      callback(output)
    }
  })
}

const goalData = (repositoryData) => {
  let goals = []
  goals = _.filter(repositoryData, (value) => {
    if (value.headerName) {
      return value
    }
  })

  return goals
}

const carTotal = (StoreData) => {
  const getCarsTotal = _.last(StoreData)
  const totalCars = getCarsTotal.totalCars
  return totalCars.value
}

function generateCSVOrPdfTriggerEmail (request, input, result, callBack) {
  let csvInput = {}
  csvInput.type = request.t('COMMON.CSVTYPE')
  csvInput.reportName = `${request.t('COMMON.WEEKREPORTNAME')} ${dateFormat(new Date(), 'isoDate')}`

  csvInput.email = input.UserEmail
  csvInput.subject = `${request.t('COMMON.WEEKREPORTTITLE')} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, csvResults => {
    callBack(csvResults)
  })
}

module.exports = {
  generateWeekReport,
  generateWeekReportByDate
}
