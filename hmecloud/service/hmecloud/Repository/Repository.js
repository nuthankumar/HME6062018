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
 * @param  {obj} connectionString SQL config to run in database
 * @param  {obj} procedure SQL procedure to run in database
 * @param  {obj} prepareParameters SQL paramters to be used to execute the procedure
 * @param  {funct} callback Function will be called once the query executed.
 * @public
 */
const executeSQL = (config, procedure, prepareParameters, callback) => {
  const output = {}

  const sqlPool = new sql.ConnectionPool(config, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    var request = prepareParameters(sqlPool.request())
    console.log('request.parameters', request.parameters)
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

/**
 * The method can be used to execute the SQL procedure
 * @param  {obj} procedure SQL procedure to run in database
 * @param  {obj} prepareParameters SQL paramters to be used to execute the procedure
 * @param  {funct} callback Function will be called once the query executed.
 * @public
 */
const executeProcedure = (procedure, prepareParameters, callback) => {
  executeSQL(dataBase.sqlConfig, procedure, prepareParameters, callback)
}

/**
 * The method can be used to execute the SQL procedure
 * @param  {obj} procedure SQL procedure to run in database
 * @param  {obj} prepareParameters SQL paramters to be used to execute the procedure
 * @param  {funct} callback Function will be called once the query executed.
 * @public
 */
const executeOdsProcedure = (procedure, prepareParameters, callback) => {
  executeSQL(dataBase.ods, procedure, prepareParameters, callback)
}

module.exports = {
  execute,
  executeProcedure,
  executeOdsProcedure
}
