const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const messages = require('../Common/Message')

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

/**
 *  Create Goal Statistic for single Store
 * @param {*} goalsStatistics
 * @param {*} getGoalTime
 * @param {*} dataArray
 * @param {*} totalCars
 * @param {*} isMinutes
 * @param {*} colors
 */
function getGoalStatistic (goalsStatistics, getGoalTime, dataArray, totalCars, isMinutes, colors) {
  isMinutes = Number(isMinutes)
  let colorSettings
  if (_.isUndefined(colors[0])) {
    colorSettings = ['N/A', 'N/A', 'N/A']
  } else {
    colorSettings = colors[0].ColourCode.split('|')
  }

  // Goal Statistics properties
  let goalDetails = { goal: 'N/A', cars: 'N/A', percentage: '0%' }
  const goalGrades = {
    goalA: {
      title: '<Goal A',
      color: '',
      menu: _.clone(goalDetails),
      greet: _.clone(goalDetails),
      service: _.clone(goalDetails),
      laneQueue: _.clone(goalDetails),
      laneTotal: _.clone(goalDetails)
    }
  }

  goalGrades.goalA.color = colorSettings[0]
  goalGrades.goalB = _.clone(goalGrades.goalA)
  goalGrades.goalB.title = '<Goal B'
  goalGrades.goalB.color = colorSettings[1]

  goalGrades.goalC = _.clone(goalGrades.goalA)
  goalGrades.goalC.title = '<Goal C'
  goalGrades.goalC.color = colorSettings[2]

  goalGrades.goalD = _.clone(goalGrades.goalA)
  goalGrades.goalD.title = '<Goal D'
  goalGrades.goalD.color = colorSettings[2]

  goalGrades.goalF = _.clone(goalGrades.goalA)
  goalGrades.goalF.title = 'Goal D'
  goalGrades.goalF.color = colorSettings[2]

  var populate = (result, goal, event, property, key, value) => {
    if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
      result[goal][event][property] = value || 'N/A'
    }
  }

  // Calculate Percentage details for goal statistics
  var populatePercentage = (result, goal, event, property, key, value, totalCarsCount) => {
    if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
      if (value === 0 || value === null || isNaN(value) || _.isUndefined(value) || totalCarsCount === 0) {
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

  let GoalTime = _.map(getGoalTime[0], (value, key) => {
    let object = {}
    object.key = key
    object.value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES))
    return object
  })

  GoalTime.forEach(element => {
    prepareGoal(goalGrades, 'menu', 'goal', element.key, element.value)
    prepareGoal(goalGrades, 'greet', 'goal', element.key, element.value)
    prepareGoal(goalGrades, 'service', 'goal', element.key, element.value)
    prepareGoal(goalGrades, 'laneQueue', 'goal', element.key, element.value)
    prepareGoal(goalGrades, 'laneTotal', 'goal', element.key, element.value)
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

    dataArray.push(goalGrades)
  })

  let goalStats = []
  Object.keys(dataArray[0]).map(function (key, value) {
    goalStats.push(dataArray[0][key])
  })

  dataArray = []
  dataArray = goalStats

  return dataArray
}

/**
 * This function is used to prepare Longest details for Day Report
 * @param {*} daysingleResult
 * @param {*} longestData
 * @param {*} format
 */
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
      // if (!_.isUndefined(LongestTimes[k])) {
      longestObj.Menu = timeObj
      // }
      LongestTimes.push(longestObj)
    } else if (tempTimeObj.headerName.includes(messages.EventName.GREET)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      // if (!_.isUndefined(LongestTimes[k])) {
      LongestTimes[k].Greet = timeObj
      // }
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.SERVICE)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      if (!_.isUndefined(LongestTimes[k])) {
        LongestTimes[k].Service = timeObj
      }
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.LANEQUEUE)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      // if (!_.isUndefined(LongestTimes[k])) {
      LongestTimes[k].LaneQueue = timeObj
      // }
      k = k + 1
      if (k === 2) {
        k = 0
      }
    } else if (tempTimeObj.headerName.includes(messages.EventName.LANETOTAl)) {
      let timeObj = {}
      timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
      timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
      timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
      if (!_.isUndefined(LongestTimes[k])) {
        LongestTimes[k].LaneTotal = timeObj
      }
      k = k + 1
      if (k === 2) {
        k = 0
      }
    }
  }
  daysingleResult.LongestTimes = LongestTimes
  return daysingleResult
}
/**
 * This function is used to prepare colors with event values
 * @param {*} result
 * @param {*} colors
 * @param {*} goalSettings
 * @param {*} format
 */
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
        'title': moment(items.WeekStartDate).format('LL') + ' OPEN -' + moment(items.WeekEndDate).format('LL') + ' CLOSE',
        'data': [
          {
            'group': {'value': items.GroupName},
            'storeId': {'value': items.StoreID},
            'index': items.WeekIndex,
            'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
            'store': {'name': items.StoreNo},
            'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
            'menu': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Menu Board']), format), 'color': getColor('Menu', items['Menu Board'])},
            'greet': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Greet), format), 'color': getColor('Greet', items.Greet)},
            'service': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Service), format), 'color': getColor('Service', items.Service)},
            'laneQueue': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Queue']), format), 'color': getColor('Lane Queue', items['Lane Queue'])},
            'laneTotal': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Total']), format), 'color': getColor('Lane Total', items['Lane Total'])},
            'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
          }
        ]
      }
      return storesData.push(Week)
    } else {
      let Week = {
        'title': moment(items.WeekStartDate).format('LL') + ' OPEN -' + moment(items.WeekEndDate).format('LL') + ' CLOSE',
        'data': [
          {
            'group': {'value': items.GroupName},
            'storeId': {'value': items.StoreID},
            'index': items.WeekIndex,
            'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
            'store': {'name': items.StoreNo},
            'week': {'open': items.WeekStartDate, 'close': items.WeekEndDate},
            'menu': {'value': items['Menu Board'], 'color': getColor('Menu', items['Menu Board'])},
            'greet': {'value': items.Greet, 'color': getColor('Greet', items.Greet)},
            'service': {'value': items.Service, 'color': getColor('Service', items.Service)},
            'laneQueue': {'value': items['Lane Queue'], 'color': getColor('Lane Queue', items['Lane Queue'])},
            'laneTotal': {'value': items['Lane Total'], 'color': getColor('Lane Total', items['Lane Total'])},
            'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
          }
        ]
      }
      return storesData.push(Week)
    }
  })

  return storesData
}
/**
 * get Color Code details for the Goals
 * @param {*} event
 * @param {*} eventValue
 * @param {*} colors
 * @param {*} goalSettings
 */
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
      let weekinfo
      if (items.StoreNo === 'Total Week') {
        items.WeekStartDate = 'Total Week'
      } else {
        items.WeekStartDate = dateUtils.convertmmddyyyy(items.WeekStartDate)
        items.WeekEndDate = dateUtils.convertmmddyyyy(items.WeekEndDate)
      }
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
        'index': items.WeekIndex,
        'week': {'timeSpan': items.WeekStartDate + (items.StoreNo !== 'Total Week' ? '-' + items.WeekEndDate : ' '), 'currentWeekpart': 'OPEN-CLOSE'},
        'menu': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Menu Board']), format), 'color': getColor('Menu', items['Menu Board'])},
        'greet': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Greet), format), 'color': getColor('Greet', items.Greet)},
        'service': {'value': dateUtils.convertSecondsToMinutes(parseInt(items.Service), format), 'color': getColor('Service', items.Service)},
        'laneQueue': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Queue']), format), 'color': getColor('Lane Queue', items['Lane Queue'])},
        'laneTotal': {'value': dateUtils.convertSecondsToMinutes(parseInt(items['Lane Total']), format), 'color': getColor('Lane Total', items['Lane Total'])},
        'totalCars': {'value': items['Total_Car'], 'color': getColor('Total_Car', items['Total_Car'])}
      }
      return storesData.push(Week)
    } else {
      if (items.StoreNo === 'Total Week') {
        items.WeekStartDate = 'Total Week'
      } else {
        items.WeekStartDate = dateUtils.convertmmddyyyy(items.WeekStartDate)
        items.WeekEndDate = dateUtils.convertmmddyyyy(items.WeekEndDate)
      }
      let Week = {
        'group': {'value': items.GroupName},
        'storeId': {'value': items.StoreID},
        'index': items.WeekIndex,
        'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
        'week': {'timeSpan': items.WeekStartDate + (items.StoreNo !== 'Total Week' ? '-' + items.WeekEndDate : ' '), 'currentWeekpart': 'OPEN-CLOSE'},
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
/**
 * Preparing the System statisitics
 * @param {*} daysingleResult
 * @param {*} systemStatisticsLane
 * @param {*} systemStatisticsGenral
 */
const prepareStatistics = (daysingleResult, systemStatisticsLane, systemStatisticsGenral) => {
  let displayData = {
    Lane: 0,
    AverageCarsInLane: 0,
    TotalPullouts: 0,
    TotalPullins: 0,
    DeleteOverMaximum: 0,
    PowerFails: 0,
    SystemResets: 0,
    VBDResets: 0
  }

  if (systemStatisticsLane[0]) {
    displayData.Lane = systemStatisticsLane[0]['Lane']
    displayData.AverageCarsInLane = systemStatisticsLane[0]['AvgCarsInLane']
    displayData.TotalPullouts = systemStatisticsLane[0]['Pullouts']
    displayData.TotalPullins = systemStatisticsLane[0]['Pullins']
    displayData.DeleteOverMaximum = systemStatisticsLane[0]['DeleteOverMax']
  }

  if (systemStatisticsGenral[0]) {
    displayData.PowerFails = systemStatisticsGenral[0]['PowerFails']
    displayData.SystemResets = systemStatisticsGenral[0]['SystemResets']
    displayData.VBDResets = systemStatisticsGenral[0]['VDBResets']
  }

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
