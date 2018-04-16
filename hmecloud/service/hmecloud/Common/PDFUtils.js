const fs = require('fs')
const moment = require('moment')
const PdfBuffer = require('dynamic-html-pdf')
const mail = require('../Common/EmailUtil')

const mutipleStore = (reportData,pdfInput, callback) => {
  const html = fs.readFileSync(__dirname + '/MultipleStore.html', 'utf8')
  const reportName = reportData.reportName
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
        printDate: moment().format('LL'),
        reportPrintTime: moment().format('LT'),
        storeDetails: reportData.storeDetails
      }
    }
  }
  PdfBuffer.create(document, options)
    .then(response => {
      if (response) {
        console.log(response)
        const attachment = [{
          filename: reportName + '.pdf',
          contents: response.toString('base64'),
          contentType: 'application/pdf; charset=ISO-8859-1'
        }]
        mail.send('jayaramv@nousinfo.com', pdfInput.subject, attachment, isMailSent => {
          let output = {}
          if (isMailSent) {
            output.status = true
            return output
          } else {
            output.status = false
            return output
          }
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
      console.log(response)
      if (response) {
        var attachment = [{
          filename: reportData.reportName + '.pdf',
          contents: response.toString('base64'),
          contentType: 'application/pdf; charset=ISO-8859-1'
        }]
        mail.send(pdfInput.email, pdfInput.subject, attachment, isMailSent => {
          let output = {}
          if (isMailSent) {
            output.status = true
            return output
          } else {
            output.status = false
            return output
          }
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
