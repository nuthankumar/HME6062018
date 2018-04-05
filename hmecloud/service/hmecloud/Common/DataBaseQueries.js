
const sqlQueries = {
  'ReportTemplates': {
    'getAllReportsTemplates': 'select distinct Id, TemplateName from ReportTemplates where AccountId= :AccountId  and CreatedBy= :CreatedBy'
    },
    'GroupHierarchy': {
        'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
        'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId'
    }
}

module.exports = sqlQueries
