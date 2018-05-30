/****** Dropping the StoredProcedure [dbo].[usp_getStoreInformations] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_getStoreInformations' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_getStoreInformations]
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_getStoreInformations
-- Author		:	jaffer
-- Created		:	20-May-2018
-- Tables		:	tbl_Stoers, ltbl_Brands, .. etc // TO DO
-- Purpose		:	Get store information, Time zone, Device names and Device types
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-May-2018	jaffer Procedure created
-- ===========================================================
-- EXEC [dbo].[usp_getStoreInformations] '5F63771D76474EF2805F39C533BA63A9'
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_getStoreInformations]
(
	@Store_UID varchar(32)
)
AS
BEGIN
-- Get Store Information 
	IF(EXISTS(SELECT 1 FROM tbl_Stores stor
        LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
        LEFT JOIN ltbl_Countries cont ON stor.Store_Country_ID = cont.Country_ID
		WHERE stor.Store_UID = @Store_UID))
		SELECT bran.Brand_Name, stor.Store_Number, stor.Store_Name, stor.Store_AddressLine1, stor.Store_AddressLine2, stor.Store_AddressLine3, 
		stor.Store_AddressLine4, stor.Store_PhoneNumber, stor.Store_FaxNumber, stor.Store_Locality, stor.Store_Region, stor.Store_PostCode, 
		cont.Country_ID, cont.Country_Name, grp.Group_ID, CASE WHEN grp.Group_Name IS NULL THEN 'Drive-thru' ELSE grp.Group_Name END AS Group_Name,
		 g.GroupName,u.User_EmailAddress
			FROM tbl_Stores stor
            			LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
                		LEFT JOIN ltbl_Countries cont ON stor.Store_Country_ID = cont.Country_ID
						LEFT JOIN tbl_StoreLBGroup storgrp ON storgrp.Store_UID = stor.Store_UID
						LEFT JOIN tbl_LBGroup grp ON grp.Group_ID = storgrp.Group_ID
						LEFT JOIN GroupStore gs ON gs.StoreId = stor.Store_ID
						LEFT JOIN [Group] g ON g.Id = gs.GroupId	
						LEFT JOIN tbl_Accounts a ON stor.Store_Account_ID = a.Account_ID
						LEFT JOIN tbl_Users u ON a.Account_User_ID = u.[User_ID]
			WHERE stor.Store_UID =  @Store_UID
	ELSE
		SELECT 'NA' Brand_Name, 'NA' Store_Number, 'NA' Store_ID, 'NA' Store_Name, 'NA' Store_AddressLine1, 'NA' Store_AddressLine2, 'NA' Store_AddressLine3, 
		'NA' Store_AddressLine4, 'NA' Store_PhoneNumber, 'NA' Store_FaxNumber, 'NA' Store_Locality, 'NA' Store_Region, 'NA' Store_PostCode, 'NA' Country_ID, 
		'NA' Country_Name

	-- Get List of Stores Device Names
	SELECT dtyp.Device_Name, dinf.Device_UID, dinf.Device_IsActive, dinf.Device_SettingVersion, dinf.Device_SerialNumber, dinf.Device_MainVersion, 
		stor.Store_Number, bran.Brand_Name INTO #DeviceNames
	FROM tbl_DeviceType dtyp
        INNER JOIN tbl_DeviceInfo dinf ON dtyp.DeviceType_ID = dinf.Device_DeviceType_ID
        INNER JOIN tbl_Stores stor ON dinf.Device_Store_ID = stor.Store_ID
        INNER JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
		WHERE stor.Store_UID = @Store_UID
	
	IF EXISTS(SELECT 1 FROM #DeviceNames)
		SELECT Device_Name, Device_UID, Device_IsActive, Device_SettingVersion, Device_SerialNumber, Device_MainVersion, Store_Number, Brand_Name 
		FROM #DeviceNames
	ELSE
		SELECT 'NA' Device_Name, 'NA' Device_UID, 'NA' Device_IsActive, 'NA' Device_SettingVersion, 'NA' Device_SerialNumber, 'NA' Device_MainVersion, 
			'NA' Store_Number, 'NA' Brand_Name 

END