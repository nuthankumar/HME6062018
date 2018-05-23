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
--  1.  	23-MAY-2018 	Ashvin G	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_MergeStoresCheck] @DeviceUid='d86c4874-60af-4777-8363-f40fa2ca356a', @StoreUid='926D52C552884B21832C50BD526E0929'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_MergeStoresCheck]
    @DeviceUid			VARCHAR(36),
	@StoreUid			VARCHAR(36)

AS
BEGIN

    SELECT dinf.Device_ID, dinf.Device_DeviceType_ID, stor.Store_UID
	FROM tbl_DeviceInfo dinf
	INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
	WHERE dinf.Device_UID = CAST(@DeviceUid AS UNIQUEIDENTIFIER)
	AND dinf.Device_DeviceType_ID IN (1,4)

	SELECT dinf.Device_Store_ID, dinf.Device_DeviceType_ID
    FROM tbl_DeviceInfo dinf
    INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
    WHERE stor.Store_UID =  @StoreUid
    AND dinf.Device_DeviceType_ID IN (1,4)


END
GO


