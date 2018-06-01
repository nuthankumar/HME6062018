const express = require('express')
const router = express.Router()
// const VerifyToken = require('../Controllers/AuthenticationController')
// const storeValidator = require('../Validators/StoreValidator')
// Old method
const ReportController = require('../Controllers/ReportController')
const StoreReportController = require('../Controllers/StoreReportController')
const authValidator = require('../Controllers/AuthenticationController')

/**
* This Service is used to Generate the Summary reports details for
*provided details
* @param request
* @param response
*
*/
router.post('/oldgeneratereport', authValidator, (request, response) => {
  let getReports = new ReportController(request)
  getReports.createReports(response)
})

router.post('/generatereport', authValidator, (request, response) => {
  let getReports = new StoreReportController(request)
  getReports.createReports(response)
})

module.exports = router
