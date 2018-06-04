GO
/****** Dropping the StoredProcedure [dbo].[usp_GetGroupNameByDeviceIDs] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects
WHERE [name] = 'usp_GetGroupNameByDeviceIDs' AND [type] ='P'))
	DROP PROCEDURE [dbo].usp_GetGroupNameByDeviceIDs
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