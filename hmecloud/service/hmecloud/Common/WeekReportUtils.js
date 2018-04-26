const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const HashMap = require('hashmap')
const messages = require('../Common/Message')
const reportUtil = require('../Common/ReportGenerateUtils')

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

const multipleStoreInfo = (weekInfo, weekData, format, colors, goalSettings) => {
  const dayIndexIds = new HashMap()
  let timeMeasure = []

  weekData.forEach(item => {
    let dayIndexId = item.WeekIndex
    if (dayIndexId && !dayIndexIds.has(dayIndexId)) {
      let dayResultsList = weekData.filter(function (obj) {
        return obj.WeekIndex === dayIndexId
      })
      let multiStoreObj = {}
      let tempData = []

      let tempRawCarData = dayResultsList[0]
      if (tempRawCarData.StoreNo !== 'Total Week') {
        multiStoreObj.title = dateUtils.convertMonthDayYear(tempRawCarData.StoreDate) + messages.COMMON.OPENVALUE + ' - ' + dateUtils.convertMonthDayYear(tempRawCarData.StoreDate) + messages.COMMON.CLOSEVALUE
      }

      for (let i = 0; i < dayResultsList.length; i++) {
        let storeObj = dayResultsList[i]

        let store = {}
        if (storeObj.StoreNo !== 'Total Week') {
          let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)

          if (storeObj.StoreNo && !storeObj.StoreNo.includes('Subtotal')) {
            store.name = storeObj.StoreNo + (storeObj.Store_Name ? ' - ' + storeObj.Store_Name : '')
            dataObject.store = store
          } else {
            store.name = ' '
            dataObject.store = store
          }

          tempData.push(dataObject)
        } else {
          let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)
          let store = {}
          store.name = ' '
          dataObject.store = store
          tempData.push(dataObject)
        }
      }
      multiStoreObj.data = tempData
      timeMeasure.push(multiStoreObj)
      dayIndexIds.set(dayIndexId, dayIndexId)
    }
  })
  weekInfo.timeMeasureType = timeMeasure
}

function prepareDayObject (item, format, colors, goalSettings) {
  let menu = {}
  let greet = {}
  let service = {}
  let laneQueue = {}
  let laneTotal = {}
  let totalCars = {}
  let dataObject = {}
  let groupId = {}
  let storeId = {}
  let deviceId = {}
  let deviceUid = {}

  if (item.StoreNo && item.StoreNo.includes('Subtotal')) {
    groupId.value = item.GroupName + ' ' + item.StoreNo
  } else if (item.StoreNo && item.StoreNo === 'Total Week') {
    groupId.value = item.StoreNo
    groupId.timeSpan = messages.COMMON.WAVG
  } else {
    groupId.value = item.GroupName
  }
  dataObject.groupId = groupId

  storeId.value = item.StoreID
  dataObject.storeId = storeId

  menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
  menu.color = reportUtil.getColourCode('Menu Board', item['Menu Board'], colors, goalSettings)
  dataObject.menu = menu

  greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
  greet.color = reportUtil.getColourCode('Greet', item.Greet, colors, goalSettings)
  dataObject.greet = greet

  service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
  service.color = reportUtil.getColourCode('Service', item.Service, colors, goalSettings)
  dataObject.service = service

  laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
  laneQueue.color = reportUtil.getColourCode('Lane Queue', item['Lane Queue'], colors, goalSettings)
  dataObject.laneQueue = laneQueue

  laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
  laneTotal.color = reportUtil.getColourCode('Lane Total', item['Lane Total'], colors, goalSettings)
  dataObject.laneTotal = laneTotal

  totalCars.value = item['Total_Car']
  dataObject.totalCars = totalCars

  deviceId.value = item.Device_ID
  dataObject.deviceId = deviceId

  deviceUid.value = item.Device_UID
  dataObject.deviceUid = deviceUid

  return dataObject
}

module.exports = {
  multipleStoreInfo,
  singleStoreinfo
}
