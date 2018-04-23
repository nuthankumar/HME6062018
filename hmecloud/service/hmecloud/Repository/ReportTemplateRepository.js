
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const sqlQuery = require('../Common/DataBaseQueries')

/**
 * The method can be used to execute create Report Template
 * @param  {input} reportTemplate create template input from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const create = (reportTemplate, callback) => {
  repository.execute(sqlQuery.ReportTemplates.createReportTemplate, {
    replacements: reportTemplate,
    type: dataBase.QueryTypes.SELECT
  }, callback)
}

/**
 * The method can be used to execute get Report Template
 * @param  {input} reportTemplateId templateId from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const get = (reportTemplateId, callback) => {
  repository.execute(sqlQuery.ReportTemplates.getReportsTemplate, {
    replacements: { id: reportTemplateId },
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result[0]))
}

/**
 * The method can be used to execute getall Report Template
 * @param  {input} accountId accountId   from  controller
 * @param  {input} createdById createdById  from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getAll = (UserUid, callback) => {
  repository.execute(sqlQuery.ReportTemplates.getAllReportsTemplates, {
    replacements: { UserUid: UserUid },
    type: dataBase.QueryTypes.SELECT
  }, callback)
}

/**
 * The method can be used to execute delete Report Template
 * @param  {input} reportTemplateId  reportTemplateId   from  controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const deleteById = (reportTemplateId, callback) => {
  repository.execute(sqlQuery.ReportTemplates.deleteTemplate, {
    replacements: { id: reportTemplateId },
    type: dataBase.QueryTypes.SELECT
  }, callback)
}
module.exports = {
  create,
  deleteById,
  get,
  getAll
}
