
const repository = require('./Repository')
const sqlQuery = require('../Common/DataBaseQueries')
const dateUtils = require('../Common/DateUtils')
const sql = require('mssql')

/**
 * The method can be used to execute create Reports
 * @param  {input} accountId accountId   from  controller
 * @param  {input} userUid userUid is used to get the role for the user
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getReport = (input, reportName, callback) => {
  let repositoryName
  let reportType
  if (reportName === 'day') {
    repositoryName = sqlQuery.Reports.getDayReport
  } else if (reportName === 'daypart') {
    repositoryName = sqlQuery.Reports.getDayPartReport
  } else if (reportName === 'week') {
    repositoryName = sqlQuery.Reports.getWeekReport
  }
  if (input.body.type === 2) {
    reportType = 'AC'
  } else if (input.body.type === 1) {
    reportType = 'TC'
  }
  repository.executeProcedure(repositoryName, request => {
    request.input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(500), input.body.deviceIds.toString())
    request.input(sqlQuery.StartDate.Parameters.StoreStartDate, sql.Date, input.body.fromDate)
    request.input(sqlQuery.EndDate.Parameters.StoreEndDate, sql.Date, input.body.toDate)
    request.input(sqlQuery.OpenTime.Parameters.InputStartDateTime, sql.NVarChar(50), dateUtils.fromTime(input.body.fromDate, input.body.openTime))
    request.input(sqlQuery.CloseTime.Parameters.InputEndDateTime, sql.NVarChar(50), dateUtils.fromTime(input.body.toDate, input.body.closeTime))
    request.input(sqlQuery.ReportType.Parameters.ReportType, sql.Char, reportType)
    request.input(sqlQuery.Lane.Parameters.LaneConfig_ID, sql.Char, 1)
    if (reportName === 'daypart') {
      request.input(sqlQuery.PageNumber.Parameters.PageNumber, sql.SmallInt, input.body.pageNumber)
    }
    request.input(sqlQuery.UserUID.Parameters.UserUID, sql.NVarChar(50), input.userUid)
    return request
  }, callback)
}
module.exports = {getReport}
