const validate = require('validator');
const momentDurationFormatSetup = require("moment-duration-format")
const moment = require("moment")


const msFormat = (avgTime, formatFlag) => {
   if (avgTime) {
        if (formatFlag === 1) {
            return moment.duration(avgTime, "seconds").format();
        } else {
            return avgTime
        }
    } else {
        return "N/A"
    }
}

const dayPartTime = (dayPartId, totalRecordCount, deviceStartTime, deviceEndTime) => {
    let dayPartTime;
    if (dayPartId && dayPartId === 1) {
        dayPartTime = " OPEN"
        // TODO: GET Time from Start date
    } else {
        dayPartTime = "CLOSE"
        // TODO: GET Time from End date
    }
    return dayPartTime
}

module.exports = {
    msFormat,
    dayPartTime
}