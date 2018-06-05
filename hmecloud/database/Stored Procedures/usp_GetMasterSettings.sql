/****** Dropping the StoredProcedure [dbo].[usp_GetMasterSettings] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetMasterSettings' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetMasterSettings]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserById
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Get user by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	04-JUNE-2018	Charan Kumar C	Changed from LEFT JOIN to INNER JOIN
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetMasterSettings]  @Device_ID = 138608, @Device_LaneConfig_ID = 1, @Device_MainVersion = '2.31.7.999', @Store_Company_ID = 1353, @Store_Brand_ID = 19
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetMasterSettings]
    @Device_ID				VARCHAR(36),
	@Device_LaneConfig_ID	smallint,
	@Device_MainVersion		VARCHAR(36),
	@Store_Company_ID		int,
	@Store_Brand_ID			int

AS
BEGIN

	SELECT DISTINCT group_id, group_name
	FROM  tbl_DeviceSettingGroup
	WHERE isActive = 1
	ORDER BY group_id

	SELECT DISTINCT dinf.Device_ID, stor.Store_Number
	FROM 
		[dbo].tbl_Stores stor
		INNER JOIN [dbo].tbl_DeviceInfo dinf ON dinf.Device_Store_ID = stor.Store_ID  AND dinf.Device_ID != @Device_ID
		AND dinf.Device_LaneConfig_ID =  @Device_LaneConfig_ID and dinf.Device_IsActive = 1
		AND dinf.Device_MainVersion = @Device_MainVersion
		INNER JOIN [dbo].tbl_DeviceConfigDetectors dtct ON  dtct.Device_ID = dinf.Device_ID 
	WHERE 
	stor.Store_Company_ID = @Store_Company_ID
	AND stor.Store_Brand_ID = @Store_Brand_ID
	AND [dbo].compareConfigs(@Device_ID,dinf.device_ID) = 1
	ORDER BY stor.Store_Number

END
GO