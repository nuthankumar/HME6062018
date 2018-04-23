
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')

/**
 * The method can be used to execute create user
 * @param  {input} user create template input from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (user, callback) => {
  repository.execute(sqlQuery.users.createuser, {
    replacements: user,
    type: dataBase.QueryTypes.SELECT
  }, callback)
}

/**
 * The method can be used to execute get user
 * @param  {input} userId templateId from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (userId, callback) => {
  repository.execute(sqlQuery.users.getReportsTemplate, {
    replacements: { id: userId },
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result[0]))
}

/**
 * The method can be used to execute getall user
 * @param  {input} accountId accountId   from  controller
 * @param  {input} createdById createdById  from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (UserUid, callback) => {
  repository.execute(sqlQuery.users.getAllReportsTemplates, {
    replacements: { UserUid: UserUid },
    type: dataBase.QueryTypes.SELECT
  }, callback)
}

/**
 * The method can be used to execute delete user
 * @param  {input} userId  userId   from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (userId, callback) => {
  repository.execute(sqlQuery.users.deleteTemplate, {
    replacements: { id: userId },
    type: dataBase.QueryTypes.SELECT
  }, callback)
}
module.exports = {
  create,
  deleteById,
  get,
  getAll
}
