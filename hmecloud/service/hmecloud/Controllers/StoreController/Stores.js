const csvFile = require('../../common/csvUtils')
var jsonexport = require('jsonexport')
const db = require('../../Model/DataBaseConnection/configDb')
const mail = require('../../common/emailUtil')

const generateSummaryReport = (input, callback) => {
  console.log('Enter generateSummaryReport')
  console.log('input.stores')
  console.log(input.stores.toString())


  const Query =
    "exec [dbo].generateSumamrizereport  @storeIds=' " + input.stores.toString() + "';"
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        console.log(result)

        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      console.log(error)
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const timeMeasure = (callback) => {
  const Query =
    'select Id,Type from [dbo].[TimeMeasure] '
  db
    .query(Query, {
      type: db.QueryTypes.RAW
    })
    .spread(result => {
      if (result) {
        const output = {
          data: result,
          status: true
        }
        callback(output)
      }
    })
    .catch(error => {
      console.log(error)
      const output = {
        data: error,
        status: true
      }

      callback(output)
    })
}

const generateCSV = (input, callback) => {
  const csv = csvFile.DAYREPORT
  jsonexport(csv, function (err, csv) {

console.log("CSV",csv)
    const loggedInUser = 'jaffersr@nousinfo.com'
    var attachment = [{
      // file on disk as an attachment
      filename: 'package.csv',
      content: csv,
      encoding: 'utf16le'
    }]


    mail.send(loggedInUser, attachment, isMailSent => {
      if (isMailSent) {
        callback('success')
      } else {
        callback('failure')
      }
    })
  });
}

module.exports = {
  generateSummaryReport,
  timeMeasure,
  generateCSV
}