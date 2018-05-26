
const repository = require('./Repository')
// const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')
const sql = require('mssql')

/**
 * The method can be used to execute getall user's permissions
 * @param  {input} input input contains parameter to be passed to procedure
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, callback) => {
  repository.executeProcedure(sqlQuery.Permission.GetByUser, request => {
    return request.input(sqlQuery.User.Parameters.UserUid, sql.VarChar(32), input.userUid)
  }, callback)
}

module.exports = {
  getAll
}
