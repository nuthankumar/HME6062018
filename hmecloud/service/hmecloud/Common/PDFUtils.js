const fs = require('fs')
const moment = require('moment')
const PdfBuffer = require('dynamic-html-pdf')

const mutipleStore = (reportData, callback) => {
  const html = fs.readFileSync(__dirname + '/Multiple.html', 'utf8')
  const options = {
    format: 'Letter',
    orientation: 'landscape',
    border: '4mm',
    paginationOffset: 1
  }
  const document = {
    type: 'buffer',
    template: html,
    context: {
      details: {
        reportName: reportData.reportName,
        startTime: reportData.startTime,
        stopTime: reportData.stopTime,
        printDate: moment().format('LL'),
        reportPrintTime: moment().format('LT'),
        storeDetails: reportData.storeDetails
      }
    }
  }
  PdfBuffer.create(document, options)
    .then(response => {
      callback(response)
    })
    .catch(error => {
      callback(response)
    })
}

const singleStore = (reportData, callback) => {
  var html = fs.readFileSync(__dirname + '/SingleStore.html', 'utf8')
  var options = {
    format: 'Letter',
    orientation: 'landscape',
    border: '4mm',
    paginationOffset: 1
  }
  let isLongTime
  if (reportData.LongestTimes && reportData.LongestTimes.length > 0) {
    isLongTime = true
  } else {
    isLongTime = false
  }
  let isgoalData
  if (reportData.goalData && reportData.goalData.length > 0) {
    isgoalData = true
  } else {
    isgoalData = false
  }
  let isSystemStatistics
  if (reportData.systemStatistics) {
    isSystemStatistics = true
  } else {
    isSystemStatistics = false
  }

  var document = {
    type: 'buffer',
    template: html,
    context: {
      details: {
        reportName: reportData.reportName,
        storeName: reportData.storeName,
        storeDesc: reportData.storeDesc,
        startTime: reportData.startTime,
        stopTime: reportData.stopTime,
        printDate: moment().format('LL'),
        reportPrintTime: moment().format('LT'),
        storeDetails: reportData.timeMeasureType,
        isLongTime: isLongTime,
        longTime: reportData.LongestTimes,
        isgoalData: isgoalData,
        goalData: reportData.goalData,
        isSystemStatistics: isSystemStatistics,
        systemStatistics: reportData.systemStatistics
      }
    }
  }
  PdfBuffer.create(document, options)
    .then(response => {
      callback(response)
    })
    .catch(error => {
      callback(response)
    })
}

module.exports = {
  singleStore, mutipleStore
}
