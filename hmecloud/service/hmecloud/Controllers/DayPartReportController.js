const dayPartRepository = require('../Repository/DayPartRepository')
const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const reportUtil = require('../Common/ReportGenerateUtils')
const HashMap = require('hashmap')
const responseObject = require('../Common/DayPart')

/**
 *  This Service is used to Generate the Summary reports details for
 * @param {*} request
 * @param {*} input
 * @param {*} callBack
 */
const generateDaypartReport = (request, input, callBack) => {
  let reportData = { timeMeasure: '',
    storeName: '',
    storeDesc: '',
    startTime: '',
    stopTime: '',
    printDate: '',
    printTime: '',
    totalRecordCount: ''
  }
  let singleDayParts = []
  let dayPartObject = {
    data: ''
  }
  let data = []
  let averageTimeResultSet
  let colorSettings
  let storeDetails
  let longestTimes
  let goalsStatistics
  let getGoalTime
  let systemStatisticsLane
  let systemStatisticsGenral
  let totalRecordCount = {}
  /**
   * Configure start time and end time
   */
  input.ReportTemplate_From_Time = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  input.ReportTemplate_To_Time = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  dayPartRepository.generateDayPartSummaryReport(input, result => {
    if (result.status === true) {
      if (input.ReportTemplate_DeviceIds.length > 1) {
        averageTimeResultSet = result.data[0]
        colorSettings = result.data[1]
        goalsStatistics = result.data[2]
        totalRecordCount = _.last(result.data)
      } else {
        averageTimeResultSet = result.data[0]
        colorSettings = result.data[1]
        longestTimes = result.data[2]
        goalsStatistics = result.data[3]
        storeDetails = result.data[4]
        getGoalTime = result.data[5]
        systemStatisticsGenral = result.data[6]
        systemStatisticsLane = result.data[7]
        totalRecordCount = _.last(result.data)
      }
      if (averageTimeResultSet.length > 0) {
        totalRecordCount.NoOfPages = input.pageNumber || 1
        if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'csv') {
          responseObject.generateCSVOrPdfTriggerEmail(request, input, result, callBack)
        } else {
          if (input.ReportTemplate_DeviceIds.length < 2) {
            reportData.deviceIds = input.ReportTemplate_DeviceIds
            singleStoreResult(reportData, totalRecordCount, averageTimeResultSet, input, colorSettings, goalsStatistics, data, dayPartObject, singleDayParts, storeDetails, getGoalTime, longestTimes, systemStatisticsLane, systemStatisticsGenral, callBack)
          } else {
            multiStoreResult(totalRecordCount, input, averageTimeResultSet, colorSettings, goalsStatistics, callBack)
          }
        }
      } else {
        result = {}
        result.key = 'noDataFound'

        result.status = false
        callBack(result)
      }
    } else {
      result = {}
      result.key = 'noDataFound'
      result.status = false
      callBack(result)
    }
  })
}
function multiStoreResult (totalRecordCount, input, averageTimeResultSet, colorSettings, goalsStatistics, callBack) {
  let reportData = {
    timeMeasure: '',
    totalRecordCount: '',
    deviceIds: []
  }
  let groupByStore = {}
  groupByStore.data = []
  //  Multi store
  reportData.totalRecordCount = totalRecordCount[0]
  reportData.timeMeasure = input.ReportTemplate_Time_Measure
  reportData.deviceIds = input.ReportTemplate_DeviceIds
  reportData.timeMeasureType = []
  let groupByDate
  groupByDate = _.groupBy(averageTimeResultSet, 'StoreDate')
  _.mapKeys(groupByDate, function (value, key) {
    const dayPartIndexIds = new HashMap()
    value.forEach(item => {
      let dayPartIndex = item.DayPartIndex
      if (dayPartIndex && !dayPartIndexIds.has(dayPartIndex)) {
        let dayPartResultsList = value.filter(function (obj) {
          return obj.DayPartIndex === dayPartIndex
        })
        dayPartIndexIds.set(dayPartIndex, dayPartIndex)
        let multiStoreObj = {}
        let tempData = []
        let tempRawCarData = dayPartResultsList[0]

        multiStoreObj.title = groupByStore.title = `${moment(tempRawCarData.StoreDate).format('MMM DD, YYYY')} - DayPart ${tempRawCarData.DayPartIndex}`
        for (let i = 0; i < dayPartResultsList.length; i++) {
          let storeObj = dayPartResultsList[i]
          let store = {}
          if (storeObj.StoreNo === 'SubTotal') {
            let dataObject = responseObject.prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            dataObject.groupId.value = `${item.GroupName} SubTotal`
            tempData.push(dataObject)
          } else if (storeObj.StoreNo === 'Total Daypart') {
            let dataObject = responseObject.prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            dataObject.groupId.value = `Total Daypart`
            dataObject.groupId.const = `(W-Avg)`
            // dataObject.storeId = store
            tempData.push(dataObject)
          } else if (storeObj.StoreNo !== 'Total Daypart') {
            let dataObject = responseObject.prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            store.name = `${storeObj.StoreNo}-${storeObj.Store_Name}`
            dataObject.store = store
            tempData.push(dataObject)
          }
        }
        multiStoreObj.data = tempData
        reportData.timeMeasureType.push(multiStoreObj)
      }
    })
  })
  if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'pdf') {
    let isMultiStore = true
    responseObject.generatePDFReport(reportData, input, isMultiStore)
    let output = {}
    output.data = input.UserEmail
    output.status = true
    callBack(output)
  } else {
    reportData.status = true
    callBack(reportData)
  }
}
function singleStoreResult (reportData, totalRecordCount, averageTimeResultSet, input, colorSettings, goalsStatistics, data, dayPartObject, singleDayParts, storeDetails, getGoalTime, longestTimes, systemStatisticsLane, systemStatisticsGenral, callBack) {
  reportData.totalRecordCount = totalRecordCount[0]
  let totoalCars = ''
  let groupByDate = _.groupBy(averageTimeResultSet, 'StoreDate')
  _.mapKeys(groupByDate, function (value, key) {
    value.forEach(item => {
      if (item.StoreNo === 'Total Daypart') {
        totoalCars = item['Total_Car']
      }
      let dataObject = responseObject.prepareDayPartObject(item, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
      data.push(dataObject)
    })
  })
  dayPartObject.data = data
  singleDayParts.push(dayPartObject)
  reportData.timeMeasureType = singleDayParts
  reportUtil.prepareStoreDetails(reportData, storeDetails, input)
  let dataArray
  dataArray = reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totoalCars, input.ReportTemplate_Format, colorSettings)
  reportData.goalData = dataArray
  // goal Longest time
  if (input.longestTime) {
    reportUtil.prepareLongestTimes(reportData, longestTimes, input.ReportTemplate_Format)
  }
  // system statistics
  if (input.systemStatistics) {
    reportUtil.prepareStatistics(reportData, systemStatisticsLane, systemStatisticsGenral)
  }
  if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'pdf') {
    let isMultiStore = false
    responseObject.generatePDFReport(reportData, input, isMultiStore)
    let output = {}
    output.data = input.UserEmail
    output.status = true
    callBack(output)
  } else {
    reportData.status = true
    callBack(reportData)
  }
}
module.exports = {
  generateDaypartReport
}
