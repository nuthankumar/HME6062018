const dateUtils = require('./DateUtils')
const _ = require('lodash')
const moment = require('moment')
const messages = require('./Message')
/**
 * This is method for creating multiple store devices values
 * @param {*} result result form database
 * @param {*} request request form user Input
 * @param {*} colors   colors form database
 * @param {*} goalSettings   goalSettings form database
 * @param {*} reportFilter reportFilter like (day,daypart,week)
 */
const Device = function (result, colors, groupName, goalSettings, request, reportFilter) {
  console.log('timeFormat', request)
  this.result = result
  this.colors = colors
  this.groupName = groupName
  this.goalSettings = goalSettings
  this.request = request
  this.reportFilter = reportFilter

}

/**
 * This is creating multiple store devices values
 */
Device.prototype.multipleStore = function () {
  const timeFormat = this.request.body.format
  const filter = this.reportFilter
  let storeDetails = this.result
  let index = 0
  let deviceInfo
  let deviceValues = []
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

  _.forEach(storeDetails, (item, key) => {
    let reportInfo = {}
    let groupName
    let storeNo
    if (filter === 'week') {
      if (item['WeekIndex'] !== index) {
        deviceInfo = {
          title: '',
          data: []
        }
        deviceInfo.title = moment(item['WeekStartDate']).format('MMM D,YYYY') + ' ' + messages.COMMON.OPENVALUE + ' - ' + moment(item['WeekEndDate']).format('MMM D,YYYY') + ' ' + messages.COMMON.CLOSEVALUE
        deviceInfo.data = []
        index = item['WeekIndex']
        deviceValues.push(deviceInfo)
      }
    }
    if (filter === 'daypart') {
      if (item['DayPartIndex'] !== index) {
        deviceInfo = {
          title: '',
          data: []
        }
        deviceInfo.title = moment(item['StoreDate']).format('MMM D,YYYY') + ' - DAYPART' + ' ' + item['DayPartIndex']
        deviceInfo.data = []
        index = item['DayPartIndex']
        deviceValues.push(deviceInfo)
      }
    }
    if (filter === 'day') {
      if (item['ID'] !== index) {
        deviceInfo = {
          title: '',
          data: []
        }
        deviceInfo.title = moment(item['StoreDate']).format('MMM D,YYYY') + messages.COMMON.OPENVALUE + ' - ' + moment(item['StoreDate']).format('MMM D,YYYY') + messages.COMMON.CLOSEVALUE
        deviceInfo.data = []
        index = item['ID']
        deviceValues.push(deviceInfo)
      }
    }
    _.forEach(storeDetails[key], function (value, key) {
      let total = null
      if (key === 'StoreID') {
        reportInfo['storeId'] = {'value': ` ${value}`}
      } else if (key === 'GroupName') {
        groupName = value
        if (reportInfo['Groups'] === null) {
          reportInfo['Groups'] = {'value': (groupName || null)}
        }
      } else if (key === 'StoreNo') {
        storeNo = value || null
        if ((key === 'StoreID') && key.includes('Subtotal')) {
          total = {'value': groupName + ' ' + storeNo}
        } else if (value === 'Total Week' || value === 'Total Daypart' || value === 'Total Day') {
          total = {'value': value, 'timeSpan': messages.COMMON.WAVG}
        }
        reportInfo[`${key}`] = {'value': `${value}`}
        reportInfo['Groups'] = total
      } else if (key === 'Store_Name') {
        reportInfo['Stores'] = {'value': (value || null)}
      } else if (key === 'Device_UID') {
        reportInfo['Device_UID'] = {'value': (value || null)}
      } else if (key === 'Device_ID') {
        reportInfo['deviceId'] = {'value': (value || null)}
      } else if (key === 'StartTime') {
        reportInfo['StartTime'] = {'value': (value || null)}
      } else if (key === 'EndTime') {
        reportInfo['EndTime'] = {'value': (value || null)}
      } else if (key === 'WeekStartDate') {
        reportInfo['WeekStartDate'] = {'value': (value || null)}
      } else if (key === 'WeekEndDate') {
        reportInfo['WeekEndDate'] = {'value': (value || null)}
      } else if (key === 'Total_Car') {
        reportInfo['Total Cars'] = {'value': (value || null)}
      } else if (key === 'StoreDate') {
        reportInfo['StoreDate'] = {'value': (value || null)}
      } else {
        let color
        if (value === 0 || value === null) {
          value = 'N/A'
          color = messages.COMMON.NACOLOR
        } else {
          color = `${getColor(key, value)}`
        }
        reportInfo[`${key}`] = {'value': `${dateUtils.convertSecondsToMinutes(parseInt(value), timeFormat)}`, 'color': color}
      }
    })
    deviceInfo.data.push(reportInfo)
  })
  return deviceValues
}

// New ODS Report
Device.prototype.getDeviceInformation = function () {
  const timeFormat = this.request.body.format
  const filter = this.reportFilter
  let storeDetails = this.result
  let index = 0
  let deviceInfo
  let deviceValues = []
  let getColors = []
  // checking color code is empty or not
  if (this.colors && this.colors.length > 0 && this.colors[0].ColourCode) { getColors = this.colors[0].ColourCode.split('|') }
  let getColor = (event, eventValue) => {
    let color = getColors[2]
    _.pickBy(this.goalSettings, (value, key) => {
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
  _.forEach(storeDetails, (item, key) => {
    let reportInfo = {}
    let groupName
    let storeNo
    if (filter === 'daypart') {
      if (item['DayPartIndex'] !== index) {
        deviceInfo = {
          title: '',
          data: []
        }
        deviceInfo.title = moment(item['StoreDate']).format('MMM D,YYYY') + ' - DAYPART' + ' ' + item['DayPartIndex']
        deviceInfo.data = []
        index = item['DayPartIndex']
        deviceValues.push(deviceInfo)
      }
    }
    _.forEach(storeDetails[key], function (value, key) {
      if (key === 'StoreID') {
        reportInfo['storeId'] = {'value': ` ${value}`}
      } else if (key === 'Store_Name') {
        reportInfo['Stores'] = {'value': (value || null)}
      } else if (key === 'Device_UID') {
        reportInfo['Device_UID'] = {'value': (value || null)}
      } else if (key === 'Device_ID') {
        reportInfo['deviceId'] = {'value': (value || null)}
      } else if (key === 'StartTime') {
        reportInfo['StartTime'] = {'value': (value || null)}
      } else if (key === 'EndTime') {
        reportInfo['EndTime'] = {'value': (value || null)}
      } else if (key === 'Total_Car') {
        reportInfo['Total Cars'] = {'value': (value || null)}
      } else if (key === 'StoreDate') {
        reportInfo['StoreDate'] = {'value': (value || null)}
      } else {
        let color
        if (value === 0 || value === null) {
          value = 'N/A'
          color = messages.COMMON.NACOLOR
        } else {
          color = `${getColor(key, value)}`
        }
        reportInfo[`${key}`] = {'value': `${dateUtils.convertSecondsToMinutes(parseInt(value), timeFormat)}`, 'color': color}
      }
      _.forEach(this.groupName, (item) => {
        reportInfo['Groups'] = { 'value': item.GroupName || null }
      })
    })
    deviceInfo.data.push(reportInfo)
  })
  return deviceValues
}
module.exports = Device
