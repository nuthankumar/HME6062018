
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
--	2.
-- ===========================================================
-- EXEC [dbo].[usp_GetGroupHierarchy] @AccountId = 1333
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetGroupHierarchy]
	@AccountId 	INT=NULL,
	@UserUid	VARCHAR(32)=NULL
AS
BEGIN
	IF (@AccountId IS NULL)
	SELECT @AccountId=User_OwnerAccount_ID
	FROM tbl_Users
	WHERE User_Uid=@UserUid
	
	;
	WITH
		GroupHierarchy
		AS
		(
				SELECT
					[Group].[ParentGroup],
					[Group].[Id] ,
					[Group].[GroupName] ,
					0 AS [Level]
				FROM [dbo].[Group] AS [Group]
				WHERE ParentGroup IS NULL AND [Group].AccountId=@AccountId
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
			'group' AS [Type],
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
			'store' AS [Type],
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
		WHERE store.Store_Account_ID = @AccountId
	ORDER BY [Level],[Name]
END
GO


