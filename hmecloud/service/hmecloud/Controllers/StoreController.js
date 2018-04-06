const messages = require('../Common/Message')
const stores = require('../Repository/StoresRepository')
const dateUtils = require('../Common/DateUtils')
const dateFormat = require('dateformat')
const csvGeneration = require('../Common/CsvUtils')
const HashMap = require('hashmap')

const defaultFromTime = '00:00:00'
const defaultEndTime = '23:59:59'
/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */
const generateReport = (input, callBack) => {
  if (input !== null) {
    stores.generateSummaryReport(input, result => {
      if (result.status === true) {
        callBack(result)
      } else {
        callBack(result)
      }
    })
  } else {
    callBack(messages.CREATEGROUP.invalidRequestBody)
  }
}

/**
 *  This service is used to get the Raw Car Data details
 * @param {*} input
 * @param {*} callBack
 */
const getRawCarDataReport = (input, callBack) => {
  let fromDateTime
  let toDateTime

  if (input.ReportTemplate_From_Time) {
    fromDateTime = input.ReportTemplate_From_Date + ' ' + input.ReportTemplate_From_Time
  } else {
    fromDateTime = input.ReportTemplate_From_Date + ' ' + defaultFromTime
  }

  if (input.ReportTemplate_To_Time) {
    toDateTime = input.ReportTemplate_To_Date + ' ' + input.ReportTemplate_To_Time
  } else {
    toDateTime = input.ReportTemplate_To_Date + ' ' + defaultEndTime
  }

  const rawCarDataqueryTemplate = {
    ReportTemplate_StoreIds: input.ReportTemplate_StoreIds,
    ReportTemplate_From_Date: input.ReportTemplate_From_Date,
    ReportTemplate_To_Date: input.ReportTemplate_To_Date,
    fromDateTime: fromDateTime,
    toDateTime: toDateTime,
    ReportTemplate_Type: input.ReportTemplate_Type,
    ReportType: 'AC',
    LaneConfig_ID: 1
  }
  const rawCarDataList = []
  const rawCarData = {}
  const departTimeStampMap = new HashMap()

  if (input.reportType === 'rr1' || input.reportType === 'rrcsv1') {
    stores.getRawCarDataReport(rawCarDataqueryTemplate, result => {
      if (result) {
        const len = result.length
        if (len > 1) {
          const storeData = result[len - 2]
          const dayPartData = result[1]
          prepareStoreDetails(rawCarData, storeData, input)
          prepareResponsObject(result, departTimeStampMap, rawCarDataList, rawCarData, len, dayPartData, input)
          rawCarData.rawCarData = rawCarDataList

          if (input.reportType === 'rr1') {
            rawCarData.status = true
            callBack(rawCarData)
          } else if (input.reportType === 'rrcsv1') {
            // Invoking CSV file generation function
            let csvInput = {}
            csvInput.type = messages.COMMON.CSVTYPE,
            csvInput.reportName = input.ReportTemplate_Time_Measure + '_' + dateFormat(new Date(), 'isoDate'),
            csvInput.email = input.UserEmail,
            csvInput.reportinput = rawCarDataList
            csvInput.subject = input.ReportTemplate_Time_Measure + ' ' + fromDateTime + ' - ' + toDateTime
            csvGeneration.generateCsvAndEmail(csvInput, result => {
              callBack(result)
            })
          }
        }
      } else {
        callBack(result)
      }
    })
  } else {
    callBack({
      error: messages.REPORTSUMMARY.InvalidReportType,
      status: false
    })
  }
}

/**
 *
 * @param {*} input
 * @param {*} response
 */
const generateCsv = (input, response) => {
  stores.generateCSV(input, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
}

module.exports = {
  generateReport,
  generateCsv,
  getRawCarDataReport
}

/**
 *
 * @param {*} rawCarData
 * @param {*} storeData
 * @param {*} input
 */
function prepareStoreDetails (rawCarData, storeData, input) {
  rawCarData.store = storeData.Store_Name
  rawCarData.description = storeData.Brand_Name
  rawCarData.startTime = input.ReportTemplate_From_Date
  rawCarData.stopTime = input.ReportTemplate_To_Date
  rawCarData.printDate = dateFormat(new Date(), 'isoDate')
  rawCarData.printTime = dateFormat(new Date(), 'shortTime')

  return rawCarData
}
/**
 *
 * @param {*} result
 * @param {*} departTimeStampMap
 * @param {*} rawCarDataList
 * @param {*} rawCarData
 * @param {*} len
 * @param {*} dayPartData
 * @param {*} input
 */
function prepareResponsObject (result, departTimeStampMap, rawCarDataList, rawCarData, len, dayPartData, input) {
  result.forEach(item => {
    let rawCarTempId = item.RawDataID
    if (rawCarTempId && !departTimeStampMap.has(rawCarTempId)) {
      let departTimeStampList = result.filter(function (obj) {
        return obj.RawDataID === rawCarTempId
      })
      let tempRawCarData = departTimeStampList[0]
      const rawCarDataObj = {}
      rawCarDataObj.departureTime = tempRawCarData.DepartTimeStamp
      rawCarDataObj.eventName = tempRawCarData.CarRecordDataType_Name
      rawCarDataObj.carsInQueue = tempRawCarData.CarsInQueue
      rawCarData.dayPart = 'DP' + tempRawCarData.Daypart_ID + dateUtils.dayPartTime(tempRawCarData.Daypart_ID, len, dayPartData.StartTime, dayPartData.EndTime)
      for (let i = 0; i < departTimeStampList.length; i++) {
        let tempEventDetails = departTimeStampList[i]
        if (tempEventDetails.EventType_Name.includes(messages.EventName.MENU)) {
          rawCarDataObj.menu = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.GREET)) {
          rawCarDataObj.laneQueue = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.SERVICE)) {
          rawCarDataObj.laneTotal = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.LANEQUEUE)) {
          rawCarDataObj.service = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        } else if (tempEventDetails.EventType_Name.includes(messages.EventName.LANETOTAl)) {
          rawCarDataObj.greet = dateUtils.convertSecondsToMinutes(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
        }
      }
      rawCarDataList.push(rawCarDataObj)
      departTimeStampMap.set(rawCarTempId, rawCarTempId)
    }
  })

  return rawCarDataList
}
