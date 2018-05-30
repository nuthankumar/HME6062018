var Request = require('request')

function getcall (url) {
  Request.get(url, (error, response, body) => {
    if (error) {
      return console.dir(error)
    }
    console.dir(JSON.parse(body))
  })
}

module.exports = {
  getcall
}
