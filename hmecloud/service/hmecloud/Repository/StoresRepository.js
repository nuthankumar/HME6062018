const db = require('../DataBaseConnection/Configuration')
const dateUtils = require('../Common/DateUtils')
const HashMap = require('hashmap')
const dateFormat = require('dateformat')

const defaultFromTime = '00:00:00'
const defaultEndTime = '23:59:59'

const generateSummaryReport = (input, callback) => {
  const Query = `exec usp_HME_Cloud_Get_Report_By_Daypart 
    @Device_IDs= '${input.deviceUIDs.toString()}' 
   ,@StoreStartDate= '${input.fromDate}'
   ,@StoreEndDate= '${input.toDate}'
   ,@StartDateTime= '${input.openTime}'
   ,@EndDateTime= '${input.closeTime}'
   ,@CarDataRecordType_ID= 11
   ,@ReportType= ${input.ReportType} 
   ,@LaneConfig_ID= 1`
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const timeMeasure = (callback) => {
  const Query =
    'select Id,Type from [dbo].[TimeMeasure] '
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const getRawCarDataReport = (input, callback) => {
  const rawCarDataList = []
  const output = {}
  const rawCarData = {}
  const departTimeStampMap = new HashMap()
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
  const Query =
        'exec usp_HME_Cloud_Get_Report_Raw_Data_Details ' + input.ReportTemplate_StoreId + " ,'" + input.ReportTemplate_From_Date + "', '" + input.ReportTemplate_To_Date + "','" + fromDateTime + "','" + toDateTime + "','" + input.ReportTemplate_Type + "'"

  db.query(Query, {
    type: db.QueryTypes.SELECT
  }).then(result => {
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

    output.data = rawCarData
    output.status = true
    callback(output)
  }).catch(error => {
    const output = {
      data: error,
      status: false
    }
    callback(output)
  })
}

module.exports = {
  generateSummaryReport,
  timeMeasure,
  getRawCarDataReport
}
