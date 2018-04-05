const jsonexport = require('jsonexport')
const mail = require('../Common/EmailUtil')

const generateCsvAndEmail = (input, callback) => {
  const CSV = jsonexport(input.csv, function (err, result) {
    if (err) {
      callback(err)
    }
    return result
  })

  var attachment = [{
    filename: input.reportName + '.csv',
    content: CSV,
    encoding: 'utf16le'
  }]

  mail.send(input.email, input.subject, attachment, isMailSent => {
    if (isMailSent) {
      callback(isMailSent)
    } else {
      callback(isMailSent)
    }
  })
}

module.exports = {
  generateCsvAndEmail

}

// exports.DAYREPORT = [
//   {
//     Day: '3/8/2018',
//     Groups: 'group1',
//     Stores: '001-202001',
//     Menu: 'NA',
//     Greet: '0.27',
//     Services: 'NA',
//     LaneQueue: 'NA',
//     LaneTotal: 'NA',
//     TotalCars: '74'
//   },
//   {
//     Day: '3/8/2018',
//     Groups: 'group2',
//     Stores: '002-202001',
//     Menu: 'NA',
//     Greet: '0.27',
//     Services: '0.37',
//     LaneQueue: 'NA',
//     LaneTotal: '0.57',
//     TotalCars: '100'
//   },
//   {
//     Day: '3/8/2018',
//     Groups: 'group2',
//     Stores: '002-202003',
//     Menu: 'NA',
//     Greet: 'NA',
//     Services: '0.27',
//     LaneQueue: 'NA',
//     LaneTotal: '0.25',
//     TotalCars: '100'
//   },
//   {
//     Groups: 'Group2 subtotal',
//     Menu: 'NA',
//     Greet: 'NA',
//     Services: 'NA',
//     LaneQueue: '0.27',
//     LaneTotal: 'NA',
//     TotalCars: 'NA'
//   }
// ]
