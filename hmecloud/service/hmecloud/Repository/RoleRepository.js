
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')

/**
 * The method can be used to execute getall user
 * @param  {input} accountId accountId   from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (accountId, callback) => {
  repository.execute(sqlQuery.ROLES.userRoles, {
    replacements: { AccountId: accountId },
    type: dataBase.QueryTypes.SELECT
  }, callback)
}

module.exports = {
  getAll
}
