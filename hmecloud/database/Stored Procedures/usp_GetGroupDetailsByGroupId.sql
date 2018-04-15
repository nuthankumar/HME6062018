USE [db_qsrdrivethrucloud_engdev]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetGroupDetailsByGroupId]    Script Date: 4/14/2018 11:31:17 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetGroupDetailsByGroupId
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	Get the Group, Store details for the given GroupId
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[usp_GetGroupDetailsByGroupId] @GroupId = 126
-- ===========================================================

ALTER PROCEDURE [dbo].[usp_GetGroupDetailsByGroupId]
	@GroupId INT
AS
 
DECLARE @query NVARCHAR(3000)

SET @query = ''
SELECT 
	Id, 
	GroupName, 
	[Description], 
	AccountId 
FROM [Group] WHERE Id = @GroupId 

EXECUTE(@query);
SET @query = '';

SELECT 
	g.Id, 
	g.GroupName,
	'' Number,
	'group' AS [Type]
FROM [dbo].[Group] AS g 
WHERE g.ParentGroup = @GroupId
UNION 
SELECT 
	s.Store_ID, 	
	ISNULL(s.Store_Name,s.Store_Number) +' '+ CASE WHEN s.Store_Name IS NULL THEN  '' ELSE s.Store_Number END,
	s.Store_Number,
	'store' AS [Type] 
FROM 
tbl_Stores AS s
INNER JOIN GroupStore gd ON s.Store_ID = gd.StoreId 
INNER JOIN[dbo].[Group] AS g ON g.Id = gd.GroupId 
WHERE 
gd.GroupId = @GroupId 

EXECUTE(@query);
