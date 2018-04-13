const dayPartRepository = require('../Repository/DayPartRepository')
const dateUtils = require('../Common/DateUtils')
// const csvGeneration = require('../Common/CsvUtils')
const _ = require('lodash')
const moment = require('moment')
const reportUtil = require('../Common/ReportGenerateUtils')
const HashMap = require('hashmap')

/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */
const generateDaypartReport = (input, callBack) => {
  let reportData = {
    timeMeasure: '',
    selectedStoreIds: [],
    storeName: '',
    storeDesc: '',
    startTime: '',
    stopTime: '',
    printDate: '',
    printTime: '',
    currentPageNo: '',
    TotalPageCount: ''

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

  input.ReportTemplate_From_Time = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  input.ReportTemplate_To_Time = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  input.ReportTemplate_From_Time = moment(input.ReportTemplate_From_Time).format('YYYY-MM-DD HH:mm:ss')
  input.ReportTemplate_From_Time = moment(input.ReportTemplate_From_Time).format('YYYY-MM-DD HH:mm:ss')
  dayPartRepository.generateDayPartSummaryReport(input, result => {
    if (result.status === true) {
      if (input.ReportTemplate_StoreIds.length > 1) {
        averageTimeResultSet = result.data[0]
        colorSettings = result.data[1]
        goalsStatistics = result.data[2]
      } else {
        averageTimeResultSet = result.data[0]
        colorSettings = result.data[1]
        goalsStatistics = result.data[2]
        longestTimes = result.data[3]
        storeDetails = result.data[4]
        getGoalTime = result.data[5]
        systemStatisticsGenral = result.data[6]
        systemStatisticsLane = result.data[7]
      }

      // Single Store result
      if (input.ReportTemplate_StoreIds.length < 2) {
        averageTimeResultSet.forEach(item => {
          let dataObject = prepareDayPartObject(item, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
          data.push(dataObject)
        })
        dayPartObject.data = data
        singleDayParts.push(dayPartObject)
        reportData.timeMeasureType = singleDayParts
        reportUtil.prepareStoreDetails(reportData, storeDetails, input)

        // goal statistics
        const dayPartTotalObject = _.last(averageTimeResultSet)
        const totalCars = dayPartTotalObject['Total_Car']
        let dataArray = []
        dataArray = reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars, input.ReportTemplate_Format, colorSettings)
        reportData.goalData = dataArray

        if (input.longestTime) {
          // goal Longest time
          reportUtil.prepareLongestTimes(reportData, longestTimes, input.ReportTemplate_Format)
        }
        // system statistics
        if (input.systemStatistics) {
          reportUtil.prepareStatistics(reportData, systemStatisticsLane, systemStatisticsGenral)
        }

        reportData.status = true
        callBack(reportData)
      } else {
        let reportData = {
          timeMeasure: '',
          selectedStoreIds: [],
          TotalPageCount: ''
        }
        //  Multi store
        reportData.timeMeasure = input.ReportTemplate_Time_Measure
        reportData.selectedStoreIds = input.ReportTemplate_StoreIds

        let groupByStore = {}
        groupByStore.data = []

        reportData.timeMeasureType = []

        const dayPartIndexIds = new HashMap()
        averageTimeResultSet.forEach(item => {
          let dayPartIndex = item.DayPartIndex

          if (dayPartIndex && !dayPartIndexIds.has(dayPartIndex)) {
            let dayPartResultsList = averageTimeResultSet.filter(function (obj) {
              return obj.DayPartIndex === dayPartIndex
            })
            dayPartIndexIds.set(dayPartIndex, dayPartIndex)

            let multiStoreObj = {}
            let tempData = []
            let tempRawCarData = dayPartResultsList[0]
            multiStoreObj.title = groupByStore.title = moment(tempRawCarData.StoreDate).format('MMM DD')
            for (let i = 0; i < dayPartResultsList.length; i++) {
              let storeObj = dayPartResultsList[i]
              let store = {}

              if (item.StoreDate !== 'Total Day') {
                let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
                // store.name = storeObj.StoreNo
                // dataObject.store = store

                tempData.push(dataObject)
              } else {
                let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
                store.name = storeObj.StoreNo
                store.timeSpan = 'W-Avg'
                dataObject.store = store

                tempData.push(dataObject)
              }
            }
            multiStoreObj.data = tempData
            reportData.timeMeasureType.push(multiStoreObj)
          }
        })

        reportData.status = true
        callBack(reportData)
      }
    } else {
      callBack(result)
    }
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

  if (item.StartTime !== null && item.StoreDate !== 'Total Daypart' && item.EndTime !== null && input.ReportTemplate_StoreIds.length < 2) {
    var dateSplit = item['StoreDate'].split('-')
    daypart.timeSpan = `${dateSplit[1]}/${dateSplit[0]}-Daypart${item['DayPartIndex']}`
    daypart.currentDaypart = `${dateUtils.converthhmmsstt(item.StartTime)}-${dateUtils.converthhmmsstt(item.EndTime)}`
    dataObject.daypart = daypart
  }

  if (input.ReportTemplate_StoreIds.length > 1) {
    dataObject.dayPartIndex = item.DayPartIndex
    groupId.value = item.GroupName
    dataObject.groupId = groupId
    storeId.value = item.Store_ID
    dataObject.storeId = storeId
  }

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
