const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')
const stores = require('../Controllers/StoreController')

/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */
router.post('/generatereport', (request, response) => {
  stores.generateReport(request, result => {
    if (result.status === true) {
      response.status(200).send(result.data)
    } else {
      response.status(400).send(result)
    }
  })
})

/**
 * This service is used to get the Raw Car Data details
 * @param request
 * @param response
 */
router.post('/getRawCarDataReport', (request, response) => {
  stores.getRawCarDataReport(request, result => {
    if (result.status === true) {
      if (request.query.reportType === 'rr1') {
        response.status(200).send(result)
      } else if (request.query.reportType === 'rrcsv1') {
        // TODO: Call the CSV file generation function to generate and send an email
      }
    } else {
      response.status(400).send(result.error)
    }
  })
})

/**
 * Generates Csv for the given input details .
 * Expects email, subject and csv data
 * @param request
 * @param response
 */
router.post('/generatecsv', VerifyToken, (request, response) => {
  const input = {
    email: request.email,
    subject: request.subject,
    attachment: request.attachment
  }
  stores.generateCsv(input, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
})

module.exports = router
