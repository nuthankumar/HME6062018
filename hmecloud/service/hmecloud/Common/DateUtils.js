const moment = require('moment')
const messages = require('../Common/Message')
const momentDurationFormatSetup = require('moment-duration-format')
const dateFormat = require('dateformat')
const _ = require('lodash')

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

const dayPartTime = (dayPartId, input) => {
  let dayPartTime

  if (dayPartId && dayPartId === 1) {
    dayPartTime = messages.COMMON.DAYPARTOPENTIME

    // TODO check with HME team
    // if (input.ReportTemplate_From_Time) {
    //   dayPartTime = messages.COMMON.OPENVALUE + '-' + moment(input.ReportTemplate_From_Time, 'hh:mm:ss a').format('hh:mm')
    // } else {
    //   dayPartTime = messages.COMMON.CLOSEVALUE + '-' + moment(input.ReportTemplate_To_Time, 'hh:mm:ss a').format('hh:mm')
    // }
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
  return moment(fromDateTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:MM:SS')
}

const toTime = (dateVal, timeVal) => {
  let toDateTime
  if (timeVal) {
    toDateTime = dateVal + ' ' + timeVal
  } else {
    toDateTime = dateVal + ' ' + defaultEndTime
  }
  return moment(toDateTime, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')
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

const dateDifferenceMonths = (fromDate, toDate) => {
  const date1 = moment(fromDate)
  const date2 = moment(toDate)
  let diffent = date2.diff(date1, 'months')
  return diffent
}

const convertMMMddMM = (dateVal) => {
  if (dateVal !== null || (_.isUndefined(dateVal))) {
    return moment(dateVal).format('MMM MM/DD')
  } else {
    return 'N/A'
  }
}
const convertMMMdYYYY = (dateVal) => {
  if (dateVal !== null || (_.isUndefined(dateVal))) {
    return moment(dateVal).format('MMM DD,YYYY')
  } else {
    return 'N/A'
  }
}

const converthhmmsstt = (dateVal) => {
  if (dateVal !== null || (_.isUndefined(dateVal))) {
    return moment(dateVal).format('hh:mm:ss A')
  } else {
    return 'N/A'
  }
}

const converthhmmtt = (dateVal) => {
  if (dateVal !== null || (_.isUndefined(dateVal))) {
    return moment(dateVal).format('hh:mm A')
  } else {
    return 'N/A'
  }
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

const getAdvancedSelectionMaxMonth = (noOfDays, dateValue) => {
  return moment(dateValue).add(noOfDays, 'month').format('YYYY-MM-DD')
}

const convertYYYYMMDD = (dateValue) => {
  return moment(dateValue).format('YYYY-MM-DD')
}

const UtcTimeTo12HourFormat = (dateValue) => {
  if (dateValue !== null || (_.isUndefined(dateValue))) {
    return moment.utc(dateValue, 'YYYY-MM-DDTHH:mm:ss Z').format('YYYY-MM-DD HH:mm a')
  } else {
    return 'N/A'
  }
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
  getAdvancedSelectionMaxDate,
  getAdvancedSelectionMaxMonth,
  dateDifferenceMonths,
  convertYYYYMMDD,
  converthhmmtt,
  convertMMMdYYYY,
  UtcTimeTo12HourFormat
}
