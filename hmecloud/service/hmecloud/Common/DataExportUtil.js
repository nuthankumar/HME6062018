const dateUtils = require('../Common/DateUtils')
const csvGeneration = require('../Common/CsvUtils')
const Pdfmail = require('./PDFUtils')

const prepareJsonForExport = (storeData, input, csvInput, callback) => {
  let storeDataList = []

  let format = input.ReportTemplate_Format
  storeData.forEach(item => {
    let store = {}

    if (item.StoreDate.includes('Total')) {
      store.Stores = item.StoreDate
    } else {
      store.Day = dateUtils.convertmmddyyyy(item.StoreDate)
    }
    if (input.ReportTemplate_StoreIds.length > 1) {
      store.Groups = item.GroupName
      if (item.StoreDate.includes('Total')) {
        store.Stores = item.StoreDate
      } else {
        store.Stores = item.StoreNo
      }
    }

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
    let output = {}
    if (result) {
      output.data = input.UserEmail
      output.status = true
    } else {
      output.data = input.UserEmail
      output.status = false
    }

    callback(output)
  })
}

const JsonForPDF = (data, input, reportName, pdfInput, isMultiStore) => {
  data.reportName = reportName
  let isEmailSent = false
  data.storeDetails = data.timeMeasureType
  if (isMultiStore) {
    isEmailSent = Pdfmail.mutipleStore(data, pdfInput)
  } else {
    isEmailSent = Pdfmail.singleStore(data, pdfInput)
  }
  return isEmailSent
}

module.exports = {
  prepareJsonForExport,
  JsonForPDF
}
