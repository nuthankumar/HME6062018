const moment = require('moment')
const messages = require('../Common/Message')
const momentDurationFormatSetup = require('moment-duration-format')
const dateFormat = require('dateformat')

const defaultFromTime = '00:00:00'
const defaultEndTime = '23:59:59'

const convertSecondsToMinutes = (avgTime, formatFlag) => {
  momentDurationFormatSetup(moment)
  if (avgTime) {
    if (formatFlag === 2) {
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
  return moment(dateValue).format('MM/DD/YYYY')
}

const dateDifference = (fromDate, toDate) => {
  const date1 = moment(fromDate)
  const date2 = moment(toDate)
  // console.log('Difference is ', dateB.diff(dateC, 'days'), 'days')
  let diffent = date2.diff(date1, 'days')
  return diffent
}
const convertMMMddMM = (dateVal) => {
    return moment(dateVal).format('MMM MM/DD')
}

const converthhmmsstt = (dateVal) => {
    return moment(dateVal).format('hh:mm:ss A')
}

const monthDifference = (fromDate, toDate) => {
    const date1 = moment(fromDate)
    const date2 = moment(toDate)
    let diffent = date2.diff(date1, 'months')
    return diffent
}

const convertMonthDayYear = (dateVal) => {
    return moment(dateVal).format('LL')
}

const getAdvancedSelectionMaxDate = (noOfDays, dateValue) => {
     return moment(dateValue).add(noOfDays, 'day').format('YYYY-MM-DD')
}
module.exports = {
  convertSecondsToMinutes,
  dayPartTime,
  fromTime,
  toTime,
  currentDate,
  currentTime,
    dateDifference,
    convertMMMddMM,
    converthhmmsstt,
    convertmmddyyyy,
    monthDifference,
    convertMonthDayYear,
    getAdvancedSelectionMaxDate
}
