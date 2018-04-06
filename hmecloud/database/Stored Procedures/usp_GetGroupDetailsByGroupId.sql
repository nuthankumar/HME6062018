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

CREATE PROCEDURE [dbo].[usp_GetGroupDetailsByGroupId]
	@GroupId INT
AS
BEGIN
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
	'group' AS [Type]
FROM [dbo].[Group] AS g 
WHERE g.ParentGroup = @GroupId
UNION 
SELECT 
	s.Id, 
	s.StoreName,
	'store' AS [Type] 
FROM 
	Stores AS s 
INNER JOIN GroupStore gd ON s.Id = gd.StoreId 
INNER JOIN[dbo].[Group] AS g ON g.Id = gd.GroupId 
WHERE 
gd.GroupId = @GroupId 

EXECUTE(@query);
END
GO


