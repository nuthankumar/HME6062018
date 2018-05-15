const messages = require('../Common/Message')
const stores = require('../Repository/StoresRepository')
const dateUtils = require('../Common/DateUtils')
const dateFormat = require('dateformat')
const csvGeneration = require('../Common/CsvUtils')
const HashMap = require('hashmap')
const _ = require('lodash')
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
  let fromDateTime = dateUtils.fromTime(input.ReportTemplate_From_Date, input.ReportTemplate_From_Time)

  let toDateTime = dateUtils.toTime(input.ReportTemplate_To_Date, input.ReportTemplate_To_Time)

  const rawCarDataqueryTemplate = {
    ReportTemplate_DeviceIds: input.ReportTemplate_DeviceIds,
    ReportTemplate_From_Date: input.ReportTemplate_From_Date,
    ReportTemplate_To_Date: input.ReportTemplate_To_Date,
    fromDateTime: fromDateTime,
    toDateTime: toDateTime,
    ReportTemplate_Type: 11, // input.CarDataRecordType_ID,
    ReportType: input.ReportTemplate_Type,
    LaneConfig_ID: 1
  }
  const rawCarDataList = []
  const rawCarData = {}
  const departTimeStampMap = new HashMap()

  if (input.reportType === 'rr1' || input.reportType === 'rrcsv1') {
    stores.getRawCarDataReport(rawCarDataqueryTemplate, result => {
      if (!_.isEmpty(result)) {
        const len = result.length
        if (len > 1) {
          const dayPartData = result[1]
          let counter = 0
          _.mapKeys(result, function (value, key) {
            if (_.has(value, 'Store_Name')) {
              prepareStoreDetails(rawCarData, value, input)
            }

            if (value.DepartTimeStamp === null || value.DepartTimeStamp === undefined) {
              counter++
              if (counter === len) {
                rawCarData.status = true
                rawCarData.key = 'ReportsNoRecordsFound'
                callBack(rawCarData)
              }
            }
          })

          prepareResponsObject(result, departTimeStampMap, rawCarDataList, rawCarData, len, dayPartData, input)
          rawCarData.rawCarData = rawCarDataList

          if (input.reportType === 'rr1') {
            rawCarData.status = true
            callBack(rawCarData)
          } else if (input.reportType === 'rrcsv1') {
            // Invoking CSV file generation function
            let output = {}
            let csvInput = {}
            csvInput.type = messages.COMMON.CSVTYPE
            csvInput.reportName = input.ReportTemplate_Time_Measure + '_' + dateFormat(new Date(), 'isoDate')
            csvInput.email = input.UserEmail
            csvInput.reportinput = rawCarDataList
            csvInput.subject = input.ReportTemplate_Time_Measure + ' ' + fromDateTime + ' - ' + toDateTime
            csvGeneration.generateCsvAndEmail(csvInput, result => {
              if (result) {
                output.data = input.UserEmail
                output.status = true
              } else {
                output.data = input.UserEmail
                output.status = false
              }

              callBack(output)
            })
          }
        }
      } else {
        callBack({
          key: 'ReportsNoRecordsFound',
          status: false
        })
      }
    })
  } else {
    callBack({
      key: 'invalidReportType',
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
/**
 *
 * @param {*} rawCarData
 * @param {*} storeData
 * @param {*} input
 */
function prepareStoreDetails (rawCarData, storeData, input) {
  rawCarData.storeName = storeData.Store_Name
  rawCarData.storeDescription = storeData.Brand_Name
  rawCarData.storeNumber = (storeData.Store_Number ? storeData.Store_Number : 'N/A')
  rawCarData.startTime = `${dateUtils.convertMMMdYYYY(input.ReportTemplate_From_Date)}`
  rawCarData.stopTime = `${dateUtils.convertMMMdYYYY(input.ReportTemplate_To_Date)}`
  rawCarData.printDate = dateUtils.convertMMMdYYYY(dateFormat(new Date(), 'isoDate'))
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
      rawCarDataObj.departureTime = dateUtils.UtcTimeTo12HourFormat(tempRawCarData.DepartTimeStamp)
      rawCarDataObj.eventName = tempRawCarData.CarRecordDataType_Name || 'N/A'
      rawCarDataObj.carsInQueue = tempRawCarData.CarsInQueue || '0'

      rawCarData.dayPart = 'DP' + tempRawCarData.Daypart_ID + dateUtils.dayPartTime(tempRawCarData.Daypart_ID, input)

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

const settingsDevices = (input, response) => {
  stores.settingsDevices(input, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
}

const settingsStores = (input, response) => {
  stores.settingsStores(input, result => {
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
  getRawCarDataReport,
  settingsDevices,
  settingsStores
}
