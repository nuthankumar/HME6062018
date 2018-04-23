IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_UpdateUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_UpdateUser]
GO

-- ===========================================================
	--      Copyright � 2018, HME, All Rights Reserved
	-- ===========================================================
	-- Name			:	usp_UpdateUser
	-- Author		:	Swathi Kumar
	-- Created		:	23-APRIL-2018
	-- Tables		:	tbl_Users, itbl_User_Store and itbl_User_Role
	-- Purpose		:	Update an User
	-- ===========================================================
	--				Modification History
	-- -----------------------------------------------------------
	-- Sl.No.	Date			Developer		Descriptopn
	-- -----------------------------------------------------------
	--  1.  	23-APRIL-2018	Swathi Kumar	Procedure created
	--  2.		24-APRIL-2018	Jayaram V		Change userRoal datatype
	-- ===========================================================
	-- EXEC [dbo].[[usp_UpdateUser]]  @Uid =N'4FD913EE-A4A0-4311-8D6F-21BEABC2AE3A',@IsActive =1,
    -- @FirstName  =N'Hme ',@LastName =N'User',@EmailAddress =N'hmeuser@hme.com',
    -- @UpdatedDTS =N'2018-04-13 12:00:30',
    -- @Stores =N'79085,79082,79084,79083', @UserRole =1
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_UpdateUser]
    @Uid				VARCHAR(32),
    @IsActive		    TINYINT,
    @FirstName			VARCHAR(50),
    @LastName			VARCHAR(50),
    @EmailAddress		VARCHAR(50),
	@UpdatedDTS			DateTime,
	@Stores				VARCHAR(MAX),
	@UserRole           VARCHAR(32)
AS
BEGIN
DECLARE @IsUserUpdated INT = 0
DECLARE @i INT = 1
DECLARE @User_ID	INT

	-- Updating User Details
SET @User_ID =
	(SELECT [User_ID] FROM tbl_Users WHERE User_UID = @Uid)
    UPDATE
		tbl_Users
	SET
		User_IsActive = @IsActive,
		User_FirstName = @FirstName,
		User_LastName = @LastName,
		User_EmailAddress = @EmailAddress,
		User_LastMod_DTS = @UpdatedDTS
	WHERE
		User_UID = @Uid

   -- Inserting User selected Store Id's
	DELETE FROM itbl_User_Store WHERE [User_ID] = @User_ID
	IF
		(@Stores IS NOT NULL
	AND
		@User_ID IS NOT NULL)
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
		(@User_ID,
		 @StoreId);

	SET
		@Stores = SUBSTRING(@Stores, @comma+1, LEN(@Stores))
    SET
		@i +=1
	END
	-- Updating User Selected Roles
	if(@UserRole IS NOT NULL)
	BEGIN
	UPDATE
		itbl_User_Role
	SET
		Role_ID = (select Role_ID from tbl_Roles where Role_UID = @UserRole)
	WHERE
		[User_ID] = @User_ID
	END

   SET @IsUserUpdated = @User_ID
   SELECT @IsUserUpdated IsUserUpdated

END
GO


