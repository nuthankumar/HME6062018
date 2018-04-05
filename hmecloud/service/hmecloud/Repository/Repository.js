const dataBase = require('../DataBaseConnection/Configuration')

const execute = (query, parameters, callback) => {
    console.log("parameters",parameters)
    console.log("query",query)
  dataBase
    .query(query, parameters)
    .then(result => {
        console.log("result",result)
      callback(result)
    })
    .catch(error => {
      console.log("ERROR",error)
      callback(error)
    })
}

module.exports = {
  execute
}
