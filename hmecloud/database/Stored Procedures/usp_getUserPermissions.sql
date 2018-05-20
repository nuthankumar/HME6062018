USE [hmeCloud]
GO
/****** Object:  StoredProcedure [dbo].[usp_getUserPermissions]    Script Date: 5/17/2018 3:37:12 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_getUserPermissions
-- Author		:	Ramesh
-- Created		:	08-May-2018
-- Tables		:	tbl_Users, itbl_User_Role, tbl_Roles and etc.
-- Purpose		:	Fetch user permissions based on User UID or permission name
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	08-May-2018	Ramesh Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_getUserPermissions] 'ED28E0A5-DB9B-425F-8C94-5CC1841B', '',0
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_getUserPermissions]
(
	@User_UID varchar(32),
	@User_Department varchar(200)='',
	@IsAdmin bit = 0
)
AS
BEGIN
DECLARE @sqlQuery varchar(4000)
	IF @IsAdmin = 1 
		BEGIN
			SET @sqlQuery = '
			WITH AdminRoles
			AS
			(
				SELECT Role_ID
					FROM tbl_AdminRole_Permissions
					WHERE 1=1 ' +IIF(ISNULL(@User_Department,'')<>'',' AND Role_Name = '''+@User_Department +'''','')+'
			)
			SELECT DISTINCT perm.Permission_Name,lrol.Role_Name,usrs.User_LastName,usrs.User_FirstName
			FROM 
				tbl_Users usrs 
				LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
				LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
				LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
				LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
				LEFT JOIN ltbl_Permission_Types ptyp ON ptyp.Permission_Type_ID = perm.Permission_Permission_Type_ID
				LEFT JOIN itbl_Subscription_Permission sper ON sper.Permission_ID = perm.Permission_ID
				LEFT JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = sper.Subscription_ID
				INNER JOIN AdminRoles adrol ON lrol.Role_ID = adrol.Role_ID
			WHERE usrs.User_UID ='''+ @User_UID +''';'
		END
	ELSE
		BEGIN
			-- get user permission based on uuid for normal user
			SET @sqlQuery = '
			SELECT  DISTINCT perm.Permission_Name,lrol.Role_Name,usrs.User_LastName,usrs.User_FirstName
			FROM 
				tbl_Users usrs 
				LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
				LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
				LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
				LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
				LEFT JOIN ltbl_Permission_Types ptyp ON ptyp.Permission_Type_ID = perm.Permission_Permission_Type_ID
				LEFT JOIN itbl_Subscription_Permission sper ON sper.Permission_ID = perm.Permission_ID
				LEFT JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = sper.Subscription_ID
			WHERE usrs.User_UID ='''+ @User_UID +''''
		END
		EXEC(@sqlQuery)
END

