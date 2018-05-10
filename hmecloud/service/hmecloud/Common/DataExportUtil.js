const dateUtils = require('../Common/DateUtils')
const csvGeneration = require('../Common/CsvUtils')
const Pdfmail = require('./PDFUtils')
const moment = require('moment')

const prepareJsonForExport = (storeData, input, csvInput, reportType, callback) => {
  let storeDataList = []
  let format = input.ReportTemplate_Format
  storeData.forEach(item => {
    let store = {}
    // Week
    if (reportType === 'week') {
      if (item.StoreNo === 'Total Week') {
        store.Week = 'Total Week'
      } else if (input.ReportTemplate_DeviceIds.length === 1) {
        store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
      } else if (input.ReportTemplate_DeviceIds.length > 1) {
        store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
        store.Groups = item.GroupName
        store.Store = item.Store_Name
        if (item.StoreNo === 'Total Week' && item.Store_Name === null) {
          store.Week = 'Total Week'
          store.Store = ''
        } else if (item.StoreNo === 'Subtotal' && item.Store_Name === null) {
          store.Week = 'Subtotal'
          store.Store = ''
        } else {
          store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
        }
      }
    }
    // Daypart
    if (reportType === 'Daypart') {
      if (item.StoreNo === 'Total Daypart') {
        store.Daypart = 'Total Daypart'
      } else if (input.ReportTemplate_DeviceIds.length === 1) {
        store.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
      } else if (input.ReportTemplate_DeviceIds.length > 1) {
        store.Groups = item.GroupName
        store.Stores = item.Store_Name
        if (item.StoreNo === 'Total Daypart') {
          store.Daypart = 'Total Daypart'
          store.Stores = ''
        } else if (item.StoreNo === 'SubTotal') {
          store.Daypart = 'SubTotal'
          store.Stores = ''
        } else {
          store.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
        }
      }
    }
    // Day
    if (reportType === 'Day') {
      if (item.StoreNo === 'Total Day') {
        store.Day = 'Total Day'
      } else if (input.ReportTemplate_DeviceIds.length === 1) {
        store.Day = moment(item.StoreDate).format('MM/DD/YYYY')
      } else if (input.ReportTemplate_DeviceIds.length > 1) {
        store.Groups = item.GroupName
        store.Stores = item.Store_Name
        if (item.StoreNo === 'Total Day') {
          store.Day = 'Total Day'
          store.Stores = ''
        } else if (item.StoreNo === 'Subtotal') {
          store.Day = 'SubTotal'
          store.Stores = ''
        } else {
          store.Day = moment(item.StoreDate).format('MM/DD/YYYY')
        }
      }
    }
    store['Menu Board'] = (dateUtils.convertSecondsToMinutes(item['Menu Board'], format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item['Menu Board'], format))
    store.Greet = (dateUtils.convertSecondsToMinutes(item.Greet, format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item.Greet, format))
    store.Service = (dateUtils.convertSecondsToMinutes(item.Service, format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item.Service, format))
    store['Lane Queue'] = (dateUtils.convertSecondsToMinutes(item['Lane Queue'], format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item['Lane Queue'], format))
    store['Lane Total'] = (dateUtils.convertSecondsToMinutes(item['Lane Total'], format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item['Lane Total'], format))
    store['Total Cars'] = (dateUtils.convertSecondsToMinutes(item['Total_Car'], format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item['Total_Car'], format))
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
