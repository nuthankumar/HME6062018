
const sqlQueries = {
  'GroupHierarchy': {
    'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
    'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId',
    'getGroupHierarchy': 'exec [dbo].[usp_GetGroupHierarchy]  @AccountId= :accountId',
    'deleteGroupByGroupId': 'exec usp_DeleteGroupByGroupId @GroupId= :groupId',
    'createGroup': 'exec usp_CreateGroup :groupName, :description, :accountId, :userName, :groups, :stores',
    'updateGroup': 'exec usp_UpdateGroup :groupId, :groupName, :description, :accountId, :userName, :groups, :stores'
  },
  'ReportTemplates': {
    'createReportTemplate': `exec [dbo].[usp_InsertReportTemplate]
	@Uid = :Uid,
@TemplateName = :TemplateName,
@SessionUid = :SessionUid,
@UserUid = :UserUid,
@Devices = :Stores,
@TimeMeasure = :TimeMeasure,
@FromDate = :FromDate,
@OpenTime = :OpenTime,
@ToDate = :ToDate,
@CloseTime = :CloseTime,
@Open = :Open,
@Close = :Close,
@Type = :Type,
@AdvancedOption = :AdvancedOption,
@IncludeStats = :SystemStatistics,
@IncludeLongs = :LongestTime,
@Format = :Format,
@CreatedDateTime = :CreatedDateTime,
@CreatedBy = :CreatedBy
`,

    'getAllReportsTemplates': 'exec [dbo].[usp_GetReportTemplates] @UserUid = :UserUid',
    'getReportsTemplate': 'exec [dbo].[usp_GetReportTemplateByID]  @Id = :id',
    'deleteTemplate': 'exec [dbo].[usp_DeleteReportTemplate]  @Id = :id'
  },
  'SummarizedReport': {
    'getRawData':
            `exec [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details]
                 @StoreId  =:ReportTemplate_StoreIds
                ,@StoreStartDate = :ReportTemplate_From_Date
                ,@StoreEndDate = :ReportTemplate_To_Date
                ,@StartDateTime =:fromDateTime
                ,@EndDateTime =:toDateTime
                ,@CarDataRecordType_IDs=:ReportTemplate_Type
                ,@ReportType =:ReportType
                ,@LaneConfig_ID=:LaneConfig_ID`,
    'weekReport': ` EXEC usp_HME_Cloud_Get_Report_By_Week_Details  @StoreIDs =:StoreIDs,
                  @StoreStartDate =:StoreStartDate,
                  @StoreEndDate =:StoreEndDate,
                  @StartDateTime =:StartDateTime,
                  @EndDateTime =:EndDateTime,
                  @CarDataRecordType_ID =:CarDataRecordType_ID,
                  @ReportType =:ReportType,
                  @LaneConfig_ID =:LaneConfig_ID`
  }
}

module.exports = sqlQueries
