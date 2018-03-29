const express = require('express')
const router = express.Router()
var VerifyToken = require('../../Controllers/AuthenticationController/Authentication')
const messages = require('../../common/message')
const groupController = require('../../Controllers/StoreController/Stores')

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
    groupController.generateSummaryReport(input, response => {
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

/**
 * Time Measure
 * get method with no input
 */
router.get('/timemeasure', (req, res) => {
  groupController.timeMeasure((response) => {
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
  groupController.generateCSV(input, response => {
    if (response.status === true) {
      res.status(200).send(response)
    } else {
      res.status(400).send(response)
    }
  })
})

module.exports = router
