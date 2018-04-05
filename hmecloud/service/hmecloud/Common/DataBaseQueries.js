
const sqlQueries = {
   'GroupHierarchy': {
        'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
        'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId',
        'getGroupHierarchy': 'exec [dbo].[usp_GetGroupHierarchy]  @AccountId= :accountId',
        'deleteGroupByGroupId': 'exec usp_DeleteGroupByGroupId @GroupId= :groupId'
   },
  'ReportTemplates': {
    'createReportTemplate': 'INSERT INTO dbo].[ReportTemplates] AccountId ,Stores,TimeMeasure,FromDate,ToDate ,OpenTime ,CloseTime,Type,Open,Close,Include,Format,TemplateName,CreatedBy,UpdatedBy,CreatedDateTime,UpdatedDateTime VALUES :AccountId,:Stores:TimeMeasure,:FromDate,:ToDate,:OpenTime,:CloseTime,:Type,:Open,:Close, :Include,:Format,:TemplateName,:CreatedBy,:UpdatedBy, :CreatedDateTime,:UpdatedDateTime',
    'getAllReportsTemplates': 'exec [dbo].[GetReportTemplates] @AccountId =:AccountId, @CreatedBy =:CreatedBy',
    'getReportsTemplate': 'exec [dbo].[GetReportTemplatesById]  @Id = :id',
    'deleteTemplate': 'delete from ReportTemplates where id = :id'
  }
}

module.exports = sqlQueries
