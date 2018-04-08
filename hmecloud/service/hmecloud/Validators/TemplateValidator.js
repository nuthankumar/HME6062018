const validate = require('validator')
const messages = require('../Common/Message')
const templateController = require('../Controllers/ReportTemplateController')

/**
 * The method can be used to execute create the report template
 * @param  {input} input input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (input, callback) => {
  let output = {}
  if (input.templateName) {
    templateController.create(input, (result) => {
      callback(result)
    })
  } else {
    output.error = messages.REPORTSUMMARY.invalidTemplateName
    output.status = false
    callback(output)
  }
}

/**
 * The method can be used to execute get the report template
 * @param  {input} input templateid from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (input, callback) => {
  let output = {}
  if (input.templateId) {
    templateController.get(input.templateId, (result) => {
      callback(result)
    })
  } else {
    output.error = messages.REPORTSUMMARY.invalidTemplateId
    output.status = false
    callback(output)
  }
}

/**
 * The method can be used to execute getall the report templates
 * @param  {input} input accountId,createdBy from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, callback) => {
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
    templateController.getAll(values, (result) => {
      callback(result)
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

/**
 * The method can be used to execute delete the report template
 * @param  {input} input templateId from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (input, callback) => {
  let output = {}
  const templateId = validate.isNumeric(input.templateId)
  if (!templateId) {
    output.error = messages.REPORTSUMMARY.invalidTemplateId
    output.status = false
  }
  templateController.deleteById(input.templateId, (result) => {
    callback(result)
  })
}
module.exports = {
  create,
  get,
  getAll,
  deleteById
}
