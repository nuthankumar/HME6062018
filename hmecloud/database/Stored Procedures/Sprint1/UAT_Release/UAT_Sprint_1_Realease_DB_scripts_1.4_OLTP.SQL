
IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_GetGroupNameByDeviceIDs')
DROP PROCEDURE usp_GetGroupNameByDeviceIDs
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetGroupNameByDeviceIDs
-- Author		:	Ramesh
-- Created		:	31-May-2018
-- Tables		:	Group,Stores and tbl_DeviceInfo
-- Purpose		:	To get Group name based on DeviceIDs passing
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.		
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_GetGroupNameByDeviceIDs]
(
@Device_IDs varchar(MAX)
)
AS
BEGIN	
	SELECT DISTINCT g.GroupName, ts.Store_ID , td.Device_ID
		FROM tbl_DeviceInfo td INNER JOIN tbl_Stores ts ON td.Device_Store_ID = ts.Store_ID
		LEFT JOIN GroupStore gs ON gs.StoreID = ts.Store_ID
		INNER JOIN [Group] g ON g.ID = gs.GroupID
		WHERE td.Device_ID in (SELECT cValue FROM dbo.split(@Device_IDs,','))

END
GO

IF EXISTS (SELECT * FROM sys.objects WHERE type = 'P' AND name = 'usp_ReportStatistics')
DROP PROCEDURE usp_ReportStatistics
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_ReportStatistics
-- Author		:	jaffer R
-- Created		:	31-05-2018
-- procedures	: GetDeviceSystemStatisticsGeneral, GetDeviceSystemStatisticsLane
-- tables		: itbl_User_Preferences
-- Purpose		: provides system general statistics
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 
--	
-- ===========================================================
-- EXEC [dbo].[usp_ReportStatistics]    @Device_ID='138623,123123',@StoreStartDate='2018-05-01', @StoreEndDate='2018-05-01',@UserUID='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- EXEC [dbo].[usp_ReportStatistics]   @UserUID='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_ReportStatistics]
    @Device_ID	VARCHAR(500) = NULL,
	@StoreEndDate	date = NULL,
	@StoreStartDate date = NULL,
	@UserUID	NVARCHAR(50) 

AS
BEGIN
DECLARE @Preferences_Preference_Value varchar(50)


	SET @Preferences_Preference_Value =''
	SELECT @Preferences_Preference_Value = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
		User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=5

	IF(ISNULL(@Preferences_Preference_Value,'') ='')
		SET @Preferences_Preference_Value = '#00b04c|#dcba00|#b40000'

	SELECT @Preferences_Preference_Value AS ColourCode
				
	IF @Device_ID is NOT NULL AND NOT EXISTS(SELECT 1 FROM dbo.Split(@Device_ID, ',') HAVING MAX(id) > 1)
	BEGIN 
		 
	EXEC GetDeviceSystemStatisticsGeneral @Device_ID,@StoreEndDate,@StoreStartDate

		-- include pullins
	DECLARE @IncludePullins bit
		SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
			FROM tbl_DeviceSetting WITH (NOLOCK) WHERE DeviceSetting_Device_ID = @Device_ID
					AND DeviceSetting_Setting_ID = '6002'

					
	EXEC GetDeviceSystemStatisticsLane  @Device_ID,@StoreEndDate,@StoreStartDate, @includePullins

	END
END
GO


