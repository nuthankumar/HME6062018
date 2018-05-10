const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')
const storeValidator = require('../Validators/StoreValidator')
const ReportController = require('../Controllers/ReportController')
const authValidator = require('../Controllers/AuthenticationController')

/**
* This Service is used to Generate the Summary reports details for
*provided details
* @param request
* @param response
*
*/
router.post('/generatereport', authValidator, (request, response) => {
  let getReports = new ReportController(request)
  getReports.createReports(response)
})
module.exports = router
