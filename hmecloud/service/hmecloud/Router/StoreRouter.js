const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')
const storeValidator = require('../Validators/StoreValidator')
const authValidator = require('../Controllers/AuthenticationController')
const hmeRouter = require('./HmeRouter')
const storeController = require('../Controllers/StoreController')
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
      response.status(200).send(result)
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
/**
 * TO DO
 */
router.get('/getAll', authValidator, VerifyToken, (request, response) => {
  storeValidator.getStores(request, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
})
/**
 *
 */
router.get('/get', authValidator, VerifyToken, (request, response) => {
  storeValidator.getStoreByUid(request, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
})

/**
 *
 */
router.post('/remove', authValidator, VerifyToken, (request, response) => {
  storeValidator.removeDeviceById(request, result => {
    if (result.status === true) {
      response.status(200).send(result)
    } else {
      response.status(400).send(result)
    }
  })
})

router.get('/settingsDevices', VerifyToken, (request, response) => {
  storeController.settingsDevices(request, result => hmeRouter.handelResult(result, response))
})

router.get('/settingsStores', VerifyToken, (request, response) => {
  storeController.settingsStores(request, result => hmeRouter.handelResult(result, response))
})

module.exports = router
