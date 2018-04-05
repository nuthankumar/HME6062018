const express = require('express')
const router = express.Router()
const VerifyToken = require('../Controllers/AuthenticationController')

const messages = require('../Common/Message')
const stores = require('../Controllers/StoreController')
const validate = require('validator')

/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param requestuest
 * @param response
 *
 */

router.post("/generatereport", (request, response) => {
  stores.generateSummaryReport(request, response => {
    if (response.status === true) {
      response.status(200).send(response);
    } else {
      response.status(400).send(response);
    }
  });
});

/*
 * This service is used to get the Raw Car Data details
 */
router.post('/getRawCarDataReport', (requestuest, response) => {
  const input = {
    ReportTemplate_StoreId: requestuest.body.reportTemplateStoreId,
    ReportTemplate_Advanced_Op: requestuest.body.reportTemplateAdvancedOp,
    ReportTemplate_Time_Measure: requestuest.body.reportTemplateTimeMeasure,
    ReportTemplate_From_Date: requestuest.body.reportTemplateFromDate,
    ReportTemplate_To_Date: requestuest.body.reportTemplateToDate,
    ReportTemplate_From_Time: requestuest.body.reportTemplateFromTime,
    ReportTemplate_To_Time: requestuest.body.reportTemplateToTime,
    ReportTemplate_Open: requestuest.body.reportTemplateOpen,
    ReportTemplate_Close: requestuest.body.reportTemplateClose,
    ReportTemplate_Type: requestuest.body.reportTemplateType,
    ReportTemplate_Include_Longs: requestuest.body.reportTemplateIncludeLongs,
    ReportTemplate_Format: requestuest.body.reportTemplateFormat
  }
  if (input.ReportTemplate_StoreId && validate.isNumeric(input.ReportTemplate_StoreId)) {
    if (input.ReportTemplate_From_Date && input.ReportTemplate_To_Date) {
      if (input.ReportTemplate_From_Date === input.ReportTemplate_To_Date) {
        if (requestuest.query.reportType === 'rr1' || requestuest.query.reportType === 'rrcsv1') {
          stores.getRawCarDataReport(input, response => {
            if (response.status === true) {
              if (requestuest.query.reportType === 'rr1') {
                response.status(200).send(response)
              } else if (requestuest.query.reportType === 'rrcsv1') {
                // TODO: Call the CSV file generation function to generate and send an email
              }
            } else {
              // const output = {
              //   data: error,
              //   status: false
              // }
              response.status(400).send(response)
            }
          })
        } else {
          response.status(400).send({
            error: messages.REPORTSUMMARY.InvalidReportType,
            status: false
          })
        }
      } else {
        response.status(400).send({
          error: messages.REPORTSUMMARY.DateRangeInvalid,
          status: false
        })
      }
    } else {
      response.status(400).send({
        error: messages.REPORTSUMMARY.DateCannotbeEmpty,
        status: false
      })
    }
  } else {
    response.status(400).send({
      error: messages.REPORTSUMMARY.InvalidStoreId,
      status: false
    })
  }
})

/**
 * Time Measure
 * get method with no input
 */
router.get('/timemeasure', (request, response) => {
  stores.timeMeasure((response) => {
    if (response.status === true) {
      response.status(200).send(response)
    } else {
      response.status(400).send(response)
    }
  })
})

router.post('/generatecsv', VerifyToken, (request, response) => {
  const input = {
    type: 'Day',
    AccountId: 0
  }
  stores.generateCSV(input, response => {
    if (response.status === true) {
      response.status(200).send(response)
    } else {
      response.status(400).send(response)
    }
  })
})

module.exports = router
