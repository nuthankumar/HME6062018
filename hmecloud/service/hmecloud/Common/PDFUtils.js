const fs = require('fs')
const moment = require('moment')
const PdfBuffer = require('dynamic-html-pdf')
const mail = require('../Common/EmailUtil')
const path = require('path')

const mutipleStore = (reportData, pdfInput, callback) => {
  let reportName
  if (reportData.timeMeasure === 3) {
    reportName = 'Weekly Report'
  } else if (reportData.timeMeasure === 2) {
    reportName = 'Daypart Report'
  } else if (reportData.timeMeasure === 1) {
    reportName = 'Day Report'
  }
  const html = fs.readFileSync(__dirname + '/MultipleStore.html', 'utf8')
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
        reportName: reportName,
        startTime: reportData.startTime,
        stopTime: reportData.stopTime,
        printDate: moment().format('ll'),
        reportPrintTime: moment().format('LT'),
        storeDetails: reportData.storeDetails
      }
    }
  }

  PdfBuffer.create(document, options)
    .then(response => {
      if (response) {
        const attachment = [{
          filename: reportName + '.pdf',
          content: Buffer.from(response, 'base64'),
          contentType: 'application/pdf'
        }]
        mail.send(pdfInput.email, pdfInput.subject, attachment, isMailSent => {
          let output = {}
          if (isMailSent) {
            output.key = 'pleasecheckemailreport' + ' ' + pdfInput.email
            output.status = true
          } else {
            output.key = 'sendMailFails' + ' ' + pdfInput.email
            output.status = false
          }
          callback(output)
        })
      }
    })
    .catch(error => {
      let output = {}
      output.error = error
      return output
    })
}

const singleStore = (reportData, pdfInput, callback) => {
  let reportName
  let headerName
  if (reportData.timeMeasure === 3) {
    reportName = 'Weekly Report'
    headerName = 'Week'
  } else if (reportData.timeMeasure === 2) {
    reportName = 'Daypart Report'
    headerName = 'Daypart'
  } else if (reportData.timeMeasure === 1) {
    reportName = 'Day Report'
    headerName = 'Day'
  }
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
        reportName: headerName,
        storeName: reportData.storeName,
        storeDesc: reportData.storeDesc,
        startTime: reportData.startTime,
        stopTime: reportData.stopTime,
        printDate: moment().format('ll'),
        reportPrintTime: moment().format('LT'),
        storeDetails: reportData.storeDetails,
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
      if (response) {
        const attachment = [{
          filename: reportName + '.pdf',
          content: Buffer.from(response, 'base64'),
          contentType: 'application/pdf'
        }]
        mail.send(pdfInput.email, pdfInput.subject, attachment, isMailSent => {
          let output = {}
          if (isMailSent) {
            output.key = 'pleasecheckemailreport' + ' ' + pdfInput.email
            output.status = true
          } else {
            output.key = 'sendMailFails' + ' ' + pdfInput.email
            output.status = false
          }
          callback(output)
        })
      }
    })
    .catch(error => {
      let output = {}
      output.error = error
      return output
    })
}

module.exports = {
  singleStore, mutipleStore
}
