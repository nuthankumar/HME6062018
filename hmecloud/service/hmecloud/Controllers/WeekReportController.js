const dateUtils = require('../Common/DateUtils')
const reportGenerate = require('../Common/ReportGenerateUtils')
const _ = require('lodash')
const moment = require('moment')
const repository = require('../Repository/StoresRepository')

const generateWeekReport = (input, callback) => {
  // check the days different
  const days = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
  const months = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
  const storeLength = (input.ReportTemplate_StoreIds).length
  console.log('Length', storeLength)
  console.log('months', months)
  console.log('input.ReportTemplate_Format', input.ReportTemplate_Format)
  if (days > -1) {
    console.log('DATA validation')
  } else {
    console.log('DATA ERROR') // Callback and throw the error
  }
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  const inputDate = {
    Device_IDs: (input.ReportTemplate_StoreIds).toString(),
    StoreStartDate: input.ReportTemplate_From_Date,
    StoreEndDate: input.ReportTemplate_To_Date,
    StartDateTime: fromDateTime,
    EndDateTime: toDateTime,
    CarDataRecordType_ID: input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1
  }
  repository.getWeekReport(inputDate, (result) => {
    // callback(result)
    if (result.length > 0) {
      const repositoryData = result
      if (input.reportType === 'weekSingle') {
        let reportData = {
          data: {
            singleWeek: [
              {
                data: []
              }
            ],
            goalData: [],
            longTimes: []
          }
        }
        reportData.data.timeMeasure = 3
        reportData.data.selectedStoreIds = input.ReportTemplate_StoreIds
        reportData.data.startTime = moment(fromDateTime).format('LL')
        reportData.data.stopTime = moment(toDateTime).format('LL')
        reportData.status = true
        // events data
        let colors = _.filter(repositoryData, val => val.ColourCode)
        let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
        const StoreData = reportGenerate.storesDetails(repositoryData, colors, goalSettings, input.ReportTemplate_Format)
        const goalsData = goalData(repositoryData)
        const carTotals = carTotal(StoreData)
        // goal setings
        let goalTimes = _.filter(repositoryData, group => group['Cashier_GoalA'])
        let daysingleResult = []
        const getGoalsData = reportGenerate.getGoalStatistic(goalSettings, goalTimes, daysingleResult, carTotals, input.ReportTemplate_Format)
        const longTimes = reportGenerate.prepareLongestTimes(daysingleResult, goalsData, input.ReportTemplate_Format)
        reportData.data.singleWeek[0].data = StoreData
        reportData.data.goalData = getGoalsData
        reportData.data.longTimes = longTimes
        callback(reportData)
      } else {
        let reportData = {
          data: {
            mutipleWeek: [
              {
                data: []
              }
            ]
          }
        }
        reportData.data.timeMeasure = 3
        reportData.data.selectedStoreIds = input.ReportTemplate_StoreIds
        reportData.data.startTime = moment(fromDateTime).format('LL')
        reportData.data.stopTime = moment(toDateTime).format('LL')
        reportData.status = true
        let colors = _.filter(repositoryData, val => val.ColourCode)
        let goalSettings = _.filter(repositoryData, group => group['Menu Board - GoalA'])
        const StoreData = reportGenerate.getAllStoresDetails(repositoryData, colors, goalSettings, input.ReportTemplate_Format)
        const youngest = _.chain(StoreData).groupBy('index')
        reportData.data.mutipleWeek[0].data = youngest
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
    console.log()
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
