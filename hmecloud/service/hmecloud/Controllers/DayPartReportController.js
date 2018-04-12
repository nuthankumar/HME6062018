const messages = require('../Common/Message')
const dayPartRepository = require('../Repository/DayPartRepository')
const dateUtils = require('../Common/DateUtils')
// const csvGeneration = require('../Common/CsvUtils')
const _ = require('lodash')
const convertTime = require('convert-time')
const moment = require('moment')
const reportUtil = require('../Common/ReportGenerateUtils')
const HashMap = require('hashmap')

const defaultFromTime = '00:00:00'
const defaultEndTime = '23:59:59'
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
  let storeDetails
  let longestTimes
  let goalsStatistics
  let getGoalTime
  let systemStatisticsLane
  let systemStatisticsGenral

  input.ReportTemplate_From_Time = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  input.ReportTemplate_To_Time = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  dayPartRepository.generateDayPartSummaryReport(input, result => {
    if (result.status === true) {
      if (input.ReportTemplate_StoreIds.length > 1) {
        averageTimeResultSet = result.data[0]
      } else {
        averageTimeResultSet = result.data[0]
        longestTimes = result.data[1]
        goalsStatistics = result.data[2]
        storeDetails = result.data[3]
        getGoalTime = result.data[4]
        systemStatisticsGenral = result.data[5]
        systemStatisticsLane = result.data[6]
      }

      // Single Store result
      if (input.ReportTemplate_StoreIds.length < 2) {
        convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)

        dayPartObject.data = data
        singleDayParts.push(dayPartObject)
        reportData.timeMeasureType = singleDayParts
        reportUtil.prepareStoreDetails(reportData, storeDetails[0], input)

        // goal statistics
        const dayPartTotalObject = _.last(averageTimeResultSet)
        const totalCars = dayPartTotalObject['Total_Car']
        let dataArray = []
        dataArray = reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars, input.ReportTemplate_Format)
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
                let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format)
                store.name = storeObj.StoreNo
                dataObject.store = store

                tempData.push(dataObject)
              } else {
                let dataObject = prepareDayPartObject(storeObj, input.ReportTemplate_Format)
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

function prepareDayPartObject (item, format) {
  let menu = {}
  let greet = {}
  let service = {}
  let laneQueue = {}
  let laneTotal = {}
  let totalCars = {}
  let dataObject = {}
  let groupId = {}
  let storeId = {}

  dataObject.dayPartIndex = item.DayPartIndex
  groupId.value = item.GroupName
  dataObject.groupId = groupId

  storeId.value = item.Store_ID
  dataObject.storeId = storeId

  menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
  //  menu.color = reportUtil.getColourCode('Menu Board', item['Menu Board'], colors, goalSettings)
  dataObject.menu = menu

  greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
  //  greet.color = reportUtil.getColourCode('Greet', item.Greet, colors, goalSettings)
  dataObject.greet = greet

  service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
  //  service.color = reportUtil.getColourCode('Service', item.Service, colors, goalSettings)
  dataObject.service = service

  laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
  //  laneQueue.color = reportUtil.getColourCode('Lane Queue', item['Lane Queue'], colors, goalSettings)
  dataObject.laneQueue = laneQueue

  laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
  // laneTotal.color = reportUtil.getColourCode('Lane Total', item['Lane Total'], colors, goalSettings)
  dataObject.laneTotal = laneTotal

  totalCars.value = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
  dataObject.totalCars = totalCars

  return dataObject
}

function convertTimeFormatonEachRowObjectElement (input, averageTimeResultSet, data) {
  averageTimeResultSet.map(row => {
    var daypartObject = {daypart: ''}
    let parts = {
      daypart: {
        timeSpan: '',
        currentDaypart: ''
      },
      dayPartIndex: '',
      groupName: {value: ''},
      storeId: {value: ''},
      menu: {value: ''},
      greet: {value: ''},
      service: {value: ''},
      laneQueue: {value: ''},
      laneTotal: {value: ''},
      totalCars: {value: ''}
    }

    Object.keys(row).map(function (key, value) {
      convertEventsTimeFormat(key, row, value, parts, input)
    })
    daypartObject = parts

    data.push(daypartObject)
  })
  return data
}

function convertEventsTimeFormat (key, row, value, parts, input) {
  // if (row['StartTime'] && row['StoreDate'] !== 'Total Daypart' && row['EndTime'] && input.ReportTemplate_StoreIds.length < 2) {
  //   var dateSplit = row['StoreDate'].split('/')
  //   parts.daypart.timeSpan = `${dateSplit[1]}/${dateSplit[0]}-Daypart+${row['DayPartIndex']}`
  //   parts.daypart.currentDaypart = `${dateUtils.converthhmmsstt(row.StartTime)}-${dateUtils.converthhmmsstt(row.EndTime)}`

  // }

  parts.dayPartIndex = row['DayPartIndex']
  // console.log(row['GroupName'])
  // parts.groupName['value'] = row['GroupName'] || null
  // parts.storeId['value'] = row['Store_ID'] || null
  if (key.includes(messages.Events.MENU)) {
    parts.menu.value = input.ReportTemplate_Format === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)
  } else if (key.includes(messages.Events.LANEQUEUE)) {
    parts.laneQueue.value = input.ReportTemplate_Format === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)
  } else if (key.includes(messages.Events.LANETOTAl)) {
    parts.laneTotal.value = input.ReportTemplate_Format === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)
  } else if (key.includes(messages.Events.SERVICE)) {
    parts.service.value = input.ReportTemplate_Format === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)
  } else if (key.includes(messages.Events.GREET)) {
    parts.greet.value = input.ReportTemplate_Format === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)
  }
}

module.exports = {
  generateDaypartReport
}
