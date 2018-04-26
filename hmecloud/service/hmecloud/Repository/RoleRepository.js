
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')
const sql = require('mssql')

/**
 * The method can be used to execute getall user
 * @param  {input} accountId accountId   from  controller
 * @param  {input} userUid userUid is used to get the role for the user
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, callback) => {
  repository.executeProcedure(sqlQuery.Role.getRoles, request => {
    return request
      .input(sqlQuery.Account.Parameters.AccountId, sql.Int, input.accountId)
      .input(sqlQuery.User.Parameters.UserUid, sql.VarChar(32), input.userUid)
  }, callback);
}
module.exports = {
  getAll
}
