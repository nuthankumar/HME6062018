
const sqlQueries = {
  'ReportTemplates': {
    'getAllReportsTemplates': 'select distinct Id, TemplateName from ReportTemplates where AccountId= :AccountId  and CreatedBy= :CreatedBy'
  }
}

module.exports = sqlQueries
