
/****** Dropping the StoredProcedure [dbo].[usp_GetAllAvailableGroupsAndStores] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetAllAvailableGroupsAndStores' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetAllAvailableGroupsAndStores
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get the All available Group and Store details
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	
--	2.
-- ===========================================================
-- EXEC [dbo].[usp_GetAllAvailableGroupsAndStores] @AccountId = 100
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
	@AccountId INT
AS 
BEGIN
	SELECT 
		DISTINCT(g.Id), 
		g.GroupName,
		'group' AS [Type],
		NULL Device_ID,
		NULL Device_UID,
		NULL Store_Number
	FROM [dbo].[Group] AS g 
	WHERE g.ParentGroup IS NULL AND g.AccountId = @AccountId
	UNION
	SELECT 
		DISTINCT TOP 500 s.Store_ID, 
		s.Store_Name, 
		'store' AS [Type],
		d.Device_ID,
		d.Device_UID,
		s.Store_Number
	FROM tbl_Stores AS s INNER JOIN tbl_DeviceInfo d ON s.Store_ID = d.Device_Store_ID 
		LEFT JOIN GroupStore AS gd ON s.Store_ID = gd.StoreID
	WHERE 
	gd.StoreID IS NULL
	AND s.Store_Account_ID = @AccountId	
END
GO


