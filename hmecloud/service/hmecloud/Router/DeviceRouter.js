const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')
const authValidator = require('../Controllers/AuthenticationController')
const hmeRouter = require('./HmeRouter')
const deviceController = require('../Controllers/DeviceController')

/**
 * This service  using getAllDevices By device UID
 * @param  {endpoint} getDevices webservice name
 * @param  {funct} authenticator  check JWT authentication
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */
router.get('/getAllDevices', authValidator, VerifyToken, (request, response) => {
  deviceController.getAllUnregisteredDevices(request, result => hmeRouter.handelResult(result, response))
})

module.exports = router
