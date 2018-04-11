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

    const inputType = input.ReportTemplate_StoreIds.length

    sqlPool.request()
      .input('InputType', sql.VarChar(5), inputType)
      .input('Device_IDs', sql.VarChar(5), `${input.ReportTemplate_StoreIds.toString()}`)
      .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
      .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
      .input('StartDateTime', sql.Date, input.ReportTemplate_From_Time)
      .input('EndDateTime', sql.Date, input.ReportTemplate_To_Time)
      .input('CarDataRecordType_ID', sql.VarChar(255), '11')
      .input('ReportType', sql.Char(2), 'AC')
      .input('LaneConfig_ID', sql.TinyInt, '1')
      .execute('_usp_HME_Cloud_Get_Report_By_Daypart', (err, result) => {
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
