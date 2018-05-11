
/****** Dropping the StoredProcedure [dbo].[usp_GetGroupHierarchy] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetGroupHierarchy' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetGroupHierarchy]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetGroupHierarchy
-- Author		:	Selvendran K
-- Created		:	30-March-2018
-- Tables		:	Group,Stores
-- Purpose		:	Get the hierarchy of the group with stores
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	30-March-2018	Selvendran K	Procedure created
--	2.		11-May-2018		Ramesh N		Procedure modified
-- ===========================================================
-- EXEC [dbo].[usp_GetGroupHierarchy] @AccountId = 1333, @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetGroupHierarchy]
	@AccountId 	INT=NULL,
	@UserUid	VARCHAR(32)=NULL
AS
BEGIN
	DECLARE @Brand_ID INT = NULL,
	@sqlQuery varchar(max)
	CREATE TABLE #AccountIDs
		(
			Account_ID int
		)
	IF (@AccountId IS NULL)
		SELECT @AccountId=User_OwnerAccount_ID
		FROM tbl_Users
		WHERE User_Uid=@UserUid
	
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
	SET @sqlQuery = 'WITH
		GroupHierarchy
		AS
		(
				SELECT
					[Group].[ParentGroup],
					[Group].[Id] ,
					[Group].[GroupName] ,
					0 AS [Level]
				FROM [dbo].[Group] AS [Group]
				INNER JOIN #AccountIDs acc ON [Group].AccountId = acc.Account_ID
				WHERE ParentGroup IS NULL 
			UNION ALL
				SELECT
					[Group].[ParentGroup],
					[Group].[Id] ,
					[Group].[GroupName] ,
					GH.[Level]+1 AS [Level]
				FROM [dbo].[Group] AS [Group]
					INNER JOIN GroupHierarchy GH ON  GH.Id=[Group].ParentGroup
		)
			SELECT
			[ParentGroup] AS [ParentGroupId],
			[Id] ,
			[GroupName] [Name],
			[Level],
			''group'' AS [Type],
			NULL Store_Number,
			NULL Store_UID,
			NULL Brand_Name,
			NULL Device_ID,
			NULL Device_UID
		FROM GroupHierarchy
	UNION ALL
		SELECT
			--TOP 500
			GH.Id [ParentGroup],
			store.Store_ID,
			store.Store_Name ,
			ISNULL(GH.[Level],8)+1,
			''store'' AS [Type],
			store.Store_Number Store_Number,
			store.Store_UID,
			brand.Brand_Name Brand_Name,
			device.Device_ID,
			device.Device_UID
		FROM GroupHierarchy AS GH
			INNER JOIN GroupStore gs ON GH.Id = gs.GroupId
			RIGHT JOIN tbl_Stores AS store ON store.Store_ID = gs.StoreId
			LEFT JOIN ltbl_Brands AS brand ON brand.Brand_ID = store.Store_Brand_ID 
			INNER JOIN tbl_DeviceInfo device ON store.store_ID = device.Device_Store_ID
		WHERE store.Store_Account_ID IN (SELECT Account_ID FROM #AccountIDs)		
		'+IIF(ISNULL(@Brand_ID,0)<> 0,' AND brand.Brand_ID='+ CONVERT(VARCHAR,@Brand_ID), '' ) +'
	ORDER BY [Level],[Type],[Name]'
	EXEC (@sqlQuery)
END
