const dataBase = require('../DataBaseConnection/Configuration')
const sql = require('mssql')

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

/**
 * The method can be used to execute the SQL procedure
 * @param  {obj} procedure SQL procedure to run in database
 * @param  {obj} prepareParameters SQL paramters to be used to execute the procedure
 * @param  {funct} callback Function will be called once the query executed.
 * @public
 */
const executeProcedure = (procedure, prepareParameters, callback) => {
  const output = {}

  const sqlPool = new sql.ConnectionPool(dataBase.sqlConfig, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    var request = prepareParameters(sqlPool.request())
    request.execute(procedure, (err, result) => {
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
      output.data = err
      output.status = false
      callback(output)
    }
  })
}

module.exports = {
  execute,
  executeProcedure
}
