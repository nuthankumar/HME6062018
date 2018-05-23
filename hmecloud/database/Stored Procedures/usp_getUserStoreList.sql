
/****** Dropping the StoredProcedure [dbo].[usp_getUserStoreList] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_getUserStoreList' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_getUserStoreList]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_getUserStoreList
-- Author		:	Jaffer sherif
-- Created		:	20-May-2018
-- Purpose		:	To get the All Store details of the user 
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	
--	2.
-- ===========================================================
-- exec [dbo].[usp_getUserStoreList] @UserUid='68LKBP85C1SKH1FI3M7X40CJHKGU07FZ',@isAdmin=0,@criteria=NULL,@filter=NULL,@SortingColumnName=NULL,@SortingType=NULL,@RecordPerPage=25,@PageNumber=0
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_getUserStoreList] 
@UserUid varchar(32) = NULL,
@isAdmin int = 0,
@criteria varchar (50) = NULL,
@filter varchar (50) = NULL,
@SortingColumnName varchar(100) = '', -- input for sorting based on column
@SortingType varchar(5) = 'ASC',   -- sorting type
@RecordPerPage smallint = 10,
@PageNumber smallint = 1,
@User_Department varchar(100)=''

AS
BEGIN
  DECLARE @Brand_ID int = NULL,
          @AccountId int = NULL,
          @sqlQuery varchar(max),
		  @sqlAdmin varchar(max),
		  @criteriaSearch varchar(max) ='',
		  @filterSearch varchar (100)='',
          @StoreCond varchar(max) = '',
          @sqlQueryPublicPortal varchar(max) = '',
          @Company_ID int,
          @isViewAllStores bit = 0,
          @IsCorpUser bit = 0,
          @Company_Type varchar(50),
          @IsOwner bit = 0,
          @View_Franchise bit = 0,
		  @TotalRecCount int,
		  @TotalPages int

 CREATE TABLE #Store_Details
	(
		ID int IDENTITY(1,1) Primary Key,
		Store_ID int,
		Store_Number varchar(50),
		Store_Name varchar(20),		
		Store_UID varchar(32),
		Store_AddressLine1 varchar(255),
		Company_Name varchar(100),
		Company_ID int ,			
		Brand_Name varchar(100),
		Device_Name varchar(100),
		Device_UID uniqueidentifier,
		Device_ID int,
		Device_EmailAccount varchar(200),
		Device_IsActive tinyint,
		Device_MainVersion varchar(30),
		Device_SerialNumber varchar(30),
		Subscription_Name varchar(100)
	)
	
	
	CREATE TABLE #public_portal_Store_Details
	(
		ID int IDENTITY(1,1) Primary Key,
		Brand_Name varchar(100),
		Store_UID varchar(50),
		Store_Number varchar(50),
		Store_Name varchar(100),
		Store_AddressLine1 varchar(255),
		Store_Locality varchar(255),
		Store_Region varchar(255),
		Store_ID int,
		Device_Name varchar(100),
		Device_MainVersion varchar(30),
		Device_IsActive tinyint,
		Device_ID int ,
		Device_UID varchar(50),
		Device_DeviceType_ID tinyint,
		Device_LaneConfig_ID tinyint,
		Device_EmailAccount varchar(200),
		Device_Timezone_ID tinyint,
		Store_Company_ID int,
		Group_Name  varchar(200),
		GroupName varchar(200)
	)

	SET @sqlAdmin = '
	INSERT INTO #Store_Details 
	(
		Store_ID ,
		Store_Number ,
		Store_Name ,		
		Store_UID ,
		Store_AddressLine1 ,
		Company_Name ,
		Company_ID  ,			
		Brand_Name ,
		Device_Name ,
		Device_UID ,
		Device_ID ,
		Device_EmailAccount ,
		Device_IsActive ,
		Device_MainVersion ,
		Device_SerialNumber ,
		Subscription_Name 
	)
	SELECT	DISTINCT stor.Store_ID,
			stor.Store_Number,
            stor.Store_Name,
			stor.Store_UID,
			Store_AddressLine1,
			lcom.Company_Name,
			lcom.Company_ID,
			bran.Brand_Name,
			dtyp.Device_Name,
			dinf.Device_UID,
			dinf.Device_ID,
            dinf.Device_EmailAccount,
			dinf.Device_IsActive,
			dinf.Device_MainVersion,
			dinf.Device_SerialNumber,
			tsub.Subscription_Name
	FROM	tbl_Stores stor
			INNER JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
            INNER JOIN tbl_Companies lcom ON lcom.Company_ID = stor.Store_Company_ID
			LEFT JOIN tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
			LEFT JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
			LEFT JOIN tbl_Users usrs ON lcom.Company_ID = usrs.User_Company_ID
				AND EXISTS(SELECT 1 FROM dbo.tbl_Accounts a WHERE a.Account_User_ID = usrs.User_ID)
			LEFT JOIN tbl_Accounts acnt ON acnt.Account_User_ID = usrs.User_ID
			LEFT JOIN ltbl_Subscriptions tsub ON tsub.Subscription_ID = acnt.Account_Subscription_ID
	WHERE 	[Store_IsActive] = 1'
	

SET @sqlQueryPublicPortal = 'select	Brand_Name,
		stor.Store_UID,
		Store_Number,
		Store_Name,
		Store_AddressLine1,
		Store_Locality,
		Store_Region,
		stor.Store_ID AS [Device_Store_ID],
		Device_Name,
		Device_MainVersion,
		Device_IsActive,
		Device_ID,
		Device_UID,
		Device_DeviceType_ID,
		Device_LaneConfig_ID,
		Device_EmailAccount,
		Device_Timezone_ID,
		Store_Company_ID,
		CASE WHEN grp.Group_Name IS NULL THEN ''Drive-thru'' ELSE grp.Group_Name END AS Group_Name,
		g.GroupName
		FROM 
		tbl_Stores stor
		LEFT JOIN ltbl_Brands bran ON stor.Store_Brand_ID = bran.Brand_ID
		LEFT JOIN tbl_DeviceInfo dinf ON stor.Store_ID = dinf.Device_Store_ID
		LEFT JOIN tbl_DeviceType dtyp ON dinf.Device_DeviceType_ID = dtyp.DeviceType_ID
		LEFT JOIN tbl_LaneConfig lane ON dinf.Device_LaneConfig_ID = lane.LaneConfig_ID
		LEFT JOIN itbl_User_Store iurs ON iurs.Store_ID = stor.Store_ID
		LEFT JOIN tbl_Users usrs ON usrs.User_ID = iurs.User_ID
		LEFT JOIN stbl_Account_Brand_ShareData absr ON (stor.Store_Account_ID = absr.Account_ID) AND (stor.Store_Brand_ID = absr.Brand_ID)
		LEFT JOIN tbl_StoreLBGroup storgrp ON storgrp.Store_UID = stor.Store_UID
		LEFT JOIN tbl_LBGroup grp ON grp.Group_ID = storgrp.Group_ID
		LEFT JOIN GroupStore gs ON gs.StoreId = stor.Store_ID
		LEFT JOIN [Group] g ON g.Id = gs.GroupId
		WHERE 0=0  AND [Store_IsActive] = 1 '

SET @SortingColumnName = IIF(ISNULL(@SortingColumnName,'')<>'',  @SortingColumnName+' '+ @SortingType, '')
	
IF (@isAdmin = 1)
	BEGIN
	
	IF((ISNULL(LTRIM(RTRIM(@criteria)),'') <>'' ) and  (ISNULL(LTRIM(RTRIM(@filter)),'') = ''))
		BEGIN
			SET @criteriaSearch ='
					AND	(Brand_Name LIKE ''%'+ @criteria +'%''
					 OR Store_Number LIKE ''%'+ @criteria +'%''
					 OR Store_Name LIKE ''%'+ @criteria +'%''
					 OR Device_SerialNumber LIKE ''%'+ @criteria +'%''
					 OR Company_Name LIKE ''%'+ @criteria +'%''
					 OR Device_MainVersion LIKE ''%'+ @criteria +'%''
					 OR Store_AddressLine1 LIKE ''%'+ @criteria +'%''
					 OR Store_AddressLine2 LIKE ''%'+ @criteria +'%''
					 OR Store_Locality LIKE ''%'+ @criteria +'%'')'
				 
			SET @sqlAdmin = @sqlAdmin + @criteriaSearch
		END
	
	IF((ISNULL(LTRIM(RTRIM(@criteria)),'') <>'' ) and  (ISNULL(LTRIM(RTRIM(@filter)),'') <> ''))
		BEGIN 
			SET @filterSearch = ' AND '+@filter+' LIKE ''%'+ @criteria +'%'''
			SET @sqlAdmin = @sqlAdmin + @filterSearch
		END	


	SET @sqlAdmin = @sqlAdmin + IIF(ISNULL(@SortingColumnName,'')<>'', ' ORDER BY '+@SortingColumnName,'')
	
	
	EXEC (@sqlAdmin)

	IF(EXISTS(SELECT 1 FROM #Store_Details))
			BEGIN
				IF(@PageNumber = 0)
					SELECT Store_ID,Store_Number,Store_Name,Store_UID,Store_AddressLine1,Company_Name,Company_ID,Brand_Name,Device_Name,Device_UID,Device_ID,
					Device_EmailAccount,Device_IsActive,Device_MainVersion,Device_SerialNumber,Subscription_Name					
							FROM #Store_Details ORDER BY ID
				ELSE
					SELECT Store_ID,Store_Number,Store_Name,Store_UID,Store_AddressLine1,Company_Name,Company_ID,Brand_Name,Device_Name,Device_UID,Device_ID,
					Device_EmailAccount,Device_IsActive,Device_MainVersion,Device_SerialNumber,Subscription_Name					
					FROM #Store_Details WHERE ID > (@PageNumber-1)*@RecordPerPage AND ID <= (@PageNumber*@RecordPerPage)
			END
			ELSE
				
				SELECT 'NA' Store_ID, 'NA' Store_Number,'NA' Store_Name,'NA' Store_UID,'NA' Store_AddressLine1,'NA' Company_Name, 'NA' Company_ID,'NA' Brand_Name,
				'NA' Device_Name,'NA'  Device_UID,'NA' Device_ID, 'NA' Device_EmailAccount, 'NA' Device_IsActive,'NA' Device_MainVersion,
				'NA' Device_SerialNumber,'NA' Subscription_Name					
	
							
	SELECT @TotalRecCount = COUNT(*), 
		@TotalPages = CASE WHEN (@RecordPerPage <>0 AND ((COUNT(*) % @RecordPerPage ) > 0)) THEN (COUNT(*)/@RecordPerPage)+1 ELSE 0 END
		FROM #Store_Details
	SELECT @TotalRecCount RecordCount, @TotalPages TotalPages

	END		
ELSE
	BEGIN
	
	  SELECT bran.Brand_ID,lrol.Role_IsCorporate,comp.Company_ID,comp.Company_Type,comp.View_Franchise,CASE WHEN acc.Account_ID IS NULL THEN 0 ELSE 1 END IsOwner 
	  INTO #UserRoleDetails FROM tbl_Users usrs
	  INNER JOIN tbl_Companies comp ON comp.Company_ID = usrs.User_Company_ID
	  LEFT JOIN itbl_Company_Brand cbrn ON cbrn.Company_ID = comp.Company_ID
	  LEFT JOIN ltbl_Brands bran ON bran.Brand_ID = cbrn.Brand_ID
	  LEFT JOIN itbl_User_Role urol ON usrs.User_ID = urol.User_ID
	  LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
	  LEFT JOIN tbl_Accounts acc ON acc.Account_ID = usrs.User_OwnerAccount_ID
	  WHERE usrs.User_UID = @UserUid


	  IF EXISTS (SELECT 1  FROM tbl_Users usrs --
		LEFT JOIN itbl_User_Role urol
		  ON usrs.User_ID = urol.User_ID
		LEFT JOIN tbl_Roles lrol
		  ON lrol.Role_ID = urol.Role_ID
		LEFT JOIN itbl_Account_Role_Permission rper
		  ON rper.Role_ID = lrol.Role_ID
		LEFT JOIN ltbl_Permissions perm
		  ON perm.Permission_ID = rper.Permission_ID
		WHERE usrs.User_UID = @UserUid
		AND perm.Permission_Name = 'ViewAllStores')
		SET @isViewAllStores = 1

	  SELECT
		@Brand_ID = Brand_ID,
		@Company_ID = Company_ID,
		@Company_Type = Company_Type,
		@View_Franchise = View_Franchise,
		@isCorpUser = Role_IsCorporate,
		@IsOwner = IsOwner
	  FROM #UserRoleDetails


	  

	  SELECT
		stor.Store_ID INTO #StoreIDs
	  FROM tbl_Users usrs
	  INNER JOIN tbl_Stores stor
		ON stor.Store_Account_ID = usrs.User_OwnerAccount_ID
	  WHERE usrs.User_UID = @UserUid


	  -- corporate or distributor  User 

	  IF (@IsCorpUser = 1
		OR (@Company_Type = 'DISTRIBUTOR'
		AND @IsOwner = 1))
	  BEGIN

		-- if corporate user is not owner or view all store permission
		IF (@IsOwner = 0
		  AND @isViewAllStores = 0)
		BEGIN

		  SET @StoreCond = 'AND stor.Store_ID IN (#StoreIDs)'

		END

		-- view franchise  falg set true fro corporate user

		IF (@View_Franchise = 1)
		BEGIN

		  SET @sqlQuery = @sqlQueryPublicPortal + ' AND bran.Brand_ID IN (' + CONVERT(varchar, @Brand_ID) + ')
				AND ((absr.Brand_ShareData IN (1))
				OR
				(absr.Brand_ShareData IS NULL AND stor.Store_Company_ID IN (' + CONVERT(varchar, @Company_ID) + ')) ' + @StoreCond
		END
		ELSE
		BEGIN

		  SET @sqlQuery = @sqlQueryPublicPortal + ' AND bran.Brand_ID IN (' + CONVERT(varchar, @Brand_ID) + ')
				AND ( absr.Brand_ShareData IS NULL AND stor.Store_Company_ID IN (' + CONVERT(varchar, @Company_ID) + '))' + @StoreCond
		END

	  END


	  -- Owner with view all stores by company Id
	  IF ((@IsCorpUser = 0 OR (@Company_Type <> 'DISTRIBUTOR' AND @IsOwner = 0))  AND (@IsOwner = 1 OR @isViewAllStores = 1))
	  BEGIN
		
		INSERT INTO #public_portal_Store_Details
		EXEC dbo.usp_HME_Cloud_Get_StoresByCompany @Company_ID,3
		SET @sqlQuery =''
		SET @sqlQuery = 'SELECT * FROM #public_portal_Store_Details'
						 +IIF(ISNULL(@SortingColumnName,'')<>'', ' ORDER BY '+@SortingColumnName,'')
	  END

	  --View only with store Ids
	  IF ((@IsCorpUser = 0
		OR (@Company_Type <> 'DISTRIBUTOR'
		AND @IsOwner = 0))
		AND @IsOwner = 0
		OR @isViewAllStores = 0)
	  BEGIN
		SET @sqlQuery = @sqlQueryPublicPortal + @StoreCond + IIF(ISNULL(@SortingColumnName,'')<>'', ' ORDER BY '+@SortingColumnName,'')
	  END
	 print @sqlQuery
	  EXEC (@sqlQuery)

	  EXEC usp_getUserPermissions @UserUid, @User_Department, @IsAdmin
	END
END