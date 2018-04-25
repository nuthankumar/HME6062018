const jsonexport = require('jsonexport')
const mail = require('../Common/EmailUtil')

const generateCsvAndEmail = (input, callback) => {
  jsonexport(input.reportinput, function (err, result) {
    if (result) {
      var attachment = [{
        filename: input.reportName + '.csv',
        content: result,
        encoding: 'utf16le'
      }]
      mail.send(input.email, input.subject, attachment, isMailSent => {
        if (isMailSent) {
            console.log("Success")
          callback(isMailSent)
        } else {
            console.log("fail")
          callback(isMailSent)
        }
      })
    }
  })
}

module.exports = {
  generateCsvAndEmail

}
