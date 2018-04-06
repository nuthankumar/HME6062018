const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration')
const sqlQuery = require('../Common/DataBaseQueries')

const generateSummaryReport = (input, callback) => {
  const Query = `exec usp_HME_Cloud_Get_Report_By_Daypart 
    @Device_IDs= '${input.reportTemplateStoreIds.toString()}' 
   ,@StoreStartDate= '${input.reportTemplateFromDate}'
   ,@StoreEndDate= '${input.reportTemplateToDate}'
   ,@StartDateTime= '${input.reportTemplateToTime}'
   ,@EndDateTime= '${input.reportTemplateClose}'
   ,@CarDataRecordType_ID= 11
   ,@ReportType= ${input.reportTemplateType} 
   ,@LaneConfig_ID= 1`

  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        callback(result)
      }
    })
    .catch(error => {
      callback(error)
    })
}

/**
 *
 * @param {*} JSON input template for calling Procedure
 * @param {*} callback
 */
const getRawCarDataReport = (template, callback) => {
  repository.execute(sqlQuery.SummarizedReport.getRawData, {
    replacements: template,
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result))
}
module.exports = {
  generateSummaryReport,
  getRawCarDataReport
}
