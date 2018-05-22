
/****** Dropping the StoredProcedure [dbo].[usp_GetAllAvailableGroupsAndStores] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetAllAvailableGroupsAndStores' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetAllAvailableGroupsAndStores
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get the All available Group and Store details
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	30-March-2018	Swathi Kumar	Procedure created
--	2.		11-May-2018		Ramesh N		Procedure modified
-- ===========================================================
-- EXEC [dbo].[usp_GetAllAvailableGroupsAndStores] @AccountId = 100
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetAllAvailableGroupsAndStores]
	@AccountId INT
AS 
BEGIN
	DECLARE @Brand_ID INT = NULL,
	@sqlQuery varchar(max),
	@Company_ID int,
	@isViewAllStores bit =0 ,
	@IsCorpUser bit = 0,
	@Company_Type varchar(50),
	@IsOwner bit = 0,
	@UserUid varchar(32),
	@View_Franchise bit = 0
	CREATE TABLE #AccountIDs
		(
			Account_ID int
		)
	INSERT INTO #AccountIDs
	SELECT @AccountId
	
	SELECT @UserUid = usrs.User_UID
	FROM tbl_Users usrs INNER JOIN tbl_Accounts acc ON usrs.User_ID = acc.Account_User_ID
	WHERE acc.Account_ID = @AccountId

	SELECT bran.Brand_ID, lrol.Role_IsCorporate, comp.Company_ID,comp.Company_Type,comp.View_Franchise, CASE WHEN acc.Account_ID IS NULL THEN 0 ELSE 1 END IsOwner 
	INTO #UserRoleDetails
	FROM 
	tbl_Users usrs 
	INNER JOIN tbl_Companies comp ON comp.Company_ID = usrs.User_Company_ID
	INNER JOIN itbl_Company_Brand cbrn ON cbrn.Company_ID = comp.Company_ID
	INNER JOIN ltbl_Brands bran ON bran.Brand_ID = cbrn.Brand_ID
	LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID 
	LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID 
	LEFT JOIN tbl_Accounts acc ON acc.Account_ID = usrs.User_OwnerAccount_ID
	WHERE  usrs.User_UID = @UserUid
	
	IF EXISTS(SELECT 1 FROM tbl_Users usrs --
				LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
				LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
				LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
				LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
				WHERE usrs.User_UID = @UserUid AND perm.Permission_Name ='ViewAllStores' )
		SET @isViewAllStores = 1

	SELECT @Brand_ID = Brand_ID, @Company_ID = Company_ID, @Company_Type = Company_Type, @View_Franchise = View_Franchise,@isCorpUser = Role_IsCorporate,
	@IsOwner = IsOwner 
	FROM #UserRoleDetails

	IF (ISNULL(@Brand_ID,0)<> 0)
	BEGIN
		IF EXISTS(SELECT 1 FROM #UserRoleDetails WHERE (Role_IsCorporate = 1 OR (Company_Type ='Distributor' AND IsOwner = 1)))
		BEGIN
			INSERT INTO #AccountIDs
			Select DISTINCT Account_ID 
			FROM stbl_Account_Brand_ShareData 
			WHERE Brand_ID = @Brand_ID AND Brand_ShareData = 1
		END
	END
	;
	SELECT stor.Store_ID INTO #StoreIDs
	FROM 
		tbl_Users usrs 
		INNER JOIN tbl_Stores stor ON stor.Store_Account_ID = usrs.User_OwnerAccount_ID
	WHERE usrs.User_UID = @UserUid
	;
	SET @sqlQuery = 'SELECT 
		DISTINCT(g.Id), 
		g.GroupName,
		''group'' AS [Type],
		NULL Device_ID,
		NULL Device_UID
	FROM [dbo].[Group] AS g 
	WHERE g.ParentGroup IS NULL AND g.AccountId IN(SELECT Account_ID FROM #AccountIDs)
	UNION
	SELECT 
		DISTINCT s.Store_ID, 
		s.Store_Name, 
		''store'' AS [Type],
		d.Device_ID,
		d.Device_UID 
	FROM tbl_Stores AS s INNER JOIN tbl_DeviceInfo d ON s.Store_ID = d.Device_Store_ID 
		LEFT JOIN GroupStore AS gd ON s.Store_ID = gd.StoreID
		LEFT JOIN ltbl_Brands AS brand ON brand.Brand_ID = s.Store_Brand_ID
			LEFT JOIN tbl_Accounts a ON s.Store_Account_ID = a.Account_ID
			'+IIF(
			((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND ISNULL(@Brand_ID,0)<> 0), -- corp user
			'LEFT JOIN stbl_Account_Brand_ShareData absr ON s.Store_Account_ID = absr.Account_ID AND 
				s.Store_Brand_ID = absr.Brand_ID' ,'') +'
		WHERE  gd.StoreID IS NULL AND s.Store_Account_ID IN (SELECT Account_ID FROM #AccountIDs) 
		AND d.Device_LaneConfig_ID <> 2 -- not dual lane		
		AND d.device_deviceType_id = 1 -- ZOOM device
		'+IIF((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND @View_Franchise = 1 AND ISNULL(@Brand_ID,0)<> 0,
				' AND brand.Brand_ID='+ CONVERT(VARCHAR,@Brand_ID) + ' AND absr.Brand_ShareData = 1','' ) +' 
		'+IIF((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND @View_Franchise = 0 AND ISNULL(@Brand_ID,0)<> 0,
				'AND absr.Brand_ShareData is null AND s.Store_Company_ID='+ CONVERT(VARCHAR,@Company_ID), '' ) +'
		'+IIF((((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') OR @isViewAllStores = 1) AND ISNULL(@Company_ID,0)<> 0 ),    -- not corp user but view all usr
		'AND s.Store_Company_ID='+ CONVERT(VARCHAR,@Company_ID), '' ) +'
		' +IIF(((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') AND @isViewAllStores <> 1) ,'  -- normal user with no view all and no corp user
		AND s.Store_ID IN(SELECT Store_ID FROM #StoreIDs)', '') 
	
	EXEC (@sqlQuery)
END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
DECLARE @IsUserDeleted INT = 0
DECLARE @UserId INT = 0

SET @UserId = 
	(SELECT [User_ID] 
	FROM 
		tbl_Users 
	WHERE  User_UID=@Uid)

IF(@UserId IS NOT NULL)
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
    WHERE usrs.User_UID=@Uid

    DELETE FROM tbl_Users WHERE User_UID=@Uid
	SET @IsUserDeleted = @UserId

	SELECT @IsUserDeleted IsUserDeleted
	END
	ELSE
	SELECT @IsUserDeleted IsUserDeleted

END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_DeleteReportTemplate] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_DeleteReportTemplate' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_DeleteReportTemplate]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteReportTemplate
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Create a Delete Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V	      Procedure created
--  2.	13-April-2018	Selvendran K	modified to actual correct table
-- ===========================================================
-- EXEC [dbo].[usp_DeleteReportTemplate] @Id = 1
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteReportTemplate]
	@Id INT
AS

DELETE FROM [dbo].[stbl_ReportTemplates]
      WHERE ReportTemplate_ID=@Id
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_DeleteGroupByGroupId] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_DeleteGroupByGroupId' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_DeleteGroupByGroupId]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteGroupByGroupId
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,GroupStore
-- Purpose		:	To Delte the Group and GroupStore records
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[usp_DeleteGroupByGroupId] @@GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteGroupByGroupId]
	@GroupId INT
AS 
BEGIN
 DECLARE @NumOfRecordsDeleted AS int;
SET @NumOfRecordsDeleted = 0;

update [Group] SET ParentGroup=NULL WHERE ParentGroup = @GroupId;

DELETE FROM GroupStore WHERE GroupId=@GroupId;

DELETE FROM [Group] WHERE Id = @GroupId;

SELECT @NumOfRecordsDeleted = @@ROWCOUNT;
SELECT @NumOfRecordsDeleted AS deletedRecords;
END
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_GetGroupHierarchy] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetGroupHierarchy' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetGroupHierarchy]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetGroupHierarchy
-- Author		:	Selvendran K
-- Created		:	30-March-2018
-- Tables		:	Group,Stores
-- Purpose		:	Get the hierarchy of the group with stores
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	30-March-2018	Selvendran K	Procedure created
--	2.		11-May-2018		Ramesh N		Procedure modified
-- ===========================================================
-- EXEC [dbo].[usp_GetGroupHierarchy] @AccountId = 1333, @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetGroupHierarchy]
	@AccountId 	INT=NULL,
	@UserUid	VARCHAR(32)=NULL
AS
BEGIN
	DECLARE @Brand_ID INT = NULL,
	@sqlQuery varchar(max),
	@Company_ID int,
	@isViewAllStores bit =0 ,
	@IsCorpUser bit = 0,
	@Company_Type varchar(50),
	@IsOwner bit = 0,
	@View_Franchise bit = 0
	CREATE TABLE #AccountIDs
		(
			Account_ID int
		)
	IF (@AccountId IS NULL)
		SELECT @AccountId=User_OwnerAccount_ID
		FROM tbl_Users
		WHERE User_Uid=@UserUid
	
	INSERT INTO #AccountIDs
	SELECT @AccountId
	
	SELECT bran.Brand_ID, lrol.Role_IsCorporate, comp.Company_ID, comp.Company_Type, comp.View_Franchise, 
	CASE WHEN acc.Account_ID IS NULL THEN 0 ELSE 1 END IsOwner 
	INTO #UserRoleDetails
	FROM tbl_Users usrs 
	INNER JOIN tbl_Companies comp ON comp.Company_ID = usrs.User_Company_ID
	LEFT JOIN itbl_Company_Brand cbrn ON cbrn.Company_ID = comp.Company_ID
	LEFT JOIN ltbl_Brands bran ON bran.Brand_ID = cbrn.Brand_ID
	LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID 
	LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID 
	LEFT JOIN tbl_Accounts acc ON acc.Account_ID = usrs.User_OwnerAccount_ID
	WHERE usrs.User_UID = @UserUid

	IF EXISTS(SELECT 1 FROM tbl_Users usrs --
				LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
				LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
				LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
				LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
				WHERE usrs.User_UID = @UserUid AND perm.Permission_Name ='ViewAllStores' )
		SET @isViewAllStores = 1

	SELECT @Brand_ID = Brand_ID, @Company_ID = Company_ID, @Company_Type = Company_Type, @View_Franchise=View_Franchise,@isCorpUser = Role_IsCorporate,
	@IsOwner = IsOwner 
	FROM #UserRoleDetails
	
	IF (ISNULL(@Brand_ID,0)<> 0)
	BEGIN
		IF EXISTS(SELECT 1 FROM #UserRoleDetails WHERE (Role_IsCorporate = 1 OR (Company_Type ='Distributor' AND IsOwner = 1)))
		BEGIN
			INSERT INTO #AccountIDs
			Select DISTINCT Account_ID 
			FROM stbl_Account_Brand_ShareData 
			WHERE Brand_ID = @Brand_ID AND Brand_ShareData = 1
		END
	END
		
	SELECT stor.Store_ID INTO #StoreIDs
	FROM 
		tbl_Users usrs 
		INNER JOIN tbl_Stores stor ON stor.Store_Account_ID = usrs.User_OwnerAccount_ID
	WHERE usrs.User_UID = @UserUid
	;
	SET @sqlQuery = 'WITH
		GroupHierarchy
		AS
		(
				SELECT
					[Group].[ParentGroup],
					[Group].[Id] ,
					[Group].[GroupName] ,
					0 AS [Level]
				FROM [dbo].[Group] AS [Group]
				INNER JOIN #AccountIDs acc ON [Group].AccountId = acc.Account_ID
				WHERE ParentGroup IS NULL 
			UNION ALL
				SELECT
					[Group].[ParentGroup],
					[Group].[Id] ,
					[Group].[GroupName] ,
					GH.[Level]+1 AS [Level]
				FROM [dbo].[Group] AS [Group]
					INNER JOIN GroupHierarchy GH ON  GH.Id=[Group].ParentGroup
		)
			SELECT
			[ParentGroup] AS [ParentGroupId],
			[Id] ,
			[GroupName] [Name],
			[Level],
			''group'' AS [Type],
			NULL Store_Number,
			NULL Store_UID,
			NULL Brand_Name,
			NULL Device_ID,
			NULL Device_UID
		FROM GroupHierarchy
	UNION ALL
		SELECT
			--TOP 500
			GH.Id [ParentGroup],
			store.Store_ID,
			store.Store_Name ,
			ISNULL(GH.[Level],8)+1,
			''store'' AS [Type],
			store.Store_Number Store_Number,
			store.Store_UID,
			brand.Brand_Name Brand_Name,
			device.Device_ID,
			device.Device_UID
		FROM GroupHierarchy AS GH
			INNER JOIN GroupStore gs ON GH.Id = gs.GroupId
			RIGHT JOIN tbl_Stores AS store ON store.Store_ID = gs.StoreId
			LEFT JOIN ltbl_Brands AS brand ON brand.Brand_ID = store.Store_Brand_ID 
			INNER JOIN tbl_DeviceInfo device ON store.store_ID = device.Device_Store_ID
			LEFT JOIN tbl_Accounts a ON store.Store_Account_ID = a.Account_ID
			'+IIF(
			((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND ISNULL(@Brand_ID,0)<> 0), -- corp user
			'LEFT JOIN stbl_Account_Brand_ShareData absr ON store.Store_Account_ID = absr.Account_ID AND 
				store.Store_Brand_ID = absr.Brand_ID' ,'') +'
		WHERE store.Store_Account_ID IN (SELECT Account_ID FROM #AccountIDs) 
		AND device.Device_LaneConfig_ID <> 2 -- not dual lane		
		AND device.device_deviceType_id = 1 -- ZOOM device
		'+IIF((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND @View_Franchise = 1 AND ISNULL(@Brand_ID,0)<> 0,
				' AND brand.Brand_ID='+ CONVERT(VARCHAR,@Brand_ID) + ' AND absr.Brand_ShareData = 1','' ) +' 
		'+IIF((@IsCorpUser = 1 OR (@Company_Type = 'DISTRIBUTOR' AND @IsOwner = 1)) AND @View_Franchise = 0 AND ISNULL(@Brand_ID,0)<> 0,
				'AND absr.Brand_ShareData is null AND store.Store_Company_ID='+ CONVERT(VARCHAR,@Company_ID), '' ) +'
		'+IIF((((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') OR @isViewAllStores = 1) AND ISNULL(@Company_ID,0)<> 0 ),    -- not cor user but veiw all usr
				'AND store.Store_Company_ID='+ CONVERT(VARCHAR,@Company_ID), '' ) +'
		' +IIF(((@IsCorpUser = 0 AND @Company_Type <> 'DISTRIBUTOR') AND @isViewAllStores <> 1) ,'  -- normal user with no view all and no corp user
		AND store.Store_ID IN(SELECT Store_ID FROM #StoreIDs)', '') +'
	ORDER BY [Level],[Type],[Name]'
	
	EXEC (@sqlQuery)
	
END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_GetGroupDetailsByGroupId] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetGroupDetailsByGroupId' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetGroupDetailsByGroupId]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetGroupDetailsByGroupId
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	Get the Group, Store details for the given GroupId
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[usp_GetGroupDetailsByGroupId] @GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetGroupDetailsByGroupId]
	@GroupId INT
AS
 BEGIN

	DECLARE @query NVARCHAR(3000)

	SET @query = ''
	SELECT 
		Id, 
		GroupName, 
		[Description], 
		AccountId 
	FROM [Group] WHERE Id = @GroupId 

	EXECUTE(@query);
	SET @query = '';

	SELECT 
		g.Id, 
		g.GroupName,
		'group' AS [Type],
		NULL Device_ID,
		NULL Device_UID,
		NULL Store_Number
	FROM [dbo].[Group] AS g 
	WHERE g.ParentGroup = @GroupId
	UNION 
	SELECT 
		s.Store_ID, 
		s.Store_Name,
		'store' AS [Type] ,
		d.Device_ID,
		d.Device_UID,
		s.Store_Number
	FROM 
	tbl_Stores AS s INNER JOIN tbl_DeviceInfo d ON s.Store_ID = d.Device_Store_ID 
	INNER JOIN GroupStore gd ON s.Store_ID = gd.StoreId 
	INNER JOIN[dbo].[Group] AS g ON g.Id = gd.GroupId 
	WHERE 
	gd.GroupId = @GroupId 

	EXECUTE(@query);

END
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/****** Dropping the StoredProcedure [dbo].[usp_GetReportTemplates] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetReportTemplates' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetReportTemplates]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportTemplates
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Get all Report Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V		Procedure created
--	2.      08-APRIL-2018   JAYARAM V		Changed the Query
--	3.		13-April-2018	Selvendran K	modified to actual correct table
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_GetReportTemplates] @AccountId and
-- @createdBy
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_GetReportTemplates]
	 @UserUid VARCHAR(32)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		ReportTemplate_ID [id]
		,ReportTemplate_UID AS [uid]
		,ReportTemplate_Name AS [templateName]
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_Session_User_UID = @UserUid
END
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/****** Dropping the StoredProcedure [dbo].[usp_GetReportTemplateByID] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetReportTemplateByID' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetReportTemplateByID]
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportTemplateByID
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Get Report Templates By Id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V		Procedure created
--	2.		13-April-2018	Selvendran K	modified to actual correct table 		
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_GetReportTemplateByID] @Id
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetReportTemplateByID]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT distinct 
			ReportTemplate_ID AS [Id]
		  ,ReportTemplate_UID AS [Uid]
		  ,ReportTemplate_Time_Measure AS [TimeMeasure]
		  ,ReportTemplate_From_Date AS [FromDate]
		  ,ReportTemplate_To_Date AS [ToDate]
		  ,ReportTemplate_From_Time AS [OpenTime]
		  ,ReportTemplate_To_Time AS [CloseTime]
		  ,ReportTemplate_Type AS [Type]
		  ,ReportTemplate_Open AS [Open]
		  ,ReportTemplate_Close AS [Close]
		  ,ReportTemplate_Include_Stats AS [SystemStatistics]
		  ,ReportTemplate_Format AS [Format]
		  ,ReportTemplate_Name AS [TemplateName]
		  ,ReportTemplate_CreatedBy AS [CreatedBy]
		  ,ReportTemplate_Session_UID AS SessionUid
		  ,ReportTemplate_Session_User_UID  AS UserUid
		  ,ReportTemplate_Device_UID AS Devices
		  ,ReportTemplate_Advanced_Op AS DdvancedOption
		  ,ReportTemplate_Include_Longs AS LongestTime
		  ,ReportTemplate_Created_DTS AS CreatedDateTime
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_ID = @Id
END

GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
		stor.Store_UID,
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
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_GetUserAudit] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetUserAudit' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetUserAudit]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserByEmail
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Get user audit by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetUserAudit] @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetUserAudit]
    @UserUid				VARCHAR(32), 
	@PageNumber				INT = 1,  
	@PageSize				INT = 1000
AS
BEGIN

   WITH Get_User_Audit
    AS
    (
        SELECT	--TOP 1000 
        		au.Audit_LastLogin,
                au.Audit_Action,
                [action_pos] = CHARINDEX('st=', au.Audit_Action),
                [action_len] = CHARINDEX('&', au.Audit_Action, CHARINDEX('st=', au.Audit_Action)) - CHARINDEX('st=', au.Audit_Action) - 3,
                [first_&_pos] = CHARINDEX('&', au.Audit_Action)
        FROM 	dbo.dtbl_Audit_User au WITH (NOLOCK)
        INNER JOIN tbl_Users u ON u.[User_ID] = au.Audit_User_ID
		WHERE u.User_UID=@UserUid
        AND		au.Audit_LastLogin > DateAdd(month, -3, GetDate())
		ORDER BY Audit_LastLogin
		OFFSET @PageSize * (@PageNumber - 1) ROWS
		FETCH NEXT @PageSize ROWS ONLY
    )
    SELECT	Audit_LastLogin,
            Audit_Action,
            [audit_page] = CASE LEFT(Audit_Action, 3) WHEN 'pg=' THEN SUBSTRING(Audit_Action, 4, IIF([first_&_pos]>0, [first_&_pos]-4, LEN(Audit_Action))) ELSE '' END,
            [page_action] = CASE [action_pos] WHEN 0 THEN '' ELSE IIF(PATINDEX('%&st=%&%', Audit_Action)=0, RIGHT(Audit_Action, (LEN(Audit_Action)-[action_pos]-2)), SUBSTRING(Audit_Action, [action_pos]+3, [action_len])) END
    FROM	Get_User_Audit
    ORDER BY Audit_LastLogin DESC


END

GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
DECLARE @User_ID INT 
DECLARE @StoreId INT

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
		@StoreUid varchar(50) = SUBSTRING(@Stores, 1, @comma-1)
	SET 
		@StoreId = 
		(SELECT 
			Store_ID 
		FROM 
			tbl_Stores 
		WHERE 
			Store_UID = @StoreUid)
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
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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




----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
DECLARE @StoreId INT

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
		@StoreUid varchar(50) = SUBSTRING(@Stores, 1, @comma-1)
	SET 
		@StoreId = 
		(SELECT 
			Store_ID 
		FROM 
			tbl_Stores 
		WHERE 
			Store_UID = @StoreUid)
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
	if(@UserRole IS NOT NULL
	AND 
		@IsUserCreated IS NOT NULL)
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
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------


/****** Dropping the StoredProcedure [dbo].[usp_InsertReportTemplate] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_InsertReportTemplate' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_InsertReportTemplate]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_InsertReportTemplate
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Create a Report Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V	Procedure created
--	2.		16-APRIL-2018	Swathi KUmar Validation included
-- ===========================================================
-- EXEC [dbo].[usp_InsertReportTemplate] @AccountId = 100
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_InsertReportTemplate]
@Uid				VARCHAR(32),
@TemplateName		VARCHAR(MAX),
@SessionUid			VARCHAR(32),
@UserUid			VARCHAR(32),
@Devices			VARCHAR(MAX),
@TimeMeasure		VARCHAR(50),
@FromDate			DATE,
@OpenTime			TIME(7),
@ToDate				DATE,
@CloseTime			TIME(7),
@Open				TINYINT,
@Close				TINYINT,
@Type				VARCHAR(50),
@AdvancedOption		TINYINT,
@IncludeStats		TINYINT,
@IncludeLongs		TINYINT,
@Format				VARCHAR(50),
@CreatedDateTime	DATETIME,
@CreatedBy			VARCHAR(50)
AS 
BEGIN
DECLARE @IsTemplateExist int = 0
DECLARE @UserSessionUID VARCHAR(32)

IF EXISTS ( SELECT 1
		FROM 
			[dbo].[stbl_ReportTemplates] 
		WHERE 
			ReportTemplate_Name = @TemplateName 
		AND 
			ReportTemplate_CreatedBy = @CreatedBy
		)
	BEGIN
		SET @IsTemplateExist =1
		
	END
Else
	BEGIN
	SET @UserSessionUID = 
	(SELECT 
	TOP 1 
		User_Session_UID 
	FROM 
		dtbl_User_Session sess 
	WHERE 
		User_UID = @UserUid 
	ORDER BY 
	User_Session_ID 
	DESC)
	 
	 INSERT INTO [dbo].[stbl_ReportTemplates] (
	
		ReportTemplate_UID
		,ReportTemplate_Name
		,ReportTemplate_Session_UID
		,ReportTemplate_Session_User_UID 
		,ReportTemplate_Device_UID 
		,ReportTemplate_Time_Measure 
		,ReportTemplate_From_Date 
		,ReportTemplate_From_Time 
		,ReportTemplate_To_Date 
		,ReportTemplate_To_Time 
		,ReportTemplate_Open 
		,ReportTemplate_Close 
		,ReportTemplate_Type 
		,ReportTemplate_Advanced_Op 
		,ReportTemplate_Include_Stats 
		,ReportTemplate_Include_Longs 
		,ReportTemplate_Format 
		,ReportTemplate_Created_DTS 
		,ReportTemplate_CreatedBy

		) 
		 VALUES 
		 (
			@Uid,
			@TemplateName,
			@UserSessionUID,
			@UserUid,
			@Devices,
			@TimeMeasure,
			@FromDate,
			@OpenTime,
			@ToDate,	
			@CloseTime,
			@Open,
			@Close,
			@Type,
			@AdvancedOption,
			@IncludeStats,
			@IncludeLongs,
			@Format,	
			@CreatedDateTime,
			@CreatedBy
		 )
		 SET @IsTemplateExist = @@IDENTITY
	END
	SElECT @IsTemplateExist IsRecordInserted 
END
GO



----------------------------------------------------------------------------------------------------------------------------------------------------------------------------

/****** Dropping the StoredProcedure [dbo].[usp_GetRoles] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetPermissionsByUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetPermissionsByUser]
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
-- Purpose		:	Get permission for the given user
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	2.		
-- ===========================================================
-- EXEC [dbo].[usp_GetPermissionsByUser] @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetPermissionsByUser]

    @UserUid	    VARCHAR(32)

AS
BEGIN

    SELECT DISTINCT
        perm.[Permission_Name],
        lrol.Role_Name
    -- , usrs.User_LastName
    -- , usrs.User_FirstName
    FROM
        tbl_Users usrs
        LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
        LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
        LEFT JOIN itbl_Account_Role_Permission rper ON rper.Role_ID = lrol.Role_ID
        LEFT JOIN ltbl_Permissions perm ON perm.Permission_ID = rper.Permission_ID
        LEFT JOIN ltbl_Permission_Types ptyp ON ptyp.Permission_Type_ID = perm.Permission_Permission_Type_ID
        LEFT JOIN itbl_Subscription_Permission sper ON sper.Permission_ID = perm.Permission_ID
        LEFT JOIN ltbl_Subscriptions subs ON subs.Subscription_ID = sper.Subscription_ID
    WHERE User_UID=@UserUid
    ORDER BY perm.[Permission_Name]
END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic
-- Author		:	Ramesh
-- Created		:	26-March-2018
-- Purpose		:	To Generate a Day part report
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
-- 1.		22/05/2018		Ramesh 			Add (LinkedServerName,DatabaseName)
-- ===========================================================
-- exec usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic @Device_IDs='15',@StoreStartDate='2018-03-23',@StoreEndDate='2018-03-24',@InputStartDateTime=N'2018-03-23 00:00:00',@InputEndDateTime=N'2018-03-24 10:30:00',@CarDataRecordType_ID='11',@ReportType='AC',@LaneConfig_ID=1,@PageNumber=1,@UserUID=null
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic]
(
	@Device_IDs varchar(500),
	@StoreStartDate date,
	@StoreEndDate date,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID tinyint = 1,
	--@RecordPerPage smallint = 4,
	@PageNumber smallint = 0,
	@UserUID NVARCHAR(50),
	@LinkedServerName VARCHAR(100) = 'POWCLOUDBI_UAT_R',
	@DatabaseName VARCHAR(100) ='db_qsrdrivethrucloud_ods_engdev'
)
AS
BEGIN

	/******************************
	 step 1. initialization
	******************************/

	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	SET NOCOUNT ON
	--DECLARE @Device_IDs varchar(500)
	DECLARE @cols NVARCHAR(2000)
	DECLARE @query NVARCHAR(4000)
	DECLARE @sum_query NVARCHAR(2000)
	DECLARE @header TABLE(headerName varchar(25), headerID smallint, Detector_ID smallint, sort smallint)
	DECLARE @headerSourceCol varchar(50)
	DECLARE @TheDevice_ID int
	DECLARE @isMultiStore bit = 0
	DECLARE @TotalRecCount smallint
	DECLARE @StartDateTime DATETIME
	DECLARE @EndDateTime DATETIME
	DECLARE @EventNames VARCHAR(4000)
	DECLARE @EventGoalNames VARCHAR(4000)
	SELECT @StartDateTime = CONVERT(DATETIME,  @InputStartDateTime);
	SELECT @EndDateTime = CONVERT(DATETIME,  @InputEndDateTime);

	DECLARE @Preferences_Preference_Value varchar(50)


	IF @StartDateTime IS NULL
		SET @StartDateTime = '1900-01-01 00:00:00'

	IF @EndDateTime IS NULL
		SET @EndDateTime = '3000-01-01 23:59:59'

	CREATE TABLE #raw_data(
		StoreDate date,
		DeviceTimeStamp datetime,
		Store_id int,
		Store_Number varchar(50),
		Device_UID uniqueidentifier,
		Device_ID int,
		CarRecordDataType_Name varchar(50),
		CarsInQueue smallint,
		EventType_ID int,
		EventType_Name varchar(50),
		EventType_Category_ID int,
		EventType_Category varchar(50),
		DetectorTime smallint,
		Goal_ID smallint,
		Daypart_ID smallint,
		CarDataRecord_ID bigint,
		Detector_ID int,
		EventType_Sort smallint,
		LaneConfig_ID tinyint
	)

	-- This is table is created temporarly. Once we get the data it needs to be removed
	DECLARE  @getGoalTime TABLE (
		Device_ID int,
		MenuBoard_GoalA  int,
		MenuBoard_GoalB int,
		MenuBoard_GoalC int,
		MenuBoard_GoalD int,-- MenuBoard_GoalF int,
		Greet_GoalA int,
		Greet_GoalB int,
		Greet_GoalC int,
		Greet_GoalD int,             --Greet_GoalF int,
		Service_GoalA int,
		Service_GoalB int,
		Service_GoalC int,
		Service_GoalD int, --Cashier_GoalF int,
		LaneQueue_GoalA int,
		LaneQueue_GoalB int,
		LaneQueue_GoalC int,
		LaneQueue_GoalD int,   --LaneQueue_GoalF int,
		LaneTotal_GoalA int,
		LaneTotal_GoalB int,
		LaneTotal_GoalC int,
		LaneTotal_GoalD int
	)

	CREATE TABLE #rollup_data(
		ID smallint NULL,
		DayPartIndex smallint,
		StartTime time,
		EndTime time,
		StoreNo varchar(50),
		Store_Name varchar(50),
		Device_UID uniqueidentifier,
		StoreDate varchar(25),
		Device_ID int,
		GroupName varchar(50),
		Store_ID int,
		Category varchar(50),
		AVG_DetectorTime int,
		Total_Car int,
		SortOrder smallint
	)

	CREATE TABLE #DayPart(
		Device_ID int,
		--Store_id int,
		DayPartIndex tinyint,
		StartTime time,
		EndTime time
	)

	CREATE TABLE #DayPartWithDate(
		id int IDENTITY(1,1),
		StoreDate date,
		DayPartIndex tinyint,
		StartTime time,
		EndTime time,
		OrigDayPartIndex tinyint,
	)
	CREATE TABLE #GroupDetails
	(
		GroupName varchar(200),
		Store_ID int,
		Device_ID int
	)

	/*************************************
	 step 2. populate, then roll up data
	*************************************/

	-- Get Users Pull-ins Preference for CarDataRecordType_ID
	SELECT @CarDataRecordType_ID = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
		User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=9

	-- pull in raw data from proc
		-- pull in raw data from proc
	SET @query ='INSERT INTO #raw_data
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_ID+''', '''+ @ReportType+''''

	EXEC(@query)
	SET @query =''

	INSERT INTO #GroupDetails(GroupName, Store_ID, Device_ID)
	SELECT DISTINCT g.GroupName, ts.Store_ID , td.Device_ID
	FROM tbl_DeviceInfo td INNER JOIN tbl_Stores ts ON td.Device_Store_ID = ts.Store_ID
	LEFT JOIN GroupStore gs ON gs.StoreID = ts.Store_ID
	INNER JOIN [Group] g ON g.ID = gs.GroupID
	WHERE td.Device_ID in (SELECT cValue FROM dbo.split(@Device_IDs,','))

	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- this is a multi store
			SET @isMultiStore = 1

			INSERT INTO @header
			SELECT	DISTINCT CASE WHEN ISNULL(EventType_Category,'')='' THEN 'NA' ELSE EventType_Category END EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			FROM    #raw_data
			WHERE	EventType_Category_ID IS NOT NULL

			SET @EventNames = NULL
			SET @cols = NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
				@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM  (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @TheDevice_ID = (SELECT TOP 1 Device_ID FROM #raw_data GROUP BY Device_ID ORDER BY MAX(Daypart_ID) DESC)

			SET @sum_query = '
				INSERT INTO	#rollup_data (DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime, Total_Car)
				SELECT DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime, Total_Car
				FROM (

					SELECT	DayPartIndex,
						NULL StartTime,
						NULL EndTime,
						''SubTotal'' StoreNo,
						NULL Store_Name,
						CONVERT(UniqueIdentifier, NULL) Device_UID,
						CAST(d.StoreDate AS varchar(25)) StoreDate,
						NULL Device_ID,
						ts.GroupName,
						NULL Store_ID,
						r.EventType_Category Category,
						AVG(r.DetectorTime) AVG_DetectorTime,
						COUNT(r.CarDataRecord_ID) Total_Car
					FROM	#StoreWithDatePart d
						LEFT JOIN #GroupDetails ts ON d.Device_ID = ts.Device_ID
						LEFT JOIN #raw_data r ON d.Device_ID = r.Device_ID
							AND	d.OrigDayPartIndex = r.Daypart_ID
							AND d.StoreDate = r.StoreDate
						WHERE ts.GroupName IS NOT NULL
					GROUP BY
						DayPartIndex, ts.GroupName, CAST(d.StoreDate AS varchar(25)),
						r.EventType_Category
					--HAVING COUNT(DISTINCT d.Store_ID)>1
					UNION ALL
					SELECT	DayPartIndex,
						NULL StartTime,
						NULL EndTime,
						''Total Daypart'' StoreNo,
						NULL Store_Name,
						CONVERT(UniqueIdentifier, NULL) Device_UID,
						CAST(d.StoreDate AS varchar(25)) StoreDate,
						NULL Device_ID,
						NULL GroupName,
						NULL Store_ID,
						r.EventType_Category Category,
						AVG(r.DetectorTime) AVG_DetectorTime,
						COUNT(r.CarDataRecord_ID) Total_Car
					FROM	#StoreWithDatePart d
						LEFT JOIN #raw_data r ON d.Store_id = r.Store_id
							AND	d.OrigDayPartIndex = r.Daypart_ID
							AND d.StoreDate = r.StoreDate
					GROUP BY
						DayPartIndex, CAST(d.StoreDate AS varchar(25)),
						r.EventType_Category
					HAVING COUNT(d.Device_ID)>1
				) A'
		END
	ELSE
		BEGIN	-- this is a single store
			INSERT INTO @header
			SELECT	DISTINCT CASE WHEN ISNULL(EventType_Name,'')='' THEN 'NA' ELSE EventType_Name END EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			FROM    #raw_data
			WHERE	Detector_ID IS NOT NULL

			SET @EventNames = NULL
			SET @cols = NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
				@EventNames =COALESCE(@EventNames + '|$|' + headerName , headerName)
			FROM  (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Name'
			SET @TheDevice_ID = CAST(@Device_IDs AS int)
			SET @sum_query = '
				INSERT INTO	#rollup_data (DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime, Total_Car)
				SELECT	NULL DayPartIndex,
						NULL StartTime,
						NULL EndTime,
						''Total Daypart'' StoreNo,
						NULL Store_Name,
						CONVERT(UniqueIdentifier, NULL) Device_UID,
						CAST(d.StoreDate AS varchar(25)) StoreDate,
						NULL Device_ID,
						NULL GroupName,
						NULL Store_ID,
						r.EventType_Name Category,
						AVG(r.DetectorTime) AVG_DetectorTime,
						COUNT(r.CarDataRecord_ID) Total_Car
					FROM	#StoreWithDatePart d
						LEFT JOIN #GroupDetails ts ON d.Device_ID = ts.Device_ID
						LEFT JOIN #raw_data r ON d.Device_ID = r.Device_ID
							AND	d.DayPartIndex = r.Daypart_ID
							AND d.StoreDate = r.StoreDate
					GROUP BY
						CAST(d.StoreDate AS varchar(25)),
						r.EventType_Name
					HAVING COUNT(d.Device_ID)>1
				'
		END

	-- get daypart records from the proc
	INSERT INTO #DayPart(Device_ID, DayPartIndex, StartTime, EndTime)
	SELECT  DISTINCT [Device_ID], [Daypart_ID], dbo.uf_ConvertNumberToTime([Daypart_Start]), dbo.uf_ConvertNumberToTime([Daypart_End])
	FROM	[dbo].[tbl_DeviceConfigDayparts]
	WHERE	device_id = @TheDevice_ID
	AND		[Daypart_Start] IS NOT NULL

	/*
	EXECUTE [dbo].[GetDeviceDayparts] @TheDevice_ID

	-- the DayPartIndex returned is off by 1. Off set it
	UPDATE #DayPart
	SET	DayPartIndex = DayPartIndex + 1
	*/


	-- for time slice reports, remove the dayparts of each day that fall out of the range
	IF @ReportType = 'TC'
		BEGIN
			DELETE FROM #DayPart
			WHERE	StartTime >= CAST(@EndDateTime AS time)
			OR		EndTime <= CAST(@StartDateTime AS time)

			INSERT INTO #DayPartWithDate(StoreDate, OrigDayPartIndex, StartTime, EndTime, DayPartIndex)
			SELECT	DISTINCT d.ThisDate, dp.DayPartIndex, dp.StartTime, dp.EndTime,
				ROW_NUMBER()OVER(Partition By d.ThisDate ORDER BY d.ThisDate, dp.StartTime, dp.EndTime) DayPartIndex
			FROM	dbo.uf_GetDatesByRange(CAST(@StoreStartDate AS varchar(25)), CAST(@StoreEndDate AS varchar(25))) d
					CROSS JOIN #DayPart dp

	END
	-- for cumulative reports, remove the dayparts for the first and last day that fall out of the range
	ELSE
		BEGIN
			INSERT INTO #DayPartWithDate(StoreDate, OrigDayPartIndex, StartTime, EndTime, DayPartIndex)
			SELECT	d.ThisDate, dp.DayPartIndex, dp.StartTime, dp.EndTime, ROW_NUMBER()OVER(Partition By d.ThisDate ORDER BY d.ThisDate, dp.StartTime, dp.EndTime) DayPartIndex
			FROM	dbo.uf_GetDatesByRange(CAST(@StoreStartDate AS varchar(25)), CAST(@StoreEndDate AS varchar(25))) d
					CROSS JOIN #DayPart dp

			DELETE FROM #DayPartWithDate
			WHERE	StoreDate = @StoreStartDate
			AND		EndTime < CAST(@StartDateTime AS time)

			DELETE FROM #DayPartWithDate
			WHERE	StoreDate = @StoreEndDate
			AND		StartTime > CAST(@EndDateTime AS time)
		END


	SELECT	dp.StoreDate,
			dp.DayPartIndex,
			dp.StartTime,
			dp.EndTime,
			e.Store_Number,
			d.Device_UID,
			d.Device_ID,
			e.Store_id,
			e.Store_Name,
			dp.OrigDayPartIndex INTO #StoreWithDatePart
	FROM	tbl_DeviceInfo d
			INNER JOIN tbl_Stores e ON d.Device_Store_ID = e.Store_ID
			CROSS JOIN #DayPartWithDate dp
	WHERE	EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE CAST(Devices.cValue AS int) = d.Device_ID)

	-- roll up records into each store date and daypart
	-- for single stores, generate a single summary row for all dayparts
	-- for multip stores, generate a summary row for each daypart
	SET @query = N'

		INSERT INTO	#rollup_data (DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime, Total_Car)
		SELECT	d.DayPartIndex,
				d.StartTime,
				d.EndTime,
				d.Store_Number,
				d.Store_Name,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				ts.GroupName,
				d.Store_ID,' +
				@headerSourceCol + ',
				AVG(r.DetectorTime),
				COUNT(r.CarDataRecord_ID)
		FROM	#StoreWithDatePart d
				LEFT JOIN #GroupDetails ts ON d.Device_ID = ts.Device_ID
				LEFT JOIN #raw_data r ON d.Device_ID = r.Device_ID
					AND	d.DayPartIndex = r.Daypart_ID
					AND d.StoreDate = r.StoreDate
		GROUP BY d.DayPartIndex,
				d.StartTime,
				d.EndTime,
				d.Store_Number,
				d.Store_Name,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				ts.GroupName,
				d.Store_ID,' +
				@headerSourceCol + '

		--UNION ALL ' --+ @sum_query

	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';

	EXECUTE(@sum_query);
	SET @sum_query = '';

	SELECT * INTO #rollup_data_all
	FROM #rollup_data;

	SELECT IDENTITY(Smallint, 1,1) ID, StoreDate INTO #DayIndex FROM #rollup_data_all
	GROUP BY StoreDate
	ORDER BY StoreDate

	UPDATE t SET t.ID = w.ID
	FROM #rollup_data_all t INNER JOIN #DayIndex w ON ISNULL(t.StoreDate,0) = ISNULL(w.StoreDate,0)

	SELECT @TotalRecCount = COUNT(DISTINCT StoreDate) FROM #rollup_data_all

	--SET @NoOfPages = @TotalRecCount--CEILING (CASE WHEN @RecordPerPage <>0 THEN CONVERT(Float, @TotalRecCount)/CONVERT(Float, @RecordPerPage) ELSE 1.0 END)

	TRUNCATE TABLE #rollup_data

	IF (@PageNumber >0 )
	BEGIN
		INSERT INTO #rollup_data(ID, DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName,
			Store_ID, Category, AVG_DetectorTime, Total_Car, SortOrder)
		SELECT ID, DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID,
		Category, AVG_DetectorTime, Total_Car, RANK() OVER(Partition By ID ORDER BY ID, ISNULL(DayPartIndex,100)) SortOrder
		FROM #rollup_data_all WHERE ID = @PageNumber

		SELECT @StartDateTime = StoreDate FROM #DayIndex WHERE ID = @PageNumber;
		SELECT @EndDateTime = StoreDate FROM #DayIndex WHERE ID = @PageNumber;

	END
	ELSE
	BEGIN
		INSERT INTO #rollup_data(ID, DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName,
			Store_ID, Category, AVG_DetectorTime, Total_Car, SortOrder)
		SELECT ID, DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID,
		Category, AVG_DetectorTime, Total_Car, RANK() OVER(Partition By ID ORDER BY ID, ISNULL(DayPartIndex,100)) SortOrder
		FROM #rollup_data_all
	END;
	-- below is a hack!!
	-- when a single store has change of config (for instanc: menu board, service... to pre loop, menu board, service...)
	-- or when multi store don't have the same config for each store
	-- it would generate multiple summary rows because the Total_Car number could vary.
	-- Using below fix, it will update Total_Car to be the same value, enable rollup to a single summary row
	WITH	Max_TotalCar_By_Day
	AS
	(
		SELECT	StoreNo, StoreDate, DayPartIndex, MAX(Total_Car) AS Max_TotalCar
		FROM	#rollup_data
		GROUP BY StoreNo, StoreDate, DayPartIndex
	)
	UPDATE	#rollup_data
	SET		Total_Car = mc.Max_TotalCar
	FROM	#rollup_data d
			INNER JOIN Max_TotalCar_By_Day mc ON IsNull(mc.StoreNo, '0') = IsNull(d.StoreNo, '0')
				AND	mc.StoreDate = d.StoreDate
				AND	IsNull(mc.DayPartIndex, 0) = IsNull(d.DayPartIndex, 0)


	-- pivot table to display avg time by event/category name for each daypart
	IF(ISNULL(@cols,'')<>'')
		SET @query = N'
		SELECT	*
		FROM	#rollup_data
		PIVOT(
			AVG(AVG_DetectorTime)
			FOR Category IN (' + @cols + ')
		) AS p
		ORDER BY StoreDate, ID, SortOrder, DayPartIndex, StoreNo;'
	ELSE
		SET @query = N'
		SELECT	ID, DayPartIndex, StartTime, EndTime, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Total_Car, SortOrder
		FROM	#rollup_data
		ORDER BY StoreDate, ID, SortOrder, DayPartIndex, StoreNo'


	/***********************************
		step 3. return result sets
	***********************************/
	-- return avg time report
	EXECUTE(@query)

	-- Get Users Primary Color Preference
		SET @Preferences_Preference_Value =''
		SELECT @Preferences_Preference_Value = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
			User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=5

		IF(ISNULL(@Preferences_Preference_Value,'') ='')
			SET @Preferences_Preference_Value = '#00b04c|#dcba00|#b40000'

		SELECT @Preferences_Preference_Value AS ColourCode


	-- return top 3 longest times
	IF (@isMultiStore = 0 AND @PageNumber >0)
		SELECT	e.headerName, t.DetectorTime, t.DeviceTimeStamp, e.Detector_ID
		FROM 	@header e
		CROSS APPLY
		(
			SELECT	TOP 3 DetectorTime, DeviceTimeStamp
			FROM	#raw_data r
			WHERE	r.EventType_ID = e.headerID
			AND r.StoreDate = @StartDateTime
			ORDER BY DetectorTime DESC
		)	AS t
		ORDER BY e.Detector_ID, DetectorTime DESC
	ELSE IF (@isMultiStore = 0 AND @PageNumber =0)
		SELECT	e.headerName, t.DetectorTime, t.DeviceTimeStamp, e.Detector_ID
		FROM 	@header e
		CROSS APPLY
		(
			SELECT	TOP 3 DetectorTime, DeviceTimeStamp
			FROM	#raw_data r
			WHERE	r.EventType_ID = e.headerID
			ORDER BY DetectorTime DESC
		)	AS t
		ORDER BY e.Detector_ID, DetectorTime DESC
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it


	-- return goal percentages and car totals goal counts (only applicable to single store)
	IF (@isMultiStore = 0)
		BEGIN
			DECLARE @goals TABLE(goalName varchar(25))

			-- populate goals
			INSERT INTO @goals
			SELECT	'GoalA'
			UNION
			SELECT	'GoalB'
			UNION
			SELECT	'GoalC'
			UNION
			SELECT	'GoalD'
			UNION
			SELECT	'GoalF'

			-- construct column names
			SET  @cols = NULL;
			SET @EventGoalNames =NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ' - ' + goalName + ']', '[' + headerName + ' - ' + goalName + ']'),
				@EventGoalNames=COALESCE(@EventGoalNames + '|$|' + headerName + ' - ' + goalName , headerName + ' - ' + goalName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
					CROSS JOIN @goals
			ORDER BY Sort;

			-- calculate Goal_ID for lane queue
			UPDATE	r
			SET		r.Goal_ID = CASE
									WHEN r.DetectorTime < g.GoalA THEN 1
									WHEN r.DetectorTime < g.GoalB THEN 2
									WHEN r.DetectorTime < g.GoalC THEN 3
									WHEN r.DetectorTime < g.GoalD THEN 4
									ELSE 5
								END
			FROM	#raw_data r
					INNER JOIN dbo.uf_GetDeviceGoals(@Device_IDs) g ON r.Device_ID = g.Device_ID AND r.EventType_ID = g.EventType_ID
			WHERE	g.EventType_ID = 1000;

			SET @query = '';

			-- calculate total cars that meet each of the goals
			IF(ISNULL(@cols,'')<>'')
				SET @query = N'
				WITH Total_Car_Count
				AS
				(
					SELECT	Device_ID,
							EventType_Name,
							IsNull(Goal_ID, 0) AS Goal_ID,
							COUNT(CarDataRecord_ID) AS Total_Cars
					FROM	#raw_data
					GROUP BY EventType_Name,
							Device_ID,
							IsNull(Goal_ID, 0)
				)
				SELECT	*
				FROM
				(		SELECT	Device_ID,
								EventType_Name + '' - '' + CASE Goal_ID WHEN 1 THEN ''GoalA'' WHEN 2 THEN ''GoalB'' WHEN 3 THEN ''GoalC'' WHEN 4 THEN ''GoalD'' WHEN 5 THEN ''GoalF'' ELSE ''N/A'' END AS EventGoal,
								Total_Cars
						FROM	Total_Car_Count
				) AS Car_count_by_goal
				PIVOT(
					SUM(Total_Cars)
					FOR EventGoal IN (' + @cols + ')
				) AS p'
			ELSE
				SET @query = N'SELECT	NULL Device_ID, NULL EventType_Name, 0 AS Goal_ID, 0 AS Total_Cars'

			EXECUTE(@query);

			-- store details
			SELECT
				a.Device_ID,
				b.Store_Number,
				b.Store_Name,
				c.Brand_Name,
				a.Device_LaneConfig_ID
			FROM tbl_DeviceInfo a
			LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
			LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
			WHERE
				Device_ID IN (@Device_IDs)
			AND b.Store_Number <> ''
			ORDER BY
			b.Store_Number

			--INSERT INTO @getGoalTime  VALUES(15,30,60,90,120,5,10,90,120,30,60,90,120,30,30,120,180,90,150,300,420)
			--SELECT Device_ID ,MenuBoard_GoalA as 'Menu Board-GoalA' ,MenuBoard_GoalB as 'Menu Board-GoalB',MenuBoard_GoalC as 'Menu Board-GoalC',MenuBoard_GoalD as 'Menu Board-GoalD',Greet_GoalA as 'Greet-GoalA' ,Greet_GoalB as 'Greet-GoalB',Greet_GoalC as 'Greet-GoalC',Greet_GoalD as 'Greet-GoalD',Service_GoalA as 'Service-GoalA' ,Service_GoalB as 'Service-GoalB',Service_GoalC as 'Service-GoalC',Service_GoalD as 'Service-GoalD',LaneQueue_GoalA as 'Lane Queue-GoalA' ,LaneQueue_GoalB as 'Lane Queue-GoalB',LaneQueue_GoalC as 'Lane Queue-GoalC',LaneQueue_GoalD as 'Lane Queue-GoalD',LaneTotal_GoalA as 'Lane Total-GoalA',  LaneTotal_GoalB as 'Lane Total-GoalB',LaneTotal_GoalC as 'Lane Total-GoalC',LaneTotal_GoalD as 'Lane Total-GoalD'
			--FROM
			--@getGoalTime;

			-- get Gaols time in seconds
			EXEC usp_HME_Cloud_Get_Device_Goals_Details @Device_IDs

			-- include pullins
			DECLARE @IncludePullins bit
			SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
				FROM tbl_DeviceSetting WITH (NOLOCK)
				WHERE DeviceSetting_Device_ID = @Device_IDs
				AND DeviceSetting_Setting_ID = '6002'

			-- Device SystemStatistics General
			EXEC GetDeviceSystemStatisticsGeneral @Device_IDs,@StoreEndDate,@StoreStartDate

			-- Device SystemStatistics Lane
			EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins -- '15','2018-03-24', '2018-03-24',0
			SELECT @EventNames EventNames
			SELECT @EventGoalNames EventGoalNames
		END
	ELSE
	BEGIN
		SELECT 1	-- fake resultset in case the application expecting it
		SELECT @EventNames EventNames
	END

	SELECT @TotalRecCount TotalRecCount, @TotalRecCount NoOfPages

	RETURN(0)

END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic
-- Author		:	Swathi Kumar
-- Created		:	12-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get Day report details for the given StoreIds
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
-- 1.		13/04/2018		Swathi Kumar	Added Subtotal calculation
-- 2.		14/05/2018		Jayaram			Dynamic events include
-- 3.		22/05/2018		Ramesh			Add LinkedServerName,DatabaseName
-- ===========================================================
--exec usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic '111447,111446','2018-03-20','2018-03-26',N'2018-03-20 00:00:00',N'2018-03-26 10:30:00','11','AC',1,'CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'

CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details_Dynamic](
	@Device_IDs varchar(500),
	@StoreStartDate date,
	@StoreEndDate date,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID tinyint = 1,
	@UserUID NVARCHAR(50),
	@LinkedServerName VARCHAR(100) = 'POWCLOUDBI_UAT_R',
	@DatabaseName VARCHAR(100) ='db_qsrdrivethrucloud_ods_engdev'
)
AS
BEGIN
	/******************************
	 step 1. initialization
	******************************/
	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	SET NOCOUNT ON

	DECLARE @cols NVARCHAR(2000)
	DECLARE @query NVARCHAR(MAX)
	DECLARE @sum_query NVARCHAR(2000)
	DECLARE @header TABLE(headerName varchar(25), headerID smallint, Detector_ID smallint, sort smallint)
	DECLARE @headerSourceCol varchar(50)
	DECLARE @isMultiStore bit = 0
	DECLARE @Preferences_Preference_Value varchar(50)
	DECLARE @StartDateTime DATETIME
	DECLARE @EndDateTime DATETIME
	DECLARE @EventNames VARCHAR(4000)
	DECLARE @EventGoalNames VARCHAR(4000)
	SELECT @StartDateTime = CONVERT(DATETIME,  @InputStartDateTime);
	SELECT @EndDateTime = CONVERT(DATETIME,  @InputEndDateTime);

	IF @StartDateTime IS NULL
		SET @StartDateTime = '1900-01-01 00:00:00'

	IF @EndDateTime IS NULL
		SET @EndDateTime = '3000-01-01 23:59:59'



	CREATE TABLE #raw_data(
		StoreDate date,
		DeviceTimeStamp datetime,
		Store_id int,
		Store_Number varchar(50),
		Device_UID uniqueidentifier,
		Device_ID int,
		CarRecordDataType_Name varchar(50),
		CarsInQueue smallint,
		EventType_ID int,
		EventType_Name varchar(50),
		EventType_Category_ID int,
		EventType_Category varchar(50),
		DetectorTime smallint,
		Goal_ID smallint,
		Daypart_ID smallint,
		CarDataRecord_ID bigint,
		Detector_ID int,
		EventType_Sort smallint,
		LaneConfig_ID tinyint
	)

	CREATE TABLE #rollup_data(
		ID smallint NULL,
		StoreNo varchar(50),
		Store_Name varchar(50),
		Device_UID uniqueidentifier,
		StoreDate varchar(25),
		Device_ID int,
		GroupName varchar(50),
		Store_ID int,
		Category varchar(50),
		AVG_DetectorTime int,
		Total_Car int
	)
	CREATE TABLE #GroupDetails
		(
			GroupName varchar(200),
			Store_ID int,
			Store_Name varchar(50),
			Device_ID int
		)


	/*************************************
	 step 2. populate, then roll up data
	*************************************/

	-- pull in raw data from proc
	SET @query ='INSERT INTO #raw_data
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_ID+''', '''+ @ReportType+''''

	EXEC(@query)
	SET @query =''
	INSERT INTO #GroupDetails(GroupName, Store_ID, Store_Name, Device_ID)
	SELECT DISTINCT g.GroupName,ts.Store_ID, ts.Store_Name , td.Device_ID
	FROM tbl_Stores ts INNER JOIN tbl_DeviceInfo td ON ts.Store_ID = td.Device_Store_ID
	LEFT JOIN GroupStore gs ON gs.StoreID = ts.Store_ID
	INNER JOIN [Group] g ON g.ID = gs.GroupID
	WHERE td.Device_ID in (SELECT cValue FROM dbo.split(@Device_IDs,','))

	-- determine whether it's multi store or single store
	-- for single stores, the column names would be its event name
	-- for multi stores, the column names would be category name
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- this is multi store
			SET @isMultiStore = 1

			INSERT INTO @header
			SELECT	DISTINCT CASE WHEN ISNULL(EventType_Category,'')='' THEN 'NA' ELSE EventType_Category END EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			FROM    #raw_data
			WHERE	EventType_Category_ID IS NOT NULL

			SET @EventNames = NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @sum_query = '
				SELECT StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime , Total_Car
				FROM (
						SELECT	''Subtotal'' StoreNo,
							NULL Store_Name,
							NULL Device_UID,
							CAST(d.StoreDate AS varchar(25)) StoreDate,
							NULL Device_ID,
							g.GroupName,
							NULL Store_ID,
							d.EventType_Category Category,
							AVG(d.DetectorTime) AVG_DetectorTime,
							COUNT(d.CarDataRecord_ID) Total_Car
						FROM	#raw_data d INNER JOIN tbl_DeviceInfo ts ON d.Device_ID = ts.Device_ID
						LEFT JOIN #GroupDetails g ON ts.Device_Store_ID = g.Store_ID
						WHERE g.GroupName IS NOT NULL AND d.Store_ID IS NOT NULL
						GROUP BY CAST(d.StoreDate AS varchar(25)), g.GroupName, d.EventType_Category
						HAVING COUNT(DISTINCT d.Store_ID)>1

						UNION ALL
						SELECT	''Total Day''  StoreNo,
							NULL Store_Name,
							NULL Device_UID,
							StoreDate,
							NULL Device_ID,
							NULL GroupName,
							NULL Store_ID,
							EventType_Category Category,
							AVG(DetectorTime) AVG_DetectorTime,
							COUNT(CarDataRecord_ID) Total_Car
						FROM	#raw_data
						GROUP BY StoreDate, EventType_Category
					) A'
		END
	ELSE
		BEGIN	-- this is single store
			INSERT INTO @header
			SELECT	DISTINCT CASE WHEN ISNULL(EventType_Name,'') ='' THEN 'NA' ELSE EventType_Name END EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			FROM    #raw_data
			WHERE	Detector_ID IS NOT NULL

			SET @EventNames =NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Name'
			SET @sum_query = '
				SELECT	NULL StoreNo,
					NULL Store_Name,
					NULL Device_UID,
					''Total Day'' StoreDate,
					NULL Device_ID,
					NULL GroupName,
					NULL Store_ID,
					EventType_Name Category,
					AVG(DetectorTime) AVG_DetectorTime,
					COUNT(CarDataRecord_ID) Total_Car
				FROM	#raw_data
				--WHERE DetectorTime IS NOT NULL
				GROUP BY  EventType_Name'

		END

	-- roll up records into each store date
	-- for single stores, generate a single summary row for all dates
	-- for multip stores, generate a summary row for each date
	SET @query = N'
		INSERT INTO	#rollup_data(StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime , Total_Car )
		SELECT	d.Store_Number,
				s.Store_Name,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				ts.GroupName,
				d.Store_ID,' +
				@headerSourceCol + ',
				AVG(d.DetectorTime),
				COUNT(d.CarDataRecord_ID)
		FROM	#raw_data d LEFT JOIN #GroupDetails ts ON d.Store_ID = ts.Store_ID
		LEFT JOIN tbl_Stores s ON d.Store_ID = s.Store_ID
		GROUP BY d.StoreDate,' +
				@headerSourceCol + ',
				d.Store_Number,
				s.Store_Name,
				d.Device_UID,
				d.Device_ID,
				ts.GroupName,
				d.Store_ID
		ORDER BY d.StoreDate,' +
				@headerSourceCol + ',
				d.Store_Number,
				d.Device_UID,
				d.Device_ID,
				ts.GroupName,
				d.Store_ID
		--UNION ALL ' --+ @sum_query

	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';

	INSERT INTO #rollup_data (StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime , Total_Car)
	EXECUTE(@sum_query);
	SET @sum_query = '';

	WITH	Update_ID_By_StoreDate
	AS
	(
		SELECT StoreDate, Row_NUMBER()OVER(ORDER BY StoreDate) ID
		FROM	#rollup_data
		GROUP BY StoreDate
	)
	UPDATE	#rollup_data
	SET		ID = mc.ID
	FROM	#rollup_data d
			INNER JOIN Update_ID_By_StoreDate mc ON mc.StoreDate = d.StoreDate

	IF NOT EXISTS(SELECT 1 FROM #rollup_data)
	BEGIN
		DECLARE @tmpDate DateTime
		CREATE TABLE #tmpDateRange
		(StoreDate datetime)
		SET @tmpDate =@StoreStartDate
		WHILE (@tmpDate <= @StoreEndDate)
		BEGIN
			INSERT INTO #tmpDateRange
			SELECT @tmpDate
			SET @tmpDate = DATEADD(dd,1,@tmpDate)
		END

		INSERT INTO #rollup_data (ID, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Category, AVG_DetectorTime , Total_Car)
		SELECT  ROW_NUMBER()OVER(ORDER BY StoreDate) ID , NULL StoreNo, NULL Store_Name, NULL Device_UID, StoreDate, NULL Device_ID, NULL GroupName, NULL Store_ID, NULL Category, NULL AVG_DetectorTime , NULL Total_Car
		FROM #tmpDateRange
		UNION ALL
		SELECT 10000 ID, 'Total Day' StoreNo, NULL Store_Name, NULL Device_UID, NULL StoreDate, NULL Device_ID, NULL GroupName, NULL Store_ID, NULL Category, NULL AVG_DetectorTime , NULL Total_Car

	END;
	-- below is a hack!!
	-- when a single store has change of config (for instanc: menu board, service... to pre loop, menu board, service...)
	-- or when multi store don't have the same config for each store
	-- it would generate multiple summary rows because the Total_Car number could vary.
	-- Using below fix, it will update Total_Car to be the same value, enable rollup to a single summary row
	WITH	Max_TotalCar_By_Day
	AS
	(
		SELECT	StoreNo, StoreDate, MAX(Total_Car) AS Max_TotalCar
		FROM	#rollup_data
		GROUP BY StoreNo, StoreDate
	)
	UPDATE	#rollup_data
	SET		Total_Car = mc.Max_TotalCar
	FROM	#rollup_data d
			INNER JOIN Max_TotalCar_By_Day mc ON mc.StoreNo = d.StoreNo
				AND	mc.StoreDate = d.StoreDate


	-- pivot table to display avg time by event/category name for each day
	IF(ISNULL(@cols,'')<>'')
		SET @query = N'
		SELECT	*, RANK () OVER (ORDER BY Storedate) DayID
		FROM	#rollup_data
		PIVOT(
			AVG(AVG_DetectorTime)
			FOR Category IN (' + @cols + ')
		) AS p
		ORDER BY  ID,StoreDate, StoreNo;'
	ELSE
		SET @query = N'
		SELECT	ID , StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, GroupName, Store_ID, Total_Car
		 , RANK () OVER (ORDER BY ID, Storedate) DayID
		FROM #rollup_data ORDER BY ID, StoreDate, StoreNo;'

	/***********************************
		step 3. return result sets
	***********************************/
	-- return avg time report
	EXECUTE(@query);
	PRINT @query

	-- return top 3 longest times (only applicable to single store)
	IF (@isMultiStore = 0)
	BEGIN
		IF EXISTS(SELECT 1 FROM @header)
		BEGIN
			SELECT	e.headerName, t.DetectorTime, t.DeviceTimeStamp, t.Detector_ID
			FROM 	@header e
			CROSS APPLY
			(
				SELECT	TOP 3 DetectorTime, DeviceTimeStamp, Detector_ID
				FROM	#raw_data r
				WHERE	r.EventType_ID = e.headerID
				ORDER BY DetectorTime DESC
			)	AS t
			ORDER BY e.Detector_ID, DetectorTime DESC
		END
		ELSE
		BEGIN
			SELECT	NULL headerName, NULL DetectorTime, NULL DeviceTimeStamp, NULL Detector_ID
		END
	END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it


	-- return goal percentages and car totals goal counts (only applicable to single store)
	IF (@isMultiStore = 0 OR @isMultiStore = 1)
		BEGIN
			DECLARE @goals TABLE(goalName varchar(25))

			-- populate goals
			INSERT INTO @goals
			SELECT	'GoalA'
			UNION
			SELECT	'GoalB'
			UNION
			SELECT	'GoalC'
			UNION
			SELECT	'GoalD'
			UNION
			SELECT	'GoalF'

			-- construct column names
			SET  @cols = NULL;
			SET @EventGoalNames = NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ' - ' + goalName + ']', '[' + headerName + ' - ' + goalName + ']'),
			@EventGoalNames = COALESCE(@EventGoalNames + '|$|' + headerName + ' - ' + goalName , headerName + ' - ' + goalName )
			FROM  (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
					CROSS JOIN @goals
			ORDER BY Sort;

			-- calculate Goal_ID for lane queue
			UPDATE	r
			SET		r.Goal_ID = CASE
									WHEN r.DetectorTime < g.GoalA THEN 1
									WHEN r.DetectorTime < g.GoalB THEN 2
									WHEN r.DetectorTime < g.GoalC THEN 3
									WHEN r.DetectorTime < g.GoalD THEN 4
									ELSE 5
								END
			FROM	#raw_data r
					INNER JOIN dbo.uf_GetDeviceGoals(@Device_IDs) g ON r.Device_ID = g.Device_ID AND r.EventType_ID = g.EventType_ID
			WHERE	g.EventType_ID = 1000;

			SET @query = '';

			-- calculate total cars that meet each of the goals
			IF(ISNULL(@cols,'')<>'')
			BEGIN

				SET @query = N'
				WITH Total_Car_Count
				AS
				(
					SELECT	Device_ID,
							EventType_Name,
							IsNull(Goal_ID, 0) AS Goal_ID,
							COUNT(CarDataRecord_ID) AS Total_Cars
					FROM	#raw_data
					GROUP BY EventType_Name,
							Device_ID,
							IsNull(Goal_ID, 0)
				)
				SELECT	*
				FROM
				(		SELECT	Device_ID,
								EventType_Name + '' - '' + CASE Goal_ID WHEN 1 THEN ''GoalA'' WHEN 2 THEN ''GoalB'' WHEN 3 THEN ''GoalC'' WHEN 4 THEN ''GoalD'' WHEN 5 THEN ''GoalF'' ELSE ''N/A'' END AS EventGoal,
								Total_Cars
						FROM	Total_Car_Count
				) AS Car_count_by_goal
				PIVOT(
					SUM(Total_Cars)
					FOR EventGoal IN (' + @cols + ')
				) AS p'
			END
			ELSE
				SET @query = N'
				IF EXISTS (SELECT	Device_ID,
							EventType_Name,
							IsNull(Goal_ID, 0) AS Goal_ID,
							COUNT(CarDataRecord_ID) AS Total_Cars
					FROM	#raw_data
					GROUP BY EventType_Name,
							Device_ID,
							IsNull(Goal_ID, 0))
				BEGIN
					SELECT	Device_ID,
								EventType_Name,
								IsNull(Goal_ID, 0) AS Goal_ID,
								COUNT(CarDataRecord_ID) AS Total_Cars
						FROM	#raw_data
						GROUP BY EventType_Name,
								Device_ID,
								IsNull(Goal_ID, 0)
				END
				ELSE
				BEGIN
					SELECT	NULL Device_ID,
					NULL EventType_Name,
					0 AS Goal_ID,
					0 AS Total_Cars
				END'
			EXECUTE(@query);

		END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it

	-- Store details
	IF (@isMultiStore = 0)
		BEGIN
			IF EXISTS (SELECT TOP 1 1 FROM tbl_DeviceInfo a
			LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
			LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
			WHERE
				Device_ID IN (@Device_IDs)
			AND b.Store_Number <> '')
			BEGIN
				SELECT
					a.Device_ID,
					b.Store_Number,
					b.Store_Name,
					c.Brand_Name,
					a.Device_LaneConfig_ID
				FROM tbl_DeviceInfo a
				LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
				LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
				WHERE
					Device_ID IN (@Device_IDs)
				AND b.Store_Number <> ''
				ORDER BY
				b.Store_Number
			END
			ELSE
			BEGIN
				SELECT
					NULL Device_ID,
					NULL Store_Number,
					NULL Store_Name,
					NULL Brand_Name,
					NULL Device_LaneConfig_ID
			END
		END
	ELSE
		SELECT 1

		-- get Color code from user Prefernce table if not found get default values
	SET @Preferences_Preference_Value =''
	SELECT @Preferences_Preference_Value = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
		User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=5

	IF(ISNULL(@Preferences_Preference_Value,'') ='')
		SET @Preferences_Preference_Value = '#00b04c|#dcba00|#b40000'

	SELECT @Preferences_Preference_Value AS ColourCode

	-- Goal time
	EXEC usp_HME_Cloud_Get_Device_Goals_Details @Device_IDs

	-- Changes for System Statistics
	IF (@isMultiStore = 0)
	BEGIN
		-- Device SystemStatistics General
		EXEC GetDeviceSystemStatisticsGeneral @Device_IDs,@StoreEndDate,@StoreStartDate

		-- include pullins
			DECLARE @IncludePullins bit
			SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
				FROM tbl_DeviceSetting WITH (NOLOCK)
				WHERE DeviceSetting_Device_ID = @Device_IDs
				AND DeviceSetting_Setting_ID = '6002'

				-- Device SystemStatistics Lane
		CREATE TABLE #tmpSystemStatisticsLane
			(
				Device_ID int,
				Lane tinyint,
				AvgCarsInLane int,
				Pullouts int,
				Pullins int,
				DeleteOverMax int
			);
		INSERT INTO #tmpSystemStatisticsLane(Device_ID, Lane, AvgCarsInLane, Pullouts, Pullins, DeleteOverMax)
		EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins
		IF EXISTS(SELECT 1 FROM #tmpSystemStatisticsLane)
			SELECT * FROM #tmpSystemStatisticsLane
		ELSE
			SELECT NULL Device_ID, NULL Lane, NULL AvgCarsInLane, NULL Pullouts, NULL Pullins, NULL DeleteOverMax

		SELECT @EventGoalNames EventGoalNames
	END
	SELECT @EventNames EventNames
	RETURN(0)

END
GO
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name   : usp_HME_Cloud_Get_Report_Raw_Data_Details
-- Author  : Swathi Kumar
-- Created  : 12-April-2018
-- Tables  : Group,Stores
-- Purpose  : To get Day report details for the given StoreIds
-- ===========================================================
--    Modification History
-- -----------------------------------------------------------
-- Sl.No.   Date         Developer            Descriptopn
-- -----------------------------------------------------------
-- 1.     22/05/2018     Ramesh              Add (LinkedServerName,DatabaseName)
-- ===========================================================
-- exec [usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic] '15', '2018-03-24', '2018-03-24', '2018-03-24 00:00:00' , '2018-03-24 12:00:00', 11, 'TC',1
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic](
 @Device_IDs varchar(500),
 @StoreStartDate date,
 @StoreEndDate date,
 @StartDateTime datetime = '1900-01-01 00:00:00',
 @EndDateTime datetime = '3000-01-01 23:59:59',
 @CarDataRecordType_IDs varchar(255) = '11',
 @ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
 @LaneConfig_ID smallint = 1,
 @LinkedServerName VARCHAR(100) = 'POWCLOUDBI_UAT_R',
 @DatabaseName VARCHAR(100) ='db_qsrdrivethrucloud_ods_engdev'
)
AS

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET NOCOUNT ON

DECLARE @MaxID int
DECLARE @query NVARCHAR(3000)

IF @StartDateTime IS NULL
 SET @StartDateTime = '1900-01-01 00:00:00'

IF @EndDateTime IS NULL
 SET @EndDateTime = '3000-01-01 23:59:59'


CREATE TABLE #DetectorEventType(
 Device_ID int,
 Detector_ID int,
 EventType_ID int,
 EventType_Name varchar(25),
 EventType_Category_ID smallint,
 EventType_Category varchar(50),
 EventType_Sort smallint,
 LaneConfig_ID tinyint
)

CREATE TABLE #DateTimeSlice(
 id int IDENTITY(1,1),
 StoreDate date,
 StartDateTime datetime,
 EndDateTime datetime
)

CREATE TABLE #StoresDevicesDates(
 Store_id int,
 Store_Number varchar(50),
 Device_UID uniqueidentifier,
 StoreDate date,
 Device_ID int
)

--CREATE TABLE #CarDetectorData(
--  Device_ID int,
--  Daypart_ID tinyint,
--  StoreDate date,
--  DepartTimeStamp datetime,
--  Detector_ID int,
--  DetectorTime smallint,
--  CarDataRecord_ID bigint,
--  Goal_ID smallint,
--  CarRecordDataType_Name varchar(20),
--  CarsInQueue tinyint
--)
CREATE TABLE #CarDetectorData(
		StoreDate date,
		DepartTimeStamp datetime,
		Store_id int,
		Store_Number varchar(50),
		Device_UID uniqueidentifier,
		Device_ID int,
		CarRecordDataType_Name varchar(50),
		CarsInQueue smallint,
		EventType_ID int,
		EventType_Name varchar(50),
		EventType_Category_ID int,
		EventType_Category varchar(50),
		DetectorTime smallint,
		Goal_ID smallint,
		Daypart_ID smallint,
		CarDataRecord_ID bigint,
		Detector_ID int,
		EventType_Sort smallint,
		LaneConfig_ID tinyint
	)
CREATE TABLE #EventTypeNames(
 EventTypeName Varchar(200)
)
-- Getting the DeviceIds for the given StoreId
--SET @Device_IDs = (select dinf.Device_ID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));
--SET @Device_UID = (select dinf.Device_UID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));


-- report type is "Time Slice", then calculate each store date with the time slice
IF @ReportType = 'TC'
 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14), CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)
 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d
ELSE
BEGIN
 -- report is 'Cumulative', apply the start time to the first day, and end time to the last day, any other days in between will be 24h
 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' 00:00:00', CAST(d.ThisDate AS char(10)) + ' 23:59:59'
 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d

 SET @MaxID = SCOPE_IDENTITY()

 UPDATE #DateTimeSlice
 SET StartDateTime = @StartDateTime
 WHERE id = 1

 UPDATE #DateTimeSlice
 SET EndDateTime = @EndDateTime
 WHERE id = @MaxID
END


-- populate this table for later join in order to reduce logical reads
INSERT INTO #DetectorEventType
SELECT g.Device_ID,
  g.Detector_ID,
  f.EventType_ID,
  f.EventType_Name,
  f.EventType_Category_ID,
  f.EventType_Category,
  f.EventType_Category_Sort,
  f.LaneConfig_ID
FROM tbl_DeviceConfigDetectors g
  INNER JOIN [dbo].[tbl_DeviceInfo] d ON g.Device_ID = d.Device_ID
  INNER JOIN tbl_EventType f ON f.EventType_ID = g.Detector_EventType_ID
WHERE EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = g.Device_ID)
AND  f.EventType_ID > 0
AND  f.LaneConfig_ID = d.Device_LaneConfig_ID
AND  g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors


-- pull records for all events
INSERT INTO #StoresDevicesDates
SELECT e.Store_id,
  e.Store_Number,
  d.Device_UID,
  dt.ThisDate,
  d.Device_ID
FROM tbl_DeviceInfo d
  INNER JOIN tbl_Stores e ON e.Store_ID = d.Device_Store_ID
  CROSS JOIN dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) dt
WHERE EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = d.Device_ID)



SET @query ='INSERT INTO #CarDetectorData
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_IDs+''', '''+ @ReportType+''''
	EXEC (@query)

--SELECT b.Device_ID ,
--  b.Daypart_ID,
--  b.StoreDate,
--  CAST(b.DepartTimeStamp AS DATETIME) AS DepartTimeStamp,
--  a.DetectorData_ID AS Detector_ID,
--  a.DetectorTime,
--  a.CarDataRecord_ID,
--  a.Goal_ID,
--  [CarRecordDataType_Name] = CASE b.CarDataRecordType_ID WHEN 11 THEN 'Car_Departure' WHEN 4 THEN 'Car_Pull_In' ELSE 'Other' END,
--  b.CarsInQueue
--FROM tbl_DetectorData a
--  INNER JOIN tbl_CarRecordData b ON b.CarDataRecord_ID = a.CarDataRecord_ID
--  --INNER JOIN ltbl_CarDataRecordType c ON c.CarRecordDataType_ID = b.CarDataRecordType_ID
--WHERE 1 = 1
--AND  b.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
--AND  EXISTS(SELECT 1 FROM #DateTimeSlice AS dts WHERE dts.StoreDate = b.StoreDate AND CAST(b.DepartTimeStamp AS DATETIME) BETWEEN dts.StartDateTime AND dts.EndDateTime)
--AND  EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = b.Device_ID)
--AND  EXISTS(SELECT 1 FROM dbo.Split(@CarDataRecordType_IDs, ',') AS drt WHERE drt.cValue = b.CarDataRecordType_ID)
--AND  (a.Goal_ID > 0 OR a.DetectorData_ID = 1000)  -- except land queue, do not include records with Goal_id = 0


-- add index to above temp table
CREATE NONCLUSTERED INDEX [IX_tbl_CarRecordData_Device_ID] ON #CarDetectorData
(
 Device_ID,
 StoreDate,
 CarDataRecord_ID,
 Detector_ID
) ON [PRIMARY]



SET @query = ''

SELECT *, RANK () OVER (ORDER BY Storedate,DepartTimeStamp) RawDataID FROM (
SELECT sdd.StoreDate,
  CAST(b.DepartTimeStamp AS DATETIME) AS DepartTimeStamp,
  sdd.Store_id,
  sdd.Store_Number,
  sdd.Device_UID,
  sdd.Device_ID,
  b.CarRecordDataType_Name,
  b.CarsInQueue,
  g.EventType_ID,
  g.EventType_Name,
  g.EventType_Category_ID,
  g.EventType_Category,
  b.DetectorTime,
  b.Goal_ID,
  b.Daypart_ID,
  b.CarDataRecord_ID,
  g.Detector_ID,
  g.EventType_Sort,
  g.LaneConfig_ID
FROM #StoresDevicesDates sdd
  LEFT JOIN #DetectorEventType g ON g.Device_ID = sdd.Device_ID
  LEFT JOIN #CarDetectorData b ON b.Device_ID = sdd.Device_ID
   AND b.StoreDate = sdd.StoreDate
   AND g.Device_ID = b.Device_ID
   AND g.Detector_ID = b.Detector_ID
   WHERE (b.Detector_ID = 1000 OR b.Goal_ID>0)

UNION

-- add records for any events that do not have detecter data
SELECT sdd.StoreDate,
  CAST(cdd.DepartTimeStamp AS datetime) AS DepartTimeStamp,
  sdd.Store_id,
  sdd.Store_Number,
  sdd.Device_UID,
  sdd.Device_ID,
  cdd.CarRecordDataType_Name,
  cdd.CarsInQueue,
  et.EventType_ID,
  et.EventType_Name,
  et.EventType_Category_ID,
  et.EventType_Category,
  NULL AS [DetectorTime],
  NULL AS [Goal_ID],
  cdd.Daypart_ID,
  cdd.CarDataRecord_ID,
  et.Detector_ID,
  et.EventType_Sort,
  et.LaneConfig_ID
FROM #StoresDevicesDates sdd
  INNER JOIN #DetectorEventType et ON et.Device_ID = sdd.Device_ID
  INNER JOIN #CarDetectorData cdd ON sdd.Device_ID = cdd.Device_ID AND cdd.Detector_ID = 2000 AND sdd.StoreDate = cdd.StoreDate
WHERE NOT EXISTS(
  SELECT 1
  FROM #CarDetectorData d
  WHERE et.Detector_ID = d.Detector_ID
  AND  cdd.CarDataRecord_ID = d.CarDataRecord_ID
   AND (d.Detector_ID = 1000 OR d.Goal_ID>0)

)
) A
ORDER BY DepartTimeStamp

--Test
INSERT INTO #EventTypeNames SELECT DISTINCT
  g.EventType_Name
FROM #StoresDevicesDates sdd
  LEFT JOIN #DetectorEventType g ON g.Device_ID = sdd.Device_ID
  LEFT JOIN #CarDetectorData b ON b.Device_ID = sdd.Device_ID
   AND b.StoreDate = sdd.StoreDate
   AND g.Device_ID = b.Device_ID
   AND g.Detector_ID = b.Detector_ID
UNION ALL
SELECT
  et.EventType_Name
FROM #StoresDevicesDates sdd
  INNER JOIN #DetectorEventType et ON et.Device_ID = sdd.Device_ID
  INNER JOIN #CarDetectorData cdd ON sdd.Device_ID = cdd.Device_ID AND cdd.Detector_ID = 2000 AND sdd.StoreDate = cdd.StoreDate
WHERE NOT EXISTS(
  SELECT 1
  FROM #CarDetectorData d
  WHERE et.Detector_ID = d.Detector_ID
  AND  cdd.CarDataRecord_ID = d.CarDataRecord_ID
)
ORDER BY EventType_Name

DECLARE @listStr VARCHAR(MAX)
SELECT  @listStr = COALESCE(@listStr+'|$|' ,'') + EventTypeName
FROM #EventTypeNames
SELECT @listStr as 'EventTypeName'
--Test end

EXECUTE(@query);

SET @query = '';
SELECT a.Device_ID, b.Store_Number, b.Store_Name, c.Brand_Name, a.Device_LaneConfig_ID
   FROM tbl_DeviceInfo a
    LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
    LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
   WHERE Device_ID IN (@Device_IDs)
   AND b.Store_Number <> ''
   ORDER BY b.Store_Number


EXECUTE(@query);

SET @query = '';

EXEC[dbo].[GetDeviceDayparts] @Device_ID = @Device_IDs
EXECUTE(@query);


RETURN(0)

GO

-- exec usp_HME_Cloud_Get_Report_Raw_Data '2955', '2015-01-28', '2015-01-28', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'
-- exec usp_HME_Cloud_Get_Report_Raw_Data '2979', '2015-01-13', '2015-01-13', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'
-- exec usp_HME_Cloud_Get_Report_Raw_Data '1354,1382', '2014-07-11', '2014-07-11', '2014-08-11 10:00:00', '2014-08-11 10:01:00', '11', 'AC'

-- exec usp_HME_Cloud_Get_Report_Raw_Data '1382', '2015-02-10', '2015-02-10', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic
-- Author		:	Swathi Kumar
-- Created		:	12-April-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get Weekly report details for the given StoreIds
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
-- 1.		13/04/2018		Swathi Kumar	Added Subtotal calculation
-- 2.		22/05/2018		Ramesh			Add (LinkedServerName,DatabaseName)
-- ===========================================================
-- EXEC [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic] '19','2018-02-24','2018-03-26',N'2018-02-24 00:00:00',N'2018-03-26 10:30:00','11','AC',1,N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
-- ===========================================================

-- use the below UserUid for testing in local data base
-- --,@UserUID=N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details_Dynamic](
	@Device_IDs VARCHAR(500),
	@StoreStartDate DATE,
	@StoreEndDate DATE,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType CHAR(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID TINYINT = 1,
	@UserUID NVARCHAR(50),
	@LinkedServerName VARCHAR(100) = 'POWCLOUDBI_UAT_R',
	@DatabaseName VARCHAR(100) ='db_qsrdrivethrucloud_ods_engdev'
)
AS
BEGIN

	/******************************
	 step 1. initialization
	******************************/

	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	SET NOCOUNT ON

	DECLARE @cols NVARCHAR(2000)
	DECLARE @query NVARCHAR(4000)
	DECLARE @sum_query NVARCHAR(4000)
	DECLARE @header TABLE(headerName varchar(25), headerID smallint, Detector_ID smallint, sort smallint)
	DECLARE @headerSourceCol varchar(50)
	DECLARE @TheDevice_ID int
	DECLARE @isMultiStore bit = 0
	DECLARE @StartDateTime DATETIME
	DECLARE @EndDateTime DATETIME
	DECLARE @EventNames VARCHAR(4000)
	DECLARE @EventGoalNames VARCHAR(4000)
	SELECT @StartDateTime = CONVERT(DATETIME,  @InputStartDateTime);
	SELECT @EndDateTime = CONVERT(DATETIME,  @InputEndDateTime);
	DECLARE @Preferences_Preference_Value varchar(50)

	IF @StartDateTime IS NULL
		SET @StartDateTime = '1900-01-01 00:00:00'

	IF @EndDateTime IS NULL
		SET @EndDateTime = '3000-01-01 23:59:59'

	CREATE TABLE #raw_data(
		StoreDate date,
		DeviceTimeStamp datetime,
		Store_id int,
		Store_Number varchar(50),
		Device_UID uniqueidentifier,
		Device_ID int,
		CarRecordDataType_Name varchar(50),
		CarsInQueue smallint,
		EventType_ID int,
		EventType_Name varchar(50),
		EventType_Category_ID int,
		EventType_Category varchar(50),
		DetectorTime smallint,
		Goal_ID smallint,
		Daypart_ID smallint,
		CarDataRecord_ID bigint,
		Detector_ID int,
		EventType_Sort smallint,
		LaneConfig_ID tinyint
	)

	-- This is table is created temporarly. Once we get the data it needs to be removed
	DECLARE  @getGoalTime TABLE (
		Device_ID int,
		MenuBoard_GoalA int,
		MenuBoard_GoalB int,
		MenuBoard_GoalC int,
		MenuBoard_GoalD int,-- MenuBoard_GoalF int,
		Greet_GoalA int,
		Greet_GoalB int,
		Greet_GoalC int,
		Greet_GoalD int,             --Greet_GoalF int,
		Cashier_GoalA int,
		Cashier_GoalB int,
		Cashier_GoalC int,
		Cashier_GoalD int, --Cashier_GoalF int,
		Pickup_GoalA int,
		Pickup_GoalB int,
		Pickup_GoalC int,
		Pickup_GoalD int, --Pickup_GoalF int,
		LaneQueue_GoalA int,
		LaneQueue_GoalB int,
		LaneQueue_GoalC int,
		LaneQueue_GoalD int,   --LaneQueue_GoalF int,
		LaneTotal_GoalA int,
		LaneTotal_GoalB int,
		LaneTotal_GoalC int,
		LaneTotal_GoalD int
	)

	CREATE TABLE #rollup_data(
		WeekIndex smallint,
		WeekStartDate char(10),
		WeekEndDate char(10),
		StoreNo varchar(50),
		Store_Name varchar(50),
		Device_UID uniqueidentifier,
		Device_ID int,
		GroupName varchar(50),
		StoreID int,
		Category varchar(50),
		AVG_DetectorTime int,
		Total_Car int
	)

	CREATE TABLE #Week(
		id int IDENTITY(1,1),
		WeekIndex smallint,
		StoreDate date,
		WeekStartDate date,
		WeekEndDate date
	)

	CREATE TABLE #GroupDetails
		(
			GroupName varchar(200),
			Store_ID int,
			Store_Name varchar(50),
			Device_ID int
		)

	--SET @Device_IDs = ''
	--SELECT @Device_IDs = CONVERT(varchar,dinf.Device_ID) + ',' + @Device_IDs
	--	FROM tbl_DeviceInfo AS dinf INNER JOIN tbl_Stores strs ON dinf.Device_Store_ID = strs.Store_ID
	--	WHERE dinf.Device_Store_ID IN (Select cValue FROM dbo.split(@StoreIDs,','))
	--SET @Device_IDs = CASE WHEN LEN(@Device_IDs)>0 THEN LEFT(@Device_IDs, LEN(@Device_IDs)-1) ELSE @Device_IDs END

	INSERT INTO #GroupDetails(GroupName, Store_ID, Store_Name, Device_ID)
	SELECT DISTINCT g.GroupName,ts.Store_ID, ts.Store_Name , td.Device_ID
	FROM tbl_Stores ts INNER JOIN tbl_DeviceInfo td ON ts.Store_ID = td.Device_Store_ID
	LEFT JOIN GroupStore gs ON gs.StoreID = ts.Store_ID
	INNER JOIN [Group] g ON g.ID = gs.GroupID
	WHERE td.Device_ID in (SELECT cValue FROM dbo.split(@Device_IDs,','))

	--SELECT DISTINCT g.GroupName, ts.Store_ID, ts.Store_Name
	--	FROM [Group] g INNER JOIN GroupStore gs ON g.ID = gs.GroupID
	--	INNER JOIN  tbl_Stores ts ON gs.StoreID = ts.Store_ID
	--	WHERE gs.StoreID in (SELECT cValue FROM dbo.split(@StoreIDs,','))


	/*************************************
	 step 2. populate, then roll up data
	*************************************/
	SELECT @CarDataRecordType_ID = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
		User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=9

	SET @CarDataRecordType_ID = CASE WHEN ISNULL(@CarDataRecordType_ID,'') ='' THEN '11' ELSE @CarDataRecordType_ID END

	-- pull in raw data from proc
	SET @query ='INSERT INTO #raw_data
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_ID+''', '''+ @ReportType+''''

	EXEC(@query)
	SET @query =''
	-- get each of the store date from the range
	INSERT INTO #Week(StoreDate)
	SELECT	ThisDate
	FROM	dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate)

	-- divide the range by 7, figure out the week index for every block of seven days
	UPDATE	#Week
	SET		WeekIndex = ((id-1)/7) + 1;

	-- calculate start and end date of each week
	WITH FirstDayOfWeek(id, WeekIndex, WeekStartDate)
	AS
	(
		SELECT	MIN(id), WeekIndex, MIN(StoreDate)
		FROM	#Week
		GROUP BY WeekIndex
	)
	UPDATE	w
	SET		w.WeekStartDate = f.WeekStartDate,
			w.WeekEndDate = DateAdd(day, 6, f.WeekStartDate)
	FROM	FirstDayOfWeek f
			INNER JOIN #Week w ON w.WeekIndex = f.WeekIndex

	-- determine whether it's multi store or single store
	-- for single stores, the column names would be its event name
	-- for multi stores, the column names would be category name
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- multi store
			SET @isMultiStore = 1

			INSERT INTO @header
			SELECT	DISTINCT EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			FROM    #raw_data
			WHERE	EventType_Category_ID IS NOT NULL

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @TheDevice_ID = (SELECT TOP 1 Device_ID FROM #raw_data
				WHERE Device_ID IN(SELECT Device_ID FROM #rollup_data) GROUP BY Device_ID
						ORDER BY MAX(Daypart_ID) DESC)

			SET @sum_query = '
				SELECT WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, GroupName, StoreID, Category, AVG_DetectorTime, Total_Car
				FROM (
					SELECT	w.WeekIndex,
							w.WeekStartDate,
							w.WeekEndDate,
							''Subtotal'' StoreNo,
							NULL Store_Name,
							NULL Device_UID,
							NULL Device_ID,
							ts.GroupName,
							NULL StoreID,
							r.EventType_Category Category,
							AVG(r.DetectorTime) AVG_DetectorTime,
							COUNT(r.CarDataRecord_ID) Total_Car
					FROM	#raw_data r
					INNER JOIN #week w ON w.StoreDate = r.StoreDate
					LEFT JOIN tbl_Stores s ON r.Store_ID = s.Store_ID
					LEFT JOIN #GroupDetails ts ON ts.Store_ID = s.Store_ID
					WHERE ts.GroupName IS NOT NULL
					GROUP BY WeekIndex,
							w.WeekStartDate,
							w.WeekEndDate,
							ts.GroupName,
							r.EventType_Category
					HAVING COUNT(DISTINCT r.Store_ID)>1
					UNION ALL
					SELECT	w.WeekIndex,
							w.WeekStartDate,
							w.WeekEndDate,
							''Total Week'' StoreNo,
							NULL Store_Name,
							NULL Device_UID,
							NULL Device_ID,
							NULL GroupName,
							NULL StoreID,
							r.EventType_Category Category,
							AVG(r.DetectorTime) AVG_DetectorTime,
							COUNT(r.CarDataRecord_ID) Total_Car
					FROM	#raw_data r
					INNER JOIN #week w ON w.StoreDate = r.StoreDate
					LEFT JOIN tbl_Stores s ON r.Store_ID = s.Store_ID
					LEFT JOIN #GroupDetails ts ON ts.Store_ID = s.Store_ID
					GROUP BY WeekIndex,
							w.WeekStartDate,
							w.WeekEndDate,
							r.EventType_Category

					) A'

		END
	ELSE
		BEGIN	-- single store
			INSERT INTO @header
			SELECT	DISTINCT EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			FROM    #raw_data
			WHERE	Detector_ID IS NOT NULL

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Name'
			SET @TheDevice_ID = CAST(@Device_IDs AS int)
			SET @sum_query = '
				SELECT	10000 WeekIndex,
						NULL WeekStartDate,
						NULL WeekEndDate,
						''Total Week'' StoreNo,
						NULL Store_Name,
						NULL Device_UID,
						NULL Device_ID,
						NULL GroupName,
						NULL StoreID,
						EventType_Name Category,
						AVG(DetectorTime) AVG_DetectorTime,
						COUNT(CarDataRecord_ID) Total_Car
				FROM	#raw_data
				GROUP BY EventType_Name '

		END


	-- roll up records into each store week
	-- for single stores, generate a single summary row for all dates
	-- for multip stores, generate a summary row for each week
	SET @query = N'
		INSERT INTO	#rollup_data(WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, GroupName, StoreID, Category, AVG_DetectorTime, Total_Car)
		SELECT	w.WeekIndex,
				CAST(w.WeekStartDate AS char(10)),
				CAST(w.WeekEndDate AS char(10)),
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				ts.GroupName,
				s.Store_ID,' +
				@headerSourceCol + ',
				AVG(DetectorTime),
				COUNT(CarDataRecord_ID)
		FROM	#raw_data r
				LEFT JOIN #week w ON w.StoreDate = r.StoreDate
				LEFT JOIN tbl_Stores s ON r.Store_ID = s.Store_ID
				LEFT JOIN #GroupDetails ts ON ts.Store_ID = s.Store_ID
		GROUP BY w.WeekIndex,
				w.WeekStartDate,
				w.WeekEndDate,' +
				@headerSourceCol + ',
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				ts.GroupName,
				s.Store_ID
		ORDER BY w.WeekIndex,
				w.WeekStartDate,
				w.WeekEndDate,' +
				@headerSourceCol + ',
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				ts.GroupName,
				s.Store_ID
		'

	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';


	INSERT INTO #rollup_data (WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, GroupName, StoreID, Category, AVG_DetectorTime, Total_Car)
	EXEC (@sum_query);

	IF NOT EXISTS(SELECT 1 FROM #rollup_data)
	BEGIN
		INSERT INTO #rollup_data (WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, GroupName, StoreID, Category, AVG_DetectorTime, Total_Car)
		SELECT DISTINCT WeekIndex, WeekStartDate, WeekEndDate, NULL StoreNo, NULL Store_Name, NULL Device_UID, NULL Device_ID, NULL GroupName, NULL StoreID, NULL Category, NULL AVG_DetectorTime, NULL Total_Car
		FROM #Week
		UNION ALL
		SELECT 10000 WeekIndex, NULL WeekStartDate, NULL WeekEndDate,'Total Week' StoreNo, NULL Store_Name, NULL Device_UID, NULL Device_ID, NULL GroupName,
						NULL StoreID, NULL Category, NULL AVG_DetectorTime, NULL Total_Car

	END;
	-- below is a hack!!
	-- when a single store has change of config (for instanc: menu board, service... to pre loop, menu board, service...)
	-- or when multi store don't have the same config for each store
	-- it would generate multiple summary rows because the Total_Car number could vary.
	-- Using below fix, it will update Total_Car to be the same value, enable rollup to a single summary row
	WITH	Max_TotalCar_By_Day
	AS
	(
		SELECT	StoreNo, WeekIndex, MAX(Total_Car) AS Max_TotalCar
		FROM	#rollup_data
		GROUP BY StoreNo, WeekIndex
	)
	UPDATE	#rollup_data
	SET		Total_Car = mc.Max_TotalCar
	FROM	#rollup_data d
			INNER JOIN Max_TotalCar_By_Day mc ON mc.StoreNo = d.StoreNo
				AND	mc.WeekIndex = d.WeekIndex

	-- pivot table to display avg time by event/category name for each day
	IF(ISNULL(@cols,'')<>'')
		SET @query = N'
		SELECT	*
		FROM	#rollup_data
		PIVOT(
			AVG(AVG_DetectorTime)
			FOR Category IN (' + @cols + ')
		) AS p
		ORDER BY WeekIndex, StoreNo;'
	ELSE
		SET @query = N'
		SELECT	WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, GroupName, StoreID, Total_Car
		FROM	#rollup_data ORDER BY WeekIndex'

	/***********************************
		step 3. return result sets
	***********************************/

	-- return avg time report
	EXECUTE(@query)

	-- EXECUTE dbo.usp_HME_Cloud_Get_Device_Goals @Device_IDs

	-- return top 3 longest times
	IF (@isMultiStore = 0 )
		IF EXISTS(SELECT 1 FROM @header)
			BEGIN
				SELECT	e.headerName, t.DetectorTime, t.DeviceTimeStamp, e.Detector_ID,t.EventType_ID , e.headerID
				FROM 	@header e
				CROSS APPLY
				(
					SELECT	TOP 3 DetectorTime, DeviceTimeStamp, r.EventType_ID
					FROM	#raw_data r
					WHERE	r.EventType_ID = e.headerID
					ORDER BY DetectorTime DESC
				)	AS t
				ORDER BY e.Detector_ID, DetectorTime DESC
			END
		ELSE
			BEGIN
				SELECT	NULL headerName, NULL DetectorTime, NULL DeviceTimeStamp, NULL Detector_ID
			END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it


	-- return goal percentages and car totals goal counts (only applicable to single store)
	IF (@isMultiStore = 0 OR @isMultiStore = 1)
		BEGIN
			DECLARE @goals TABLE(goalName varchar(25))

			-- populate goals
			INSERT INTO @goals
			SELECT	'GoalA'
			UNION
			SELECT	'GoalB'
			UNION
			SELECT	'GoalC'
			UNION
			SELECT	'GoalD'
			UNION
			SELECT	'GoalF'

			-- construct column names
			SET  @cols = NULL;

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ' - ' + goalName + ']', '[' + headerName + ' - ' + goalName + ']'),
			@EventGoalNames = COALESCE(@EventGoalNames + '|$|' + headerName + ' - ' + goalName , headerName + ' - ' + goalName)
			FROM  (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
					CROSS JOIN @goals
			ORDER BY Sort;

			-- calculate Goal_ID for lane queue
			UPDATE	r
			SET		r.Goal_ID = CASE
									WHEN r.DetectorTime < g.GoalA THEN 1
									WHEN r.DetectorTime < g.GoalB THEN 2
									WHEN r.DetectorTime < g.GoalC THEN 3
									WHEN r.DetectorTime < g.GoalD THEN 4
									ELSE 5
								END
			FROM	#raw_data r
					INNER JOIN dbo.uf_GetDeviceGoals(@Device_IDs) g ON r.Device_ID = g.Device_ID AND r.EventType_ID = g.EventType_ID
			WHERE	g.EventType_ID = 1000;

			SET @query = '';

			-- calculate total cars that meet each of the goals
			IF(ISNULL(@cols,'')<>'')
			BEGIN
				SET @query = N'
				WITH Total_Car_Count
				AS
				(
					SELECT	Device_ID,
							EventType_Name,
							IsNull(Goal_ID, 0) AS Goal_ID,
							COUNT(CarDataRecord_ID) AS Total_Cars
					FROM	#raw_data
					GROUP BY EventType_Name,
							Device_ID,
							IsNull(Goal_ID, 0)
				)
				SELECT	*
				FROM
				(		SELECT	Device_ID,
								EventType_Name + '' - '' + CASE Goal_ID WHEN 1 THEN ''GoalA'' WHEN 2 THEN ''GoalB'' WHEN 3 THEN ''GoalC'' WHEN 4 THEN ''GoalD'' WHEN 5 THEN ''GoalF'' ELSE ''N/A'' END AS EventGoal,
								Total_Cars
						FROM	Total_Car_Count
				) AS Car_count_by_goal
				PIVOT(
					SUM(Total_Cars)
					FOR EventGoal IN (' + @cols + ')
				) AS p'
			END
			ELSE
				SET @query = N'
				IF EXISTS (SELECT	Device_ID,
							EventType_Name,
							IsNull(Goal_ID, 0) AS Goal_ID,
							COUNT(CarDataRecord_ID) AS Total_Cars
					FROM	#raw_data
					GROUP BY EventType_Name,
							Device_ID,
							IsNull(Goal_ID, 0))
				BEGIN
					SELECT	Device_ID,
								EventType_Name,
								IsNull(Goal_ID, 0) AS Goal_ID,
								COUNT(CarDataRecord_ID) AS Total_Cars
						FROM	#raw_data
						GROUP BY EventType_Name,
								Device_ID,
								IsNull(Goal_ID, 0)
				END
				ELSE
				BEGIN
					SELECT	NULL Device_ID,
					NULL EventType_Name,
					0 AS Goal_ID,
					0 AS Total_Cars
				END'
			EXECUTE(@query);
		END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it


		SET @query = '';
	IF (@isMultiStore = 0)
		BEGIN
		IF EXISTS(SELECT TOP 1 1 FROM tbl_DeviceInfo a
			LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
			LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
			WHERE
				Device_ID IN (@Device_IDs)
			AND b.Store_Number <> '')
			SELECT
				a.Device_ID,
				b.Store_Number,
				b.Store_Name,
				c.Brand_Name,
				a.Device_LaneConfig_ID
			FROM tbl_DeviceInfo a
			LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
			LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
			WHERE
				Device_ID IN (@Device_IDs)
			AND b.Store_Number <> ''
			ORDER BY
			b.Store_Number
		ELSE
			SELECT
				NULL Device_ID,
				NULL Store_Number,
				NULL Store_Name,
				NULL Brand_Name,
				NULL Device_LaneConfig_ID

		END
	ELSE
		SELECT 1

			-- get Color code from user Prefernce table if not found get default values
		SET @Preferences_Preference_Value =''
		SELECT @Preferences_Preference_Value = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
			User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=5

		IF(ISNULL(@Preferences_Preference_Value,'') ='')
			SET @Preferences_Preference_Value = '#00b04c|#dcba00|#b40000'

		SELECT @Preferences_Preference_Value AS ColourCode

		-- get Gaols time in seconds
			EXEC usp_HME_Cloud_Get_Device_Goals @Device_IDs

			EXECUTE(@query);
			-- Changes for System Statistics
	IF (@isMultiStore = 0)
	BEGIN
		-- Device SystemStatistics General
		EXEC GetDeviceSystemStatisticsGeneral @Device_IDs,@StoreEndDate,@StoreStartDate

		-- include pullins
		DECLARE @IncludePullins bit
		SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
			FROM tbl_DeviceSetting WITH (NOLOCK)
			WHERE DeviceSetting_Device_ID = @Device_IDs
			AND DeviceSetting_Setting_ID = '6002'

		CREATE TABLE #tmpSystemStatisticsLane
			(
				Device_ID int,
				Lane tinyint,
				AvgCarsInLane int,
				Pullouts int,
				Pullins int,
				DeleteOverMax int
			);
			-- Device SystemStatistics Lane
		INSERT INTO #tmpSystemStatisticsLane(Device_ID, Lane, AvgCarsInLane, Pullouts, Pullins, DeleteOverMax)
		EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins
		IF EXISTS(SELECT 1 FROM #tmpSystemStatisticsLane)
			SELECT * FROM #tmpSystemStatisticsLane
		ELSE
			SELECT NULL Device_ID, NULL Lane, NULL AvgCarsInLane, NULL Pullouts, NULL Pullins, NULL DeleteOverMax
		SELECT @EventGoalNames EventGoalNames
	END
	SELECT @EventNames EventNames
	RETURN(0)
End
