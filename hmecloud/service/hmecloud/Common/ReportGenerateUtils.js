const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const messages = require('../Common/Message')
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
// This function is used to Prepare Store Details
const prepareStoreDetails = (daysingleResult, storeData, input) => {
    if (storeData && storeData[0]) {
     daysingleResult.storeName = (storeData[0].Store_Name ? storeData[0].Store_Name : 'N/A')
     daysingleResult.storeDesc = (storeData[0].Brand_Name ? storeData[0].Brand_Name : 'N/A')
    }
  daysingleResult.startTime = input.ReportTemplate_From_Date
  daysingleResult.stopTime = input.ReportTemplate_To_Date
  daysingleResult.printDate = dateUtils.currentDate()
  daysingleResult.printTime = dateUtils.currentTime()
  daysingleResult.timeMeasure = input.ReportTemplate_Time_Measure
  daysingleResult.selectedStoreIds = input.ReportTemplate_StoreIds
  return daysingleResult
}

function getGoalStatistic (goalsStatistics, getGoalTime, dataArray, totalCars, isMinutes) {
  const goalGrades = {
    goalA: {
      title: '<Goal A',
      menu: { goal: '', cars: '', percentage: '' },
      greet: { goal: '', cars: '', percentage: '' },
      service: { goal: '', cars: '', percentage: '' },
      laneQueue: { goal: '', cars: '', percentage: '' },
      laneTotal: { goal: '', cars: '', percentage: '' }
    },
    goalB: {
      title: '<Goal B',
      menu: { goal: '', cars: '', percentage: '' },
      greet: { goal: '', cars: '', percentage: '' },
      service: { goal: '', cars: '', percentage: '' },
      laneQueue: { goal: '', cars: '', percentage: '' },
      laneTotal: { goal: '', cars: '', percentage: '' }
    },
    goalC: {
      title: '<Goal C',
      menu: { goal: '', cars: '', percentage: '' },
      greet: { goal: '', cars: '', percentage: '' },
      service: { goal: '', cars: '', percentage: '' },
      laneQueue: { goal: '', cars: '', percentage: '' },
      laneTotal: { goal: '', cars: '', percentage: '' }
    },
    goalD: {
      title: '<Goal D',
      menu: { goal: '', cars: '', percentage: '' },
      greet: { goal: '', cars: '', percentage: '' },
      service: { goal: '', cars: '', percentage: '' },
      laneQueue: { goal: '', cars: '', percentage: '' },
      laneTotal: { goal: '', cars: '', percentage: '' }
    },
    goalF: {
      title: 'Goal D',
      menu: { goal: '', cars: '', percentage: '' },
      greet: { goal: '', cars: '', percentage: '' },
      service: { goal: '', cars: '', percentage: '' },
      laneQueue: { goal: '', cars: '', percentage: '' },
      laneTotal: { goal: '', cars: '', percentage: '' }
    }
  }

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
    prepareGoal(goalGrades, 'menu', 'goal', key, value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)))
    prepareGoal(goalGrades, 'greet', 'goal', key, value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)))
    prepareGoal(goalGrades, 'service', 'goal', key, value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)))
    prepareGoal(goalGrades, 'laneQueue', 'goal', key, value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)))
    prepareGoal(goalGrades, 'laneTotal', 'goal', key, value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES)))
  })

  // get the values for the cars
  _.map(goalsStatistics[0], (value, key) => {
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

  return dataArray[0]
}
// This function is used to prepare Longest details for Day Report
const prepareLongestTimes = (daysingleResult, longestData, format) => {
  let LongestTimes = []
  let longestObj = {}
  let k = 0
  for (let i = 0; i < longestData.length; i++) {
    let tempTimeObj = longestData[i]
    if (tempTimeObj.headerName.includes(messages.EventName.MENU)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      longestObj.Menu = timeObj
      LongestTimes.push(longestObj)
    } else if (tempTimeObj.headerName.includes(messages.EventName.GREET)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      LongestTimes[k].Greet = timeObj
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.SERVICE)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      LongestTimes[k].Service = timeObj
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.LANEQUEUE)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      LongestTimes[k].LaneQueue = timeObj
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.LANETOTAl)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      LongestTimes[k].LaneTotal = timeObj
      k = k + 1
      if (k === 2) {
        k = 0
      }
    }
  }
  daysingleResult.LongestTimes = LongestTimes
  return daysingleResult
}
// This function is used to prepare colors with event values
const storesDetails = (result, colors, goalSettings, format) => {
  let storeDetails = _.filter(result, (value) => {
    if (value.StoreNo) {
      return value
    }
  })
  let colorSettings = []
  if (colors.length > 0) {
    colorSettings = colors[0].ColourCode.split('|')
  }
  let getColor = (event, eventValue) => {
    let color = colorSettings[2]
    const eventSettings = _.pickBy(goalSettings[0], (value, key) => {
      if (key.toLowerCase().includes(event.toLowerCase())) {
        if (value && eventValue < value) {
          if (key.includes('GoalA')) {
            color = colorSettings[0]
          } else if (key.includes('GoalB')) {
            color = colorSettings[1]
          } else if (key.includes('GoalC')) {
            color = colorSettings[2]
          }
          return true
        }
      }
    })
    return color
  }
  let storesData = []
  _.forEach(storeDetails, (items) => {
    if (format === 2) {
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
        'menu': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Menu Board']), format), 'color': getColor('Menu', items['Menu Board'])},
        'greet': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Greet), format), 'color': getColor('Greet', items.Greet)},
        'service': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Service), format), 'color': getColor('Service', items.Service)},
        'laneQueue': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Queue']), format), 'color': getColor('Lane Queue', items['Lane Queue'])},
        'laneTotal': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Total']), format), 'color': getColor('Lane Total', items['Lane Total'])},
        'totalCars': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Total_Car']), format), 'color': getColor('Total_Car', items['Total_Car'])}
      }
      return storesData.push(Week)
    } else {
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
        'menu': {'value': items['Menu Board'], 'color': getColor('Menu', items['Menu Board'])},
        'greet': {'value': items.Greet, 'color': getColor('Greet', items.Greet)},
        'service': {'value': items.Service, 'color': getColor('Service', items.Service)},
        'laneQueue': {'value': items['Lane Queue'], 'color': getColor('Lane Queue', items['Lane Queue'])},
        'laneTotal': {'value': items['Lane Total'], 'color': getColor('Lane Total', items['Lane Total'])},
        'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
      }
      return storesData.push(Week)
    }
  })

  return storesData
}

const getColourCode = (event, eventValue, colors, goalSettings) => {
  let colorSettings = []
  let color
  if (colors.length > 0) {
    colorSettings = colors[0].ColourCode.split('|')
  }
  color = colorSettings[2]
  const eventSettings = _.pickBy(goalSettings[0], (value, key) => {
    if (key.toLowerCase().includes(event.toLowerCase())) {
      if (value && eventValue < value) {
        if (key.includes('GoalA')) {
          color = colorSettings[0]
        } else if (key.includes('GoalB')) {
          color = colorSettings[1]
        } else if (key.includes('GoalC')) {
          color = colorSettings[2]
        }
        return color
      }
    }

  })
  return color
}

// Mutiple store

// This function is used to prepare colors with event values
const getAllStoresDetails = (result, colors, goalSettings, format) => {
  let storeDetails = _.filter(result, (value) => {
    if (value.StoreNo) {
      return value
    }
  })

  let colorSettings = []
  if (colors.length > 0) {
    colorSettings = colors[0].ColourCode.split('|')
  }
  let getColor = (event, eventValue) => {
    let color = colorSettings[2]
    const eventSettings = _.pickBy(goalSettings[0], (value, key) => {
      if (key.toLowerCase().includes(event.toLowerCase())) {
        if (value && eventValue < value) {
          if (key.includes('GoalA')) {
            color = colorSettings[0]
          } else if (key.includes('GoalB')) {
            color = colorSettings[1]
          } else if (key.includes('GoalC')) {
            color = colorSettings[2]
          }
          return true
        }
      }
    })
    return color
  }
  let storesData = []
  _.forEach(storeDetails, (items) => {
    if (format === 2) {
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'index': items.WeekIndex,
        'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
        'menu': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Menu Board']), format), 'color': getColor('Menu', items['Menu Board'])},
        'greet': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Greet), format), 'color': getColor('Greet', items.Greet)},
        'service': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Service), format), 'color': getColor('Service', items.Service)},
        'laneQueue': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Queue']), format), 'color': getColor('Lane Queue', items['Lane Queue'])},
        'laneTotal': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Total']), format), 'color': getColor('Lane Total', items['Lane Total'])},
        'totalCars': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Total_Car']), format), 'color': getColor('Total_Car', items['Total_Car'])}
      }
      return storesData.push(Week)
    } else {
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'index': items.WeekIndex,
        'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
        'menu': {'value': items['Menu Board'], 'color': getColor('Menu', items['Menu Board'])},
        'greet': {'value': items.Greet, 'color': getColor('Greet', items.Greet)},
        'service': {'value': items.Service, 'color': getColor('Service', items.Service)},
        'laneQueue': {'value': items['Lane Queue'], 'color': getColor('Lane Queue', items['Lane Queue'])},
        'laneTotal': {'value': items['Lane Total'], 'color': getColor('Lane Total', items['Lane Total'])},
        'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
      }
      return storesData.push(Week)
    }
  })

  return storesData
}

const prepareStatistics = (daysingleResult, systemStatisticsLane, systemStatisticsGenral) => {

    let displayData = {}
    displayData.Lane = systemStatisticsLane[0]['Lane']
    displayData.AverageCarsInLane = systemStatisticsLane[0]['AvgCarsInLane']
    displayData.TotalPullouts = systemStatisticsLane[0]['Pullouts']
    displayData.TotalPullins = systemStatisticsLane[0]['Pullins']
    displayData.DeleteOverMaximum = systemStatisticsLane[0]['DeleteOverMax']
    displayData.PowerFails = systemStatisticsGenral[0]['PowerFails']
    displayData.SystemResets = systemStatisticsGenral[0]['SystemResets']
    displayData.VBDResets = systemStatisticsGenral[0]['VDBResets']
    daysingleResult.systemStatistics = displayData
} 

module.exports = {
  prepareStoreDetails,
  prepareLongestTimes,
  getGoalStatistic,
  storesDetails,
  getAllStoresDetails,
  getColourCode,
  prepareStatistics
}
