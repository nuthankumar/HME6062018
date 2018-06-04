

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_MergeStoresCheck
-- Author		:	Ashvin G
-- Created		:	23-MAY-2018
-- Tables		:	tbl_Stores
-- Purpose		:	check store to merge
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	1-June-2018 	Charan Kumar C	Stored Procedure created
--	
-- ===========================================================
--EXEC usp_MergeStoresDeviceInfo '498f0fc4-f594-485d-ae78-556a2dcf687d','878207B40993407B929CE34B86CE23B7'
-- ===========================================================


CREATE PROCEDURE usp_MergeStoresDeviceInfo (
	@Device_UIDs VARCHAR(MAX)
	,@Store_UID VARCHAR(50)
	)
AS
BEGIN
	SELECT dtyp.Device_Name
		,stor.Store_Number
		,dinf.Device_SerialNumber
		,dinf.Device_UID
		,dinf.Device_IsActive
	FROM tbl_DeviceInfo dinf
	INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
	INNER JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
	WHERE stor.Store_UID = @Store_UID
		AND dinf.Device_DeviceType_ID IN (
			SELECT dtyp.DeviceType_ID
			FROM tbl_DeviceType dtyp
			INNER JOIN tbl_DeviceInfo dinf ON dtyp.DeviceType_ID = dinf.Device_DeviceType_ID
			WHERE EXISTS (
                SELECT 1
                FROM dbo.Split(@Device_UIDs, ',') AS Devices
                WHERE Devices.cValue = dinf.Device_UID
            )
        )
END
