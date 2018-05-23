-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_MergeStoresDeviceInfo
-- Author		:	Ashvin G
-- Created		:	23-MAY-2018
-- Tables		:	tbl_Stores
-- Purpose		:	merge store device info
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	23-MAY-2018 	Ashvin G	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_MergeStoresDeviceInfo] @DeviceUid='1bb4388a-eee7-42e1-bcda-ab602efab84f', @StoreUid='E92277AD439F45EFA15CE44194C8E8D4'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_MergeStoresDeviceInfo]
    @DeviceUid			VARCHAR(36),
	@StoreUid			VARCHAR(36)

AS
BEGIN

    ;WITH CTE_DEVICETYPE_LIST AS(
	SELECT dtyp.DeviceType_ID
    FROM tbl_DeviceType dtyp
	INNER JOIN tbl_DeviceInfo dinf ON dtyp.DeviceType_ID = dinf.Device_DeviceType_ID
    WHERE dinf.Device_UID = CAST(@DeviceUid AS UNIQUEIDENTIFIER))

	SELECT dtyp.Device_Name, stor.Store_Number, dinf.Device_SerialNumber, dinf.Device_UID, dinf.Device_IsActive
    FROM tbl_DeviceInfo dinf
    INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
    INNER JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
	LEFT JOIN CTE_DEVICETYPE_LIST CDL ON CDL.DeviceType_ID = dinf.Device_DeviceType_ID
    WHERE stor.Store_UID = @StoreUid	


END
GO


