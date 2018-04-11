const dateUtils = require('../Common/DateUtils')
const stores = require('../Repository/StoresRepository')
const reportUtil = require('../Common/ReportGenerateUtils')
const _ = require('lodash')


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
                if (storesLength === 1) {
                    reportUtil.prepareStoreDetails(daysingleResult, result.data[3], input)
                    prepareDayResults(daysingleResult, result.data[0], input.ReportTemplate_Format);
                    if (input.longestTime) {
                        reportUtil.prepareLongestTimes(daysingleResult, result.data[1], input.ReportTemplate_Format)
                    }
                    let colrs = result.data[4]
                    getGoalTime = result.data[5]
                    const dayPartTotalObject = _.last(result.data[0])
                    const totalCars = dayPartTotalObject['Total_Car']
                    const dataArray = []
                    reportUtil.getGoalStatistic(result.data[1], getGoalTime, dataArray, totalCars)
                    daysingleResult.goalData = dataArray[0] 
                } else if (storesLength > 1) {

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
    daysingleResult.singleDay = singleDay
} 

module.exports = {
    generateDayReport
}