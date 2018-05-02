
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_StoresByCompany] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_HME_Cloud_Get_StoresByCompany' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_StoresByCompany]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_StoresByCompany
-- Author		:	Selvendran K
-- Created		:	06-APRIL-2018
-- Tables		:	Store
-- Purpose		:	Geting store information
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Report Group related 
--											information added
-- ===========================================================
-- EXECUTE dbo.usp_HME_Cloud_Get_StoresByCompany 1352, 1
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_StoresByCompany](
	@Company_ID int,
	@Subscription_ID int = 4  -- default to premium account
)
AS

/*
	Copyright (c) 2014 HME, Inc.

	Author:
		Wells Wang (2014-11-24)
	Description:
		It returns a list of stores within a company or distributor
		
	Parameters:
		@Company_ID
	Usage:
		EXECUTE dbo.usp_HME_Cloud_Get_StoresByCompany @Company_ID, @Subscription_ID

	Documentation:
		If @Subscription_ID = 3, the proc returns a list of stores with both free and premium accounts
		If @Subscription_ID = 4 (default), the proc returns a list of stores with only premium accounts
	Based on:
		N/A
	Depends on:
		N/A
	Depends on me:
		/hmecloud/security/_tmp_login_create.cfm
*/

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET NOCOUNT ON

SELECT 	Brand_Name,
		stor.Store_UID,
		Store_Number,
		Store_Name,
		Store_AddressLine1,
		Store_Locality,
		Store_Region,
		Store_ID AS [Device_Store_ID],
		Device_Name,
		Device_MainVersion,
		Device_IsActive,
		Device_ID,
		Device_UID,
		Device_DeviceType_ID,
		Device_LaneConfig_ID,
		Device_EmailAccount,
		Device_Timezone_ID,
		Store_Company_ID,
		Group_Name,
		g.GroupName
FROM 	dbo.tbl_Stores stor
        INNER JOIN dbo.ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
        LEFT  JOIN dbo.tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
        LEFT  JOIN dbo.tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
		LEFT JOIN tbl_StoreLBGroup storgrp ON storgrp.Store_UID = stor.Store_UID
		LEFT JOIN tbl_LBGroup grp ON grp.Group_ID = storgrp.Group_ID
		LEFT JOIN GroupStore gs ON gs.StoreId = stor.Store_ID
		LEFT JOIN [Group] g ON g.Id = gs.GroupId
WHERE 	EXISTS(	
		SELECT	1 
        FROM	tbl_Companies c,
				[dbo].[tbl_Users] u,
				[dbo].[tbl_Accounts] a
        WHERE	c.Company_ID = stor.Store_Company_ID
		AND		c.Company_ID = u.User_Company_ID
		AND		u.User_ID = a.Account_User_ID
        AND		c.Distributor_ID = @Company_ID   -- stores tied to company
		AND		a.Account_Subscription_ID >= @Subscription_ID
        )
		OR 
		EXISTS(	
		SELECT	1 
        FROM	tbl_Companies c,
				[dbo].[tbl_Users] u,
				[dbo].[tbl_Accounts] a
        WHERE	c.Company_ID = stor.Store_Company_ID
		AND		c.Company_ID = u.User_Company_ID
		AND		u.User_ID = a.Account_User_ID
        AND		c.Company_ID = @Company_ID   -- stores tied to distributor
		AND		a.Account_Subscription_ID >= @Subscription_ID
        )


RETURN(0)

GO


