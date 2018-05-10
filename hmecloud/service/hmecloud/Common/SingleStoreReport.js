const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const messages = require('../Common/Message')
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
    storeInfo.storeName = (storeInformation[0].Store_Name ? storeInformation[0].Store_Name : 'N/A')
    storeInfo.storeNumber = (storeInformation[0].Store_Number ? storeInformation[0].Store_Number : 'N/A')
    storeInfo.storeDesc = (storeInformation[0].Brand_Name ? storeInformation[0].Brand_Name : 'N/A')
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
    _.forEach(storeDetails[index], function (value, key) {
      if (key === 'WeekStartDate') {
        reportInfo['WeekStartDate'] = {'value': ` ${value}`}
        startDate = {'value': ` ${value}`}
      } else if (key === 'WeekEndDate') {
        reportInfo['WeekEndDate'] = {'value': ` ${value}`}
        endDate = {'value': ` ${value}`}
      } else if (key === 'DayPartIndex') {
        dayPartValue = ` ${value}`
      } else if (key === 'StoreDate') {
        if (filter === 'day') {
          if (value === 'Total Day') {
            reportInfo['day'] = {
              'timeSpan': 'Total Day',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            reportInfo['day'] = {
              'timeSpan': ` ${value}`,
              'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
          }
        } else if (filter === 'daypart') {
          if (value === 'Total Daypart') {
            reportInfo['daypart'] = {
              'timeSpan': 'Total DayPart',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            if (!Number.isNaN(parseInt(dayPartValue))) {
              let dateSplit = `${value}`.split('-')
              reportInfo['daypart'] = {
                'timeSpan': `${dateSplit[1]}/${dateSplit[2]}-Daypart ${dayPartValue}`,
                'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
            } else if (Number.isNaN(parseInt(dayPartValue))) {
              reportInfo['daypart'] = {
                'timeSpan': 'Total Daypart',
                'currentWeekpart': messages.COMMON.WAVG}
            }
          }
        }
        reportInfo[`${key}`] = {'value': `${value}`}
      } else if (key === 'StoreNo') {
        if (filter === 'week') {
          if (value === 'Total Week') {
            reportInfo['week'] = {
              'timeSpan': 'Total Week',
              'currentWeekpart': messages.COMMON.WAVG}
          } else {
            reportInfo['week'] = {
              'timeSpan': startDate.value + ' - ' + endDate.value,
              'currentWeekpart': messages.COMMON.DAYOPENCLOSE}
          }
          reportInfo[`${key}`] = {'value': ` ${value}`}
        }
        reportInfo[`${key}`] = {'value': ` ${value}`}
      } else if (key === 'GroupName') {
        reportInfo['group'] = {'value': ` ${value}`}
      } else if (key === 'StoreID') {
        reportInfo['storeId'] = {'value': ` ${value}`}
      } else if (key === 'Store_Name') {
        reportInfo['storeName'] = {'value': ` ${value}`}
      } else if (key === 'Device_UID') {
        reportInfo['deviceUid'] = {'value': ` ${value}`}
      } else if (key === 'Device_ID') {
        reportInfo['deviceId'] = {'value': ` ${value}`}
      } else if (key === 'WeekIndex') {
        reportInfo['index'] = {'value': ` ${value}`}
      } else if (timeFormat === 2) {
        reportInfo[`${key}`] = {'value': `${dateUtils.convertSecondsToMinutes(parseInt(value), timeFormat)}`, 'color': `${getColor(key, value)}`}
      } else if (timeFormat === 1) {
        reportInfo[`${key}`] = {'value': `${value}`, 'color': `${getColor(key, value)}`}
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
Device.prototype.getLongestTime = function (longestTime) {
  const timeFormat = this.request.body.format
  let deviceLongestTime = []
  let timeObj = []
  _.forEach(longestTime, (items) => {
    let timeDetails = {}
    if (items['DeviceTimeStamp'] !== null) {
      timeDetails.headerName = items.headerName
      timeDetails.Value = dateUtils.convertSecondsToMinutes(items.DetectorTime, timeFormat)
      timeDetails.Date = dateUtils.convertMMMddMM(items.DeviceTimeStamp)
      timeDetails.Time = dateUtils.converthhmmsstt(items.DeviceTimeStamp)
      timeObj.push(timeDetails)
    }
  })
  if (timeObj.length > 0) {
    deviceLongestTime = [ _.groupBy(timeObj, 'headerName') ]
  } else {
    deviceLongestTime = []
  }
  return deviceLongestTime
}
Device.prototype.getGoalStatistics = function (goalSetting, deviceGoalInfo, totalCars, goalHeader, deviceHeaders) {
  const timeFormat = Number(this.request.body.format)
  let getColors = []
  if (_.isUndefined(this.colors[0]) || _.isUndefined(this.colors[0].ColourCode)) {
    getColors = ['N/A', 'N/A', 'N/A']
  } else {
    getColors = this.colors[0].ColourCode.split('|')
  }
  let goalDetails = []
  function CalculatePercetage (value, totalCars) {
    if (value === 0 || value === null || isNaN(value) || _.isUndefined(value) || totalCars === 0) {
      return `0%`
    } else {
      return `${Math.round(value / totalCars * 100)}%`
    }
  }
  _.map(deviceGoalInfo[0], (value, key) => {
    let goalGrades = {}
    if (key !== 'Device_ID') {
      let goalTime = (timeFormat === 1 ? value : dateUtils.convertSecondsToMinutes(value, messages.TimeFormat.MINUTES))
      if (key.includes('GoalA')) {
        goalGrades.title = '< Goal A (min:sec)'
        goalGrades.color = getColors[0]
        goalGrades[`${key}`] = {'goal': (goalTime || 'N/A'), 'cars': (value || 0), 'percentage': (CalculatePercetage(value, totalCars) || '0%')}
      } else if (key.includes('GoalB')) {
        goalGrades.title = '< Goal B (min:sec)'
        goalGrades.color = getColors[1]
        goalGrades[`${key}`] = {'goal': (goalTime || 'N/A'), 'cars': (value || 0), 'percentage': (CalculatePercetage(value, totalCars) || '0%')}
      } else if (key.includes('GoalC')) {
        goalGrades.title = '< Goal C (min:sec)'
        goalGrades.color = getColors[2]
        goalGrades[`${key}`] = {'goal': (goalTime || 'N/A'), 'cars': (value || 0), 'percentage': (CalculatePercetage(value, totalCars) || '0%')}
      } else if (key.includes('GoalD')) {
        goalGrades.title = '< Goal D (min:sec)'
        goalGrades.color = getColors[2]
        goalGrades[`${key}`] = {'goal': (goalTime || 'N/A'), 'cars': (value || 0), 'percentage': (CalculatePercetage(value, totalCars) || '0%')}
      } else if (key.includes('GoalF')) {
        goalGrades.title = '> Goal D (min:sec)'
        goalGrades.color = getColors[2]
        goalGrades[`${key}`] = {'goal': (goalTime || 'N/A'), 'cars': (value || 0), 'percentage': (CalculatePercetage(value, totalCars) || '0%')}
      }
    }
    if (goalGrades.title) {
      goalDetails.push(goalGrades)
    }
  })
  return goalDetails
}
Device.prototype.getSystemStatistics = function (DeviceSystemInfo, DeviceLaneInfo) {
  let displayData = {}
  displayData.Lane = (_.isNull(DeviceLaneInfo[0].Lane)) ? 0 : DeviceLaneInfo[0].Lane
  displayData.AverageCarsInLane = (_.isNull(DeviceLaneInfo[0].AvgCarsInLane)) ? 0 : DeviceLaneInfo[0].AvgCarsInLane
  displayData.TotalPullouts = (_.isNull(DeviceLaneInfo[0].Pullouts)) ? 0 : _.get(DeviceLaneInfo, '0.Pullouts', '0')
  displayData.TotalPullins = (_.isNull(DeviceLaneInfo[0].Pullins)) ? 0 : _.get(DeviceLaneInfo, '0.Pullins', '0')
  displayData.DeleteOverMaximum = (_.isNull(DeviceLaneInfo[0].DeleteOverMax)) ? 0 : _.get(DeviceLaneInfo, '0.DeleteOverMax', '0')
  displayData.PowerFails = (_.isNull(DeviceLaneInfo[0].PowerFails)) ? 0 : _.get(DeviceSystemInfo, '0.PowerFails', '0')
  displayData.SystemResets = (_.isNull(DeviceLaneInfo[0].SystemResets)) ? 0 : _.get(DeviceSystemInfo, '0.SystemResets', '0')
  displayData.VBDResets = (_.isNull(DeviceLaneInfo[0].VDBResets)) ? 0 : _.get(DeviceSystemInfo, '0.VDBResets', '0')
  return displayData
}
module.exports = Device
