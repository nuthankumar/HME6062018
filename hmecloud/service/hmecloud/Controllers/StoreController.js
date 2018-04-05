const messages = require('../Common/Message')
const stores = require('../Repository/StoresRepository')
const validate = require('validator')
const dateUtils = require('../Common/DateUtils')
const dateFormat = require('dateformat')
const HashMap = require('hashmap')
/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */

const generateReport = (request, callBack) => {
  const input = {
    stores: request.body.stores,
    fromDate: request.body.fromDate,
    toDate: request.body.toDate,
    openTime: request.body.openTime,
    type: request.body.type,
    advanceType: request.body.advanceType,
    include: request.body.include,
    format: request.body.format,
    templateName: request.body.templateName
  }

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

/*
 * This service is used to get the Raw Car Data details
 */
const getRawCarDataReport = (request, callBack) => {
  const rawCarDataList = []
  const rawCarData = {}
  const departTimeStampMap = new HashMap()
  const input = {
    ReportTemplate_StoreId: request.body.reportTemplateStoreId,
    ReportTemplate_Advanced_Op: request.body.reportTemplateAdvancedOp,
    ReportTemplate_Time_Measure: request.body.reportTemplateTimeMeasure,
    ReportTemplate_From_Date: request.body.reportTemplateFromDate,
    ReportTemplate_To_Date: request.body.reportTemplateToDate,
    ReportTemplate_From_Time: request.body.reportTemplateFromTime,
    ReportTemplate_To_Time: request.body.reportTemplateToTime,
    ReportTemplate_Open: request.body.reportTemplateOpen,
    ReportTemplate_Close: request.body.reportTemplateClose,
    ReportTemplate_Type: request.body.reportTemplateType,
    ReportTemplate_Include_Longs: request.body.reportTemplateIncludeLongs,
    ReportTemplate_Format: request.body.reportTemplateFormat
  }
  if (
    input.ReportTemplate_StoreId &&
    validate.isNumeric(input.ReportTemplate_StoreId)
  ) {
    if (input.ReportTemplate_From_Date && input.ReportTemplate_To_Date) {
      if (input.ReportTemplate_From_Date === input.ReportTemplate_To_Date) {
        if (
          request.query.reportType === 'rr1' ||
          request.query.reportType === 'rrcsv1'
        ) {
          stores.getRawCarDataReport(input, result => {
            const len = result.length
            const storeData = result[len - 2]
            const dayPartData = result[len - 1]
            rawCarData.store = storeData.Store_Name
            rawCarData.description = storeData.Brand_Name
            rawCarData.startTime = input.ReportTemplate_From_Date
            rawCarData.stopTime = input.ReportTemplate_To_Date
            rawCarData.printDate = dateFormat(new Date(), 'isoDate')
            rawCarData.printTime = dateFormat(new Date(), 'shortTime')
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
                  if (tempEventDetails.EventType_Name.includes('Menu Board')) {
                    rawCarDataObj.menu = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                  } else if (tempEventDetails.EventType_Name.includes('Lane Queue')) {
                    rawCarDataObj.laneQueue = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                  } else if (tempEventDetails.EventType_Name.includes('Lane Total')) {
                    rawCarDataObj.laneTotal = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                  } else if (tempEventDetails.EventType_Name.includes('Service')) {
                    rawCarDataObj.service = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                  } else if (tempEventDetails.EventType_Name.includes('Greet')) {
                    rawCarDataObj.greet = dateUtils.msFormat(tempEventDetails.DetectorTime, input.ReportTemplate_Format)
                  }
                }
                rawCarDataList.push(rawCarDataObj)
                departTimeStampMap.set(rawCarTempId, rawCarTempId)
              }
            })
            rawCarData.rawCarData = rawCarDataList
        
            if (result.status === true) {
              if (request.query.reportType === 'rr1') {
                callBack(result)
              } else if (request.query.reportType === 'rrcsv1') {
                // TODO: Call the CSV file generation function to generate and send an email
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
      } else {
        callBack({
          error: messages.REPORTSUMMARY.DateRangeInvalid,
          status: false
        })
      }
    } else {
      callBack({
        error: messages.REPORTSUMMARY.DateCannotbeEmpty,
        status: false
      })
    }
  } else {
    callBack({
      error: messages.REPORTSUMMARY.InvalidStoreId,
      status: false
    })
  }
}

const generateCsv = (req, res) => {
  const input = {
    type: 'Day',
    AccountId: 0
  }
  stores.generateCSV(input, response => {
    if (response.status === true) {
      res.status(200).send(response)
    } else {
      res.status(400).send(response)
    }
  })
}

module.exports = {
  generateReport,
  generateCsv,
  getRawCarDataReport
}
