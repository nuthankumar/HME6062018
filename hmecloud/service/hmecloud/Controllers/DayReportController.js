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
                if (storesLength === 1) {
                    reportUtil.prepareStoreDetails(daysingleResult, result.data[3], input)
                    let colors = result.data[4]
                    let goalstatisticsDetails = result.data[2]
                    let goalSettings = _.filter(goalstatisticsDetails, group => group['Menu Board - GoalA'])
                    prepareDayResults(daysingleResult, result.data[0], input.ReportTemplate_Format, colors, goalSettings);
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
                    //Colours
                    let colors = result.data[4]
                    let goalstatisticsDetails = result.data[2]
                    prepareMultiStoreResults(daysingleResult, result.data[0], input.ReportTemplate_Format, colors, goalstatisticsDetails)

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
function prepareMultiStoreResults(daysingleResult, daysData, format, colors, goalSettings) {
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
            let tempRawCarData = dayResultsList[0]
            multiStoreObj.title = tempRawCarData.StoreDate
            for (let i = 0; i < dayResultsList.length; i++) {
                let storeObj = dayResultsList[i]
                let store = {}

                if (item.StoreDate !== 'Total Day') {
                    let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)
                    store.name = storeObj.StoreNo
                    dataObject.store = store

                    tempData.push(dataObject)
                } else {
                    let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)
                    store.name = storeObj.StoreNo
                    store.timeSpan = "W-Avg"
                    dataObject.store = store

                    tempData.push(dataObject)
                }
            }
            multiStoreObj.data = tempData
            timeMeasure.push(multiStoreObj)
            dayIndexIds.set(dayIndexId, dayIndexId)
        }
        
        
    })

    daysingleResult.timeMeasureType = timeMeasure
}

function prepareDayObject(item, format, colors, goalSettings) {
    let menu = {}
    let greet = {}
    let service = {}
    let laneQueue = {}
    let laneTotal = {}
    let totalCars = {}
    let dataObject = {}
    let groupId = {}
    let storeId = {}

    groupId.value = item.GroupName
    dataObject.groupId = groupId

    storeId.value = item.Store_ID
    dataObject.storeId = storeId

    menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
    menu.color = reportUtil.getColourCode('Menu Board', item['Menu Board'], colors, goalSettings)
    dataObject.menu = menu

    greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
    greet.color = reportUtil.getColourCode('Greet', item.Greet, colors, goalSettings)
    dataObject.greet = greet

    service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
    service.color = reportUtil.getColourCode('Service', item.Service, colors, goalSettings)
    dataObject.service = service

    laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
    laneQueue.color = reportUtil.getColourCode('Lane Queue', item['Lane Queue'], colors, goalSettings)
    dataObject.laneQueue = laneQueue

    laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
    laneTotal.color = reportUtil.getColourCode('Lane Total', item['Lane Total'], colors, goalSettings)
    dataObject.laneTotal = laneTotal

    totalCars.value = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
    dataObject.totalCars = totalCars

    return dataObject
}

// This function is used to Prepare the Day details

function prepareDayResults(daysingleResult, dayData, format, colors, goalSettings) {
    let singleDay = []
    let dataList = []
    let dayDataObj = {}
   
    dayData.forEach(item => {
        
        if (item.StoreDate !== 'Total Day') {
            let dataObject = prepareDayObject(item, format, colors, goalSettings)
            dataObject.day = item.StoreDate
            dataObject.timeSpan = "OPEN - CLOSE"
            dataList.push(dataObject)
        } else {
            let dataObject = prepareDayObject(item, format, colors, goalSettings)
            dataObject.day = item.StoreDate
            dataObject.timeSpan = "W-Avg"
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