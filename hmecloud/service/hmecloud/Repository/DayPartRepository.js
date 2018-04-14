const dataBaseSql = require('../DataBaseConnection/Configuration').sqlConfig
const sql = require('mssql')

const generateDayPartSummaryReport = (input, callback) => {
  const output = {}

  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }

    sqlPool.request()
      .input('StoreIDs', sql.VarChar(500), input.ReportTemplate_StoreIds.toString())
      .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
      .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
      .input('InputStartDateTime', sql.NVarChar(50), input.ReportTemplate_From_Time)
      .input('InputEndDateTime', sql.NVarChar(50), input.ReportTemplate_To_Time)
      .input('CarDataRecordType_ID', sql.VarChar(255), input.CarDataRecordType_ID)
      .input('ReportType', sql.Char(2), input.ReportTemplate_Type)
      .input('LaneConfig_ID', sql.TinyInt, '1')
      // .input('RecordPerPage', sql.SmallInt, input.recordPerPage)
      .input('PageNumber', sql.SmallInt, input.pageNumber)
      .execute('usp_HME_Cloud_Get_Report_By_Daypart_Details', (err, result) => {
        if (err) {
          output.data = err
          output.status = false

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
  generateDayPartSummaryReport

}
