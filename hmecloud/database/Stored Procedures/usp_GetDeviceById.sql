/****** Dropping the StoredProcedure [dbo].[usp_GetUserById] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetDeviceById' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetDeviceById]
GO
USE [db_qsrdrivethrucloud_dev]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetDeviceById]    Script Date: 6/4/2018 7:38:08 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
--  1.  	04-JUNE-2018	Charan Kumar C	Procedure modified to add count and columns required
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetDeviceById] @DeviceUid='F141D470-960D-4B99-A52A-7001700820F6'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetDeviceById]
    @DeviceUid				VARCHAR(36)
AS
BEGIN
	DECLARE @SettingsCount INT
    SELECT  DISTINCT Device_ID,Brand_Name,Store_UID,Store_Number,Store_AddressLine1,Store_Locality,Store_Region,Device_Name,
	Device_IsActive,Device_UID,LaneConfig_Name,Device_SerialNumber,Device_DeviceType_ID,Device_MainVersion,Device_SettingVersion,
	Device_LaneConfig_ID,Store_Company_ID,Store_Brand_ID
	FROM 
		tbl_Stores stor
		LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
		LEFT JOIN tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
		LEFT JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
		LEFT JOIN tbl_LaneConfig lane ON dinf.Device_LaneConfig_ID = lane.LaneConfig_ID
		LEFT JOIN itbl_User_Store iurs ON iurs.Store_ID = stor.Store_ID
		LEFT JOIN tbl_Users usrs ON usrs.User_ID = iurs.User_ID
		LEFT JOIN stbl_Account_Brand_ShareData absr ON stor.Store_Brand_ID = absr.Brand_ID
	WHERE 0=0
	AND dinf.Device_UID = CAST(@DeviceUid AS UNIQUEIDENTIFIER)

	SELECT @SettingsCount=COUNT(*) FROM 
		tbl_Stores stor
		LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
		LEFT JOIN tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
		LEFT JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
		LEFT JOIN tbl_LaneConfig lane ON dinf.Device_LaneConfig_ID = lane.LaneConfig_ID
		LEFT JOIN itbl_User_Store iurs ON iurs.Store_ID = stor.Store_ID
		LEFT JOIN tbl_Users usrs ON usrs.User_ID = iurs.User_ID
		LEFT JOIN stbl_Account_Brand_ShareData absr ON stor.Store_Brand_ID = absr.Brand_ID
	WHERE 0=0
	AND dinf.Device_UID = CAST(@DeviceUid AS UNIQUEIDENTIFIER)

	SELECT @SettingsCount AS SettingsCount

	SELECT DISTINCT sinf.SettingInfo_Setting_ID, dset.DeviceSetting_Device_ID, sinf.SettingInfo_Name, dinf.Device_Store_ID, 
	dset.DeviceSetting_SettingValue, sgrp.SettingsGroup_ID, sgrp.SettingsGroup_Name,sgrp.SettingsGroup_Order
	FROM 
		tbl_DeviceInfo dinf
		INNER JOIN tbl_DeviceSetting dset ON dinf.Device_ID = dset.DeviceSetting_Device_ID 
		INNER JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID 
		INNER JOIN tbl_SettingInfo sinf ON dset.DeviceSetting_Setting_ID = sinf.SettingInfo_Setting_ID 
		INNER JOIN ltbl_SettingsGroup sgrp ON sinf.SettingInfo_SettingsGroup_ID = sgrp.SettingsGroup_ID
	WHERE 0=0
	AND dinf.Device_UID =CONVERT(uniqueidentifier, @DeviceUid)
	AND SettingsGroup_ID IN (1,2,3,4,0,6,7,8,9)
	ORDER BY sgrp.SettingsGroup_Order, sinf.SettingInfo_Setting_ID, dset.DeviceSetting_Device_ID, sinf.SettingInfo_Name, dinf.Device_Store_ID, 
	dset.DeviceSetting_SettingValue, sgrp.SettingsGroup_ID, sgrp.SettingsGroup_Name
	
	END

GO