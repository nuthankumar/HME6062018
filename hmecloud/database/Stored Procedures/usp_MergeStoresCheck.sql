-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_MergeStoresCheck
-- Author		:	Charan Kumar C
-- Created		:	01-JUNE-2018
-- Tables		:	tbl_Stores
-- Purpose		:	check store to merge
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	01-JUNE-2018 	Charan Kumar C	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_MergeStoresCheck] @Device_UIDs='d86c4874-60af-4777-8363-f40fa2ca356a', @Store_UID='926D52C552884B21832C50BD526E0929'

CREATE PROCEDURE [usp_MergeStoresCheck]
(
    @Device_UIDs			VARCHAR(MAX),
	@Store_UID			VARCHAR(36)
)

AS

BEGIN

DECLARE @OriginIDs AS TABLE (
		Device_DeviceType_ID SMALLINT
		)

DECLARE @DestinationIDs AS TABLE (
		Device_DeviceType_ID SMALLINT
		)
DECLARE @Exists BIT
SET @Exists=0

	INSERT INTO @OriginIDs
    SELECT  dinf.Device_DeviceType_ID
	FROM tbl_DeviceInfo dinf
	INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
	WHERE EXISTS (
			SELECT 1
			FROM dbo.Split(@Device_UIDs, ',') AS Devices
			WHERE Devices.cValue = dinf.Device_UID
			)
	AND dinf.Device_DeviceType_ID IN (1,4)

	INSERT INTO @DestinationIDs
	SELECT  dinf.Device_DeviceType_ID
    FROM tbl_DeviceInfo dinf
    INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
    WHERE stor.Store_UID =  @Store_UID
    AND dinf.Device_DeviceType_ID IN (1,4)


IF EXISTS(SELECT 1 FROM @OriginIDs O INNER JOIN  @DestinationIDs D ON D.Device_DeviceType_ID=O.Device_DeviceType_ID)
SET @Exists= 1
 
SELECT @Exists

END