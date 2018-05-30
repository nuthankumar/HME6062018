/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Remove_Device_From_Store] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Remove_Device_From_Store' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Remove_Device_From_Store]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Remove_Device_From_Store
-- Author		:	jaffer
-- Created		:	05-May-2018
-- Tables		:	tbl_DeviceInfo, tbl_Stores
-- Purpose		:	Remove Device from store
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	05-May-2018	jaffer	Procedure created
-- ===========================================================
-- EXEC [dbo].[usp_HME_Cloud_Remove_Device_From_Store] @Device_UIDs = ''
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_HME_Cloud_Remove_Device_From_Store] 
	@Device_UIDs VARCHAR(500)
AS

BEGIN


--EXISTS(SELECT 1 FROM dbo.Split(@@Device_UIDs, ',') AS Devices WHERE Devices.cValue = b.Device_ID)


SELECT Store_UID into #storeUIDS FROM tbl_Stores WHERE Store_ID in 
(SELECT DISTINCT Device_Store_ID FROM tbl_DeviceInfo  WHERE Device_UID IN (@Device_UIDs))

IF (EXISTS(SELECT 1 FROM tbl_DeviceInfo d WHERE Device_UID IN (@Device_UIDs) AND Device_DeviceType_ID = 1))
	EXEC PopulateAzureStoresForRemove #storeUIDS, Device_ID
	SELECT DISTINCT d.Device_ID, d.Device_MainVersion, d.Device_UID  FROM tbl_DeviceInfo d WHERE Device_UID IN (@Device_UIDs) AND Device_DeviceType_ID = 1


--EXISTS(SELECT 1 FROM dbo.Split(@@Device_UIDs, ',') AS Devices WHERE Devices.cValue = b.Device_ID)

	

	--  Clear Out Store_ID & EmailAccount from Associated Devices --->
	
    UPDATE tbl_DeviceInfo SET Device_Store_ID = 0, Device_EmailAccount = NULL WHERE Device_UID IN (@Device_UIDs)
            
-- <!--- Check to see it any Devices are still attached to Store --->
	IF (EXISTS(SELECT 1 FROM tbl_DeviceInfo WHERE Device_Store_ID in ( SELECT DISTINCT Device_Store_ID FROM tbl_DeviceInfo  WHERE Device_UID IN (@Device_UIDs)))) ---- Clear Out Company_ID & Account_ID from Selected Stores 
	UPDATE tbl_Stores SET Store_Company_ID = 0 , Store_Account_ID = 0 WHERE Store_ID in ( SELECT DISTINCT Device_Store_ID FROM tbl_DeviceInfo  WHERE Device_UID IN (@Device_UIDs))

END 

	