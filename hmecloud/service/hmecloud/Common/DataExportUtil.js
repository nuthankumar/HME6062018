const dateUtils = require('../Common/DateUtils')
const CSVGeneration = require('../Common/CsvUtils')
const Pdfmail = require('./PDFUtils')
const moment = require('moment')
const _ = require('lodash')

const generateCSVReport = (results, input, csvInput, reportType, eventHeaders, callback) => {
  let storeDataList = []
  let format = input.body.format
  let reportDetails
  if (reportType === 'rawcardata') {
    reportDetails = results
  } else {
    if (results && results.length > 0) {
      reportDetails = results[0].data
    }
  }
  _.forEach(reportDetails, (item, key) => {
    let store = {}
    // Week
    if (reportType === 'week') {
      if (item.StoreNo === 'Total Week') {
        store.Week = 'Total Week'
      } else if (input.body.deviceIds.length === 1) {
        store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
      } else if (input.body.deviceIds.length > 1) {
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
      } else if (input.body.deviceIds.length === 1) {
        store.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
      } else if (input.body.deviceIds.length > 1) {
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
      } else if (input.body.deviceIds.length === 1) {
        store.Day = moment(item.StoreDate).format('MM/DD/YYYY')
      } else if (input.body.deviceIds.length > 1) {
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
    if (reportType !== 'rawcardata') {
      _.forEach(eventHeaders, (value, key) => {
        if (item[`${value}`] !== null) {
          store[`${value}`] = (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item[`${value}`].value, format))
        }
      })
    }
    if (reportType === 'rawcardata') {
      _.forEach(reportDetails[key], (value, key) => {
        store[`${key}`] = `${value}` === 'N/A' ? '' : `${value}`
      })
    }
    storeDataList.push(store)
  })
  csvInput.reportinput = storeDataList
  CSVGeneration.generateCsvAndEmail(csvInput, result => {
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
  generateCSVReport, JsonForPDF }
