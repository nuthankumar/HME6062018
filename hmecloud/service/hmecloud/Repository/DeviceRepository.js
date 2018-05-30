const repository = require('./Repository')
const sqlQuery = require('../Common/DataBaseQueries')
const sql = require('mssql')

const getunRegisterDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.Device.getunRegisterDevices, request => {
    return request
      .input(sqlQuery.util.Parameters.PageNumber, sql.SmallInt, input.pno)
      .input(sqlQuery.util.Parameters.criteria, sql.VarChar(100), input.criteria)
      .input(sqlQuery.util.Parameters.filter, sql.VarChar(50), input.filter)
      .input(sqlQuery.util.Parameters.SortingColumnName, sql.VarChar(50), input.column)
      .input(sqlQuery.util.Parameters.SortingType, sql.VarChar(5), input.sortType)
      .input(sqlQuery.util.Parameters.RecordPerPage, sql.SmallInt, input.per)
  }, callback)
}

module.exports = {
  getunRegisterDevices
}
