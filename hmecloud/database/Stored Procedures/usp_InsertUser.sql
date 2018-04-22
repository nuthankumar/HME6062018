
/****** Dropping the StoredProcedure [dbo].[usp_InsertUser] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_InsertUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_InsertUser]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_InsertUser
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Create an User
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_InsertUser] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_InsertUser]
    @Uid				VARCHAR(32),
    @IsActive		    VARCHAR(MAX),
    @IsVerified			VARCHAR(32),
    @ResetPassword		VARCHAR(32),
    @OwnerAccountId		VARCHAR(MAX),
    @CompanyId		    VARCHAR(50),
    @FirstName			DATE,
    @LastName			TIME(7),
    @EmailAddress		DATE,
    @PasswordHash		TIME(7),
    @PasswordSalt		TINYINT,
    @CreatedDTS			TINYINT,
    @CreatedBy			VARCHAR(50)
AS
BEGIN
    INSERT INTO tbl_Users
        (
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
        User_CreatedBy)
    VALUES
        ( 
            @Uid,
            @IsActive,
            @IsVerified,
            @ResetPassword,
            @OwnerAccountId,
            @CompanyId,
            @FirstName,
            @LastName,
            @EmailAddress,
            @PasswordHash,
            @PasswordSalt,
            @CreatedDTS,
            @CreatedBy
		 )
    RETURN @@IDENTITY

END



