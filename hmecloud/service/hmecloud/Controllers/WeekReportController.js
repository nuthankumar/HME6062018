const dateUtils = require('../Common/DateUtils')
const reportGenerate = require('../Common/ReportGenerateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')

const generateWeekReport = (input, callback) => {
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
    LaneConfig_ID: 1,
    RecordPerPage: input.recordPerPage,
    PageNumber: input.pageNumber
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
      if (input.ReportTemplate_StoreIds.length === 1) {
        let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
        const StoreData = reportGenerate.getAllStoresDetails(repositoryData, colors, goalSettings, input.ReportTemplate_Format)
        const groupbyIndex = _.groupBy(StoreData, indexValue => indexValue.index)
        let vals = _.values(groupbyIndex)
        let storesVals = _.flatten(vals)
        let timeMeasureType = []
        data.timeMeasureType = storesVals
        //timeMeasureType = temptimeMeasure
        data.totalRecordCount = _.find(repositoryData, totalRecords => totalRecords.TotalRecCount)
        const carTotals = carTotal(StoreData)
        // goal setings
        let daysingleResult = []
        let goalTimes = _.filter(repositoryData, group => group['Cashier_GoalA'])
        const getGoalsData = reportGenerate.getGoalStatistic(goalSettings, goalTimes, daysingleResult, carTotals, input.ReportTemplate_Format, colors)
        const goalsData = goalData(repositoryData)
        data.LongestTimes = {}
        const longData = reportGenerate.prepareLongestTimes(data, goalsData, input.ReportTemplate_Format)
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
        let timeMeasureType = []
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

module.exports = {
  generateWeekReport
}