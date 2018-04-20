
/****** Dropping the StoredProcedure [dbo].[usp_UpdateGroup] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_UpdateGroup' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_UpdateGroup]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_UpdateGroup
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,GroupStore
-- Purpose		:	To update a one of the existing Group
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_UpdateGroup] @GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_UpdateGroup]
	@GroupId int,
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
	DECLARE @IsGroupIdExist int
	DECLARE @TempGroupName varchar(50)
	DECLARE @IsAccountIDExist bit
	SET @IsAccountIDExist = 0
	SET @IsGroupIdExist = 0
	SET @TempGroupName = ''

	SELECT 
		@IsGroupIdExist = Id, @TempGroupName = GroupName
	FROM [Group] 
	WHERE Id = @GroupId 
	
	IF(@IsGroupIdExist >0)
	BEGIN
		SELECT @IsGroupIdExist AS groupId

		IF ((@GroupName <> @TempGroupName) AND EXISTS(SELECT 1 FROM [Group] WHERE GroupName = @GroupName AND AccountId = @AccountId))
		BEGIN
			SET @IsAccountIDExist = 1
			GOTO EndTask
		END
		Print 'Executing'
		 UPDATE [Group] SET [Description]= @Description, 
			UpdatedBy = @UserName, 
			UpdatedDateTime =  SYSDATETIME(),
			GroupName = @GroupName 
			WHERE Id = @GroupId;
		 UPDATE [Group] SET ParentGroup= NULL WHERE ParentGroup = @GroupId;
		 DELETE from GroupStore where GroupId = @GroupId;
	
		IF
		(@Groups IS NOT NULL 
		AND 
		@GroupId IS NOT NULL
		)
		WHILE 
		LEN(@Groups) > 0 
		BEGIN
			DECLARE @comma int= CHARINDEX(',', @Groups)
			IF @comma = 0 
			SET @comma = len(@Groups)+1
			DECLARE @ChildGroupId varchar(16) = SUBSTRING(@Groups, 1, @comma-1)
			
			UPDATE [Group] SET ParentGroup = @GroupId 
			WHERE Id = @ChildGroupId
			SET @Groups = SUBSTRING(@Groups, @comma+1, LEN(@Groups))
			SET @i +=1
		END
	
		SET @i = 1
		IF (@Stores IS NOT NULL AND @GroupId IS NOT NULL)
		WHILE LEN(@Stores) > 0 
		BEGIN
			DECLARE @comma1 int= CHARINDEX(',', @Stores)
			IF @comma1 = 0 
				SET @comma1 = LEN(@Stores)+1
			
			DECLARE @StoreId varchar(16) = SUBSTRING(@Stores, 1, @comma1-1)
			INSERT INTO GroupStore(GroupId, StoreId) 
			VALUES (@GroupId, @StoreId);
    
			SET @Stores = SUBSTRING(@Stores, @comma1+1, LEN(@Stores))
			SET @i +=1
		END

	EndTask:	
		SELECT @IsAccountIDExist AS IsGroupAlreadyExist
		END
	ELSE 
	BEGIN
		SELECT @IsGroupIdExist AS groupId
		SELECT @IsAccountIDExist AS IsGroupAlreadyExist
	END 

END


GO


