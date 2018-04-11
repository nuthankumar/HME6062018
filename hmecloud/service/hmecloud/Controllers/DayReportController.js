const dateUtils = require('../Common/DateUtils')
const stores = require('../Repository/StoresRepository')
const reportUtil = require('../Common/ReportGenerateUtils')
const _ = require('lodash')
const HashMap = require('hashmap')


const generateDayReport = (input, callBack) => {
    let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
    let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
    let storesLength = input.ReportTemplate_StoreIds.length
    const datReportqueryTemplate = {
        ReportTemplate_StoreIds: input.ReportTemplate_StoreIds,
        ReportTemplate_From_Date: input.ReportTemplate_From_Date,
        ReportTemplate_To_Date: input.ReportTemplate_To_Date,
        FromDateTime: fromDateTime,
        ToDateTime: toDateTime,
        ReportTemplate_Type: input.reportType,
        CarDataRecordType_ID:input.CarDataRecordType_ID
    }

    if (input !== null) {
        let daysingleResult = {}
        stores.getDayDataReport(datReportqueryTemplate, result => {
            if (result.status === true) {
                // Preparing Single Store results
                console.log("Stores Length=====" + storesLength)
                if (storesLength === 1) {
                    reportUtil.prepareStoreDetails(daysingleResult, result.data[3], input)
                    let colors = result.data[4]
                    console.log("The colours====" + JSON.stringify(colors))
                    let goalstatisticsDetails = result.data[2]
                    console.log("The goal statistics===" + JSON.stringify(goalstatisticsDetails))
                    let goalSettings = _.filter(goalstatisticsDetails, group => group['Menu Board - GoalA'])
                    console.log("Goal settings=====" + JSON.stringify(goalSettings))
                    const StoreData = reportUtil.storesDetails(result.data[0], colors, goalSettings, input.ReportTemplate_Format)
                    console.log("The Colour mapped data*****" + JSON.stringify(StoreData))
                    prepareDayResults(daysingleResult, result.data[0], input.ReportTemplate_Format);
                    if (input.longestTime) {
                        reportUtil.prepareLongestTimes(daysingleResult, result.data[1], input.ReportTemplate_Format)
                    }
                    
                    getGoalTime = result.data[5]
                    const dayPartTotalObject = _.last(result.data[0])
                    const totalCars = dayPartTotalObject['Total_Car']
                    const dataArray = []
                    reportUtil.getGoalStatistic(goalstatisticsDetails, getGoalTime, dataArray, totalCars)
                    daysingleResult.goalData = dataArray[0] 
                } else if (storesLength > 1) {
                    prepareMultiStoreResults(daysingleResult, result.data[0], input.ReportTemplate_Format)

                } 
                daysingleResult.status = true
                callBack(daysingleResult)
            } else {
                callBack(result)
            }
        })
    } else {
        callBack(messages.CREATEGROUP.invalidRequestBody)
    }
}


// This function is used to prepare the Multi Store results for Day Report
function prepareMultiStoreResults(daysingleResult, daysData, format) {
    const dayIndexIds = new HashMap()
    let timeMeasure = []
    daysData.forEach(item => {
        let dayIndexId = item.DayID
     //   console.log("The Items===" + JSON.stringify(item))

        if (dayIndexId && !dayIndexIds.has(dayIndexId)) {
            let dayResultsList = daysData.filter(function (obj) {
                return obj.DayID === dayIndexId
            })
            let multiStoreObj = {}
            let tempData = []
            console.log("The child results Length==" + dayResultsList.length)
            let tempRawCarData = dayResultsList[0]
            multiStoreObj.title = tempRawCarData.StoreDate
            for (let i = 0; i < dayResultsList.length; i++) {
                let storeObj = dayResultsList[i]
                let menu = {}
                let greet = {}
                let service = {}
                let laneQueue = {}
                let laneTotal = {}
                let totalCars = {}
                let dataObject = {}
                let groupId = {}
                let storeId = {}
                let store = {}

                if (item.StoreDate !== 'Total Day') {
                    store.name = storeObj.StoreNo
                    dataObject.store = store

                    menu.value = dateUtils.convertSecondsToMinutes(storeObj['Menu Board'], format)
                    menu.color = "Red"
                    dataObject.menu = menu

                    greet.value = dateUtils.convertSecondsToMinutes(storeObj.Greet, format)
                    greet.color = "RED"
                    dataObject.greet = greet

                    service.value = dateUtils.convertSecondsToMinutes(storeObj.Service, format)
                    service.color = "Red"
                    dataObject.service = service

                    laneQueue.value = dateUtils.convertSecondsToMinutes(storeObj['Lane Queue'], format)
                    laneQueue.color = "Red"
                    dataObject.laneQueue = laneQueue

                    laneTotal.value = dateUtils.convertSecondsToMinutes(storeObj['Lane Total'], format)
                    laneTotal.color = "Red"
                    dataObject.laneTotal = laneTotal

                    totalCars.value = dateUtils.convertSecondsToMinutes(storeObj['Total_Car'], format)
                    totalCars.color = "Red"
                    dataObject.totalCars = totalCars
                    tempData.push(dataObject)
                } else {
                    menu.value = dateUtils.convertSecondsToMinutes(storeObj['Menu Board'], format)
                    menu.color = "Red"
                    multiStoreObj.menu = menu

                    greet.value = dateUtils.convertSecondsToMinutes(storeObj.Greet, format)
                    greet.color = "RED"
                    dataObject.greet = greet

                    service.value = dateUtils.convertSecondsToMinutes(storeObj.Service, format)
                    service.color = "Red"
                    dataObject.service = service

                    laneQueue.value = dateUtils.convertSecondsToMinutes(storeObj['Lane Queue'], format)
                    laneQueue.color = "Red"
                    dataObject.laneQueue = laneQueue

                    laneTotal.value = dateUtils.convertSecondsToMinutes(storeObj['Lane Total'], format)
                    laneTotal.color = "Red"
                    dataObject.laneTotal = laneTotal

                    totalCars.value = dateUtils.convertSecondsToMinutes(storeObj['Total_Car'], format)
                    totalCars.color = "Red"
                    dataObject.totalCars = totalCars
                    tempData.push(dataObject)
                }
            }
            multiStoreObj.data = tempData
            timeMeasure.push(multiStoreObj)
            dayIndexIds.set(dayIndexId, dayIndexId)
        }
        
        
    })

    console.log("The Multi store results=====" + JSON.stringify(timeMeasure))
    daysingleResult.timeMeasureType = timeMeasure
}



// This function is used to Prepare the Day details

function prepareDayResults(daysingleResult, dayData, format) {
    let singleDay = []
    let dataList = []
    let dayDataObj = {}
   
    dayData.forEach(item => {
        let menu = {}
        let greet = {}
        let service = {}
        let laneQueue = {}
        let laneTotal = {}
        let totalCars = {}
        let dataObject = {}
        let groupId = {}
        let storeId = {}

        if (item.StoreDate !== 'Total Day') {
            dataObject.day = item.StoreDate
            dataObject.timeSpan = "OPEN - CLOSE"

            menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format) 
            menu.color = "Red"
            dataObject.menu = menu

            greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
            greet.color = "RED"
            dataObject.greet = greet

            service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
            service.color = "Red"
            dataObject.service = service

            laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
            laneQueue.color = "Red"
            dataObject.laneQueue = laneQueue

            laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
            laneTotal.color = "Red"
            dataObject.laneTotal = laneTotal

            totalCars.value = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
            totalCars.color = "Red"
            dataObject.totalCars = totalCars

            dataList.push(dataObject)
        } else {
            dataObject.day = item.StoreDate
            dataObject.timeSpan = "W-Avg"
            menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
            menu.color = "Red"
            dataObject.menu = menu

            greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
            greet.color = "RED"
            dataObject.greet = greet

            service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
            service.color = "Red"
            dataObject.service = service

            laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
            laneQueue.color = "Red"
            dataObject.laneQueue = laneQueue

            laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
            laneTotal.color = "Red"
            dataObject.laneTotal = laneTotal

            totalCars.value = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
            totalCars.color = "Red"
            dataObject.totalCars = totalCars

            dataList.push(dataObject)
        }
    })
    dayDataObj.data = dataList
    singleDay.push(dayDataObj)
    daysingleResult.timeMeasureType = singleDay
} 

module.exports = {
    generateDayReport
}