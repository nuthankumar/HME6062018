const express = require('express')
const validate = require('validator')
const router = express.Router()

//   controller config
//   Config error messages
const messages = require('../../common/message')

const templatecontroller = require('../../Controllers/ReportTemplateController/ReportTemplates')

/**
 * get all the details
 * Passing templet id and AccountId
 */

router.get('/list', (req, res) => {
  if (req.query.accountId && req.query.createdBy) {
    const input = {
      AccountId: req.query.accountId,
      CreatedBy: req.query.createdBy
    }
    const AccountId = validate.isNumeric(input.AccountId)
    const CreatedBy = validate.isNumeric(input.CreatedBy)
    if (!AccountId) {
      res.status(400).send({
        error: messages.LISTGROUP.accountId,
        status: false
      })
    }
    if (!CreatedBy) {
      res.status(400).send({
        error: messages.LISTGROUP.createdBy,
        status: false
      })
    }
    if (AccountId ) {
        templatecontroller.getReportTemplates(input, response => {
        if (response.status === true) {
          res.send(response)
        } else {
          res.status(400).send(response)
        }
      })
    }
  } else if (!req.query.AccountId && req.query.CreatedBy) {
    res.status(400).send({
      error: messages.LISTGROUP.accountId,
      status: false
    })
  } else if (req.query.AccountId && !req.query.createdBy) {
    res.status(400).send({
      error: messages.LISTGROUP.createdBy,
      status: false
    })
  } else {
    res.status(400).send({
      error: messages.LISTGROUP,
      status: false
    })
  }
})

//   Create a template list

router.post('/create', (req, res) => {
    if (req.body.templateName) {
        const input = {
            AccountId: 100, //     TODO: To be updated
            Stores: (req.body.selectedList).toString(),
            TimeMeasure: req.body.timeMeasure,
            FromDate: req.body.fromDate,
            ToDate: req.body.toDate,
            OpenTime: req.body.openTime,
            CloseTime: req.body.closeTime,
            Type: req.body.type,
            Open: req.body.open,
            Close: req.body.close,
            Include: (req.body.include).toString(),
            Format: req.body.format,
            TemplateName: req.body.templateName,
            CreatedBy: 1000 //     TODO: To be updated based on Logged in User
        }
        if (input.AccountId) {
            templatecontroller.createReportTemplate(input, response => {
                if (response.status === true) {
                    res.send(response)
                } else {
                    res.status(400).send(response)
                }
            })
        }
    } else {
        res.status(400).send({
            error: messages.REPORTSUMMARY.invalidTemplateName,
            status: false
        })
    }
});

router.delete('/delete', (req, res) => {
  if (req.query.templetId) {
    const input = {
      Id: req.query.templetId,
      AccountId: 100 // TODO: To be updated with actual value
    }
    const templateId = validate.isNumeric(input.Id)

    if (!templateId) {
      res.status(400).send({
        error: messages.REPORTSUMMARY.invalidTemplateId,
        status: false
      })
    }
    templatecontroller.deleteReportTemplate(input, response => {
      if (response.status === true) {
        res.send(response)
      } else {
        res.status(400).send(response)
      }
    })
  } else {
    res.status(400).send({
      error: messages.REPORTSUMMARY.invalidTemplateId,
      status: false
    })
  }
})

router.get('/gettemplate', (req, res) => {
    const output = {
        data: {}
    }
    if (req.query.templetId) {
        const input = {
            Id: req.query.templetId,
            AccountId: 100 // TODO: To be updated with actual value
        }
        const templateId = validate.isNumeric(input.Id)

        if (!templateId) {
            res.status(400).send({
                error: messages.REPORTSUMMARY.invalidTemplateId,
                status: false
            })
        }
        templatecontroller.getReportTemplate(input, response => {
            if (response.status === true) {
                const Stores = response.data.Stores.split(",")
                const Include = response.data.Include.split(",")
                output.data.accountId = response.data.AccountId
                output.data.selectedList = Stores
                output.data.timeMeasure = response.data.TimeMeasure
                output.data.fromDate = response.data.FromDate
                output.data.toDate = response.data.ToDate
                output.data.openTime = response.data.OpenTime
                output.data.closeTime = response.data.CloseTime
                output.data.templateName = response.data.TemplateName
                output.data.open = response.data.Open
                output.data.close = response.data.Close
                output.data.type = response.data.Type
                output.data.include = Include
                output.data.format = response.data.Format
                output.status = true
                res.send(output)
            } else {
                res.status(400).send(response)
            }
        })
    } else {
        res.status(400).send({
            error: messages.REPORTSUMMARY.invalidTemplateId,
            status: false
        })
    }
});

module.exports = router
