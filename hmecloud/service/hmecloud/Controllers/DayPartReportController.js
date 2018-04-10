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
    TotalPageCount: '',
    singleDayPart: '',
    goalStatistics: ''
  }
  let singleDayParts = []
  let dayPartObject = {
    data: ''
  }
  const data = []
  console.log('Day Report controller invoked')

  input.ReportTemplate_From_Time = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  input.ReportTemplate_To_Time = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  if (input !== null) {
    dayPartRepository.generateDayPartSummaryReport(input, result => {
      if (result.status === true) {
        const averageTimeResultSet = result.data[1]

        const longestTimes = result.data[2]
        const goalsStatistics = result.data[3]
        const getGoalTime = result.data[4]
        console.log(input.ReportTemplate_StoreIds.length)
        // Single Store result

        if (input.ReportTemplate_StoreIds.length < 2) {
          convertTimeFormatonEachRowObjectElement(input, averageTimeResultSet, data)
          //  console.log(data)
          dayPartObject.data = data
          singleDayParts.push(dayPartObject)
          reportData.singleDayPart = singleDayParts
          reportData.selectedStoreIds = input.ReportTemplate_StoreIds
          reportData.timeMeasure = input.ReportTemplate_Time_Measure
          reportData.startTime = moment(input.ReportTemplate_From_Date, 'YYYY/MM/dd').format('MMM D,YYYY')
          reportData.stopTime = moment(input.ReportTemplate_To_Date, 'YYYY/MM/dd').format('MMM D,YYYY')

          const dayPartTotalObject = _.last(averageTimeResultSet)
          const totalCars = dayPartTotalObject['Total_Car']

          const dataArray = []
          // goal satistic array values
          getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars)
          // reportData
          // goal statistic == dataArray[0]
          // LongesTimes

          // Longst time
          // reportUtil.prepareStoreDetails(daysingleResult, getGoalTime, input)

          reportData.goalStatistics = dataArray[0]
          callBack(reportData)
        } else {
          //  Multi store

          callBack(averageTimeResultSet)
        }
      } else {
        callBack(result)
      }
    })
  } else {
    callBack(messages.CREATEGROUP.invalidRequestBody)
  }
}

function getGoalStatistic (goalsStatistics, getGoalTime, dataArray, totalCars) {
  const goalGrades = {
    goalA: {
      title: '<Goal A',
      menu: {goal: '', cars: '', percentage: ''},
      greet: {goal: '', cars: '', percentage: ''},
      service: {goal: '', cars: '', percentage: ''},
      laneQueue: {goal: '', cars: '', percentage: ''},
      laneTotal: {goal: '', cars: '', percentage: ''}
    },
    goalB: {
      title: '<Goal B',
      menu: {goal: '', cars: '', percentage: ''},
      greet: {goal: '', cars: '', percentage: ''},
      service: {goal: '', cars: '', percentage: ''},
      laneQueue: {goal: '', cars: '', percentage: ''},
      laneTotal: {goal: '', cars: '', percentage: ''}
    },
    goalC: {
      title: '<Goal C',
      menu: {goal: '', cars: '', percentage: ''},
      greet: {goal: '', cars: '', percentage: ''},
      service: {goal: '', cars: '', percentage: ''},
      laneQueue: {goal: '', cars: '', percentage: ''},
      laneTotal: {goal: '', cars: '', percentage: ''}
    },
    goalD: {
      title: '<Goal D',
      menu: {goal: '', cars: '', percentage: ''},
      greet: {goal: '', cars: '', percentage: ''},
      service: {goal: '', cars: '', percentage: ''},
      laneQueue: {goal: '', cars: '', percentage: ''},
      laneTotal: {goal: '', cars: '', percentage: ''}
    },
    goalF: {
      title: 'Goal D',
      menu: {goal: '', cars: '', percentage: ''},
      greet: {goal: '', cars: '', percentage: ''},
      service: {goal: '', cars: '', percentage: ''},
      laneQueue: {goal: '', cars: '', percentage: ''},
      laneTotal: {goal: '', cars: '', percentage: ''}
    }
  }

  // console.log(totalCars);
  var populate = (result, goal, event, property, key, value) => {
    if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
      result[goal][event][property] = value
    }
  }

  var populatePercentage = (result, goal, event, property, key, value, totalCarsCount) => {
    if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
      if (value === 0 || value === null) {
        result[goal][event][property] = `0%`
      } else {
        result[goal][event][property] = `${Math.round(value / totalCarsCount * 100)}%`
      }
    }
  }

  var prepareGoal = (result, event, property, key, value) => {
    populate(result, 'goalA', event, property, key, value)
    populate(result, 'goalB', event, property, key, value)
    populate(result, 'goalC', event, property, key, value)
    populate(result, 'goalD', event, property, key, value)
    populate(result, 'goalF', event, property, key, value)
  }

  var prepareGoalPercentage = (result, event, property, key, value, totalCars) => {
    populatePercentage(result, 'goalA', event, property, key, value, totalCars)
    populatePercentage(result, 'goalB', event, property, key, value, totalCars)
    populatePercentage(result, 'goalC', event, property, key, value, totalCars)
    populatePercentage(result, 'goalD', event, property, key, value, totalCars)
    populatePercentage(result, 'goalF', event, property, key, value, totalCars)
  }
  // Get the values for the goals
  _.map(getGoalTime[0], (value, key) => {
    prepareGoal(goalGrades, 'menu', 'goal', key, value)
    prepareGoal(goalGrades, 'greet', 'goal', key, value)
    prepareGoal(goalGrades, 'service', 'goal', key, value)
    prepareGoal(goalGrades, 'laneQueue', 'goal', key, value)
    prepareGoal(goalGrades, 'laneTotal', 'goal', key, value)
  })

  // get the values for the cars
  return _.map(goalsStatistics[0], (value, key) => {
    prepareGoal(goalGrades, 'menu', 'cars', key, value)
    prepareGoal(goalGrades, 'greet', 'cars', key, value)
    prepareGoal(goalGrades, 'service', 'cars', key, value)
    prepareGoal(goalGrades, 'laneQueue', 'cars', key, value)
    prepareGoal(goalGrades, 'laneTotal', 'cars', key, value)

    prepareGoalPercentage(goalGrades, 'menu', 'percentage', key, value, totalCars)
    prepareGoalPercentage(goalGrades, 'greet', 'percentage', key, value, totalCars)
    prepareGoalPercentage(goalGrades, 'service', 'percentage', key, value, totalCars)
    prepareGoalPercentage(goalGrades, 'laneQueue', 'percentage', key, value, totalCars)
    prepareGoalPercentage(goalGrades, 'laneTotal', 'percentage', key, value, totalCars)
    // value : statistic value
    //  totalCars : avgTimeCalculate
    dataArray.push(goalGrades)
  })
}

function convertTimeFormatonEachRowObjectElement (input, averageTimeResultSet, data) {
  averageTimeResultSet.map(row => {
    console.log(row)
    var daypartObject = {daypart: ''}
    let parts = {
      daypart: {
        timeSpan: '',
        currentDaypart: ''
      },
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
// console.log(data)

function convertEventsTimeFormat (key, row, value, parts, input) {
  if (row['StartTime'] && row['StoreDate'] !== 'Total Daypart' && row['EndTime']) {
    var dateSplit = row['StoreDate'].split('/')
    parts.daypart.timeSpan = `${dateSplit[1]}/${dateSplit[0]}-Daypart+${row['DayPartIndex']}`
    parts.daypart.currentDaypart = `${convertTime(row['StartTime'])}-${convertTime(row['EndTime'])}`
  }

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
