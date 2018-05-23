
/****** Dropping the StoredProcedure [dbo].[usp_GetPermissionsByUser] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetPermissionsByUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetPermissionsByUser]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserById
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Roles,itbl_Account_Role_Permission
--                  ltbl_Permissions,itbl_Subscription_Permission
--                  ltbl_Subscriptions,tbl_Users,tbl_Companies
-- Purpose		:	Get permission for the given user
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	2.		
-- ===========================================================
-- EXEC [dbo].[usp_GetPermissionsByUser] @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetPermissionsByUser]

    @UserUid	    VARCHAR(32)

AS
BEGIN

    SELECT DISTINCT
        perm.[Permission_Name],
        lrol.Role_Name
    -- , usrs.User_LastName
    -- , usrs.User_FirstName
    FROM
        tbl_Users usrs
        LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
        LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
        LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
        LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
        LEFT JOIN ltbl_Permission_Types ptyp ON ptyp.Permission_Type_ID = perm.Permission_Permission_Type_ID
        LEFT JOIN itbl_Subscription_Permission sper ON sper.Permission_ID = perm.Permission_ID
        LEFT JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = sper.Subscription_ID
    WHERE User_UID=@UserUid
    ORDER BY perm.[Permission_Name]
END
