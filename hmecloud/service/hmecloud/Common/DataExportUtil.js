const dateUtils = require('../Common/DateUtils')
const csvGeneration = require('../Common/CsvUtils')
const _ = require('lodash')
const reportGenerate = require('./ReportGenerateUtils')
const Pdfmail = require('./PDFUtils')

const prepareJsonForExport = (storeData, input, csvInput, callback) => {
  let storeDataList = []

  let format = input.ReportTemplate_Format
  storeData.forEach(item => {
    let store = {}

    if (item.StoreDate.includes('Total')) {
      store.Stores = item.StoreDate
    } else {
      store.Day = dateUtils.convertmmddyyyy(item.StoreDate)
    }
    if (input.ReportTemplate_StoreIds.length > 1) {
      store.Groups = item.GroupName
      if (item.StoreDate.includes('Total')) {
        store.Stores = item.StoreDate
      } else {
        store.Stores = item.StoreNo
      }
    }

    store['Menu Board'] = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
    store.Greet = dateUtils.convertSecondsToMinutes(item.Greet, format)
    store.Service = dateUtils.convertSecondsToMinutes(item.Service, format)
    store['Lane Queue'] = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
    store['Lane Total'] = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
    store['Total_Car'] = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
    storeDataList.push(store)
  })
  csvInput.reportinput = storeDataList
  csvGeneration.generateCsvAndEmail(csvInput, result => {
    let output = {}
    if (result) {
      output.data = input.UserEmail
      output.status = true
    } else {
      output.data = input.UserEmail
      output.status = false
    }

    callback(output)
  })
}

const prepareJson = (data, input, result, reportName, pdfInput, isMethod) => {
  const pdfData = {}
  pdfData.reportName = reportName
  pdfData.startTime = data.startTime
  pdfData.stopTime = data.stopTime
  let colors = _.filter(result, val => val.ColourCode)
  // Single
  if (input.ReportTemplate_DeviceIds.length === 1) {
    pdfData.reportName = reportName
    pdfData.Store_Name = result[0].Store_Name
    pdfData.startTime = data.startTime
    pdfData.stopTime = data.stopTime
    const goalSettings = _.filter(result, group => group['Menu Board - GoalA'])
    const StoreData = reportGenerate.getAllStoresDetails(result, colors, goalSettings, input.ReportTemplate_Format)
    const groupbyIndex = _.groupBy(StoreData, indexValue => indexValue.index)
    let vals = _.values(groupbyIndex)
    let storesVals = _.flatten(vals)
    let timeMeasureType = []
    let timeMeasureObj = {}
    let timeMeasureArray = []
    timeMeasureObj.data = storesVals
    timeMeasureArray.push(timeMeasureObj)
    if (isMethod === 'PDF') {
      pdfData.storeDetails = timeMeasureArray
    } else {
      pdfData.timeMeasure = timeMeasureArray
    }
    const carTotals = carTotal(StoreData)
    // goal setings
    let daysingleResult = []
    let goalTimes = _.filter(result, group => group['Menu Board - GoalA'])
    let goal = []
    const getGoalsData = reportGenerate.getGoalStatistic(goalSettings, goal, daysingleResult, carTotals, input.ReportTemplate_Format, colors)
    const goalsData = goalData(result)
    if (input.longestTime) {
      pdfData.LongestTimes = {}
      const longData = reportGenerate.prepareLongestTimes(pdfData, goalsData, input.ReportTemplate_Format)
    }
    if (input.systemStatistics) {
      let resultsLength = result.length
      if (resultsLength > 0) {
        let systemStatisticsLane = []
        let systemStatisticsGenral = []
        systemStatisticsLane[0] = result[resultsLength - 1]
        systemStatisticsGenral[0] = result[resultsLength - 2]
        reportGenerate.prepareStatistics(pdfData, systemStatisticsLane, systemStatisticsGenral)
      }
    }
    let goalsGroup = []
    goalsGroup = getGoalsData
    pdfData.goalData = goalsGroup
    if (isMethod === 'PDF') {
      const isEmailSent = Pdfmail.singleStore(pdfData, pdfInput)
      return isEmailSent
    } else if (isMethod === 'singleReport') {
      return pdfData
    }
  } else if (input.ReportTemplate_DeviceIds.length > 1) {
    let goalSettings = _.filter(result, group => group['Menu Board - GoalA'])
    const StoreData = reportGenerate.storesDetails(result, colors, goalSettings, input.ReportTemplate_Format)
    const groupbyIndex = _.groupBy(StoreData, indexValue => indexValue.index)
    let vals = _.values(groupbyIndex)
    let storesVals = _.flatten(vals)
    if (isMethod === 'PDF') {
      pdfData.storeDetails = storesVals
    } else {
      pdfData.timeMeasure = storesVals
    }
    if (isMethod === 'PDF') {
      const isEmailSent = Pdfmail.singleStore(pdfData, pdfInput)
      return isEmailSent
    } else if (isMethod === 'multipleReport') {
      return pdfData
    }
  }
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


const JsonForPDF = (data, input, reportName, pdfInput, isMultiStore) => {
  data.reportName = reportName
  let isEmailSent = false
  data.storeDetails = data.timeMeasureType
  if (isMultiStore) {
    isEmailSent = Pdfmail.mutipleStore(data, pdfInput)
  } else {
    isEmailSent = Pdfmail.singleStore(data, pdfInput)
  }
  return isEmailSent
}


module.exports = {
  prepareJsonForExport,
  prepareJson,
  JsonForPDF
}