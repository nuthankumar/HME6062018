USE [db_qsrdrivethrucloud_engdev]
GO
/****** Object:  StoredProcedure [dbo].[usp_GetAllAvailableGroupsAndStores]    Script Date: 4/14/2018 11:24:09 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
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

ALTER PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
	@AccountId INT
AS 

SELECT 
	DISTINCT(g.Id), 
	g.GroupName,
	'' [Number],
	'group' AS [Type] 
FROM [dbo].[Group] AS g 
WHERE g.ParentGroup IS NULL AND g.AccountId = @AccountId
UNION
SELECT 
	DISTINCT s.Store_ID, 
	ISNULL(s.Store_Name,s.Store_Number) +' '+ CASE WHEN s.Store_Name IS NULL THEN  '' ELSE s.Store_Number END,
	s.Store_Number , 
	'store' AS [Type] 
FROM tbl_Stores AS s, GroupStore AS gd 
WHERE s.Store_Account_ID = @AccountId AND
	s.Store_ID NOT IN(
		SELECT 
			StoreId 
		FROM GroupStore 
		WHERE StoreId IS NOT NULL) 
		
