const express = require('express')
const router = express.Router()
var VerifyToken = require('../../Controllers/AuthenticationController/Authentication')
const messages = require('../../common/message')
const stores = require('../../Controllers/StoreController/Stores')
const validate = require('validator')

/**
 * This Service is used to Generate the Summary reports details for
 *provided details
 * @param request
 * @param response
 *
 */

router.post('/generatereport', (req, res) => {
  const input = {
    stores: req.body.stores,
    fromDate: req.body.fromDate,
    toDate: req.body.toDate,
    openTime: req.body.openTime,
    type: req.body.type,
    advanceType: req.body.advanceType,
    include: req.body.include,
    format: req.body.format,
    templateName: req.body.templateName
  }
  console.log(input)

  if (input !== null) {
    stores.generateSummaryReport(input, response => {
      if (response.status === true) {
        res.status(200).send(response)
      } else {
        res.status(400).send(response)
      }
    })
  } else {
    res
      .status(400)
      .send({
        error: messages.CREATEGROUP.invalidRequestBody,
        status: false
      })
  }
})

/*
 * This service is used to get the Raw Car Data details
 */
router.post('/getRawCarDataReport', (request, res) => {
  const input = {
    ReportTemplate_StoreId: request.body.reportTemplateStoreId,
    ReportTemplate_Advanced_Op: request.body.reportTemplateAdvancedOp,
    ReportTemplate_Time_Measure: request.body.reportTemplateTimeMeasure,
    ReportTemplate_From_Date: request.body.reportTemplateFromDate,
    ReportTemplate_To_Date: request.body.reportTemplateToDate,
    ReportTemplate_From_Time: request.body.reportTemplateFromTime,
    ReportTemplate_To_Time: request.body.reportTemplateToTime,
    ReportTemplate_Open: request.body.reportTemplateOpen,
    ReportTemplate_Close: request.body.reportTemplateClose,
    ReportTemplate_Type: request.body.reportTemplateType,
    ReportTemplate_Include_Longs: request.body.reportTemplateIncludeLongs,
    ReportTemplate_Format: request.body.reportTemplateFormat
  }
  if (input.ReportTemplate_StoreId && validate.isNumeric(input.ReportTemplate_StoreId)) {
    if (input.ReportTemplate_From_Date && input.ReportTemplate_To_Date) {
      if (input.ReportTemplate_From_Date === input.ReportTemplate_To_Date) {
        if (request.query.reportType === 'rr1' || request.query.reportType === 'rrcsv1') {
          stores.getRawCarDataReport(input, response => {
            if (response.status === true) {
              if (request.query.reportType === 'rr1') {
                res.status(200).send(response)
              } else if (request.query.reportType === 'rrcsv1') {
                // TODO: Call the CSV file generation function to generate and send an email
              }
            } else {
              const output = {
                data: error,
                status: false
              }
              res.status(400).send(response)
            }
          })
        } else {
          res.status(400).send({
            error: messages.REPORTSUMMARY.InvalidReportType,
            status: false
          })
        }
      } else {
        res.status(400).send({
          error: messages.REPORTSUMMARY.DateRangeInvalid,
          status: false
        })
      }
    } else {
      res.status(400).send({
        error: messages.REPORTSUMMARY.DateCannotbeEmpty,
        status: false
      })
    }
  } else {
    res.status(400).send({
      error: messages.REPORTSUMMARY.InvalidStoreId,
      status: false
    })
  }
})

/**
 * Time Measure
 * get method with no input
 */
router.get('/timemeasure', (req, res) => {
  stores.timeMeasure((response) => {
    if (response.status === true) {
      res.status(200).send(response)
    } else {
      res.status(400).send(response)
    }
  })
})

router.post('/generatecsv', VerifyToken, (req, res) => {
  const input = {
    type: 'Day',
    AccountId: 0
  }
  stores.generateCSV(input, response => {
    if (response.status === true) {
      res.status(200).send(response)
    } else {
      res.status(400).send(response)
    }
  })
})

module.exports = router
