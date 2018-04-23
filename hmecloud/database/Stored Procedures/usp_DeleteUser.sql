
/****** Dropping the StoredProcedure [dbo].[usp_DeleteUser] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_DeleteUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_DeleteUser]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteUser
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Delete user by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_DeleteUser] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteUser]
    @Uid				VARCHAR(32)
AS
BEGIN


    DELETE urol
FROM itbl_User_Role urol
        INNER JOIN tbl_Users usrs ON usrs.[User_ID] = urol.[User_ID]
        LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
WHERE usrs.User_UID =@Uid

    DELETE urol
FROM
        tbl_Users usrs
        INNER JOIN itbl_User_Store urol ON usrs.[User_ID] = urol.[User_ID]
        INNER JOIN tbl_Stores stor ON stor.Store_ID = urol.Store_ID
        INNER JOIN ltbl_Brands bran ON bran.Brand_ID = stor.Store_Brand_ID
        INNER JOIN tbl_Accounts acct ON acct.Account_ID = usrs.User_OwnerAccount_ID
        INNER JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = acct.Account_Subscription_ID
WHERE usrs.User_UID=@Uid

    DELETE FROM tbl_Users WHERE User_UID=@Uid

END

