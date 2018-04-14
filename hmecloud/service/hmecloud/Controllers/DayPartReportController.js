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

      // Single Store result
      if (input.ReportTemplate_StoreIds.length < 2) {
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

        reportData.status = true
        callBack(reportData)
      } else {
        let reportData = {
          timeMeasure: '',
          selectedStoreIds: [],
          totalRecordCount: ''
        }
        let groupByDate
        let groupByStore = {}
        groupByStore.data = []

        //  Multi store
        reportData.totalRecordCount = totalRecordCount[0]
        reportData.timeMeasure = input.ReportTemplate_Time_Measure
        reportData.selectedStoreIds = input.ReportTemplate_StoreIds

        reportData.timeMeasureType = []

        groupByDate = _.groupBy(averageTimeResultSet, 'StoreDate')
          .mapKeys(groupByDate, function (value, key) {
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
                multiStoreObj.title = groupByStore.title = moment(tempRawCarData.StoreDate).format('MMM DD')
                for (let i = 0; i < dayPartResultsList.length; i++) {
                  let storeObj = dayPartResultsList[i]
                  let store = {}

                  if (item.StoreNo !== 'Total Daypart') {
                    let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)

                    tempData.push(dataObject)
                  } else if (item.StoreNo === 'SubTotal') {
                    let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)

                    dataObject.groups.value = `${item.GroupName} ${item.StoreNo}`

                    tempData.push(dataObject)
                  } else {
                    let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format, input, colorSettings, goalsStatistics)
                    dataObject.groups.value = `${item.StoreNo}`
                    store.timeSpan = 'W-Avg'
                    dataObject.store = store

                    tempData.push(dataObject)
                  }
                }
                multiStoreObj.data = tempData
                reportData.timeMeasureType.push(multiStoreObj)
              }
            })
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
  let groups = {}
  let stores = {}
  let daypart = {}
  let date = item['StoreDate']
  dataObject.date = date
  if (item.StartTime !== null && item.StoreDate !== 'Total Daypart' && item.EndTime !== null && input.ReportTemplate_StoreIds.length < 2) {
    var dateSplit = item['StoreDate'].split('-')
    daypart.timeSpan = `${dateSplit[1]}/${dateSplit[0]}-Daypart${item['DayPartIndex']}`
    daypart.currentDaypart = `${dateUtils.converthhmmsstt(item.StartTime)}-${dateUtils.converthhmmsstt(item.EndTime)}`
    dataObject.daypart = daypart
  }

  dataObject.dayPartIndex = item.DayPartIndex
  groups.value = item.GroupName
  dataObject.groups = groups
  if ((_.isUndefined(item.Store_ID) && _.isUndefined(item.Store_Name)) || (item.Store_ID === null && item.Store_Name === null)) {
    stores.value = 'N/A'
  } else {
    stores.value = `${item.Store_ID} - ${item.Store_Name}`
  }
  dataObject.stores = stores

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
