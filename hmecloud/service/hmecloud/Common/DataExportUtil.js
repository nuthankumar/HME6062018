const dateUtils = require('../Common/DateUtils')
const CSVGeneration = require('../Common/CsvUtils')
const Pdfmail = require('./PDFUtils')
const moment = require('moment')
const _ = require('lodash')

const singleStore = (deviceDetails, reportType, input, eventHeaders, format, csvInput, callback) => {
  let storeDeviceDetails = []
  eventHeaders = [...eventHeaders, 'Total Cars']
  if (reportType.reportName !== 'rawcardata') {
    _.forEach(deviceDetails, (item, key) => {
      let deviceInfo = {}
      // Week Report
      if (reportType.reportName === 'week') {
        if (item.StoreNo === 'Total Week') {
          deviceInfo.Week = 'Total Week'
        } else if (input.body.deviceIds.length === 1) {
          deviceInfo.Week = moment(item.WeekStartDate).format('MM/DD/YYYY') + '-' + moment(item.WeekEndDate).format('MM/DD/YYYY')
          if (item.Week) {
            deviceInfo.Week = item.Week.timeSpan + ' ' + item.Week.currentWeekpart
          }
        }
      }
      // Daypart Report
      if (reportType.reportName === 'daypart') {
        if (item.StoreNo === 'Total Daypart') {
          deviceInfo.Daypart = 'Total Daypart'
        } else if (input.body.deviceIds.length === 1) {
          deviceInfo.Daypart = moment(item.StoreDate).format('MM/DD/YYYY')
          if (item.Daypart) {
            deviceInfo.Daypart = item.Daypart.timeSpan + ' ' + item.Daypart.currentWeekpart
          }
        }
      }
      // Day Report
      if (reportType.reportName === 'day') {
        if (item.StoreNo === 'Total Day') {
          deviceInfo.Day = 'Total Day'
        } else if (input.body.deviceIds.length === 1) {
          deviceInfo.Day = moment(item.StoreDate).format('MM/DD/YYYY')
          if (item.Day) {
            deviceInfo.Day = item.Day.timeSpan + ' ' + item.Day.currentWeekpart
          }
        }
      }
      _.forEach(eventHeaders, (value, key) => {
        if (item[`${value}`] !== null || item[`${value}`] !== 'N/A') {
          if (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) !== '0 seconds' && dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) !== null) {
            deviceInfo[`${value}`] = (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format))
          } else {
            deviceInfo[`${value}`] = ''
          }
        } else {
          deviceInfo[`${value}`] = ''
        }
        if (value === 'Total Cars') {
          deviceInfo['Total Cars'] = item['Total Cars'].value !== null ? item['Total Cars'].value : ''
        }
      })
      storeDeviceDetails.push(deviceInfo)
    })
  } else {
    storeDeviceDetails = deviceDetails
  }
  csvInput.reportinput = storeDeviceDetails
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

const mutipleStore = (deviceDetails, reportType, input, eventHeaders, format, csvInput, callback) => {
  let storeDeviceDetails = []
  eventHeaders = [...eventHeaders, 'Total Cars']
  let rcd = []
  _.map(deviceDetails, (item) => {
    _.map(item.data, (deviceValues) => {
      storeDeviceDetails.push(deviceValues)
    })
  })
  // Week
  if (storeDeviceDetails && storeDeviceDetails.length > 0) {
    _.forEach(storeDeviceDetails, (item, key) => {
      let deviceInfo = {}
      if (reportType.reportName === 'week') {
        let groupname = null
        if (item.WeekStartDate && item.WeekStartDate.value !== undefined) {
          deviceInfo.Week = moment(item.WeekStartDate.value).format('L') + '-' + moment(item.WeekEndDate.value).format('L')
        }
        if (item.Groups && item.Groups.value === 'null') {
          groupname = ''
        } else {
          groupname = item.Groups ? item.Groups.value : ''
        }
        deviceInfo.Groups = groupname
        deviceInfo.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo && item.StoreNo.value === 'Total Week') {
          deviceInfo.Groups = 'Total Week'
          deviceInfo.Stores = ''
        } else if (item.StoreNo && item.StoreNo.value === 'Subtotal') {
          deviceInfo.Groups = groupname
          deviceInfo.Stores = item.StoreNo.value
        }
      }
      // Daypart
      if (reportType.reportName === 'daypart') {
        let groupname = null
        if (item.StoreDate && item.StoreDate.value !== undefined) {
          deviceInfo.Daypart = moment(item.StoreDate.value).format('L')
        }
        if (item.Groups && item.Groups.value === 'null') {
          groupname = ''
        } else {
          groupname = item.Groups ? item.Groups.value : ''
        }
        deviceInfo.Groups = groupname
        deviceInfo.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo && item.StoreNo.value === 'Total Daypart') {
          deviceInfo.Groups = 'Total Daypart'
          deviceInfo.Stores = ''
        } else if (item.StoreNo && item.StoreNo.value === 'Subtotal') {
          deviceInfo.Groups = groupname
          deviceInfo.Stores = item.StoreNo.value
        }
      }
      // // Day
      if (reportType.reportName === 'day') {
        let groupname = null
        if (item.StoreDate && item.StoreDate.value !== undefined) {
          deviceInfo.Day = moment(item.StoreDate.value).format('L')
        }
        if (item.Groups && item.Groups.value === 'null') {
          groupname = ''
        } else {
          groupname = item.Groups ? item.Groups.value : ''
        }
        deviceInfo.Groups = groupname
        deviceInfo.Stores = item.StoreNo.value ? item.StoreNo.value : ''
        if (item.StoreNo.value && item.StoreNo.value === 'Total Day') {
          deviceInfo.Groups = 'Total Day'
          deviceInfo.Stores = ''
        } else if (item.StoreNo.value && item.StoreNo.value === 'Subtotal') {
          deviceInfo.Groups = groupname
          deviceInfo.Stores = item.StoreNo.value
        }
      }
      _.forEach(eventHeaders, (value, key) => {
        if (item[`${value}`] !== null || item[`${value}`] !== 'N/A') {
          if (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) !== '0 seconds' && dateUtils.convertSecondsToMinutes(item[`${value}`].value, format) !== null) {
            deviceInfo[`${value}`] = (dateUtils.convertSecondsToMinutes(item[`${value}`].value, format))
          } else {
            deviceInfo[`${value}`] = ''
          }
        } else {
          deviceInfo[`${value}`] = ''
        }
        if (value === 'Total Cars') {
          deviceInfo['Total Cars'] = item['Total Cars'].value !== null ? item['Total Cars'].value : ''
        }
      })
      rcd.push(deviceInfo)
    })
  }
  csvInput.reportinput = rcd
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

const generateCSVReport = (results, input, csvInput, reportType, eventHeaders, callback) => {
  let format = input.body.format
  let reportDetails
  if (input.body.deviceIds.length === 1) {
    if (reportType.reportName === 'rawcardata') {
      reportDetails = results
    } else {
      reportDetails = results[0].data
    }
    singleStore(reportDetails, reportType, input, eventHeaders, format, csvInput, result => {
      callback(result)
    })
  } else {
    reportDetails = results
    mutipleStore(reportDetails, reportType, input, eventHeaders, format, csvInput, result => {
      callback(result)
    })
  }
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
