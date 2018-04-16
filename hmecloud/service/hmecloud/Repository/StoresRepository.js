const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const dataBaseSql = require('../DataBaseConnection/Configuration').sqlConfig
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')



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
      callback(output)
    }
    sqlPool.request()
      .input('Device_IDs', sql.VarChar(500), input.ReportTemplate_DeviceIds.toString())
      .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
      .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
      .input('StartDateTime', sql.DateTime2, input.FromDateTime)
      .input('EndDateTime', sql.DateTime2, input.ToDateTime)
      .input('CarDataRecordType_ID', sql.SmallInt, input.CarDataRecordType_ID)
      .input('ReportType', sql.Char, input.ReportTemplate_Type)
      .input('UserUID', sql.NVarChar(50), input.userUid)
      .execute('usp_HME_Cloud_Get_Report_By_Date_Details', (err, result) => {
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
/**
 * The method can be used to execute get Report Template
 * @param  {template} template input from controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getWeekReport = (template, callback) => {
  repository.execute(sqlQuery.SummarizedReport.weekReport, {
    replacements: template,
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result))
}

module.exports = {
  getRawCarDataReport,
  getDayDataReport,
  getWeekReport
}
