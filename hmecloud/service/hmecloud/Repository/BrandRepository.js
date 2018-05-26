
const repository = require('./Repository')
// const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')
// const sql = require('mssql')

/**
 * The method can be used to execute getall user
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, callback) => {
  repository.executeProcedure(sqlQuery.Brand.getBrands, request => {
    return request
  }, callback)
}
module.exports = {
  getAll
}
