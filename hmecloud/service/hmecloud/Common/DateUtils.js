const moment = require('moment')
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
    dayPartTime = ' OPEN-11:59'
    // TODO: GET Time from Start date
  } else {
    dayPartTime = 'CLOSE-23:59'
    // TODO: GET Time from End date
  }
  return dayPartTime
}

module.exports = {
  convertSecondsToMinutes,
  dayPartTime
}
