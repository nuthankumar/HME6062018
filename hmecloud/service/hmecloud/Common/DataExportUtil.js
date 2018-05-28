const dateUtils = require('../Common/DateUtils')
const CSVGeneration = require('../Common/CsvUtils')
const Pdfmail = require('./PDFUtils')
const moment = require('moment')
const _ = require('lodash')

const generateCSVReport = (results, input, csvInput, reportType, eventHeaders, callback) => {
  let storeDataList = []
  let format = input.body.format
  let reportDetails
  if (reportType.reportName === 'rawcardata') {
    reportDetails = results
  } else {
    if (results && results.length > 0) {
      reportDetails = results[0].data
    }
  }
  _.forEach(reportDetails, (item, key) => {
    let store = {}
    // Week
    if (reportType.reportName === 'week') {
      if (item.StoreNo === 'Total Week') {
        store.Week = 'Total Week'
      } else if (input.body.deviceIds.length === 1) {
        store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
        if (item.Week) {
          store.Week = item.Week.timeSpan + ' ' + item.Week.currentWeekpart
        }
      } else if (input.body.deviceIds.length > 1) {
        store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
        store.Groups = item.Groups.value ? item.Groups.value : ''
        store.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo.value === 'Total Week') {
          store.Groups = 'Total Week'
          store.Stores = ''
        } else if (item.StoreNo.value === 'Subtotal') {
          store.Groups = item.Groups.value
          store.Stores = item.StoreNo.value
        } else {
          store.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
        }
      }
    }
    // Daypart
    if (reportType.reportName === 'daypart') {
      if (item.StoreNo === 'Total Daypart') {
        store.Daypart = 'Total Daypart'
      } else if (input.body.deviceIds.length === 1) {
        store.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
        if (item.Daypart) {
          store.Daypart = item.Daypart.timeSpan + ' ' + item.Daypart.currentWeekpart
        }
      } else if (input.body.deviceIds.length > 1) {
        store.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
        store.Groups = item.Groups.value ? item.Groups.value : ''
        store.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo.value === 'Total Daypart') {
          store.Groups = 'Total Daypart'
          store.Stores = ''
        } else if (item.StoreNo.value === 'SubTotal') {
          store.Groups = item.Groups.value
          store.Stores = item.StoreNo.value
        }
      }
    }
    // Day
    if (reportType.reportName === 'day') {
      if (item.StoreNo === 'Total Day') {
        store.Day = 'Total Day'
      } else if (input.body.deviceIds.length === 1) {
        store.Day = moment(item.StoreDate).format('MM/DD/YYYY')
        if (item.Day) {
          store.Day = item.Day.timeSpan + ' ' + item.Day.currentWeekpart
        }
      } else if (input.body.deviceIds.length > 1) {
        store.Day = moment(item.StoreDate).format('MM/DD/YYYY')
        store.Groups = item.Groups.value ? item.Groups.value : ''
        store.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo.value === 'Total Day') {
          store.Groups = 'Total Day'
          store.Stores = ''
        } else if (item.StoreNo.value === 'Subtotal') {
          store.Groups = item.Groups.value
          store.Stores = item.StoreNo.value
        }
      }
    }
    if (reportType.reportName !== 'rawcardata') {
      _.forEach(eventHeaders, (value, key) => {
        if (item[`${value}`] !== null && item[`${value}`] !== 'N/A') {
          store[`${value}`] = (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) === 'N/A' ? '' : dateUtils.convertSecondsToMinutes(item[`${value}`].value, format))
        }
      })
    }
    if (reportType.reportName === 'rawcardata') {
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
  generateCSVReport,
  JsonForPDF
}
