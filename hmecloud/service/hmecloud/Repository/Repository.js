const dataBase = require('../DataBaseConnection/Configuration')

const execute = (query, parameters, callback) => {
  dataBase
    .query(query, parameters)
    .then(result => {
      callback(result)
    })
    .catch(error => {
      callback(error)
    })
}

module.exports = {
  execute
}
