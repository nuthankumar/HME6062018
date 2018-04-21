
/****** Dropping the StoredProcedure [dbo].[usp_CreateGroup] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_CreateGroup' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_CreateGroup]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_CreateGroup
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,GroupStore
-- Purpose		:	To create a new Group
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_CreateGroup] @GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_CreateGroup]
	@GroupName varchar(50),
	@Description varchar(255),
	@AccountId int,
	@UserName varchar(50),
	@Groups varchar(max),
	@Stores varchar(max)	

AS 
BEGIN
	DECLARE @InsertedGroupId AS int;
	SET @InsertedGroupId = 0;
	DECLARE @IsGroupExist int
	declare @i int = 1

	SET 
	@IsGroupExist = 
	(SELECT 
		COUNT(*) 
	FROM 
		[Group] 
	WHERE 
	GroupName = @GroupName 
	AND 
	AccountId = @AccountId
	);
	if(@IsGroupExist >0)
	BEGIN
		SELECT 
		@IsGroupExist AS groupcount
	END
		ELSE
	BEGIN
		INSERT 
		INTO 
			[GROUP] 
		VALUES(
			@GroupName, 
			@Description, 
			@AccountId, 
			@UserName, 
			@UserName,
			SYSDATETIME(), 
			SYSDATETIME(),
			NULL
			);
		SET @InsertedGroupId = @@IDENTITY

	IF
		(@Groups IS NOT NULL 
	AND 
		@InsertedGroupId IS NOT NULL)
	WHILE 
	LEN(@Groups) > 0 
	BEGIN
	DECLARE 
		@comma int= CHARINDEX(',', @Groups)
    IF 
		@comma = 0 
	SET 
		@comma = len(@Groups)+1
    DECLARE 
		@ChildGroupId varchar(16) = SUBSTRING(@Groups, 1, @comma-1)
	UPDATE 
		[Group] 
	SET ParentGroup = @InsertedGroupId 
	WHERE 
		Id = @ChildGroupId
    SET 
		@Groups = SUBSTRING(@Groups, @comma+1, LEN(@Groups))
    SET 
		@i +=1
	END


	SET 
		@i = 1
	IF
		(@Stores IS NOT NULL 
	AND 
		@InsertedGroupId IS NOT NULL)
	WHILE 
	LEN(@Stores) > 0 
	BEGIN
    DECLARE 
		@comma1 int= CHARINDEX(',', @Stores)
    IF 
		@comma1 = 0 SET @comma1 = LEN(@Stores)+1
    DECLARE 
		@StoreId varchar(16) = SUBSTRING(@Stores, 1, @comma1-1)
    INSERT 
	INTO 
		GroupStore(
		GroupId,
		StoreId) 
	VALUES 
		(@InsertedGroupId, 
		@StoreId);
    
	SET 
	@Stores = SUBSTRING(@Stores, @comma1+1, LEN(@Stores))
    SET 
	@i +=1
	END

	SELECT 
	  @InsertedGroupId 
	AS 
	 groupId

	END
END

GO


