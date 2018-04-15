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
  console.log('REQUEST', request)
  let output = {}
    const templateId = request.query.templetId//validate.isNumeric(request.query.templateId)
    if (templateId) {
        templateController.get(templateId, request, (result) => {
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
<<<<<<< HEAD
  if (!input.AccountId) {
    output.error = input.t('LISTGROUP.accountId')
    output.status = false
    callback(output)
  }

  if (input.AccountId) {
    values.AccountId = input.AccountId
    values.CreatedBy = input.AccountId
=======
    console.log("The logged in user Id", input.userId)
 
    if (input.userId) {
        values.UserUid = input.userId
>>>>>>> b19199fa8550b13d87b855d8f5964b6c4e4c1735
    templateController.getAll(values, input, (result) => {
      callback(result)
    })
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
