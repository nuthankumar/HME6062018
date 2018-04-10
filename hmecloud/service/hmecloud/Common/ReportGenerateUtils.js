const dateUtils = require('../Common/DateUtils')
const _ = require('lodash')
const messages = require('../Common/Message')
const moment = require('moment')
const momentDurationFormatSetup = require('moment-duration-format')
// This function is used to Prepare Store Details
const prepareStoreDetails = (daysingleResult, storeData, input) => {
  daysingleResult.storeName = storeData.Store_Name
  daysingleResult.storeDesc = storeData.Brand_Name
  daysingleResult.startTime = input.ReportTemplate_From_Date
  daysingleResult.stopTime = input.ReportTemplate_To_Date
  daysingleResult.printDate = dateUtils.currentDate()
  daysingleResult.printTime = dateUtils.currentTime()
  daysingleResult.timeMeasure = input.ReportTemplate_Time_Measure
  daysingleResult.selectedStoreIds = input.ReportTemplate_StoreIds
  return daysingleResult
}

function getGoalStatistic(goalsStatistics, getGoalTime, dataArray, totalCars) {
    const goalGrades = {
        goalA: {
            title: '<Goal A',
            menu: { goal: '', cars: '', percentage: '' },
            greet: { goal: '', cars: '', percentage: '' },
            service: { goal: '', cars: '', percentage: '' },
            laneQueue: { goal: '', cars: '', percentage: '' },
            laneTotal: { goal: '', cars: '', percentage: '' }
        },
        goalB: {
            title: '<Goal B',
            menu: { goal: '', cars: '', percentage: '' },
            greet: { goal: '', cars: '', percentage: '' },
            service: { goal: '', cars: '', percentage: '' },
            laneQueue: { goal: '', cars: '', percentage: '' },
            laneTotal: { goal: '', cars: '', percentage: '' }
        },
        goalC: {
            title: '<Goal C',
            menu: { goal: '', cars: '', percentage: '' },
            greet: { goal: '', cars: '', percentage: '' },
            service: { goal: '', cars: '', percentage: '' },
            laneQueue: { goal: '', cars: '', percentage: '' },
            laneTotal: { goal: '', cars: '', percentage: '' }
        },
        goalD: {
            title: '<Goal D',
            menu: { goal: '', cars: '', percentage: '' },
            greet: { goal: '', cars: '', percentage: '' },
            service: { goal: '', cars: '', percentage: '' },
            laneQueue: { goal: '', cars: '', percentage: '' },
            laneTotal: { goal: '', cars: '', percentage: '' }
        },
        goalF: {
            title: 'Goal D',
            menu: { goal: '', cars: '', percentage: '' },
            greet: { goal: '', cars: '', percentage: '' },
            service: { goal: '', cars: '', percentage: '' },
            laneQueue: { goal: '', cars: '', percentage: '' },
            laneTotal: { goal: '', cars: '', percentage: '' }
        }
    }

    var populate = (result, goal, event, property, key, value) => {
        if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
            result[goal][event][property] = value
        }
    }

    var populatePercentage = (result, goal, event, property, key, value, totalCarsCount) => {
        if (key.toLowerCase().includes(goal.toLowerCase()) && key.toLowerCase().includes(event.toLowerCase())) {
            if (value === 0 || value === null) {
                result[goal][event][property] = `0%`
            } else {
                result[goal][event][property] = `${Math.round(value / totalCarsCount * 100)}%`
            }
        }
    }

    var prepareGoal = (result, event, property, key, value) => {
        populate(result, 'goalA', event, property, key, value)
        populate(result, 'goalB', event, property, key, value)
        populate(result, 'goalC', event, property, key, value)
        populate(result, 'goalD', event, property, key, value)
        populate(result, 'goalF', event, property, key, value)
    }

    var prepareGoalPercentage = (result, event, property, key, value, totalCars) => {
        populatePercentage(result, 'goalA', event, property, key, value, totalCars)
        populatePercentage(result, 'goalB', event, property, key, value, totalCars)
        populatePercentage(result, 'goalC', event, property, key, value, totalCars)
        populatePercentage(result, 'goalD', event, property, key, value, totalCars)
        populatePercentage(result, 'goalF', event, property, key, value, totalCars)
    }
    // Get the values for the goals
    _.map(getGoalTime[0], (value, key) => {
        prepareGoal(goalGrades, 'menu', 'goal', key, value)
        prepareGoal(goalGrades, 'greet', 'goal', key, value)
        prepareGoal(goalGrades, 'service', 'goal', key, value)
        prepareGoal(goalGrades, 'laneQueue', 'goal', key, value)
        prepareGoal(goalGrades, 'laneTotal', 'goal', key, value)
    })

    // get the values for the cars
    _.map(goalsStatistics[0], (value, key) => {
        prepareGoal(goalGrades, 'menu', 'cars', key, value)
        prepareGoal(goalGrades, 'greet', 'cars', key, value)
        prepareGoal(goalGrades, 'service', 'cars', key, value)
        prepareGoal(goalGrades, 'laneQueue', 'cars', key, value)
        prepareGoal(goalGrades, 'laneTotal', 'cars', key, value)

        prepareGoalPercentage(goalGrades, 'menu', 'percentage', key, value, totalCars)
        prepareGoalPercentage(goalGrades, 'greet', 'percentage', key, value, totalCars)
        prepareGoalPercentage(goalGrades, 'service', 'percentage', key, value, totalCars)
        prepareGoalPercentage(goalGrades, 'laneQueue', 'percentage', key, value, totalCars)
        prepareGoalPercentage(goalGrades, 'laneTotal', 'percentage', key, value, totalCars)
        // value : statistic value
        //  totalCars : avgTimeCalculate
        dataArray.push(goalGrades)
    })
    return dataArray[0]
}
    // This function is used to prepare Longest details for Day Report
    const prepareLongestTimes = (daysingleResult, longestData, format) => {
    let LongestTimes = []
    let longestObj = {}
    let k = 0
    for (let i = 0; i < longestData.length; i++) {
        let tempTimeObj = longestData[i]
        if (tempTimeObj.headerName.includes(messages.EventName.MENU)) {
            let timeObj = {}
            timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
            timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
            timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
            longestObj.Menu = timeObj
            LongestTimes.push(longestObj)
        } else if (tempTimeObj.headerName.includes(messages.EventName.GREET)) {
            let timeObj = {}
            timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
            timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
            timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
            LongestTimes[k].Greet = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        } else if (tempTimeObj.headerName.includes(messages.EventName.SERVICE)) {
            let timeObj = {}
            timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
            timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
            timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
            LongestTimes[k].Service = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        } else if (tempTimeObj.headerName.includes(messages.EventName.LANEQUEUE)) {
            let timeObj = {}
            timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
            timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
            timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
            LongestTimes[k].LaneQueue = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        }else if (tempTimeObj.headerName.includes(messages.EventName.LANETOTAl)) {
            let timeObj = {}
            timeObj.Value = dateUtils.convertSecondsToMinutes(tempTimeObj.DetectorTime, format)
            timeObj.Date = dateUtils.convertMMMddMM(tempTimeObj.DeviceTimeStamp)
            timeObj.Time = dateUtils.converthhmmsstt(tempTimeObj.DeviceTimeStamp)
            LongestTimes[k].LaneTotal = timeObj
            k = k + 1
            if (k === 2) {
                k = 0
            }
        }
      }
    daysingleResult.LongestTimes = LongestTimes
    return daysingleResult
}

module.exports = {
  prepareStoreDetails,
  prepareLongestTimes,
  getGoalStatistic
}
