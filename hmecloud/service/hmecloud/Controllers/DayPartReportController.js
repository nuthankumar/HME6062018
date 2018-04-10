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

  input.ReportTemplate_From_Time = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  input.ReportTemplate_To_Time = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  if (input !== null) {
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
        }

        // Single Store result

        if (input.ReportTemplate_StoreIds.length < 2) {
          convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)

          dayPartObject.data = data
          singleDayParts.push(dayPartObject)
          reportData.singleDayPart = singleDayParts
          reportUtil.prepareStoreDetails(reportData, storeDetails[0], input)
          const dayPartTotalObject = _.last(averageTimeResultSet)
          const totalCars = dayPartTotalObject['Total_Car']

          const dataArray = []
          reportUtil.getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars)

          reportData.goalStatistics = dataArray[0]
          callBack(reportData)
        } else {
          // reportUtil.prepareStoreDetails(reportData, storeDetails[0], input)
          //  Multi store
          const multipleDayPart = []
          const groupByStore = {
            title: '',
            data: []
          }

          convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)
          const daypartIndex = _.groupBy(data, 'dayPartIndex')
          groupByStore.data = daypartIndex
          groupByStore.title = moment(input.ReportTemplate_From_Date).format('MMM DD')
          multipleDayPart.push(groupByStore)
          //  reportData.multipleDayPart(multipleDayPart)
          callBack(multipleDayPart)
        }
      } else {
        callBack(result)
      }
    })
  } else {
    callBack(messages.CREATEGROUP.invalidRequestBody)
  }
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
