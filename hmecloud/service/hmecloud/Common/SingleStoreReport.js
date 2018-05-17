const dateUtils = require('./DateUtils')
const _ = require('lodash')
const messages = require('./Message')
// deviceData, color, goalSettings, this.request, reportFilter
const Device = function (result, colors, goalSettings, request, reportFilter) {
  this.result = result
  this.colors = colors
  this.goalSettings = goalSettings
  this.request = request
  this.reportFilter = reportFilter
}
Device.prototype.getStoreInfo = (input, storeInformation) => {
  let storeInfo = {}
  if (storeInformation && storeInformation[0]) {
    storeInfo.storeName = storeInformation[0].Store_Name ? storeInformation[0].Store_Name : 'N/A'
    storeInfo.storeNumber = storeInformation[0].Store_Number ? storeInformation[0].Store_Number : 'N/A'
    storeInfo.storeDesc = storeInformation[0].Brand_Name ? storeInformation[0].Brand_Name : 'N/A'
  }
  storeInfo.startTime = `${dateUtils.convertMMMdYYYY(input.body.fromDate)}`
  storeInfo.stopTime = `${dateUtils.convertMMMdYYYY(input.body.toDate)}`
  storeInfo.printDate = dateUtils.convertMMMdYYYY(dateUtils.currentDate())
  storeInfo.printTime = dateUtils.currentTime()
  storeInfo.timeMeasure = input.body.timeMeasure
  storeInfo.deviceIds = input.body.deviceIds
  return storeInfo
}
Device.prototype.getSingleStoreValues = function () {
  const timeFormat = this.request.body.format
  const filter = this.reportFilter
  let storeDetails = this.result
  let getColors = []
  getColors = this.colors[0].ColourCode.split('|')
  let getColor = (event, eventValue) => {
    let color = getColors[2]
    _.pickBy(this.goalSettings[0], (value, key) => {
      if (key.toLowerCase().includes(event.toLowerCase())) {
        if (value && eventValue < value) {
          if (key.includes('GoalA')) {
            color = getColors[0]
          } else if (key.includes('GoalB')) {
            color = getColors[1]
          } else if (key.includes('GoalC')) {
            color = getColors[2]
          }
          return true
        }
      }
    })
    return color
  }
  let deviceInfo = []
  _.map(storeDetails, (item, index) => {
    let reportInfo = {}
    let startDate
    let endDate
    let dayPartValue
    let newValue
    _.forEach(storeDetails[index], function (value, key) {
      if (key === 'WeekStartDate') {
        reportInfo['WeekStartDate'] = {'value': dateUtils.convertmmddyyyy(`${value}`)}
        startDate = {'value': `${value}`}
      } else if (key === 'WeekEndDate') {
        reportInfo['WeekEndDate'] = {'value': dateUtils.convertmmddyyyy(`${value}`)}
        endDate = {'value': `${value}`}
      } else if (key === 'DayPartIndex') {
        dayPartValue = `${value}`
      } else if (key === 'StoreDate') {
        if (filter === 'day') {
          if (value === 'Total Day') {
            reportInfo['Day'] = {
              'timeSpan': 'Total Day',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            reportInfo['Day'] = {
              'timeSpan': `${value}`,
              'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
          }
        } else if (filter === 'daypart') {
          if (value === 'Total Daypart') {
            reportInfo['Daypart'] = {
              'timeSpan': 'Total DayPart',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            if (!Number.isNaN(parseInt(dayPartValue))) {
              let dateSplit = `${value}`.split('-')
              reportInfo['Daypart'] = {
                'timeSpan': `${dateSplit[1]}/${dateSplit[2]}-Daypart${dayPartValue}`,
                'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
            } else if (Number.isNaN(parseInt(dayPartValue))) {
              reportInfo['Daypart'] = {
                'timeSpan': 'Total Daypart',
                'currentWeekpart': messages.COMMON.WAVG}
            }
          }
        }
        reportInfo[`${key}`] = {'value': `${value}`}
      } else if (key === 'StoreNo') {
        if (filter === 'week') {
          if (value === 'Total Week') {
            reportInfo['Week'] = {
              'timeSpan': 'Total Week',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            reportInfo['Week'] = {
              'timeSpan': startDate.value + ' - ' + endDate.value,
              'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
          }
          reportInfo[`${key}`] = {'value': `${value}`}
        }
        reportInfo[`${key}`] = {'value': `${value}`}
      } else if (key === 'GroupName') {
        reportInfo['Groups'] = {'value': `${value}`}
      } else if (key === 'StoreID') {
        reportInfo['storeId'] = {'value': `${value}`}
      } else if (key === 'Store_Name') {
        reportInfo['Stores'] = {'value': `${value}`}
      } else if (key === 'Device_UID') {
        reportInfo['deviceUid'] = {'value': `${value}`}
      } else if (key === 'Device_ID') {
        reportInfo['deviceId'] = {'value': `${value}`}
      } else if (key === 'WeekIndex') {
        reportInfo['index'] = {'value': `${value}`}
      } else if (key === 'Total_Car') {
        reportInfo['Total Cars'] = {'value': (value || null)}
      } else if (timeFormat === 2) {
        newValue = value
        if (newValue === 0 || newValue === null) {
          newValue = 'N/A'
        }
        reportInfo[`${key}`] = {'value': `${dateUtils.convertSecondsToMinutes(parseInt(newValue), timeFormat)}`, 'color': `${getColor(key, newValue)}`}
      } else if (timeFormat === 1) {
        newValue = value
        if (newValue === 0 || newValue === null) {
          newValue = 'N/A'
        }
        reportInfo[`${key}`] = {'value': `${newValue}`, 'color': `${getColor(key, newValue)}`}
      }
    })
    deviceInfo.push(reportInfo)
  })
  let timeMeasureType = []
  let deviceTime = {}
  deviceTime.data = deviceInfo
  timeMeasureType.push(deviceTime)
  return timeMeasureType
}
Device.prototype.getLongestTime = function (longestTime, deviceHeaders) {
  const timeFormat = this.request.body.format
  let deviceLongestTime = []
  _.forEach(longestTime, (items) => {
    let timeDetails = {}
    _.forEach(deviceHeaders, (value, key) => {
      if (items['DeviceTimeStamp'] !== null) {
        if (items[`${value}`] !== null) {
          timeDetails[`${value}`] = {
            'Value': dateUtils.convertSecondsToMinutes(items.DetectorTime, timeFormat),
            'Date': dateUtils.convertMMMddMM(items.DeviceTimeStamp),
            'Time': dateUtils.converthhmmsstt(items.DeviceTimeStamp)
          }
        }
        deviceLongestTime.push(timeDetails)
      } else {
        deviceLongestTime = []
      }
    })
  })
  return deviceLongestTime
}
Device.prototype.getGoalStatistics = function (goalSetting, deviceGoalInfo, totalCars, goalHeader, deviceHeaders) {
  let eventGoalList
  if (goalHeader && goalHeader.length > 0 && !_.isNull(goalHeader[0].EventGoalNames) && goalHeader[0].EventGoalNames !== undefined) {
    eventGoalList = _.get(goalHeader[0], 'EventGoalNames').split('|$|')
  } else {
    eventGoalList = []
  }
  let goalGrade = {}
  let isMinutes = Number(this.request.body.format)
  let colorSettings
  if (_.isUndefined(this.colors[0]) || _.isUndefined(this.colors[0].ColourCode)) {
    colorSettings = ['N/A', 'N/A', 'N/A']
  } else {
    colorSettings = this.colors[0].ColourCode.split('|')
  }
  function CalculatePercetage (value, totalCarsCount) {
    if (value === 0 || value === null || isNaN(value) || _.isUndefined(value) || totalCarsCount === 0) {
      return `0%`
    } else {
      return `${Math.round(value / totalCarsCount * 100)}%`
    }
  }
  _.map(deviceGoalInfo[0], (value, key) => {
    let obj = {goal: '', cars: '0', percentage: '0%'}
    let rowKey = {}
    let row = _.clone(obj)
    if (eventGoalList.indexOf(key) > -1) {
      row.cars = value || '0'
      row.percentage = CalculatePercetage(value, totalCars)
      let eventWithGolas = _.split(key, '-', 2)
      let event = _.trim(eventWithGolas[0])
      let goal = _.trim(eventWithGolas[1])
      if (key.includes(goal)) {
        if (_.has(goalGrade, goal)) {
          goalGrade[goal][event] = row
        } else {
          rowKey[event] = row
          goalGrade[goal] = rowKey
          goalGrade[goal].title = (goal === 'GoalF' ? `> GoalD (min:sec)` : `<${goal} (min:sec)`)
          goalGrade[goal].color = getColorForGoal(goal)
        }
      }
    }
  })
  function getColorForGoal (goal) {
    if (goal === 'GoalA') {
      return colorSettings[0]
    } else if (goal === 'GoalB') {
      return colorSettings[1]
    } else {
      return colorSettings[2]
    }
  }
  _.map(deviceGoalInfo[0], (value, key) => {
    let eventWithGolas = _.split(key, '-', 2)
    let event = _.trim(eventWithGolas[0])
    let goals = _.trim(eventWithGolas[1])
    if (_.has(goalGrade, [goals, event])) {
      value = (isMinutes === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES))
      _.set(goalGrade, [goals, event, 'goal'], value)
    }
  })
  return _.values(goalGrade) || []
}
Device.prototype.getSystemStatistics = function (DeviceSystemInfo, DeviceLaneInfo) {
  let displayData = {}
  if ((!_.isEmpty(DeviceLaneInfo)) && !_.isEmpty(DeviceLaneInfo)) {
    displayData.Lane = (_.isNull(DeviceLaneInfo[0].Lane)) ? 0 : DeviceLaneInfo[0].Lane
    displayData.AverageCarsInLane = (_.isNull(DeviceLaneInfo[0].AvgCarsInLane)) ? 0 : DeviceLaneInfo[0].AvgCarsInLane
    displayData.TotalPullouts = (_.isNull(DeviceLaneInfo[0].Pullouts)) ? 0 : _.get(DeviceLaneInfo, '0.Pullouts', '0')
    displayData.TotalPullins = (_.isNull(DeviceLaneInfo[0].Pullins)) ? 0 : _.get(DeviceLaneInfo, '0.Pullins', '0')
    displayData.DeleteOverMaximum = (_.isNull(DeviceLaneInfo[0].DeleteOverMax)) ? 0 : _.get(DeviceLaneInfo, '0.DeleteOverMax', '0')
    displayData.PowerFails = (_.isNull(DeviceLaneInfo[0].PowerFails)) ? 0 : _.get(DeviceSystemInfo, '0.PowerFails', '0')
    displayData.SystemResets = (_.isNull(DeviceLaneInfo[0].SystemResets)) ? 0 : _.get(DeviceSystemInfo, '0.SystemResets', '0')
    displayData.VBDResets = (_.isNull(DeviceLaneInfo[0].VDBResets)) ? 0 : _.get(DeviceSystemInfo, '0.VDBResets', '0')
  }
  return displayData
}

module.exports = Device
