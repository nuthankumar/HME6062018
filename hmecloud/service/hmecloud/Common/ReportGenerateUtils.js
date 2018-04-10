const dateUtils = require('../Common/DateUtils')
const messages = require('../Common/Message')
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
// This function is used to Prepare Store Details
const  prepareStoreDetails = (daysingleResult, storeData, input) => {
    daysingleResult.store = storeData.Store_Name
    daysingleResult.description = storeData.Brand_Name
    daysingleResult.startTime = input.ReportTemplate_From_Date
    daysingleResult.stopTime = input.ReportTemplate_To_Date
    daysingleResult.printDate = dateUtils.currentDate()
    daysingleResult.printTime = dateUtils.currentTime()
    daysingleResult.timeMeasure = input.ReportTemplate_Time_Measure
    daysingleResult.selectedStoreIds = input.ReportTemplate_StoreIds
    return daysingleResult
}

// This function is used to prepare Longest details for Day Report
const prepareLongestTimes = (daysingleResult, longestData, format) =>{
    let LongestTimes = []
    let longestObj = {}
    let k = 0
    for (let i = 0; i < longestData.length; i++) {
        let tempTimeObj = longestData[i]
        if (tempTimeObj.headerName.includes(messages.EventName.MENU)) {
            let timeObj = {}
            timeObj.Name = tempTimeObj.headerName
            timeObj.Value = tempTimeObj.DetectorTime
            timeObj.Date = moment(tempTimeObj.DeviceTimeStamp).format('MMM MM/DD') // tempTimeObj.DeviceTimeStamp
            timeObj.Time = moment(tempTimeObj.DeviceTimeStamp).format('hh:mm:ss A')
            longestObj.Menu = timeObj
            LongestTimes.push(longestObj)
        } else if (tempTimeObj.headerName.includes(messages.EventName.GREET)) {
            let timeObj = {}
            timeObj.Name = tempTimeObj.headerName
            timeObj.Value = tempTimeObj.DetectorTime
            timeObj.Date = tempTimeObj.DeviceTimeStamp
            timeObj.Time = tempTimeObj.DeviceTimeStamp
            LongestTimes[k].Greet = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        } else if (tempTimeObj.headerName.includes(messages.EventName.SERVICE)) {
            let timeObj = {}
            timeObj.Name = tempTimeObj.headerName
            timeObj.Value = tempTimeObj.DetectorTime
            timeObj.Date = tempTimeObj.DeviceTimeStamp
            timeObj.Time = tempTimeObj.DeviceTimeStamp
            LongestTimes[k].Service = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        } else if (tempTimeObj.headerName.includes(messages.EventName.LANEQUEUE)) {
            let timeObj = {}
            timeObj.Name = tempTimeObj.headerName
            timeObj.Value = tempTimeObj.DetectorTime
            timeObj.Date = tempTimeObj.DeviceTimeStamp
            timeObj.Time = tempTimeObj.DeviceTimeStamp
            LongestTimes[k].LaneQueue = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        }else if (tempTimeObj.headerName.includes(messages.EventName.LANETOTAl)) {
                let timeObj = {}
                timeObj.Name = tempTimeObj.headerName
                timeObj.Value = tempTimeObj.DetectorTime
                timeObj.Date = tempTimeObj.DeviceTimeStamp
                timeObj.Time = tempTimeObj.DeviceTimeStamp
                LongestTimes[k].LaneTotal = timeObj
                k = k + 1
                if (k === 2) {
                    k = 0
                }
        }
      }
    
    console.log(JSON.stringify(LongestTimes))
    return daysingleResult
}

module.exports = {
    prepareStoreDetails,
    prepareLongestTimes
}