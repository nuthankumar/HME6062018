const dateUtils = require('../Common/DateUtils')

const prepareJsonForExport = (storeData, input, csvInput) => {

    let storeDataList = []
    let store = {}
    let format = input.ReportTemplate_Format
    storeData.forEach(item => {
        console.log("Item", item.StoreDate)
        store.storeDate = dateUtils.convertmmddyyyy(item.StoreDate)
        store['Menu Board'] = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
        store.Greet = dateUtils.convertSecondsToMinutes(item.Greet, format)
        store.Service = dateUtils.convertSecondsToMinutes(item.Service, format)
        store['Lane Queue'] = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
        store['Lane Total'] = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
        store['Total_Car'] = dateUtils.convertSecondsToMinutes(item['Total_Car'], format)
        storeDataList.push(store)
    })
    csvInput.reportinput = storeDataList

    csvGeneration.generateCsvAndEmail(csvInput, result => {
        if (result) {
            output.data = input.UserEmail
            output.status = true
        } else {
            output.data = input.UserEmail
            output.status = false
        }

        callBack(output)
    }) 
   
}

module.exports = {
        prepareJsonForExport
    }

