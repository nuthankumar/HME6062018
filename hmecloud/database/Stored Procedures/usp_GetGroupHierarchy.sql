USE [db_qsrdrivethrucloud_engdev]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetGroupHierarchy]    Script Date: 4/14/2018 11:11:59 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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
-- EXEC [dbo].[usp_GetGroupHierarchy] @AccountId = 1311
-- ===========================================================

ALTER PROCEDURE [dbo].[usp_GetGroupHierarchy]
	@AccountId INT
AS 

;WITH GroupHierarchy AS (
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
	'' [Number],
	[Level],
	'group' AS [Type]
FROM GroupHierarchy 
UNION ALL 
SELECT top 500
	GH.Id [ParentGroup], 
	store.Store_ID,  
	ISNULL(store.Store_Name,store.Store_Number) +' '+ CASE WHEN store.Store_Name IS NULL THEN  ''ELSE store.Store_Number END,
	store.Store_Number,
	ISNULL(GH.[Level],8)+1,
	'store' AS [Type]
FROM GroupHierarchy AS GH
INNER JOIN GroupStore gs ON GH.Id = gs.GroupId 
RIGHT JOIN tbl_Stores AS store ON store.Store_ID = gs.StoreId

ORDER BY [Level],[Name]  


