const dateUtils = require('../Common/DateUtils')



const generateDayReport = (input, callBack) => {
    console.log("Day Report controller invoked")
    let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
    
    let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
    const datReportqueryTemplate = {
        ReportTemplate_StoreIds: input.ReportTemplate_StoreIds,
        ReportTemplate_From_Date: input.ReportTemplate_From_Date,
        ReportTemplate_To_Date: input.ReportTemplate_To_Date,
        fromDateTime: fromDateTime,
        toDateTime: toDateTime,
        ReportTemplate_Type: input.CarDataRecordType_ID,
        ReportType: input.ReportTemplate_Type,
        LaneConfig_ID: 1
    }

    console.log("The put values===" + JSON.stringify(datReportqueryTemplate))

    /*if (input !== null) {
        stores.generateSummaryReport(input, result => {
            if (result.status === true) {
                callBack(result)
            } else {
                callBack(result)
            }
        })
    } else {
        callBack(messages.CREATEGROUP.invalidRequestBody)
    }*/
}
module.exports = {
    generateDayReport
}