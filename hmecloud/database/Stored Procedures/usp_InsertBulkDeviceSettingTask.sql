
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_InsertBulkDeviceSettingTask' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_InsertBulkDeviceSettingTask]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_InsertBulkDeviceSettingTask
-- Author		:	Charan Kumar C
-- Created		:	05-JUNE-2018
-- Tables		:	tbl_BulkDeviceSetting
-- Purpose		:	InsertBulkDeviceSettingTask
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1		05-JUNE-2018  Charan Kumar C   Created procedure
--	
-- ===========================================================
-- EXEC [dbo].[usp_InsertBulkDeviceSettingTask]  @SourceDevice_UID='20E48EAC-1A21-476B-BA52-E3943641202A',@DestinationDevice_IDS='36411,36412',@Group_IDS='1,2',@CreatedBy='a@a.com'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_InsertBulkDeviceSettingTask]
	@SourceDevice_UID uniqueidentifier,
	@DestinationDevice_IDS varchar(max),
	@Group_IDS varchar(255),
	@CreatedBy varchar(200)
AS
BEGIN

DECLARE @Task_UID UNIQUEIDENTIFIER
SET @Task_UID = NEWID()
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
	BEGIN TRY
		INSERT INTO [dbo].[tbl_BulkDeviceSetting]
			([Task_UID]
			,[SourceDevice_UID]
			,[DestinationDevice_UID]
			,[Group_IDS]
			,[CreatedBy])
		SELECT @Task_UID, @SourceDevice_UID, DINF.Device_UID, @Group_IDS, @CreatedBy
		FROM dbo.Split(@DestinationDevice_IDS, ',') DEST
		INNER JOIN [dbo].[tbl_DeviceInfo] DINF ON DINF.Device_ID = DEST.cValue
		RETURN 1
	END TRY
	BEGIN CATCH
		RETURN 0;
	END CATCH

END