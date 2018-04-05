const validate = require('validator')
const messages = require('../Common/Message')
const templateController = require('../Controllers/ReportTemplateController')

const getalltemplate = (input, callback) => {
  let output = {}
  let values = {}
  const AccountId = validate.isNumeric(input.accountId)
  const CreatedBy = validate.isNumeric(input.createdBy)
  if (!AccountId) {
    output.error = messages.LISTGROUP.accountId
    output.status = false
    callback(output)
  }
  if (!CreatedBy) {
    output.error = messages.LISTGROUP.createdBy
    output.status = false
    callback(output)
  }
  if (AccountId && CreatedBy) {
    values.AccountId = input.accountId
    values.CreatedBy = input.createdBy
    templateController.getAllReportTemplates(values, (result) => {
      console.log("RESULT",result)
      if (result.length > 0) {
        output.data = result
        output.status = true
        callback(output)
      } else {
        output.error = messages.LISTGROUP.notfound
        output.status = false
        callback(output)
      }
    })
  } else if (!AccountId && CreatedBy) {
    output.error = messages.LISTGROUP.accountId
    output.status = false
    callback(output)
  } else if (AccountId && !CreatedBy) {
    output.error = messages.LISTGROUP.createdBy
    output.status = false
    callback(output)
  } else {
    output.error = messages.LISTGROUP
    output.status = false
  }
}

module.exports = {
  getalltemplate
}
