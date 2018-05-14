
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
	@sqlQuery varchar(max),
	@Company_ID int,
	@isViewAllStores bit =0 ,
	@IsCorpUser bit = 0,
	@Company_Type varchar(50),
	@IsOwner bit = 0,
	@UserUid varchar(32)

	CREATE TABLE #AccountIDs
		(
			Account_ID int
		)
	INSERT INTO #AccountIDs
	SELECT @AccountId
	
	SELECT @UserUid = usrs.User_UID
	FROM tbl_Users usrs INNER JOIN tbl_Accounts acc ON usrs.User_ID = acc.Account_User_ID
	WHERE acc.Account_ID = @AccountId

	SELECT bran.Brand_ID, lrol.Role_IsCorporate, comp.Company_ID,  comp.Company_Type, CASE WHEN acc.Account_ID IS NULL THEN 0 ELSE 1 END IsOwner 
	INTO #UserRoleDetails
	FROM 
	tbl_Users usrs 
	INNER JOIN tbl_Companies comp ON comp.Company_ID = usrs.User_Company_ID
	INNER JOIN itbl_Company_Brand cbrn ON cbrn.Company_ID = comp.Company_ID
	INNER JOIN ltbl_Brands bran ON bran.Brand_ID = cbrn.Brand_ID
	LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID 
	LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID 
	LEFT JOIN tbl_Accounts acc ON acc.Account_ID = usrs.User_OwnerAccount_ID
	WHERE  usrs.User_UID = @UserUid
	
	IF EXISTS(SELECT 1 FROM tbl_Users usrs --
				LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
				LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
				LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
				LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
				WHERE usrs.User_UID = @UserUid AND perm.Permission_Name ='ViewAllStores' )
		SET @isViewAllStores = 1

	SELECT @Brand_ID = Brand_ID, @Company_ID = Company_ID, @Company_Type = Company_Type, @isCorpUser = Role_IsCorporate,
	@IsOwner = IsOwner 
	FROM #UserRoleDetails

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
	SELECT stor.Store_ID INTO #StoreIDs
	FROM 
		tbl_Users usrs 
		INNER JOIN tbl_Stores stor ON stor.Store_Account_ID = usrs.User_OwnerAccount_ID
	WHERE usrs.User_UID = @UserUid
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
			LEFT JOIN tbl_Accounts a ON s.Store_Account_ID = a.Account_ID
			'+IIF(
			((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND ISNULL(@Brand_ID,0)<> 0), -- corp user
			'LEFT JOIN stbl_Account_Brand_ShareData absr ON s.Store_Account_ID = absr.Account_ID AND 
				s.Store_Brand_ID = absr.Brand_ID' ,'') +'
		WHERE  gd.StoreID IS NULL AND s.Store_Account_ID IN (SELECT Account_ID FROM #AccountIDs) 
		AND d.Device_LaneConfig_ID <> 2 -- not dual lane		
		AND d.device_deviceType_id = 1 -- ZOOM device
		'+IIF(@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1) AND ISNULL(@Brand_ID,0)<> 0,
				' AND brand.Brand_ID='+ CONVERT(VARCHAR,@Brand_ID) + ' AND absr.Account_ShareData = 1', 
				'' ) +' 
		'+IIF((((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') OR @isViewAllStores = 1) AND ISNULL(@Company_ID,0)<> 0 ),'   -- not cor user but veiw all usr
		AND s.Store_Company_ID='+ CONVERT(VARCHAR,@Company_ID), '' ) +'
		' +IIF(((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') AND @isViewAllStores <> 1) ,'  -- normal user with no view all and no corp user
		AND s.Store_ID IN(SELECT Store_ID FROM #StoreIDs)', '') 
	
	EXEC (@sqlQuery)
END
