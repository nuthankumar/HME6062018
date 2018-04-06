const moment = require('moment')
const messages = require('../Common/Message')
const momentDurationFormatSetup = require('moment-duration-format')
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

module.exports = {
  convertSecondsToMinutes,
  dayPartTime
}
