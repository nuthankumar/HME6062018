
const sqlQueries = {
  'ReportTemplates': {
    'getAllReportsTemplates': 'select distinct Id, TemplateName from ReportTemplates where AccountId= :AccountId  and CreatedBy= :CreatedBy'
    },
    'GroupHierarchy': {
        'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
        'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId',
        'getGroupHierarchy': 'exec [dbo].[usp_GetGroupHierarchy]  @AccountId= :accountId'
    }
}

module.exports = sqlQueries
