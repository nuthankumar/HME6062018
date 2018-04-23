const dateUtils = require('../Common/DateUtils')
const reportUtil = require('../Common/ReportGenerateUtils')
const dateFormat = require('dateformat')
const message = require('../Common/Message')
const dataExportUtil = require('../Common/DataExportUtil')

function prepareDayPartObject (item, format, input, colors, goalSettings) {
  let menu = {}
  let greet = {}
  let service = {}
  let laneQueue = {}
  let laneTotal = {}
  let totalCars = {}
  let dataObject = {}
  let groupId = {}
  let storeId = {}
  let daypart = {}
  let deviceId = {}
  let deviceUid = {}

  if (item.StartTime !== null && item.StoreDate !== 'Total Daypart' && item.EndTime !== null && input.ReportTemplate_DeviceIds.length < 2) {
    var dateSplit = item['StoreDate'].split('-')
    daypart.timeSpan = `${dateSplit[1]}/${dateSplit[2]}-Daypart${item['DayPartIndex']}`
    daypart.currentDaypart = `${dateUtils.converthhmmsstt(item.StartTime)}-${dateUtils.converthhmmsstt(item.EndTime)}`
    dataObject.daypart = daypart
  }

  groupId.value = item.GroupName
  dataObject.groupId = groupId

  deviceId.value = item.Device_ID
  dataObject.deviceId = deviceId

  deviceUid.value = item.Device_UID
  dataObject.deviceUid = deviceUid

  if ((_.isUndefined(item.Store_ID) && _.isUndefined(item.Store_Name)) || (item.Store_ID === null && item.Store_Name === null)) {
    storeId.value = 'N/A'
  } else {
    storeId.value = `${item.Store_ID} - ${item.Store_Name}`
  }
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

  return dataObject
}

function generatePDFReport (reportData, input, isMultiStore) {
  let pdfInput = {}
  pdfInput.type = `${message.COMMON.PDFTYPE}`
  pdfInput.reportName = `${message.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`
  console.log('input input ', input)
  pdfInput.email = input.UserEmail
  pdfInput.subject = `${message.COMMON.DAYPARTREPORTTITLEPDF} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  let reportName = 'Daypart'
  dataExportUtil.JsonForPDF(reportData, input, reportName, pdfInput, isMultiStore)
}

function generateCSVOrPdfTriggerEmail (request, input, result, callBack) {
  let csvInput = {}
  csvInput.type = message.COMMON.CSVTYPE
  csvInput.reportName = `${message.COMMON.DAYPARTREPORTNAME} ${dateFormat(new Date(), 'isoDate')}`

  csvInput.email = input.UserEmail
  csvInput.subject = `${message.COMMON.DAYPARTREPORTTITLE} ${input.ReportTemplate_From_Time} ${input.ReportTemplate_To_Date + (input.ReportTemplate_Format === 1 ? '(TimeSlice)' : '(Cumulative)')}`
  dataExportUtil.prepareJsonForExport(result.data[0], input, csvInput, csvResults => {
    callBack(csvResults)
  })
}

module.exports = {
  prepareDayPartObject,
  generatePDFReport,
  generateCSVOrPdfTriggerEmail
}
