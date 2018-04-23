
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

	-- ===========================================================
	-- EXEC [dbo].[[usp_InsertUser]]  @Uid =N'4FD913EE-A4A0-4311-8D6F-21BEABC2AE3A',@IsActive =1,@IsVerified =0, @ResetPassword =0,
    -- @OwnerAccountId =1357,@CompanyId  =1271,@FirstName  =N'Hme ',@LastName =N'User',@EmailAddress =N'hmeuser@hme.com',
    -- @PasswordHash =N'abcd',@PasswordSalt =N'abcd',@CreatedDTS =N'2018-04-13 12:00:30',@CreatedBy =N'hmeadmin@hme.com',
    -- @Stores =N'79085,79082,79084,79083', @UserRole =1
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_InsertUser]
    @Uid				VARCHAR(32),
    @IsActive		    TINYINT,
    @IsVerified			TINYINT,
    @ResetPassword		TINYINT,
    @OwnerAccountId		INT,
    @CompanyId		    INT,
    @FirstName			VARCHAR(50),
    @LastName			VARCHAR(50),
    @EmailAddress		VARCHAR(50),
    @PasswordHash		VARCHAR(200),
    @PasswordSalt		VARCHAR(100),
    @CreatedDTS			DateTime,
    @CreatedBy			VARCHAR(100),
	@Stores				VARCHAR(MAX),
	@UserRole           VARCHAR(32)
AS
BEGIN
DECLARE @IsUserCreated INT = 0
DECLARE @i INT = 1
DECLARE @Role_ID INT

	-- Inserting User Details
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
   SET @IsUserCreated = @@IDENTITY

   -- Inserting User selected Store Id's

	IF
		(@Stores IS NOT NULL 
	AND 
		@IsUserCreated IS NOT NULL)
	WHILE 
	LEN(@Stores) > 0 
	BEGIN
    DECLARE 
		@comma int= CHARINDEX(',', @Stores)
    IF 
		@comma = 0 SET @comma = LEN(@Stores)+1
    DECLARE 
		@StoreId varchar(16) = SUBSTRING(@Stores, 1, @comma-1)
    INSERT 
	INTO 
		itbl_User_Store(
		[User_ID],
		Store_ID) 
	VALUES 
		(@IsUserCreated, 
		@StoreId);
    
	SET 
	@Stores = SUBSTRING(@Stores, @comma+1, LEN(@Stores))
    SET 
	@i +=1
	END
	-- Inserting User Selected Roles
	if(@UserRole IS NOT NULL)
	BEGIN
	SET @Role_ID = (select Role_ID from tbl_Roles where Role_UID = @UserRole)
	INSERT
	INTO 
		itbl_User_Role(
		[User_ID],
		Role_ID)
	VALUES
	(@IsUserCreated,
	 @Role_ID)

	END


   SELECT @IsUserCreated IsUserCreated

END
GO