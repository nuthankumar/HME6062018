
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
-- EXEC [dbo].[usp_GetUserById] 
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

END



