
const sqlQueries = {
  'GroupHierarchy': {
    'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
    'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId',
    'getGroupHierarchy': 'exec [dbo].[usp_GetGroupHierarchy]  @AccountId= :accountId',
    'deleteGroupByGroupId': 'exec usp_DeleteGroupByGroupId @GroupId= :groupId'
  },
  'ReportTemplates': {
    'createReportTemplate': '[dbo].[usp_InsertReportTemplate] @AccountId  =:AccountId  ,@Stores = :Stores,@TimeMeasure = :TimeMeasure ,@FromDate =:FromDate,@ToDate =:FromDate ,@OpenTime=:OpenTime ,@CloseTime =:CloseTime,@Type=:Type,@Open=:Open, @Close=:Close,@Include=:Include,@Format=:Format,@TemplateName=:TemplateName,@CreatedBy=:CreatedBy,@UpdatedBy=:UpdatedBy,@CreatedDateTime=:CreatedDateTime, @UpdatedDateTime=:UpdatedDateTime',
    'getAllReportsTemplates': 'exec [dbo].[usp_GetReportTemplates] @AccountId =:AccountId, @CreatedBy =:CreatedBy',
    'getReportsTemplate': 'exec [dbo].[usp_GetReportTemplateByID]  @Id = :id',
    'deleteTemplate': 'exec [dbo].[usp_DeleteReportTemplate]  @Id = :id'
  }
}

module.exports = sqlQueries
