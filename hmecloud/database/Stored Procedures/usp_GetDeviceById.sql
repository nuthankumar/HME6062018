/****** Dropping the StoredProcedure [dbo].[usp_GetUserById] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetDeviceById' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetDeviceById]
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
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetDeviceById] @Device_IDs='2A19A147-AE3E-4EBF-82D3-9994E79B6FCB'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetDeviceById]
    @Device_IDs				VARCHAR(36)
AS
BEGIN


SET @Device_IDs = '2A19A147-AE3E-4EBF-82D3-9994E79B6FCB'
    SELECT Distinct stor.*,dinf.* FROM 
		tbl_Stores stor
		LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
		LEFT JOIN tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
		LEFT JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
		LEFT JOIN tbl_LaneConfig lane ON dinf.Device_LaneConfig_ID = lane.LaneConfig_ID
		LEFT JOIN itbl_User_Store iurs ON iurs.Store_ID = stor.Store_ID
		LEFT JOIN tbl_Users usrs ON usrs.User_ID = iurs.User_ID
		LEFT JOIN stbl_Account_Brand_ShareData absr ON stor.Store_Brand_ID = absr.Brand_ID
	WHERE 0=0
	AND dinf.Device_UID = CAST(@Device_IDs AS UNIQUEIDENTIFIER) --IN ('2A19A147-AE3E-4EBF-82D3-9994E79B6FCB')

	SELECT DISTINCT sinf.SettingInfo_Setting_ID, dset.DeviceSetting_Device_ID, sinf.SettingInfo_Name, dinf.Device_Store_ID, 
	dset.DeviceSetting_SettingValue, sgrp.SettingsGroup_ID, sgrp.SettingsGroup_Name
	FROM 
		tbl_DeviceInfo dinf
		INNER JOIN tbl_DeviceSetting dset ON dinf.Device_ID = dset.DeviceSetting_Device_ID 
		INNER JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID 
		INNER JOIN tbl_SettingInfo sinf ON dset.DeviceSetting_Setting_ID = sinf.SettingInfo_Setting_ID 
		INNER JOIN ltbl_SettingsGroup sgrp ON sinf.SettingInfo_SettingsGroup_ID = sgrp.SettingsGroup_ID
	WHERE 0=0
	AND dinf.Device_UID =CONVERT(uniqueidentifier, @Device_IDs)--('2A19A147-AE3E-4EBF-82D3-9994E79B6FCB')
	ORDER BY sgrp.SettingsGroup_Name, sgrp.SettingsGroup_ID, sinf.SettingInfo_Name, sinf.SettingInfo_Setting_ID, dset.DeviceSetting_Device_ID, dinf.Device_Store_ID, dset.DeviceSetting_SettingValue


END
GO


