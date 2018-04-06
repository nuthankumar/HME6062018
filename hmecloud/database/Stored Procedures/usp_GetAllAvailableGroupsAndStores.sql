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

SELECT 
	DISTINCT(g.Id), 
	g.GroupName,
	'group' AS [Type] 
FROM [dbo].[Group] AS g 
WHERE 
	g.ParentGroup IS NULL 
AND 
	g.AccountId = @AccountId
UNION
SELECT 
	DISTINCT s.Id, 
	s.StoreName, 
	'store' AS [Type] 
FROM 
	Stores AS s, GroupStore AS gd 
WHERE 
	s.AccountId = @AccountId AND
	s.Id NOT IN(
		SELECT 
			StoreId 
		FROM GroupStore 
		WHERE StoreId IS NOT NULL) 
		
GO


