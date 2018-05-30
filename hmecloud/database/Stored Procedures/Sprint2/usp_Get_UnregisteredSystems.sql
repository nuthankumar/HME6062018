
GO
/****** Dropping the StoredProcedure [dbo].[usp_Get_UnregisteredSystems] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_Get_UnregisteredSystems' AND [type] ='P'))
	DROP PROCEDURE [dbo].usp_Get_UnregisteredSystems
GO

--select * from tbl_stores where Store_Account_ID=2499
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_Get_UnregisteredSystems
-- Author		:	Jayaram
-- Created		:	17-MAY-2018
-- Tables		:	tbl_DeviceInfo,tbl_DeviceType,
--                  tbl_LaneConfig,tbl_Stores,ltbl_Brands
-- Purpose		:	get device information
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	17-May-2018		Jayaram			 Procedure created
--
-- ===========================================================
-- EXEC [dbo].[usp_Get_UnregisteredSystems] @PageNumber=1, @criteria='2.00',@filter=Device_MainVersion , @RecordPerPage=20

-- sorting
-- EXEC [dbo].[usp_Get_UnregisteredSystems] @PageNumber=1,@SortingColumnName=Device_MainVersion,@SortingType='DESC'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_Get_UnregisteredSystems]
(
	   @criteria varchar (100) = NULL,
	   @filter varchar (50) = NULL,
	   @SortingColumnName varchar(100) = 'Store_Number', -- input for sorting based on column
	   @SortingType varchar(5) = 'ASC',
	   @RecordPerPage smallint = 10,
	   @PageNumber smallint = 1
)
AS
BEGIN
DECLARE @SqlQuery AS VARCHAR(MAX),
		@SearchColumns AS VARCHAR(500),
		@DefaultSortColumn AS VARCHAR(40),
		@TotalRecCount int,
		@TotalPages int,
		@criteriaSearch varchar(max) =NULL,
		@filterSearch varchar (100)=NULL
--- Creating Temp table  -------

CREATE TABLE #SystemInfo(
	ID int IDENTITY(1,1),
	Device_Name VARCHAR(100),
	Store_Number INT,
    Device_SerialNumber VARCHAR(100),
    Device_SettingVersion VARCHAR(100),
    Device_UID uniqueidentifier,
    DeviceType_ID INT ,
    LaneConfig_Name VARCHAR(100),
    Brand_Name VARCHAR(100),
    Device_IsActive TINYINT,
    Device_ModelName  VARCHAR(100),
	Device_MainVersion VARCHAR(100)
	)
 SET @SqlQuery= 'SELECT  Device_Name,
            Store_Number,
            Device_SerialNumber,
            Device_SettingVersion,
            Device_UID,
            DeviceType_ID,
            LaneConfig_Name,
            Brand_Name,
            Device_IsActive,
            Device_ModelName,
			Device_MainVersion
    FROM               tbl_DeviceInfo d
            INNER JOIN tbl_DeviceType dt ON d.Device_DeviceType_ID = dt.DeviceType_ID
            INNER JOIN tbl_LaneConfig lc ON d.Device_LaneConfig_ID = lc.LaneConfig_ID
            LEFT  JOIN tbl_Stores s ON s.Store_ID = d.Device_Store_ID
            LEFT  JOIN ltbl_Brands b ON s.Store_Brand_ID = b.Brand_ID
    WHERE  Device_Store_ID = 0 '

SET @SortingColumnName = IIF(ISNULL(@SortingColumnName,'')<>'',  @SortingColumnName+' '+ @SortingType, '')

IF (@RecordPerPage is NUll)
SET @RecordPerPage = 10

IF((ISNULL(LTRIM(RTRIM(@criteria)),'') <>'' ) and  (ISNULL(LTRIM(RTRIM(@filter)),'') = ''))
		BEGIN
			SET @criteriaSearch ='AND (
	         ( Brand_Name like ''%'+@criteria+'%'' 
				OR Store_Number like ''%'+@criteria+'%''
				OR Device_Name like  ''%'+@criteria+'%''
				OR Device_SerialNumber like  ''%'+@criteria+'%''
				OR Device_SettingVersion like  ''%'+@criteria+'%'' 
				OR Device_SerialNumber like  ''%'+@criteria+'%'' 
				OR LaneConfig_Name like  ''%'+@criteria+'%'' 
				OR Device_IsActive like  ''%'+@criteria+'%'' ) OR @SearchText IS NULL)'

				SET @SqlQuery = @SqlQuery + @criteriaSearch
		END

IF((ISNULL(LTRIM(RTRIM(@criteria)),'') <>'' ) and  (ISNULL(LTRIM(RTRIM(@filter)),'') <> ''))
		BEGIN 
			SET @filterSearch = ' AND '+@filter+' LIKE ''%'+ @criteria +'%'''
			SET @SqlQuery = @SqlQuery+ @filterSearch
END	


SET @SqlQuery = @SqlQuery + IIF(ISNULL(@SortingColumnName,'')<>'', ' ORDER BY '+@SortingColumnName,'')
print @SqlQuery
--IF @SearchColumns IS NOT NULL
--	 BEGIN
--	 SET @SqlQuery =  @SqlQuery + @SearchColumns  
--	 END
--	ORDER BY '+ @DefaultSortColumn+' '+ @SortOrder

	INSERT INTO #SystemInfo    
	EXEC(@SqlQuery)
	
	
	IF(EXISTS(SELECT 1 FROM #SystemInfo))
			BEGIN
				IF(@PageNumber = 0)
					SELECT Device_Name,Store_Number,Device_SerialNumber,Device_SettingVersion,Device_UID,DeviceType_ID,LaneConfig_Name,
            Brand_Name,Device_IsActive,Device_ModelName,Device_MainVersion					
			FROM #SystemInfo ORDER BY ID
				ELSE
					SELECT Device_Name,Store_Number,Device_SerialNumber,Device_SettingVersion,Device_UID,DeviceType_ID,LaneConfig_Name,
            Brand_Name,Device_IsActive,Device_ModelName,Device_MainVersion						
					FROM #SystemInfo WHERE ID > (@PageNumber-1)*@RecordPerPage AND ID <= (@PageNumber*@RecordPerPage)
			END
			ELSE
				SELECT 'NA' Device_Name,'NA' Store_Number, 'NA' Device_SerialNumber, 'NA' Device_SettingVersion, 'NA' Device_UID,'NA' DeviceType_ID, 'NA' LaneConfig_Name,
            'NA' Brand_Name,'NA' Device_IsActive, 'NA' Device_ModelName,'NA' Device_MainVersion	

	SELECT @TotalRecCount = COUNT(*), 
		@TotalPages = CASE WHEN (@RecordPerPage <>0 AND ((COUNT(*) % @RecordPerPage ) > 0)) THEN (COUNT(*)/@RecordPerPage)+1 ELSE 0 END
		FROM #SystemInfo
	SELECT @TotalRecCount RecordCount, @TotalPages TotalPages

END
