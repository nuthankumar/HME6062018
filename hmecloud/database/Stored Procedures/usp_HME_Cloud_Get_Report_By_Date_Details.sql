-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Date_Details
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
-- ===========================================================
-- exec [usp_HME_Cloud_Get_Report_By_Date_Details] '99180,99181', '2018-02-23', '2018-02-27', '2018-02-23 00:00:00' , '2018-02-27 12:00:00', 11, 'AC',1, '68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
-- ===========================================================

--exec usp_HME_Cloud_Get_Report_By_Date_Details '3,4','2018-03-20','2018-03-26',N'2018-03-20 00:00:00',N'2018-03-26 10:30:00','11','AC',1
ALTER PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Date_Details](
	@Device_IDs varchar(500),
	@StoreStartDate date,
	@StoreEndDate date,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID tinyint = 1,
	@UserUID NVARCHAR(50)
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

		--SET @Device_IDs = ''
		--SELECT @Device_IDs = CONVERT(varchar,dinf.Device_ID) + ',' + @Device_IDs 
		-- FROM tbl_DeviceInfo AS dinf INNER JOIN tbl_Stores strs ON dinf.Device_Store_ID = strs.Store_ID 
		-- WHERE dinf.Device_Store_ID IN (Select cValue FROM dbo.split(@StoreIDs,','))

		--IF LEN(@Device_IDs)>0 
		--	SET @Device_IDs = LEFT(@Device_IDs, LEN(@Device_IDs)-1)

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

	/*************************************
	 step 2. populate, then roll up data
	*************************************/

	-- pull in raw data from proc
	INSERT INTO #raw_data
	EXECUTE dbo.usp_HME_Cloud_Get_Report_Raw_Data @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType, @LaneConfig_ID

	INSERT INTO #GroupDetails(GroupName, Store_ID, Store_Name, Device_ID)
	SELECT DISTINCT g.GroupName,ts.Store_ID, ts.Store_Name , td.Device_ID
	FROM tbl_Stores ts INNER JOIN tbl_DeviceInfo td ON ts.Store_ID = td.Device_Store_ID
	LEFT JOIN GroupStore gs ON gs.StoreID = ts.Store_ID
	INNER JOIN [Group] g ON g.ID = gs.GroupID
	WHERE td.Device_ID in (SELECT cValue FROM dbo.split(@Device_IDs,','))
		--SELECT DISTINCT g.GroupName,ts.Store_ID, ts.Store_Name
		--FROM [Group] g INNER JOIN GroupStore gs ON g.ID = gs.GroupID
		--INNER JOIN  tbl_Stores ts ON gs.StoreID = ts.Store_ID 
		--WHERE gs.StoreID in (SELECT cValue FROM dbo.split(@StoreIDs,','))

	-- determine whether it's multi store or single store
	-- for single stores, the column names would be its event name
	-- for multi stores, the column names would be category name
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- this is multi store
			SET @isMultiStore = 1

			INSERT INTO @header
			SELECT	DISTINCT EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			FROM    #raw_data
			WHERE	EventType_Category_ID IS NOT NULL

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
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
			SELECT	DISTINCT EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			FROM    #raw_data
			WHERE	Detector_ID IS NOT NULL

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
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
		SELECT	*, RANK () OVER (ORDER BY ID, Storedate) DayID
		FROM #rollup_data ORDER BY ID, StoreDate, StoreNo;'

	/***********************************
		step 3. return result sets
	***********************************/
	-- return avg time report
	EXECUTE(@query);
	
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

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ' - ' + goalName + ']', '[' + headerName + ' - ' + goalName + ']')
			FROM    @header
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
	--INSERT INTO @getGoalTime  VALUES(15,30,60,90,120,5,10,15,20,30,60,90,120,30,60,90,120,30,30,120,180,90,150,300,420)
	--SELECT *  FROM @getGoalTime;

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
	END
	RETURN(0)

END

