const fs = require('fs')
const moment = require('moment')
const PdfBuffer = require('dynamic-html-pdf')
const mail = require('../Common/EmailUtil')
const path = require('path')
const _ = require('lodash')

const mutipleStore = (reportData, pdfInput, callback) => {
  let reportName
  let goalEvents
  let mainEvents
  if (reportData.timeMeasure === 3) {
    reportName = 'Weekly Report'
  } else if (reportData.timeMeasure === 2) {
    reportName = 'Daypart Report'
  } else if (reportData.timeMeasure === 1) {
    reportName = 'Day Report'
  }
  let isEventHeader
  if (reportData.eventList && reportData.eventList.length > 0 && reportData.eventList !== undefined) {
    isEventHeader = true
    mainEvents = _.clone(reportData.eventList)
  } else {
    isEventHeader = false
  }
  let isTimeMeasureType
  let rcds = []
  if (reportData.timeMeasureType && reportData.timeMeasureType.length > 0) {
    _.forEach(reportData.timeMeasureType[0].data, (items) => {
      let storeDeviceHeaders = []
      _.forEach(reportData.eventList, (event) => {
        storeDeviceHeaders.push(items[event])
      })
      rcds.push(storeDeviceHeaders)
    })
    isTimeMeasureType = true
  } else {
    isTimeMeasureType = false
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
        mainEvents: mainEvents,
        isEventHeader: isEventHeader,
        isTimeMeasureType: isTimeMeasureType,
        storeDetails: reportData.timeMeasureType,
        deviceHeaders: rcds
      }
    }
  }
 // console.log('reports Input', JSON.stringify(document.context.details))
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
            output.data = pdfInput.email
            output.status = true
          } else {
            output.data = pdfInput.email
            output.status = false
          }
          callback(output)
        })
      }
    })
    .catch(error => {
      let output = {}
      console.log('error', error)
      output.error = error
      return output
    })
}

const singleStore = (reportData, pdfInput, callback) => {
  let reportName
  let headerName
  let storeDeviceValues = []
  let goalEvents = []
  let mainEvents = []
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
  if (reportData.LongestTimes && reportData.LongestTimes.length > 0 && reportData.LongestTimes !== undefined) {
    isLongTime = true
  } else {
    isLongTime = false
  }
  let isgoalData
  if (reportData.goalData && reportData.goalData.length > 0 && reportData.goalData !== undefined) {
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
  let isEventHeader
  if (reportData.eventList && reportData.eventList.length > 0 && reportData.eventList !== undefined) {
    isEventHeader = true
    goalEvents = _.clone(reportData.eventList)
    mainEvents = _.clone(reportData.eventList)
    _.forEach(goalEvents, (item, index) => {
      if (goalEvents[index] === 'Week' || goalEvents[index] === 'Day'||goalEvents[index] === 'Daypart' ||goalEvents[index] === 'Total Cars' ) {
        goalEvents.splice(index, 1)
      }
    })
  } else {
    isEventHeader = false
  }
  let isTimeMeasureType
  let rcds = []
  if (reportData.timeMeasureType && reportData.timeMeasureType.length > 0) {
    _.forEach(reportData.timeMeasureType[0].data, (items) => {
      let storeDeviceHeaders = []
      _.forEach(reportData.eventList, (event) => {
        storeDeviceHeaders.push(items[event])
      })
      rcds.push(storeDeviceHeaders)
    })
    isTimeMeasureType = true
  } else {
    isTimeMeasureType = false
  }

  const document = {
    type: 'buffer',
    template: html,
    context: {
      details: {
        reportName: headerName,
        storeName: reportData.storeName,
        storeDesc: reportData.storeDesc,
        startTime: reportData.startTime,
        stopTime: reportData.stopTime,
        printDate: reportData.printDate,
        reportPrintTime: reportData.printTime,
        isTimeMeasureType: isTimeMeasureType,
        deviceDetails: reportData.timeMeasureType[0].data,
        deviceHeaders: rcds,
        devicevalues: storeDeviceValues,
        eventHeaders: mainEvents,
        isEventHeader: isEventHeader,
        isLongTime: isLongTime,
        longTime: reportData.LongestTimes,
        isgoalData: isgoalData,
        goalData: reportData.goalData,
        goalEvents: goalEvents,
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
        console.log('Buffer', attachment[0].content)
        mail.send(pdfInput.email, pdfInput.subject, attachment, isMailSent => {
          let output = {}
          if (isMailSent) {
            console.log('success')
            output.data = pdfInput.email
            output.status = true
          } else {
            console.log('fail')
            output.data = pdfInput.email
            output.status = false
          }
          callback(output)
        })
      }
    })
    .catch(error => {
      console.log('error', error)
      let output = {}
      output.error = error
      return output
    })
}

module.exports = {
  singleStore, mutipleStore
}
