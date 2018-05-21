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
 * This service  using getAllStores By user UID
 * @param  {endpoint} getStore webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getAllStores', authValidator, VerifyToken, (request, response) => {
  storeController.getAllStores(request, result => hmeRouter.handelResult(result, response))
})

/**
 * This service  using getStore By UID
 * @param  {endpoint} getStore webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getStore', authValidator, VerifyToken, (request, response) => {
  storeController.getStoreByUid(request, result => hmeRouter.handelResult(result, response))
})

/**
 * This service  using remove device By device UID
 * @param  {endpoint} removeDevice webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.post('/removeDevice', authValidator, VerifyToken, (request, response) => {
  storeController.removeDeviceById(request, result => hmeRouter.handelResult(result, response))
})
router.get('/settingsDevices', VerifyToken, (request, response) => {
  storeController.settingsDevices(request, result => hmeRouter.handelResult(result, response))
})

router.get('/settingsStores', VerifyToken, (request, response) => {
  storeController.settingsStores(request, result => hmeRouter.handelResult(result, response))
})

router.post('/getMasterSettings', VerifyToken, (request, response) => {
  storeController.getMasterSettings(request, result => hmeRouter.handelResult(result, response))
})

router.post('/saveMasterSettings', VerifyToken, (request, response) => {
  storeController.saveMasterSettings(request, result => hmeRouter.handelResult(result, response))
})

router.post('/saveMergeDevices', VerifyToken, (request, response) => {
  storeController.saveMergeDevices(request, result => hmeRouter.handelResult(result, response))
})

router.get('/unRegisterDevicesSearch', VerifyToken, (request, response) => {
  storeController.unRegisterDevicesSearch(request, result => hmeRouter.handelResult(result, response))
})

module.exports = router
