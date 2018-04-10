const dateUtils = require('../Common/DateUtils')
// This function is used to Prepare Store Details
const  prepareStoreDetails = (daysingleResult, storeData, input) => {
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

// This function is used to prepare Longest details for Day Report
const prepareLongestTimes = (daysingleResult, longestData, format) =>{
    let LongestTimes = []
    // console.log("The length=====$$$$$$$$" + JSON.stringify(longestData))
    longestData.forEach(item => {
      //  if (tempEventDetails.EventType_Name.includes(messages.EventName.MENU)) {
       // }
    })
    return daysingleResult
}

module.exports = {
    prepareStoreDetails,
    prepareLongestTimes
}