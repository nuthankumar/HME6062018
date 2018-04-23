
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
  daysingleResult.startTime = `${dateUtils.convertMMMddMM(input.ReportTemplate_To_Date)} OPEN`
  daysingleResult.stopTime = `${dateUtils.convertMMMddMM(input.ReportTemplate_To_Date)} CLOSE`
  daysingleResult.printDate = dateUtils.convertMMMddMM(dateUtils.currentDate())
  daysingleResult.printTime = dateUtils.currentTime()
  daysingleResult.timeMeasure = input.ReportTemplate_Time_Measure
  daysingleResult.deviceIds = input.ReportTemplate_DeviceIds
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
      title: '< Goal A (min:sec)',
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
  goalGrades.goalB.title = '< Goal B (min:sec)'
  goalGrades.goalB.color = colorSettings[1]

  goalGrades.goalC = _.clone(goalGrades.goalA)
  goalGrades.goalC.title = '< Goal C (min:sec)'
  goalGrades.goalC.color = colorSettings[2]

  goalGrades.goalD = _.clone(goalGrades.goalA)
  goalGrades.goalD.title = '< Goal D (min:sec)'
  goalGrades.goalD.color = colorSettings[2]

  goalGrades.goalF = _.clone(goalGrades.goalA)
  goalGrades.goalF.title = '> Goal D (min:sec)'
  goalGrades.goalF.color = colorSettings[2]

  function CalculatePercetage (value, totalCarsCount) {
    if (value === 0 || value === null || isNaN(value) || _.isUndefined(value) || totalCarsCount === 0) {
      return `0%`
    } else {
      return `${Math.round(value / totalCarsCount * 100)}%`
    }
  }

  _.map(getGoalTime[0], (value, key) => {
    value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES))

    if (key.includes('GoalA')) {
      setGoalTime(key, value, goalGrades.goalA)
    } else if (key.includes('GoalB')) {
      setGoalTime(key, value, goalGrades.goalB)
    } else if (key.includes('GoalC')) {
      setGoalTime(key, value, goalGrades.goalC)
    } else if (key.includes('GoalD')) {
      setGoalTime(key, value, goalGrades.goalD)
    } else if (key.includes('GoalF')) {
      setGoalTime(key, value, goalGrades.goalF)
    }
  })

  function setGoalTime (key, value, goal) {
    if (key.includes('Menu')) {
      goal.menu.goal = value
    } else if (key.includes('Greet')) {
      goal.greet.goal = value
    } else if (key.includes('Service')) {
      goal.service.goal = value
    } else if (key.includes('Queue')) {
      goal.laneQueue.goal = value
    } else if (key.includes('Total')) {
      goal.laneTotal.goal = value
    }
  }

  _.map(goalsStatistics[0], (value, key) => {
    if (key.includes('GoalA')) {
      eventMatch(key, value, goalGrades.goalA, totalCars)
    } else if (key.includes('GoalB')) {
      eventMatch(key, value, goalGrades.goalB, totalCars)
    } else if (key.includes('GoalC')) {
      eventMatch(key, value, goalGrades.goalC, totalCars)
    } else if (key.includes('GoalD')) {
      eventMatch(key, value, goalGrades.goalD, totalCars)
    } else if (key.includes('GoalF')) {
      eventMatch(key, value, goalGrades.goalF, totalCars)
    }
  })

  function eventMatch (key, value, goal, totalCarsCount) {
    if (value === null) {
      value = 'N/A'
    }
    if (key.includes('Menu')) {
      goal.menu.cars = value
      goal.menu.percentage = CalculatePercetage(value, totalCarsCount)
    } else if (key.includes('Greet')) {
      goal.greet.cars = value
      goal.greet.percentage = CalculatePercetage(value, totalCarsCount)
    } else if (key.includes('Service')) {
      goal.service.cars = value
      goal.service.percentage = CalculatePercetage(value, totalCarsCount)
    } else if (key.includes('Queue')) {
      goal.laneQueue.cars = value
      goal.laneQueue.percentage = CalculatePercetage(value, totalCarsCount)
    } else if (key.includes('Total')) {
      goal.laneTotal.cars = value
      goal.laneTotal.percentage = CalculatePercetage(value, totalCarsCount)
    }
  }

  dataArray.push(goalGrades.goalA, goalGrades.goalB, goalGrades.goalC, goalGrades.goalD, goalGrades.goalF)
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
const storesDetails = (weekRecords, result, colors, goalSettings, format) => {
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
    _.pickBy(goalSettings[0], (value, key) => {
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
      let subtotal
      let groupName
      if (items.StoreNo === 'Subtotal') {
        subtotal = ''
        groupName = {'value': items.GroupName + 'Subtotal'}
      } else if (items.StoreNo === 'Total Week') {
        subtotal = ''
        groupName = {'value': 'Total Week', 'timeSpan': messages.COMMON.WAVG}
      } else {
        groupName = {'value': items.GroupName}
        subtotal = items.StoreNo
      }
      let Week = {
        'title': moment(items.WeekStartDate).format('LL') + ' OPEN -' + moment(items.WeekEndDate).format('LL') + ' CLOSE',
        'data': [
          {
            'group': groupName,
            'storeId': {'value': items.StoreID},
            'index': items.WeekIndex,
            'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
            'deviceId': {'value': items.Device_ID},
            'deviceUid': {'value': items.Device_UID},
            'store': {'name': subtotal},
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
      let subtotal
      let groupName
      if (items.StoreNo === 'Subtotal') {
        subtotal = ''
        groupName = {'value': items.GroupName + 'Subtotal'}
      } else if (items.StoreNo === 'Total Week') {
        subtotal = ''
        groupName = {'value': items.GroupName + 'Total Week', 'timeSpan': messages.COMMON.WAVG}
      } else {
        groupName = {'value': items.GroupName}
        subtotal = items.StoreNo
      }
      let Week = {
        'title': moment(items.WeekStartDate).format('LL') + ' OPEN -' + moment(items.WeekEndDate).format('LL') + ' CLOSE',
        'data': [
          {
            'group': groupName,
            'storeId': {'value': items.StoreID},
            'index': items.WeekIndex,
            'storeName': (items.Store_Name ? items.Store_Name : 'N/A'),
            // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
            'deviceId': {'value': items.Device_ID},
            'deviceUid': {'value': items.Device_UID},
            'store': {'name': subtotal},
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

  weekRecords.timeMeasureType = storesData
  return weekRecords
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
  _.pickBy(goalSettings[0], (value, key) => {
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
const getAllStoresDetails = (weekRecords, result, colors, goalSettings, format) => {
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
    _.pickBy(goalSettings[0], (value, key) => {
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
        'deviceId': {'value': items.Device_ID},
        'deviceUid': {'value': items.Device_UID},
        // 'storedesc': (items.Brand_Name ? items.Brand_Name : 'N/A'),
        'index': items.WeekIndex,
        'week': {'timeSpan': items.WeekStartDate + (items.StoreNo !== 'Total Week' ? '-' + items.WeekEndDate : ' '), 'currentWeekpart': (items.StoreNo !== 'Total Week' ? messages.COMMON.DAYOPENCLOSE : messages.COMMON.WAVG)},
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
        'deviceId': {'value': items.Device_ID},
        'deviceUid': {'value': items.Device_UID},
        'week': {'timeSpan': items.WeekStartDate + (items.StoreNo !== 'Total Week' ? '-' + items.WeekEndDate : ' '), 'currentWeekpart': (items.StoreNo !== 'Total Week' ? messages.COMMON.DAYOPENCLOSE : messages.COMMON.WAVG)},
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
  let temp = []
  let weekInfo = {}
  weekInfo.data = storesData
  temp.push(weekInfo)
  weekRecords.timeMeasureType = temp
  return weekRecords
}
/**
 * Preparing the System statisitics
 * @param {*} daysingleResult
 * @param {*} systemStatisticsLane
 * @param {*} systemStatisticsGenral
 */
const prepareStatistics = (daysingleResult, systemStatisticsLane, systemStatisticsGenral) => {
  let displayData = { }

  displayData.Lane = _.get(systemStatisticsLane, '0.Lane', '0')
  displayData.AverageCarsInLane = _.get(systemStatisticsLane, '0.AvgCarsInLane', '0')
  displayData.TotalPullouts = _.get(systemStatisticsLane, '0.Pullouts', '0')
  displayData.TotalPullins = _.get(systemStatisticsLane, '0.Pullins', '0')
  displayData.DeleteOverMaximum = _.get(systemStatisticsLane, '0.DeleteOverMax', '0')
  displayData.PowerFails = _.get(systemStatisticsGenral, '0.PowerFails', '0')
  displayData.SystemResets = _.get(systemStatisticsGenral, '0.SystemResets', '0')
  displayData.VBDResets = _.get(systemStatisticsGenral, '0.VDBResets', '0')

  daysingleResult.systemStatistics = displayData
  return daysingleResult
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
