
/****** Dropping the StoredProcedure [dbo].[usp_GetUserById] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetUserById' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetUserById]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserById
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Get user by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetUserById] @Uid='A2FMY6TU1WT0LU77LWMG6A2VMCZSRXWN'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetUserById]
    @Uid				VARCHAR(32)
AS
BEGIN

    SELECT
        User_UID,
        User_IsActive,
        User_IsVerified,
        User_ResetPassword,
        User_OwnerAccount_ID,
        User_Company_ID,
        User_FirstName,
        User_LastName,
        User_EmailAddress,
        User_PasswordHash,
        User_PasswordSalt,
        User_Created_DTS,
        User_CreatedBy
    FROM tbl_Users
    WHERE User_UID=@Uid

    SELECT
        urol.Role_ID,
		lrol.Role_UID,
        urol.[User_ID],
        lrol.Role_Name
    FROM itbl_User_Role urol
        INNER JOIN tbl_Users usrs ON usrs.[User_ID] = urol.[User_ID]
        LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
    WHERE usrs.User_UID =@Uid

    SELECT
        stor.Store_ID,
        bran.Brand_ID,
        subs.Subscription_Level,
        usrs.User_Company_ID
    FROM
        tbl_Users usrs
        INNER JOIN itbl_User_Store urol ON usrs.[User_ID] = urol.[User_ID]
        INNER JOIN tbl_Stores stor ON stor.Store_ID = urol.Store_ID
        INNER JOIN ltbl_Brands bran ON bran.Brand_ID = stor.Store_Brand_ID
        INNER JOIN tbl_Accounts acct ON acct.Account_ID = usrs.User_OwnerAccount_ID
        INNER JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = acct.Account_Subscription_ID
    WHERE usrs.User_UID=@Uid

END
