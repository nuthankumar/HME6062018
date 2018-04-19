const dayPartRepository = require('../Repository/DayPartRepository')
const dateUtils = require('../Common/DateUtils')
const dataExportUtil = require('../Common/DataExportUtil')
const _ = require('lodash')
const moment = require('moment')
const reportUtil = require('../Common/ReportGenerateUtils')
const HashMap = require('hashmap')
const dateFormat = require('dateformat')
const message = require('../Common/Message')

/**
 *  This Service is used to Generate the Summary reports details for
 * @param {*} request
 * @param {*} input
 * @param {*} callBack
 */
const generateDaypartReport = (request, input, callBack) => {
  let reportData = {
    timeMeasure: '',
    selectedStoreIds: [],
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
        reportData.deviceIds = input.ReportTemplate_DeviceIds
        totalRecordCount.NoOfPages = input.pageNumber || 1
        if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'csv') {
          generateCSVOrPdfTriggerEmail(request, input, result, callBack)
        } else {
          if (input.ReportTemplate_DeviceIds.length < 2) {
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
    selectedStoreIds: [],
    totalRecordCount: ''
  }
  let groupByStore = {}
  groupByStore.data = []
  //  Multi store
  reportData.totalRecordCount = totalRecordCount[0]
  reportData.timeMeasure = input.ReportTemplate_Time_Measure
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
            let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            dataObject.groupId.value = `${item.GroupName} SubTotal`
            tempData.push(dataObject)
          } else if (storeObj.StoreNo === 'Total Daypart') {
            let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            dataObject.groupId.value = `Total Daypart`
            dataObject.groupId.const = `(W-Avg)`
            // dataObject.storeId = store
            tempData.push(dataObject)
          } else if (storeObj.StoreNo !== 'Total Daypart') {
            let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
            store.name = `${storeObj.StoreNo} ${storeObj.Store_Name}`
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
    generatePDFReport(reportData, input, isMultiStore)
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
      let dataObject = prepareDayPartObject(item, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
      data.push(dataObject)
    })
  })
  dayPartObject.data = data
  singleDayParts.push(dayPartObject)
  reportData.timeMeasureType = singleDayParts
  reportUtil.prepareStoreDetails(reportData, storeDetails, input)
  let dataArray = []

  dataArray = reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totoalCars, input.ReportTemplate_Format, colorSettings)
  reportData.goalData = dataArray
  if (input.longestTime) {
    // goal Longest time

    reportUtil.prepareLongestTimes(reportData, longestTimes, input.ReportTemplate_Format)
  }
  // system statistics
  if (input.systemStatistics) {
    reportUtil.prepareStatistics(reportData, systemStatisticsLane, systemStatisticsGenral)
  }
  if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'pdf') {
    let isMultiStore = false
    generatePDFReport(reportData, input, isMultiStore)
    let output = {}
    output.data = input.UserEmail
    output.status = true
    callBack(output)
  } else {
    reportData.status = true
    callBack(reportData)
  }
}

function generatePDFReport (reportData, input, isMultiStore) {
  let pdfInput = {}
  pdfInput.type = `${message.COMMON.PDFTYPE}`
  pdfInput.reportName = `${message.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
  console.log('input input ', input)
  pdfInput.email = input.UserEmail
  pdfInput.subject = `${message.COMMON.DAYPARTREPORTTITLEPDF} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  let reportName = 'Daypart'
  dataExportUtil.JsonForPDF(reportData, input, reportName, pdfInput, isMultiStore)
}

function generateCSVOrPdfTriggerEmail (request, input, result, callBack) {
  let csvInput = {}
  csvInput.type = message.COMMON.CSVTYPE
  csvInput.reportName = `${message.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`

  csvInput.email = input.UserEmail
  csvInput.subject = `${message.COMMON.DAYPARTREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, csvResults => {
    callBack(csvResults)
  })
}

function prepareDayPartObject (item, format, input, colors, goalSettings) {
  let menu = {}
  let greet = {}
  let service = {}
  let laneQueue = {}
  let laneTotal = {}
  let totalCars = {}
  let dataObject = {}
  let groupId = {}
  let storeId = {}
  let daypart = {}
  let deviceId = {}
  let deviceUid = {}

  if (item.StartTime !== null && item.StoreDate !== 'Total Daypart' && item.EndTime !== null && input.ReportTemplate_DeviceIds.length < 2) {
    var dateSplit = item['StoreDate'].split('-')
    daypart.timeSpan = `${dateSplit[1]}/${dateSplit[2]}-Daypart${item['DayPartIndex']}`
    daypart.currentDaypart = `${dateUtils.converthhmmsstt(item.StartTime)}-${dateUtils.converthhmmsstt(item.EndTime)}`
    dataObject.daypart = daypart
  }

  groupId.value = item.GroupName
  dataObject.groupId = groupId

  deviceId.value = item.Device_ID
  dataObject.deviceId = deviceId

  deviceUid.value = item.Device_UID
  dataObject.deviceUid = deviceUid

  if ((_.isUndefined(item.Store_ID) && _.isUndefined(item.Store_Name)) || (item.Store_ID === null && item.Store_Name === null)) {
    storeId.value = 'N/A'
  } else {
    storeId.value = `${item.Store_ID} - ${item.Store_Name}`
  }
  storeId.value = item.Store_ID
  dataObject.storeId = storeId

  menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
  menu.color = reportUtil.getColourCode('Menu Board', item['Menu Board'], colors, goalSettings)
  dataObject.menu = menu

  greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
  greet.color = reportUtil.getColourCode('Greet', item.Greet, colors, goalSettings)
  dataObject.greet = greet

  service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
  service.color = reportUtil.getColourCode('Service', item.Service, colors, goalSettings)
  dataObject.service = service

  laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
  laneQueue.color = reportUtil.getColourCode('Lane Queue', item['Lane Queue'], colors, goalSettings)
  dataObject.laneQueue = laneQueue

  laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
  laneTotal.color = reportUtil.getColourCode('Lane Total', item['Lane Total'], colors, goalSettings)
  dataObject.laneTotal = laneTotal

  totalCars.value = item['Total_Car']
  dataObject.totalCars = totalCars

  return dataObject
}

module.exports = {
  generateDaypartReport
}
