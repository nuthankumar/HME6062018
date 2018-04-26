
/****** Dropping the StoredProcedure [dbo].[usp_GetRoles] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetRoles' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetRoles]
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
-- Purpose		:	Get Roles
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	2.		23-APRIL-2018	Jayaram V		Add orderby condition
-- ===========================================================
-- EXEC [dbo].[usp_GetRoles] @AccountId = 1333, @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetRoles]
    @AccountId      INT=NULL,
    @UserUid	    VARCHAR(32)=NULL,
    @IsCorporate    BIT = NULL,
    @IsHidden       BIT = NULL
AS
BEGIN

    IF (@AccountId IS NULL)
        SELECT @AccountId=User_OwnerAccount_ID
        FROM tbl_Users
        WHERE User_Uid=@UserUid

    SELECT DISTINCT Role_UID, Role_Name, Role_IsDefault
    FROM
        tbl_Roles lrol
        INNER JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
        INNER JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
        INNER JOIN ltbl_Permission_Types ptyp ON ptyp.Permission_Type_ID = perm.Permission_Permission_Type_ID
        INNER JOIN itbl_Subscription_Permission sper ON sper.Permission_ID = perm.Permission_ID
        INNER JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = sper.Subscription_ID
        INNER JOIN tbl_Users u ON u.User_OwnerAccount_ID = lrol.Role_OwnerAccount_ID
        INNER JOIN tbl_Companies c ON c.Company_ID = u.User_Company_ID
    WHERE lrol.Role_IsCorporate=ISNULL(@IsCorporate,lrol.Role_IsCorporate)
        AND lrol.Role_IsHidden=ISNULL(@IsHidden,lrol.Role_IsHidden)
        AND lrol.Role_OwnerAccount_ID=@AccountId
    ORDER BY lrol.Role_Name
END
