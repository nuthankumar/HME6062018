const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration')
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')

const generateSummaryReport = (input, callback) => {

  const sql_pool = new sql.ConnectionPool(dataBase.sqlConfig, err => {
    sql_pool.request() // or: new sql.Request(pool2)
      .input('InputType', sql.VarChar(5), '1')
      .execute('_usp_HME_Cloud_Get_Report_By_Daypart', (err, result) => {
        if (err) callback(error)
        if (result && result.recordsets) {
          callback(result.recordsets)
        }
      })
  })

  sql_pool.on('error', err => {
    if (err) callback(error)
  })

  /*
  // this works for multiple resultsets!
    sql.connect(config, err => {
      new sql.Request()
        .input('InputType', sql.VarChar(5), '1')
        .execute('_usp_HME_Cloud_Get_Report_By_Daypart', (err, result) => {
          if (err) callback(error)
          if (result) callback(result)
        })
    })
  
    sql.on('error', err => {
      console.log('sql-error: ', err)
    })
  */

  /*
  // this does NOT work for multiple resultsets!
    const Query = `exec usp_HME_Cloud_Get_Report_By_Daypart 
      @Device_IDs= '${input.reportTemplateStoreIds.toString()}' 
     ,@StoreStartDate= '${input.reportTemplateFromDate}'
     ,@StoreEndDate= '${input.reportTemplateToDate}'
     ,@StartDateTime= '${input.reportTemplateToTime}'
     ,@EndDateTime= '${input.reportTemplateClose}'
     ,@CarDataRecordType_ID= 11
     ,@ReportType= ${input.reportTemplateType} 
     ,@LaneConfig_ID= 1`
  */
  /*
    const Query = `EXEC _usp_HME_Cloud_Get_Report_By_Daypart :InputType`
    const inputType = 1;
  
    dataBase
      .query(Query, //{
      {
        multipleStatements: true,
        replacements: { InputType: inputType }, type: dataBase.QueryTypes.SELECT
      }).then(result => {
        console.log('result: ', result);
        if (result) { callback(result) }
      })
      // .spread(result => {
      //   console.log('result: ', result);
      //   if (result) {
      //     callback(result)
      //   }
      // })
      .catch(error => {
        console.log('error: ', error);
        callback(error)
      })
    */
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
