const fs = require('fs')
const moment = require('moment')
const PdfBuffer = require('dynamic-html-pdf')
const mail = require('../Common/EmailUtil')
const path = require('path')
const _ = require('lodash')

const mutipleStore = (reportData, pdfInput, input, callback) => {
  let reportName
  let eventLength
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
    eventLength = reportData.eventList.length - 4
  } else {
    isEventHeader = false
  }
  let isTimeMeasureType
  let rcds = []
  if (reportData.timeMeasureType && reportData.timeMeasureType.length > 0) {
    _.forEach(reportData.timeMeasureType, (item) => {
      let storeDeviceHeaders = []
      _.forEach(item.data, (details) => {
        let deviceDetails = []
        _.forEach(reportData.eventList, (event) => {
          if (event === 'Total Cars') {
            let totalcar = {'totalcar': details['Total Cars'].value}
            deviceDetails.push(totalcar)
          } else if (event === 'Groups') {
            let groups = {'groups': details['Groups']}
            deviceDetails.push(groups)
          } else if (event === 'Stores') {
            let Stores = {'Stores': details['Stores'].value}
            deviceDetails.push(Stores)
          } else {
            deviceDetails.push(details[event])
          }
        })
        storeDeviceHeaders.push(deviceDetails)
      })
      rcds.push(storeDeviceHeaders)
    })
    isTimeMeasureType = true
  } else {
    isTimeMeasureType = false
  }
  let Headers = []
  if (reportData.eventList && reportData.eventList.length > 0 && reportData.eventList !== undefined) {
    for (let i = 0; i < reportData.timeMeasureType.length; i++) {
      Headers.push(reportData.eventList)
    }
  } else {
    Headers = []
  }
  let titles = []
  if (reportData.timeMeasureType && reportData.timeMeasureType.length > 0) {
    _.forEach(reportData.timeMeasureType, (item) => {
      let deviceTitles = {}
      _.forEach(item, (value, key) => {
        if (key === 'title') {
          deviceTitles.title = value
        }
      })
      titles.push(deviceTitles)
    })
    isTimeMeasureType = true
  } else {
    isTimeMeasureType = false
  }
  let mainData = []
  let timeFormat
  input.format === 2 ? timeFormat = ' (min:sec)' : timeFormat = ' (sec)'
  for (let i = 0; i < reportData.timeMeasureType.length; i++) {
    let temp = []
    temp.push({headers: Headers[i]})
    temp.push({rcds: rcds[i]})
    temp.push({title: titles[i]})
    temp.push({eventHeaders: {'headerslength': eventLength}})
    temp.push({timeFormat: {'format': timeFormat}})
    mainData.push(temp)
  }

  const html = fs.readFileSync(__dirname + '/MultipleStore.html', 'utf8')
  const options = {
    format: 'Letter',
    orientation: 'landscape',
    border: '4mm',
    paginationOffset: 1,
    footer: {
      height: '10mm'
    }
  }
  const document = {
    type: 'buffer',
    template: html,
    context: {
      details: {
        reportName: reportName,
        startTime: reportData.startTime,
        stopTime: reportData.endTime,
        printDate: moment().format('ll'),
        reportPrintTime: reportData.localTime,
        isEventHeader: isEventHeader,
        isTimeMeasureType: isTimeMeasureType,
        events: mainData,
        titles: titles,
        headers: Headers,
        deviceHeaders: rcds,
        goalsEventLength: eventLength,
        timeFormat: timeFormat
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
      output.error = error
      return output
    })
}

const singleStore = (reportData, pdfInput, input, callback) => {
  let reportName
  let headerName
  let eventLength
  let storeDeviceValues = []
  let goalEvents = []
  let mainEvents = []
  if (reportData.timeMeasure === 3) {
    reportName = 'Weekly Report'
    headerName = 'WEEK'
  } else if (reportData.timeMeasure === 2) {
    reportName = 'Daypart Report'
    headerName = 'DAYPART'
  } else if (reportData.timeMeasure === 1) {
    reportName = 'Day Report'
    headerName = 'DAY'
  }
  var html = fs.readFileSync(__dirname + '/SingleStore.html', 'utf8')
  var options = {
    format: 'Letter',
    orientation: 'landscape',
    border: '4mm',
    paginationOffset: 1,
    footer: {
      height: '10mm'
    }
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
    eventLength = reportData.eventList.length - 3
    _.forEach(goalEvents, (item, index) => {
      if (goalEvents[index] === 'Week' || goalEvents[index] === 'Day' || goalEvents[index] === 'Daypart' || goalEvents[index] === 'Total Cars') {
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
        if (event === 'Total Cars') {
          let totalcar = {'totalcar': items['Total Cars'].value}
          storeDeviceHeaders.push(totalcar)
        }
        storeDeviceHeaders.push(items[event])
      })
      rcds.push(storeDeviceHeaders)
    })
    isTimeMeasureType = true
  } else {
    isTimeMeasureType = false
  }
  let goalsHeaders = []
  if (reportData.goalData && reportData.goalData.length > 0) {
    _.forEach(reportData.goalData, (events) => {
      let goals = {}
      let goal = {}
      _.forEach(events, (value, key) => {
        if (key !== 'title' && key !== 'color') {
          goals[`${key}`] = value
        } else {
          if (input.format === 1 && key === 'title') {
            goal[`${key}`] = value + ' (sec)'
          } else if (input.format === 2 && key === 'title') {
            goal[`${key}`] = value + ' (min:sec)'
          } else {
            goal[`${key}`] = value
          }
        }
      })
      goal['events'] = goals
      goalsHeaders.push(goal)
    })
  } else {
    goalsHeaders = []
  }
  let timeFormat
  input.format === 2 ? timeFormat = ' (min:sec)' : timeFormat = ' (sec)'
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
        printDate: moment().format('ll'),
        reportPrintTime: reportData.localTime,
        isTimeMeasureType: isTimeMeasureType,
        deviceDetails: reportData.timeMeasureType[0].data,
        deviceHeaders: rcds,
        devicevalues: storeDeviceValues,
        eventHeaders: mainEvents,
        isEventHeader: isEventHeader,
        isLongTime: isLongTime,
        longTime: reportData.LongestTimes,
        isgoalData: isgoalData,
        goalData: goalsHeaders,
        goalEvents: goalEvents,
        goalHeaders: goalsHeaders,
        isSystemStatistics: isSystemStatistics,
        systemStatistics: reportData.systemStatistics,
        goalsEventLength: eventLength,
        timeFormat: timeFormat
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
      output.error = error
      return output
    })
}

module.exports = {
  singleStore, mutipleStore
}
