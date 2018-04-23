
/****** Dropping the StoredProcedure [dbo].[usp_GetUserById] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetUserByEmail' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetUserByEmail]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserByEmail
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
-- EXEC [dbo].[usp_GetUserByEmail] @EmailAddress='selvendrank@nousinfo.com'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetUserByEmail]
    @EmailAddress				VARCHAR(200)
AS
BEGIN

    SELECT [User_ID]
        , [User_UID]
        , [User_OwnerAccount_ID]
        , [User_Company_ID]
        , [User_EmailAddress]
        , [User_FirstName]
        , [User_LastName]
        , [User_IsActive]
        , [User_IsVerified]
        , CASE WHEN acct.Account_User_ID IS NULL THEN 0 ELSE 1 END [IsAccountOwner]
    FROM [dbo].[tbl_Users] usr
        LEFT JOIN tbl_Accounts acct ON acct.Account_User_ID = usr.[User_ID]
    WHERE [User_IsActive] = 1 AND [User_EmailAddress]=@EmailAddress


END

