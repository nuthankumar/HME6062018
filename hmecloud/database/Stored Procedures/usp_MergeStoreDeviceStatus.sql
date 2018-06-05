/****** Object:  StoredProcedure [dbo].[usp_MergeStoreDeviceStatus]    Script Date: 6/5/2018 12:41:49 PM ******/
IF  EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'[dbo].[usp_MergeStoreDeviceStatus]') AND type in (N'P', N'PC'))
DROP PROCEDURE [dbo].[usp_MergeStoreDeviceStatus]
GO
/****** Object:  StoredProcedure [dbo].[usp_MergeStoresCheck]    Script Date: 6/5/2018 12:22:00 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	[usp_MergeStoreDeviceStatus]
-- Author		:	Charan Kumar C
-- Created		:	05-JUNE-2018
-- Tables		:	tbl_DeviceInfo,tbl_Stores
-- Purpose		:	check store to merge and provide device info
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	01-JUNE-2018 	Charan Kumar C	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_MergeStoreDeviceStatus] @Device_UIDs='03889BEE-D24F-497D-91C7-20A9FB83192A', @Store_UID='61560967F1A5499FB2C50D672B5FCC11'

CREATE PROCEDURE [dbo].[usp_MergeStoreDeviceStatus]
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


 IF (@Exists=1)
 BEGIN
	SELECT @Exists IsExist
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
ELSE
	SELECT @Exists IsExist
END