const messages = require('../Common/Message')
const dayPartRepository = require('../Repository/DayPartRepository')
const dateUtils = require('../Common/DateUtils')
const csvGeneration = require('../Common/CsvUtils')
const _ = require('lodash')
const convertTime = require('convert-time')
const moment = require('moment')
const reportUtil = require('../Common/ReportGenerateUtils')

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
    // singleDayPart: '',
    // goalStatistics: ''
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
        storeDetails = result.data[0]
        averageTimeResultSet = result.data[1]
        longestTimes = result.data[2]
        goalsStatistics = result.data[3]
        getGoalTime = result.data[4]
        systemStatisticsLane = result.data[5]
        systemStatisticsGenral = result.data[6]

      }

      
      // Single Store result
      console.log(storeDetails);

      if (input.ReportTemplate_StoreIds.length < 2) {
        convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)

        dayPartObject.data = data
        singleDayParts.push(dayPartObject)
        reportData.singleDayPart = singleDayParts
        reportUtil.prepareStoreDetails(reportData, storeDetails[0], input)

        // goal statistics
        const dayPartTotalObject = _.last(averageTimeResultSet)
        const totalCars = dayPartTotalObject['Total_Car']
        const dataArray = []
        reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars, input.ReportTemplate_Format)
        reportData.goalStatistics = dataArray[0]

        if (input.longestTime) {
          // goal Longest time
          reportUtil.prepareLongestTimes(reportData, longestTimes, input.ReportTemplate_Format)
        }

        
        if (input.systemStatistics) {

          let displayData = {}

          displayData.Lane = systemStatisticsLane[0]['Lane']
          displayData.AverageCarsInLane = systemStatisticsLane[0]['AvgCarsInLane']
          displayData.TotalPullouts = systemStatisticsLane[0]['Pullouts']
          displayData.TotalPullins = systemStatisticsLane[0]['Pullins']
          displayData.DeleteOverMaximum = systemStatisticsLane[0]['DeleteOverMax']
          displayData.PowerFails = systemStatisticsGenral[0]['PowerFails']
          displayData.SystemResets = systemStatisticsGenral[0]['SystemResets']
          displayData.VBDResets = systemStatisticsGenral[0]['VDBResets']
          console.log(systemStatisticsLane[0]['Lane'])
          reportData.systemStatistics = {}
          reportData.systemStatistics = displayData
        }

        reportData.status = true
        callBack(reportData)
      } else {
        //  Multi store
        reportData.timeMeasure = input.ReportTemplate_Time_Measure
        reportData.selectedStoreIds = input.ReportTemplate_StoreIds
        // reportData.currentPageNo
        // reportData.TotalPageCount
        let groupByStore = new Object()
        groupByStore.data = new Array()

        const multiparts = {
          dayPartIndex: '',
          groupId: { value: '' },
          storeId: { value: '' },
          menu: { value: '' },
          greet: { value: '' },
          service: { value: '' },
          laneQueue: { value: '' },
          laneTotal: { value: '' },
          totalCars: { value: '' }
        }
        convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)
        let dayPartIndex = 0
        reportData.multipleDayPart = []

        averageTimeResultSet.forEach(daypartsRow => {
          Object.keys(daypartsRow).map(function (key, value) {
            convertEventsTimeFormat(key, daypartsRow, value, multiparts, input)
          })

          if (multiparts['dayPartIndex'] === dayPartIndex) {
            groupByStore.title = moment(input.ReportTemplate_From_Date).format('MMM DD')
            groupByStore.data.push(multiparts)
          } else {
            if (dayPartIndex !== 0) {
              reportData.multipleDayPart.push(groupByStore)
              groupByStore = new Object()
              groupByStore.data = new Array()
            } else {
              groupByStore.data.push(multiparts)
            }
            dayPartIndex = multiparts['dayPartIndex']
          }
        })

        reportData.multipleDayPart.push(groupByStore)
        reportData.status = true
        callBack(reportData)
      }
    } else {
      callBack(result)
    }
  })
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
  if (row['StartTime'] && row['StoreDate'] !== 'Total Daypart' && row['EndTime'] && input.ReportTemplate_StoreIds.length < 2) {
    var dateSplit = row['StoreDate'].split('/')
    parts.daypart.timeSpan = `${dateSplit[1]}/${dateSplit[0]}-Daypart+${row['DayPartIndex']}`
    parts.daypart.currentDaypart = `${convertTime(row['StartTime'])}-${convertTime(row['EndTime'])}`
  }
 
  parts.dayPartIndex = row['DayPartIndex']
  

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
