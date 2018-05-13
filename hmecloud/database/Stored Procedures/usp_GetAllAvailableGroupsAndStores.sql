
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
--  1.  	30-March-2018	Swathi Kumar	Procedure created
--	2.		11-May-2018		Ramesh N		Procedure modified
-- ===========================================================
-- EXEC [dbo].[usp_GetAllAvailableGroupsAndStores] @AccountId = 100
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
	@AccountId INT
AS 
BEGIN
	DECLARE @Brand_ID INT = NULL,
	@sqlQuery varchar(max)
	CREATE TABLE #AccountIDs
		(
			Account_ID int
		)
	INSERT INTO #AccountIDs
	SELECT @AccountId
	
	SELECT bran.Brand_ID, lrol.Role_IsCorporate, comp.Company_Type, CASE WHEN acc.Account_ID IS NULL THEN 0 ELSE 1 END IsOwner 
	INTO #UserRoleDetails
	FROM 
	tbl_Users usrs 
	INNER JOIN tbl_Companies comp ON comp.Company_ID = usrs.User_Company_ID
	INNER JOIN itbl_Company_Brand cbrn ON cbrn.Company_ID = comp.Company_ID
	INNER JOIN ltbl_Brands bran ON bran.Brand_ID = cbrn.Brand_ID
	LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID 
	LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID 
	LEFT JOIN tbl_Accounts acc ON acc.Account_ID = usrs.User_OwnerAccount_ID
	WHERE usrs.User_OwnerAccount_ID = @AccountId
	
	SELECT @Brand_ID = Brand_ID FROM #UserRoleDetails
	IF (ISNULL(@Brand_ID,0)<> 0)
	BEGIN
		IF EXISTS(SELECT 1 FROM #UserRoleDetails WHERE (Role_IsCorporate = 1 OR (Company_Type ='Distributor' AND IsOwner = 1)))
		BEGIN
			INSERT INTO #AccountIDs
			Select DISTINCT Account_ID 
			FROM stbl_Account_Brand_ShareData 
			WHERE Brand_ID = @Brand_ID AND Brand_ShareData = 1
		END
	END
	;
	SET @sqlQuery = 'SELECT 
		DISTINCT(g.Id), 
		g.GroupName,
		''group'' AS [Type],
		NULL Device_ID,
		NULL Device_UID
	FROM [dbo].[Group] AS g 
	WHERE g.ParentGroup IS NULL AND g.AccountId IN(SELECT Account_ID FROM #AccountIDs)
	UNION
	SELECT 
		DISTINCT s.Store_ID, 
		s.Store_Name, 
		''store'' AS [Type],
		d.Device_ID,
		d.Device_UID 
	FROM tbl_Stores AS s INNER JOIN tbl_DeviceInfo d ON s.Store_ID = d.Device_Store_ID 
		LEFT JOIN GroupStore AS gd ON s.Store_ID = gd.StoreID
		LEFT JOIN ltbl_Brands AS brand ON brand.Brand_ID = s.Store_Brand_ID
	WHERE s.Store_Account_ID IN (SELECT Account_ID FROM #AccountIDs)
	AND d.Device_LaneConfig_ID=1
	AND gd.StoreID IS NULL ' +IIF(ISNULL(@Brand_ID,0)<> 0,' AND brand.Brand_ID='+ CONVERT(VARCHAR,@Brand_ID), '' )
	
	EXEC (@sqlQuery)
END
