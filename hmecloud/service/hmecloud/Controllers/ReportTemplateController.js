
const messages = require('../Common/Message')
const repository = require('../Repository/ReportTemplateRepository')

/**
 * The method can be used to execute handel errors and return to routers.
 * @param  {input} message input from custom messages.
 * @param  {input} status input false.
 * @public
 */
const errorHandler = (message, status) => {
  let output = {}
  output.error = message
  output.status = status
  return output
}

/**
 * The method can be used to execute create Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (reportTemplate, callback) => {
  let output = {}
  const values = {
    AccountId: reportTemplate.AccountId,
    Stores: (reportTemplate.body.selectedList).toString(),
    TimeMeasure: reportTemplate.body.timeMeasure,
    FromDate: reportTemplate.body.fromDate,
    ToDate: reportTemplate.body.toDate,
    OpenTime: reportTemplate.body.openTime,
    CloseTime: reportTemplate.body.closeTime,
    Type: reportTemplate.body.type,
    Open: reportTemplate.body.open,
    Close: reportTemplate.body.close,
    Include: (reportTemplate.body.include).toString(),
    Format: reportTemplate.body.format,
    TemplateName: reportTemplate.body.templateName,
    CreatedBy: reportTemplate.AccountId,
    UpdatedBy: reportTemplate.AccountId,
    CreatedDateTime: reportTemplate.body.CreatedDateTime,
    UpdatedDateTime: reportTemplate.body.UpdatedDateTime
  }
  repository.create(values, (result) => {
    if (result) {
      output.data = messages.REPORTSUMMARY.createSuccess
      output.status = true
      callback(output)
    } else {
      callback(errorHandler(messages.REPORTSUMMARY.createFail, false))
    }
  })
}

/**
 * The method can be used to execute get Report Template
 * @param  {input} reportTemplate input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (reportTemplate, callback) => {
  let output = {}
  repository.get(reportTemplate, (result) => {
    if (result) {
      const Stores = result.Stores.split(',')
      const Include = result.Include.split(',')
      output.data = result
      output.data.SelectedList = Stores
      output.data.Include = Include
      output.status = true
      callback(output)
    } else {
      callback(errorHandler(messages.LISTGROUP.notfound, false))
    }
  })
}

/**
 * The method can be used to execute getAll Report Templates
 * @param  {input} AccountId input from  user request
 * @param  {input} CreatedBy input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (input, callback) => {
  let output = {}
  repository.getAll(input.AccountId, input.CreatedBy, (result) => {
    if (result.length > 0) {
      output.data = result
      output.status = true
      callback(output)
    } else {
      callback(errorHandler(messages.LISTGROUP.notfound, false))
    }
  })
}
/**
 * The method can be used to execute delete the report template
 * @param  {input} input input from  user request
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (input, callback) => {
  let output = {}
  repository.deleteById(input, (result) => {
    if (result) {
      output.data = messages.REPORTSUMMARY.deleteSuccess
      output.status = true
      callback(output)
    } else {
      callback(errorHandler(messages.REPORTSUMMARY.deteleFail, false))
    }
  })
}

module.exports = {
  create,
  deleteById,
  get,
  getAll
}
