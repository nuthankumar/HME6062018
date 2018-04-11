const validate = require('validator')
const messages = require('../Common/Message')
const templateController = require('../Controllers/ReportTemplateController')

/**
 * The method can be used to execute create the report template
 * @param  {input} input input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (request, callback) => {
  let output = {}
  if (request.body.templateName) {
    templateController.create(request, (result) => {
      callback(result)
    })
  } else {
    output.error = request.t('REPORTSUMMARY.invalidTemplateName')
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
const get = (request, callback) => {
  let output = {}
  const templateId = validate.isNumeric(request.query.templateId)
  if (templateId) {
    templateController.get(request.query.templateId, request, (result) => {
      callback(result)
    })
  } else {
    output.error = request.t('REPORTSUMMARY.invalidTemplateId')
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
  const AccountId = validate.isNumeric(input.query.accountId)
  const CreatedBy = validate.isNumeric(input.query.createdBy)
  if (!AccountId) {
    output.error = input.t('LISTGROUP.accountId')
    output.status = false
    callback(output)
  }
  if (!CreatedBy) {
    output.error = input.t('LISTGROUP.createdBy')
    output.status = false
    callback(output)
  }
  if (AccountId && CreatedBy) {
    values.AccountId = input.query.accountId
    values.CreatedBy = input.query.createdBy
    templateController.getAll(values, input, (result) => {
      callback(result)
    })
  } else if (!AccountId && CreatedBy) {
    output.error = input.t('LISTGROUP.accountId')
    output.status = false
    callback(output)
  } else if (AccountId && !CreatedBy) {
    output.error = input.t('LISTGROUP.createdBy')
    output.status = false
    callback(output)
  } else {
    output.error = input.t('CREATEGROUP.invalidInput')
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
  const templateId = validate.isNumeric(input.query.templateId)
  if (!templateId) {
    output.error = input.t('REPORTSUMMARY.invalidTemplateId')
    output.status = false
    callback(output)
  }
  templateController.deleteById(input.query.templateId, (result) => {
    callback(result)
  })
}
module.exports = {
  create,
  get,
  getAll,
  deleteById
}
