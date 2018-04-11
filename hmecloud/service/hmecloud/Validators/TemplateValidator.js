const validate = require('validator')
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
  if (!input.AccountId) {
    output.error = input.t('LISTGROUP.accountId')
    output.status = false
    callback(output)
  }
 
  if (input.AccountId) {
    values.AccountId = input.AccountId
      values.CreatedBy = input.AccountId
    templateController.getAll(values, input, (result) => {
      callback(result)
    })
  }  else {
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
  templateController.deleteById(input, (result) => {
    callback(result)
  })
}
module.exports = {
  create,
  get,
  getAll,
  deleteById
}
