/****** Dropping the StoredProcedure [dbo].[usp_UpdateStoreDetails] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_UpdateStoreDetails' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_UpdateStoreDetails]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_updateStoreDetails
-- Author		:	Jaffer sherif
-- Created		:	23-May-2018
-- Purpose		:	To get the All Store details of the user 
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	
--	2.
-- ===========================================================
-- exec [dbo].[usp_UpdateStoreDetails] @UserUid='68LKBP85C1SKH1FI3M7X40CJHKGU07FZ',@isAdmin=0,@criteria=NULL,@filter=NULL,@SortingColumnName=NULL,@SortingType=NULL,@RecordPerPage=25,@PageNumber=0
-- non admin
-- exec [dbo].usp_UpdateStoreDetails  @isAdmin = 0, @Store_Name '',@Store_UID ='',@Company_ID ='',@Store_ID ='', @timeZone ='',@AzureData = ''
-- admin
-- exec [dbo].[usp_UpdateStoreDetails]  @isAdmin = 1, @Store_ID ='83499' , @timeZone ='(GMT-08:00) Pacific Time (US & Canada)'
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_UpdateStoreDetails] 

-- for non admin
@isAdmin int = 0,
@Store_UID varchar(32) = NULL,
@Company_ID int = NULL,
@AzureData varchar(max) = NULL,
@Store_ID int = NULL, -- for admin

--@Store_Name varchar(100) = NULL,
@timeZone varchar(500) = NULL

-- select * from tbl_Stores where Store_UID='C5B3795ACA0A4612A961A36B39DC6C5D' -- 83499
--select * from tbl_deviceinfo t where device_store_id = 83499  
-- select * from tbl_deviceinfo t where Device_ID = 4624  
-- select * from  Azure_DeviceTimezones where Device_ID in ( 4624 , 106708)
AS
BEGIN
DECLARE @NumOfRecordsUpdated AS int;
SET @NumOfRecordsUpdated = 0;
  DECLARE @Device_id int = NULL, @Device_uid UNIQUEIDENTIFIER  = NULL

  -- for the normal users

IF (@isAdmin <> 1)
-- update the store name if user is not admin  -- StoreUID StoreNumber StoreName Company_ID
	BEGIN

		-- @AzureSettingData NVARCHAR(1000) = {"StoreNumber":"Store X","StoreUID":"C5B3795ACA0A4612A961A36B39DC6C5D","StoreName":"123"}
	
		IF (EXISTS(select 1 from tbl_Stores s inner join  tbl_DeviceInfo d on d.Device_Store_ID = s.Store_ID 
		 where s.Store_UID= @Store_UID and d.Device_DeviceType_ID =1 ))
	
		BEGIN

		exec dbo.PopulateAzureStoreNumbers  @Company_ID,@Store_UID, @AzureData
		UPDATE tbl_Stores  SET Store_Name = @Store_ID  WHERE Store_UID = @Store_UID

		END

	END

ELSE 
	BEGIN
	-- for admin input store id to update time zone for the store
	
	
--	select * from Azure_DeviceTimezones
	-- update in device info table
	-- select @Device_id = device_id from tbl_deviceinfo t where device_store_id = @Store_ID 
	select device_id into #deviceID from tbl_deviceinfo t where device_store_id = @Store_ID 
			IF (EXISTS(select 1 from Azure_DeviceTimezones tz where tz.Device_ID in (select * from #deviceID)) )	
			BEGIN
				update Azure_DeviceTimezones set Timezone = @timeZone  where device_id  in (select * from #deviceID)
				SELECT @NumOfRecordsUpdated = @@ROWCOUNT;
				SELECT @NumOfRecordsUpdated AS updatedRecords;	
			END
	    	ELSE

			BEGIN
				insert into Azure_DeviceTimezones (device_id, timezone) values (@timeZone,@Device_id)
				SELECT @NumOfRecordsUpdated = @@ROWCOUNT;
				SELECT @NumOfRecordsUpdated AS updatedRecords;	
			END
	
	
	
			-- get the 1 device id , uid 
			--INSERT INTO #deviceDetails
			SET @Device_id = NULL
			select TOP (1)    @Device_id = dev.Device_ID   , @Device_uid = dev.Device_UID from tbl_DeviceInfo dev  
					JOIN tbl_Stores stor ON stor.Store_ID = dev.Device_Store_ID
					JOIN Azure_CompanyLeaderboardVersions ver ON ver.Company_ID = stor.Store_Company_ID 
					and ver.LeaderboardMode_ID =2
					where dev.Device_Store_ID = @Store_ID and dev.Device_IsActive = 1 and dev.Device_DeviceType_ID = 1 

	IF (@Device_id is not null)
			BEGIN
					exec dbo.PopulateAzureStores @Device_UID= @Device_uid
					exec PopulateAzureStoreSettings  @Device_ID=@Device_id
					exec dbo.PopulateAzureStoreDays  @Device_ID=@Device_id
					exec dbo.PopulateAzureDayParts  @Device_ID=@Device_id

--SELECT @NumOfRecordsUpdated = @@ROWCOUNT;
--SELECT @NumOfRecordsUpdated AS updatedRecords;
	
			END
		-- call dbo.PopulateAzureStores serivce input Device_UID
					
	END

				--return TZRecordCount
END