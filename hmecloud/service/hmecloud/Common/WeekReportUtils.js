const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const moment = require('moment')
const messages = require('../Common/Message')

const singleStoreinfo = (weekRecords, result, colors, goalSettings, format) => {
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
 * This function is used to prepare colors with event values
 * @param {*} result
 * @param {*} colors
 * @param {*} goalSettings
 * @param {*} format
 */
const multipleStoreInfo = (weekRecords, result, colors, goalSettings, format) => {
  console.log('color', colors)
  let storeDetails = _.filter(result, (value) => {
    if (value.StoreNo) {
      return value
    }
  })
  let colorSettings = []
  if (colors && colors.length > 0) {
    colorSettings = colors[0].ColourCode.split('|')
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

module.exports = {
  multipleStoreInfo,
  singleStoreinfo
}
