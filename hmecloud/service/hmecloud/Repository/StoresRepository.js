const db = require('../DataBaseConnection/Configuration')

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
  const output = {}
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
    callback(result)
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
