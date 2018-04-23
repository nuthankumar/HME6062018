
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')


/**
 * The method can be used to execute getall user
 * @param  {input} accountId accountId   from  controller
 * @param  {input} createdById createdById  from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (accountId, isCorporate, isHidden, callback) => {
    repository.execute(sqlQuery.users.getAllReportsTemplates, {
        replacements: { UserUid: UserUid },
        type: dataBase.QueryTypes.SELECT
    }, callback)
}

module.exports = {
    getAll
}
