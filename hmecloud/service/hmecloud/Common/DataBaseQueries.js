
const sqlQueries = {
  'GroupHierarchy': {
    'getgroupDetails': 'exec [usp_GetGroupDetailsByGroupId] @GroupId = :groupId',
    'getAllAvailableGroupsAndStores': 'exec [usp_GetAllAvailableGroupsAndStores] @AccountId = :accountId',
    'getGroupHierarchy': 'exec [dbo].[usp_GetGroupHierarchy]  @AccountId= :accountId, @UserUid=:userUid',
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
@Devices = :DeviceUUIds,
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
                 @Device_IDs  =:ReportTemplate_DeviceIds
                ,@StoreStartDate = :ReportTemplate_From_Date
                ,@StoreEndDate = :ReportTemplate_To_Date
                ,@StartDateTime =:fromDateTime
                ,@EndDateTime =:toDateTime
                ,@CarDataRecordType_IDs=:ReportTemplate_Type
                ,@ReportType =:ReportType
                ,@LaneConfig_ID=:LaneConfig_ID`
  },
  'users': {
    'createuser': `exec [dbo].[usp_InsertUser]
    @Uid =:Uid,
    @IsActive =:IsActive,
    @IsVerified =:IsVerified,
    @ResetPassword =:ResetPassword,
    @OwnerAccountId =:OwnerAccountId,
    @CompanyId =:CompanyId,
    @FirstName =:FirstName,
    @LastName =:LastName,
    @EmailAddress =:EmailAddress,
    @PasswordHash =:PasswordHash,
    @PasswordSalt =:PasswordSalt,
    @CreatedDTS =:CreatedDTS,
    @CreatedBy =:CreatedBy,
    @Stores =:Stores,
    @UserRole =:UserRole`,
    'getuser': `EXEC [dbo].[usp_GetUserById] @Uid =:id`,
    'getUserAudit': `EXEC [dbo].[usp_GetUserAudit] @UserUid =:id`,
    'deleteuser': `EXEC [dbo].[usp_DeleteUser] @Uid =:id`,

    'updateuser': `EXEC [dbo]. [usp_UpdateUser]
                    @Uid =:Uid,
                    @IsActive =:IsActive,
                    @FirstName =:FirstName,
                    @LastName =:LastName,
                    @EmailAddress =:EmailAddress,
                    @UpdatedDTS =:UpdatedDTS,
                    @Stores =:Stores,
                    @UserRole =:UserRole`
  },
  ROLES: {
    userRoles: 'EXEC [dbo].[usp_GetRoles] @AccountId = :AccountId, @IsCorporate = null, @IsHidden =null, @UserUid=:userUid'
  },
  Permission: {
    GetByUser: '[dbo].[usp_GetPermissionsByUser]',
    Parameters: {

    }
  },
  Account: {
    Parameters: {
      AccountId: 'AccountId'
    }
  },
  User: {
    Parameters: {
      UserUid: 'UserUid'
    }
  },
  Role: {
    Parameters: {
    },
    getRoles: '[dbo].[usp_GetRoles]'
  },
  DeviceStatus: {
    getStatus: '[dbo].[usp_getDeviceById]'
  },
  merge: {
    parameters: {
      StoreUid: 'StoreUid',
      DeviceUid: 'DeviceUid'
    },
    getStatus: {
      check: '[dbo].[usp_MergeStoresCheck]',
      info: '[dbo].[usp_MergeStoresDeviceInfo]'
    }
  },
  MasterSetting: {
    getStatus: '[dbo].[usp_GetMasterSettings]',
    saveStatus: '[dbo].[InsertBulkDeviceSettingTask]'
  },
  Country: {
    getCountries: '[dbo].[usp_GetCountries]'
  },
  TimeZone: {
    getTimeZones: '[dbo].[usp_GetTimeZones]'
  },
  Brand: {
    getBrands: '[dbo].[usp_GetBrands]'
  },
  Reports: {
    getWeekReport: '[dbo].[usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic]',
    getDayPartReport: '[dbo].[usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic]',
    getDayReport: '[dbo].[usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic]',
    getRawCarData: '[dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic]',
    getODSDaypartReport: '[dbo].[usp_GetReportByDaypart]',
    getGroupNameByDeviceID: '[dbo].[usp_GetGroupNameByDeviceIDs]',
    getSystemStatistics: '[dbo].[usp_ReportStatistics]',
    getODSRawcardataReport: '[dbo].[usp_GetReportRawData]',
    getODSReportByDate: '[dbo].[usp_GetReportByDate]',
    getODSWeekReport: '[dbo].[usp_GetReportByWeek]'
  },

  DeviceUid: {
    Parameters: {
      DeviceUid: 'DeviceUid'
    }
  },

  DeviceIds: {
    Parameters: {
      Device_IDs: 'Device_IDs'
    }
  },
  DeviceID: {
    Parameters: {
      DeviceID: 'Device_ID'
    }
  },
  MasterSettingsIds: {
    Parameters: {
      Device_ID: 'Device_ID',
      Device_LaneConfig_ID: 'Device_LaneConfig_ID',
      Device_MainVersion: 'Device_MainVersion',
      Store_Company_ID: 'Store_Company_ID',
      Store_Brand_ID: 'Store_Brand_ID'
    }
  },
  MasterSettingsSave: {
    Parameters: {
      SourceDevice_UID: 'SourceDevice_UID',
      DestinationDevice_IDS: 'DestinationDevice_IDS',
      Group_IDS: 'Group_IDS',
      CreatedBy: 'CreatedBy'
    }
  },
  StartDate: {
    Parameters: {
      StoreStartDate: 'StoreStartDate'
    }
  },
  EndDate: {
    Parameters: {
      StoreEndDate: 'StoreEndDate'
    }
  },
  OpenTime: {
    Parameters: {
      InputStartDateTime: 'InputStartDateTime'
    }
  },
  CloseTime: {
    Parameters: {
      InputEndDateTime: 'InputEndDateTime'
    }
  },
  ReportType: {
    Parameters: {
      ReportType: 'ReportType'
    }
  },
  Lane: {
    Parameters: {
      LaneConfig_ID: 'LaneConfig_ID'
    }
  },
  PageNumber: {
    Parameters: {
      PageNumber: 'PageNumber'
    }
  },
  CarRecordTypeID: {
    Parameters: {
      CarDataRecordType_IDs: 'CarDataRecordType_IDs'
    }
  },
  StartDateTime: {
    Parameters: {
      StartDateTime: 'StartDateTime'
    }
  },
  EndDateTime: {
    Parameters: {
      EndDateTime: 'EndDateTime'
    }
  },
  UserUID: {
    Parameters: {
      UserUID: 'UserUID'
    }
  },
  Server: {
    Parameters: {
      DatabaseName: 'DatabaseName',
      LinkedServerName: 'LinkedServerName'
    }
  },
  Stores: {
    getAllStores: '[dbo].[usp_GetAllStores]',
    getStoreDetailsByUID: '[dbo].[usp_GetStoreById]',
    saveStoreDetails: '[dbo].[usp_UpdateStoreDetails]',
    Parameters: {
      User_UID: 'UserUid',
      isAdmin: 'isAdmin',
      criteria: 'criteria',
      filter: 'filter',
      SortingColumnName: 'SortingColumnName',
      SortingType: 'SortingType',
      RecordPerPage: 'RecordPerPage',
      PageNumber: 'PageNumber',
      Store_UID: 'Store_UID',
      Company_ID: 'Company_ID',
      AzureData: 'AzureData',
      Store_ID: 'Store_ID',
      timeZone: 'timeZone'
    }
  },
  Device: {
    removeByDUID: '[dbo].[usp_RemoveDeviceByUID]',
    getunRegisterDevices: '[dbo].[usp_GetUnregisteredSystems]',
    Parameters: {
      Device_UIDs: 'Device_UIDs'
    }
  },
  util: {
    Parameters: {
      criteria: 'criteria',
      filter: 'filter',
      SortingColumnName: 'SortingColumnName',
      SortingType: 'SortingType',
      RecordPerPage: 'RecordPerPage',
      PageNumber: 'PageNumber'
    }
  }
}

module.exports = sqlQueries
