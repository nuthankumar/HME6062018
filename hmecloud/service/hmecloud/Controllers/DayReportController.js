const dateUtils = require('../Common/DateUtils')
const stores = require('../Repository/StoresRepository')
const reportUtil = require('../Common/ReportGenerateUtils')
const _ = require('lodash')
const HashMap = require('hashmap')
const messages = require('../Common/Message')
const dataExportUtil = require('../Common/DataExportUtil')
const dateFormat = require('dateformat')
const message = require('../Common/Message')

// This function is used to Generate Day Report based on the given Date Range

const generateDayReportByDate = (request, input, callback) => {
  let pageStartDate = input.ReportTemplate_From_Date
  let pageEndDate = input.ReportTemplate_To_Date
  let lastPage
  let currentPage = input.pageNumber

  if (currentPage === 0) {
    pageStartDate = input.ReportTemplate_From_Date
    pageEndDate = input.ReportTemplate_To_Date
    lastPage = 0
  } else if (input.ReportTemplate_DeviceIds.length > 1) {
    let daysDiff = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)
    lastPage = Math.ceil((daysDiff + 1) / 2)
    if (currentPage !== 1) {
      pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 2), pageStartDate)
    }
    pageEndDate = dateUtils.getAdvancedSelectionMaxDate(1, pageStartDate)
    if (pageEndDate > input.ReportTemplate_To_Date) {
      pageEndDate = pageStartDate
    }
  } else {
    let daysDiff = dateUtils.dateDifference(input.ReportTemplate_From_Date, input.ReportTemplate_To_Date)

    lastPage = Math.ceil((daysDiff + 1) / 7)
    if (currentPage !== 1) {
      pageStartDate = dateUtils.getAdvancedSelectionMaxDate(((currentPage - 1) * 7), pageStartDate)
    }
    pageEndDate = dateUtils.getAdvancedSelectionMaxDate(6, pageStartDate)
    if (pageEndDate > input.ReportTemplate_To_Date) {
      pageEndDate = input.ReportTemplate_To_Date
    }
  }
  input.ReportTemplate_From_Date = pageStartDate
  input.ReportTemplate_To_Date = pageEndDate
  generateDayReport(request, input, result => {
    let totalRecordCount = {}
    totalRecordCount.NoOfPages = lastPage
    result.totalRecordCount = totalRecordCount
    callback(result)
  })
}

const generateDayReport = (request, input, callback) => {
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)
  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)
  let storesLength = input.ReportTemplate_DeviceIds.length
  const datReportqueryTemplate = {
    ReportTemplate_DeviceIds: input.ReportTemplate_DeviceIds,
    ReportTemplate_From_Date: input.ReportTemplate_From_Date,
    ReportTemplate_To_Date: input.ReportTemplate_To_Date,
    FromDateTime: fromDateTime,
    ToDateTime: toDateTime,
    ReportTemplate_Type: input.ReportTemplate_Type,
    CarDataRecordType_ID: 11, // input.CarDataRecordType_ID
    UserUID: input.userUid

  }

  if (input !== null) {
    let daysingleResult = {}
    stores.getDayDataReport(datReportqueryTemplate, result => {
      if (result.status === true) {
        // Preparing Single Store results
        // Preparing response for CSV
        if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'csv') {
          let csvInput = {}
          csvInput.type = message.COMMON.CSVTYPE
          csvInput.reportName = message.COMMON.DAYREPORTNAME + '_' + dateFormat(new Date(), 'isoDate')
          csvInput.email = input.UserEmail
          csvInput.subject = message.COMMON.DAYREPORTTITLE + ' ' + fromDateTime + ' - ' + toDateTime + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')
          let reportType = 'Day'
          dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, reportType, csvResults => {
            callback(csvResults)
          })
        } else {
          let colors
          let goalstatisticsDetails
          daysingleResult.deviceIds = input.ReportTemplate_DeviceIds
          if (storesLength === 1) {
            reportUtil.prepareStoreDetails(daysingleResult, result.data[3], input)
            colors = result.data[4]
            goalstatisticsDetails = result.data[2]
            let goalSettings = _.filter(goalstatisticsDetails, group => group['Menu Board - GoalA'])
            prepareDayResults(daysingleResult, result.data[0], input.ReportTemplate_Format, colors, goalSettings)
            if (input.longestTime) {
              reportUtil.prepareLongestTimes(daysingleResult, result.data[1], input.ReportTemplate_Format)
            }
            let getGoalTime = result.data[5]
            const dayPartTotalObject = _.last(result.data[0])
            const totalCars = _.get(dayPartTotalObject, 'Total_Car', '0')
            let dataArray = []
            dataArray = reportUtil.getGoalStatistic(goalstatisticsDetails, getGoalTime, dataArray, totalCars, input.ReportTemplate_Format, colors)
            daysingleResult.goalData = dataArray
            if (input.systemStatistics) {
              let systemStatisticsLane
              let systemStatisticsGenral
              systemStatisticsLane = result.data[7]
              systemStatisticsGenral = result.data[6]
              if (systemStatisticsLane && systemStatisticsGenral) {
                reportUtil.prepareStatistics(daysingleResult, systemStatisticsLane, systemStatisticsGenral)
              }
            }

            if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'pdf') {
              let isMultiStore = false
              generatePDFReport(daysingleResult, input, isMultiStore)
              let output = {}
              output.data = input.UserEmail
              output.status = true
              callback(output)
            }
          } else if (storesLength > 1) {
            // Colours
            colors = result.data[4]
            goalstatisticsDetails = result.data[2]
            prepareMultiStoreResults(daysingleResult, result.data[0], input.ReportTemplate_Format, colors, goalstatisticsDetails)

            if (!_.isUndefined(input.reportType) && input.reportType.toLowerCase().trim() === 'pdf') {
              let isMultiStore = true
              generatePDFReport(daysingleResult, input, isMultiStore)
              let output = {}
              output.data = input.UserEmail
              output.status = true
              callback(output)
            }
          }

          daysingleResult.status = true
          callback(daysingleResult)
        }
      } else {
        callback(result)
      }
    })
  } else {
    callback(messages.CREATEGROUP.invalidRequestBody)
  }
}

function generatePDFReport (reportData, input, isMultiStore) {
  let pdfInput = {}
  pdfInput.type = `${message.COMMON.PDFTYPE}`
  pdfInput.reportName = `${message.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
  console.log(input)
  pdfInput.email = input.UserEmail
  pdfInput.subject = `${message.COMMON.DAYPARTREPORTTITLEPDF} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  let reportName = 'Day '
  // console.log('reportData.timeMeasureType', reportData.timeMeasureType[0].data)
  dataExportUtil.JsonForPDF(reportData, input, reportName, pdfInput, isMultiStore)
}

// This function is used to prepare the Multi Store results for Day Report
function prepareMultiStoreResults (daysingleResult, daysData, format, colors, goalSettings) {
  const dayIndexIds = new HashMap()
  let timeMeasure = []
  daysData.forEach(item => {
    let dayIndexId = item.DayID
    if (dayIndexId && !dayIndexIds.has(dayIndexId)) {
      let dayResultsList = daysData.filter(function (obj) {
        return obj.DayID === dayIndexId
      })
      let multiStoreObj = {}
      let tempData = []
      let tempRawCarData = dayResultsList[0]
      if (tempRawCarData.StoreNo !== 'Total Day') {
        multiStoreObj.title = dateUtils.convertMonthDayYear(tempRawCarData.StoreDate) + messages.COMMON.OPENVALUE + ' - ' + dateUtils.convertMonthDayYear(tempRawCarData.StoreDate) + messages.COMMON.CLOSEVALUE
      }

      for (let i = 0; i < dayResultsList.length; i++) {
        let storeObj = dayResultsList[i]

        let store = {}
        if (storeObj.StoreNo !== 'Total Day') {
          let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)

          if (storeObj.StoreNo && !storeObj.StoreNo.includes('Subtotal')) {
            store.name = storeObj.StoreNo + (storeObj.Store_Name ? ' - ' + storeObj.Store_Name : '')
            dataObject.store = store
          } else {
            store.name = ' '
            dataObject.store = store
          }
          tempData.push(dataObject)
        } else {
          let dataObject = prepareDayObject(storeObj, format, colors, goalSettings)
          let store = {}
          store.name = ' '
          dataObject.store = store
          tempData.push(dataObject)
        }
      }
      multiStoreObj.data = tempData
      timeMeasure.push(multiStoreObj)
      dayIndexIds.set(dayIndexId, dayIndexId)
    }
  })

  daysingleResult.timeMeasureType = timeMeasure
}

function prepareDayObject (item, format, colors, goalSettings) {
  let menu = {}
  let greet = {}
  let service = {}
  let laneQueue = {}
  let laneTotal = {}
  let totalCars = {}
  let dataObject = {}
  let groupId = {}
  let storeId = {}
  let deviceId = {}
  let deviceUid = {}

  if (item.StoreNo && item.StoreNo.includes('Subtotal')) {
    groupId.value = item.GroupName + ' ' + item.StoreNo
  } else if (item.StoreNo && item.StoreNo === 'Total Day') {
    groupId.value = item.StoreNo
    groupId.timeSpan = messages.COMMON.WAVG
  } else {
    groupId.value = item.GroupName
  }
  dataObject.groupId = groupId

  storeId.value = item.Store_ID
  dataObject.storeId = storeId

  menu.value = dateUtils.convertSecondsToMinutes(item['Menu Board'], format)
  menu.color = reportUtil.getColourCode('Menu Board', item['Menu Board'], colors, goalSettings)
  dataObject.menu = menu

  greet.value = dateUtils.convertSecondsToMinutes(item.Greet, format)
  greet.color = reportUtil.getColourCode('Greet', item.Greet, colors, goalSettings)
  dataObject.greet = greet

  service.value = dateUtils.convertSecondsToMinutes(item.Service, format)
  service.color = reportUtil.getColourCode('Service', item.Service, colors, goalSettings)
  dataObject.service = service

  laneQueue.value = dateUtils.convertSecondsToMinutes(item['Lane Queue'], format)
  laneQueue.color = reportUtil.getColourCode('Lane Queue', item['Lane Queue'], colors, goalSettings)
  dataObject.laneQueue = laneQueue

  laneTotal.value = dateUtils.convertSecondsToMinutes(item['Lane Total'], format)
  laneTotal.color = reportUtil.getColourCode('Lane Total', item['Lane Total'], colors, goalSettings)
  dataObject.laneTotal = laneTotal

  totalCars.value = item['Total_Car']
  dataObject.totalCars = totalCars

  deviceId.value = item.Device_ID
  dataObject.deviceId = deviceId

  deviceUid.value = item.Device_UID
  dataObject.deviceUid = deviceUid

  return dataObject
}

// This function is used to Prepare the Day details

function prepareDayResults (daysingleResult, dayData, format, colors, goalSettings) {
  let singleDay = []
  let dataList = []
  let dayDataObj = {}

  dayData.forEach(item => {
    if (item.StoreDate !== 'Total Day') {
      let day = {}
      let dataObject = prepareDayObject(item, format, colors, goalSettings)

      day.timeSpan = dateUtils.convertmmddyyyy(item.StoreDate)
      day.currentDaypart = messages.COMMON.DAYOPENCLOSE
      dataObject.day = day
      dataList.push(dataObject)
    } else {
      let day = {}
      let dataObject = prepareDayObject(item, format, colors, goalSettings)
      day.timeSpan = item.StoreDate
      day.currentDaypart = messages.COMMON.WAVG
      dataObject.day = day
      dataList.push(dataObject)
    }
  })
  dayDataObj.data = dataList
  singleDay.push(dayDataObj)
  daysingleResult.timeMeasureType = singleDay
}

module.exports = {
  generateDayReport,
  generateDayReportByDate
}
