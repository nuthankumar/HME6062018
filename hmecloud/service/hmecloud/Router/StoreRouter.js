const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')
const storeValidator = require('../Validators/StoreValidator')
const authValidator = require('../Controllers/AuthenticationController')
/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */
router.post('/generatereport', authValidator, (request, response) => { 
  storeValidator.reportValidator(request, result => {
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
router.post('/getRawCarDataReport', authValidator, (request, response, next) => {
   
  storeValidator.reportValidator(request, result => {
    if (result.status === true) {
      response.status(200).send(result)      
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
router.post('/generatecsv', authValidator, VerifyToken, (request, response) => {
  storeValidator.csvValidator(request.body, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
})

module.exports = router
