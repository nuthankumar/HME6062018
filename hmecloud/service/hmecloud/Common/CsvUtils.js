const jsonexport = require('jsonexport')
const mail = require('../Common/EmailUtil')

const generateCsvAndEmail = function (input, callback) {
  jsonexport(input.reportinput, function (err, result) {
    if (result) {
      var attachment = [{
        filename: input.reportName + '.csv',
        content: result,
        encoding: 'utf16le'
      }]
      isMailSent = mail.send( input.email, input.subject, attachment, isMailSent => {
        if (isMailSent) {
          callback(isMailSent)
        } else {
          callback(isMailSent)
        }
      })
    }
  })
}

module.exports = {generateCsvAndEmail}
