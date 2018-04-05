
const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration')
const sqlQuery = require('../Common/DataBaseQueries')

const create = (reportTemplate, callback) => {
  repository.execute(sqlQuery.ReportTemplates.createReportTemplate, {
    replacements: reportTemplate,
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result))
}
const get = (reportTemplateId, callback) => {
  repository.execute(sqlQuery.ReportTemplates.getReportsTemplate, {
    replacements: { id: reportTemplateId },
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result[0]))
}
const getAll = (accountId, createdById, callback) => {
  repository.execute(sqlQuery.ReportTemplates.getAllReportsTemplates, {
    replacements: { AccountId: accountId, CreatedBy: createdById }
  }, callback)
}
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
