const dataBase = require('../DataBaseConnection/Configuration')

/**
 * The method can be used to execute the SQL statement
 * @param  {obj} query SQL statement to run in database
 * @param  {obj} parameters SQL paramters to be used to execute the query
 * @param  {funct} callback Function will be called once the query executed.
 * @public
 */
const execute = (query, parameters, callback) => {
  dataBase.db
    .query(query, parameters)
    .then(result => {
      callback(result)
    })
    .catch(error => {
      console.log(error)
      callback(error)
    })
}

module.exports = {
  execute
}
