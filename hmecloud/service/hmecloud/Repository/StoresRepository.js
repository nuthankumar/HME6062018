const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const dataBaseSql = require('../DataBaseConnection/Configuration').sqlConfig
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')

const generateSummaryReport = (input, callback) => {

    const sql_pool = new sql.ConnectionPool(dataBaseSql, err => {
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


const getDayDataReport = (input, callback) => {
    const output = {}
    const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
        if (err) {
            output.data = err
            output.status = false
            console.log(err)
            callback(output)
        }
        sqlPool.request()
            .input('Device_IDs', sql.VarChar(500), input.ReportTemplate_StoreIds.toString())
            .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
            .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
            .input('StartDateTime', sql.DateTime2 , input.FromDateTime)
            .input('EndDateTime', sql.DateTime2 , input.ToDateTime)
            .input('CarDataRecordType_ID', sql.SmallInt, input.ReportTemplate_Type)
            .execute('usp_HME_Cloud_Get_Report_By_Date', (err, result) => {
                if (err) {
                    output.data = err
                    output.status = false 
                    console.log(err)
                    callback(output)
                }
                if (result && result.recordsets) {
                    output.data = result.recordsets
                    output.status = true
                    callback(output)
                }
            }) 
    })

    sqlPool.on('error', err => {
        if (err) {
            callback(err)
        }
    })
}


module.exports = {
  generateSummaryReport,
    getRawCarDataReport,
    getDayDataReport
}
