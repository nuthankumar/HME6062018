const dateUtils = require('../Common/DateUtils')
const stores = require('../Repository/StoresRepository')
const reportUtil = require('../Common/ReportGenerateUtils')



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
        ReportTemplate_Type: input.CarDataRecordType_ID
    }


    if (input !== null) {
        let daysingleResult = {}
        stores.getDayDataReport(datReportqueryTemplate, result => {
            if (result.status === true) {
                // Preparing Single Store results
                if (storesLength === 1) {
                    reportUtil.prepareStoreDetails(daysingleResult, result.data[3], input)
                   // prepareDayResults(daysingleResult, result.data[0]);
                    reportUtil.prepareLongestTimes(daysingleResult, result.data[1], input.ReportTemplate_Format)
                    //prepareGoalsStatistics(daysingleResult, result.data[1])
                   // console.log("The Store response===" + JSON.stringify(daysingleResult))
                } else if (storesLength > 1) {

                } 
                callBack(result)
            } else {
                callBack(result)
            }
        })
    } else {
        callBack(messages.CREATEGROUP.invalidRequestBody)
    }
}




// This function is used to Prepare the Day details

function prepareDayResults(daysingleResult, dayData) {
    let singleDay = []
    let dataList = []
    let dataObject = {}
    dayData.forEach(item => {
        dataObject.Day = dateUtils.convertmmddyyyy(item.StoreDate)
        dataObject.TimeSpan = "OPEN - CLOSE"
       // if (item.)
    })
} 

module.exports = {
    generateDayReport
}