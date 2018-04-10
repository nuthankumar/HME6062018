const moment = require('moment')
const messages = require('../Common/Message')
const momentDurationFormatSetup = require('moment-duration-format')
const dateFormat = require('dateformat')

const defaultFromTime = '00:00:00'
const defaultEndTime = '23:59:59'

const convertSecondsToMinutes = (avgTime, formatFlag) => {
  momentDurationFormatSetup(moment)
  if (avgTime) {
    if (formatFlag === 1) {
      return moment.duration(avgTime, 'seconds').format()
    } else {
      return avgTime
    }
  } else {
    return 'N/A'
  }
}

const dayPartTime = (dayPartId, totalRecordCount, deviceStartTime, deviceEndTime) => {
  let dayPartTime
  if (dayPartId && dayPartId === 1) {
    dayPartTime = messages.COMMON.DAYPARTOPENTIME
  } else {
    dayPartTime = messages.COMMON.DAYPARTCLOSETIME
  }
  return dayPartTime
}

const fromTime = (dateVal, timeVal) => {
  let fromDateTime
  if (timeVal) {
    fromDateTime = dateVal + ' ' + timeVal
  } else {
    fromDateTime = dateVal + ' ' + defaultFromTime
  }

  return moment(fromDateTime).format('YYYY-MM-DD HH:mm:ss')
}

const toTime = (dateVal, timeVal) => {
  let toDateTime
  if (timeVal) {
    toDateTime = dateVal + ' ' + timeVal
  } else {
    toDateTime = dateVal + ' ' + defaultEndTime
  }
  return moment(toDateTime).format('YYYY-MM-DD HH:mm:ss')
}

const currentDate = () => {
  return dateFormat(new Date(), 'isoDate')
}

const currentTime = () => {
  return dateFormat(new Date(), 'shortTime')
}

const convertmmddyyyy = (dateValue) => {
  return moment(dateValue).format('mm/dd/yyyy')
}

const dateDifference = (fromDate, toDate) => {
  const date1 = moment(fromDate)
  const date2 = moment(toDate)
  // console.log('Difference is ', dateB.diff(dateC, 'days'), 'days')
  let diffent = date2.diff(date1, 'days')
  return diffent
}

module.exports = {
  convertSecondsToMinutes,
  dayPartTime,
  fromTime,
  toTime,
  currentDate,
  currentTime,
  dateDifference
}
