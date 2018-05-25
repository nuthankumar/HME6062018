
const dateUtils = require('./DateUtils')
const dateFormat = require('dateformat')
const moment = require('moment')
const _ = require('lodash')

const Device = function (result, request) {
  this.result = result
  this.request = request
}
Device.prototype.storeInfo = function () {
  let getStoreTnfo = {}
  if (this.result.data[2] && this.result.data[2].length > 0 && this.result.data[2] !== null && this.result.data[2] !== undefined) {
    getStoreTnfo.storeName = this.result.data[2][0].Store_Name
    getStoreTnfo.storeDescription = this.result.data[2][0].Brand_Name
    getStoreTnfo.storeNumber = (this.result.data[2][0].Store_Number ? this.result.data[2][0].Store_Number : 'N/A')
    getStoreTnfo.startTime = `${dateUtils.convertMMMdYYYY(this.request.body.fromDate)}`
    getStoreTnfo.stopTime = `${dateUtils.convertMMMdYYYY(this.request.body.toDate)}`
    getStoreTnfo.printDate = dateUtils.convertMMMdYYYY(dateFormat(new Date(), 'isoDate'))
    getStoreTnfo.printTime = dateFormat(new Date(), 'shortTime')
    if (this.result.data[0][0] && this.result.data[2] && this.result.data[2].length > 0 && this.result.data[2] !== null && this.result.data[2] !== undefined) {
      let dayPart = this.result.data[0][0].Daypart_ID
      getStoreTnfo.dayPart = 'DP' + dayPart + dateUtils.dayPartTime(dayPart)
    }
  } else {
    getStoreTnfo = {}
  }
  return getStoreTnfo
}
Device.prototype.generateReports = function (deviceDetails) {
  function timeFormat (dateValue) {
    if (dateValue !== null || (_.isUndefined(dateValue))) {
      return moment.utc(dateValue, 'YYYY-MM-DDTHH:mm:ss Z').format('YYYY-MM-DD HH:mm a')
    } else {
      return 'N/A'
    }
  }
  let rawCarDataList = []
  let events = []
  let rawCarData = {}
  _.forEach(deviceDetails, (item, key) => {
    if (events.includes(item['EventType_Name'])) {
      rawCarDataList.push(rawCarData)
      rawCarData = {}
      events = []
    }
    if (item['DepartTimeStamp']) {
      rawCarData.departureTime = timeFormat(item['DepartTimeStamp'])
    } else {
      rawCarData.departureTime = 'N/A'
    }
    if (item['CarRecordDataType_Name']) {
      rawCarData.eventName = item['CarRecordDataType_Name'] ? item['CarRecordDataType_Name'] : 'N/A'
    } else {
      rawCarData.eventName = 'N/A'
    }
    if (item['CarsInQueue']) {
      rawCarData.carsInQueue = item['CarsInQueue'] ? item['CarsInQueue'] : '0'
    } else {
      rawCarData.carsInQueue = 'N/A'
    }
    events.push(item['EventType_Name'])
  })
  _.forEach(deviceDetails, (item) => {
    _.forEach(events, (value, key) => {
      rawCarData[`${item['EventType_Name'].toString()}`] = dateUtils.convertSecondsToMinutes(item['DetectorTime'], this.request.body.format)
    })
    rawCarDataList.push(rawCarData)
  })
  return rawCarDataList
}
module.exports = Device
