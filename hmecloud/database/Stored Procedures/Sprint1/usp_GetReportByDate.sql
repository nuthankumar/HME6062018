GO
/****** Dropping the StoredProcedure [dbo].[usp_GetReportByDate] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetReportByDate' AND [type] ='P'))
	DROP PROCEDURE [dbo].usp_GetReportByDate
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportByDate
-- Author		:	Ramesh
-- Created		:	01-June-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get Day report details for the given StoreIds
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [usp_GetReportByDate] '99181,99182,108037', '2018-06-01','2018-06-05', '2018-06-01 05:10','2018-06-05 17:11',11,'AC',1 ,'CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_GetReportByDate](
	@Device_IDs VARCHAR(500),
	@StoreStartDate DATE,
	@StoreEndDate DATE,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID VARCHAR(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID TINYINT = 1,
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
		Store_ID int,
		Category varchar(50),
		AVG_DetectorTime int,
		Total_Car int
	)
	
	/*************************************
	 step 2. populate, then roll up data
	*************************************/
	SELECT	Value AS Device_ID
	INTO	#Devices
	FROM	dbo.uf_SplitInt(@Device_IDs)

	DECLARE @tmpDate DateTime
	CREATE TABLE #tmpDateRange
	(StoreDate date)
	SET @tmpDate =@StoreStartDate
	WHILE (@tmpDate <= @StoreEndDate)
	BEGIN
		INSERT INTO #tmpDateRange
		SELECT @tmpDate
		SET @tmpDate = DATEADD(dd,1,@tmpDate)
	END

	;WITH StoresDevicesDates AS (
	SELECT	e.Store_id,
			e.Store_Name, 
			e.Store_Number,
			d.Device_UID,
			d.Device_ID,
			t.StoreDate

	FROM	tbl_DeviceInfo d (NOLOCK)
			INNER JOIN tbl_Stores e (NOLOCK) ON e.Store_ID = d.Device_Store_ID
			INNER JOIN #Devices dd ON dd.device_id = d.Device_ID
			CROSS JOIN #tmpDateRange t
			)
			INSERT INTO #raw_data
	SELECT 
			e.StoreDate,
			a.DepartTimeStamp, 
			e.Store_id,
			e.Store_Number,
			d.Device_UID,
			g.Device_ID,
			CASE a.CarDataRecordType_ID WHEN 11 THEN 'Car_Departure' WHEN 4 THEN 'Car_Pull_In' ELSE 'Other' END CarRecordDataType_Name, 
			a.CarsInQueue, 
			f.EventType_ID,
			f.EventType_Name,
			f.EventType_Category_ID, 
			f.EventType_Category, 
			a.DetectorTime, 
			a.Goal_ID, 
			a.Daypart_ID, 
			a.CarDataRecord_ID,
			g.Detector_ID,
			f.EventType_Category_Sort AS EventType_Sort,
			f.LaneConfig_ID
		FROM	StoresDevicesDates e 
			LEFT JOIN dbo.tbl_DeviceConfigDetectors g (NOLOCK) ON e.Device_ID = g.Device_ID
			LEFT JOIN dbo.tbl_DeviceInfo d (NOLOCK) ON g.Device_ID = d.Device_ID
			LEFT JOIN dbo.tbl_EventType f (NOLOCK) ON f.EventType_ID = g.Detector_EventType_ID
			--INNER JOIN StoresDevicesDates e (NOLOCK) ON e.Store_ID = d.Device_Store_ID
			LEFT JOIN[dbo].[tbl_CarDetectorData] a (NOLOCK) ON g.Device_ID=a.Device_ID AND	g.Detector_ID = a.DetectorData_ID AND a.StoreDate=e.StoreDate

	--FROM	dbo.tbl_DeviceConfigDetectors g (NOLOCK)
	--		INNER JOIN dbo.tbl_DeviceInfo d (NOLOCK) ON g.Device_ID = d.Device_ID
	--		INNER JOIN dbo.tbl_EventType f (NOLOCK) ON f.EventType_ID = g.Detector_EventType_ID
	--		INNER JOIN StoresDevicesDates e (NOLOCK) ON e.Store_ID = d.Device_Store_ID
	--		LEFT JOIN[dbo].[tbl_CarDetectorData] a (NOLOCK) ON g.Device_ID=a.Device_ID AND	g.Detector_ID = a.DetectorData_ID
			
	WHERE	EXISTS(SELECT 1 FROM #Devices dd WHERE dd.Device_ID = g.Device_ID)
	AND		f.EventType_ID > 0
	AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
	AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
	AND		f.EventType_ID NOT IN (1001)  -- exclude Lane Queue 2 for the moment
	--AND     a.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
	AND		(a.CarDataRecordType_ID IS NULL OR a.CarDataRecordType_ID >= @CarDataRecordType_ID)
	AND (a.DepartTimeStampLocal IS NULL OR (
	(@ReportType = 'TC' AND		a.DepartTimeStampLocal BETWEEN CAST(a.StoreDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14) 
								AND CAST(a.StoreDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)) 
	OR 
	(@ReportType = 'AC' AND a.DepartTimeStampLocal BETWEEN @StartDateTime and @EndDateTime)
	))
	
	
	-- pull in raw data from proc
	--INSERT INTO #raw_data
	--EXEC dbo.usp_HME_Cloud_Get_Report_Raw_Data @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType

	-- determine whether it's multi store or single store
	-- for single stores, the column names would be its event name
	-- for multi stores, the column names would be category name
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- this is multi store
			SET @isMultiStore = 1

			--INSERT INTO @header
			--SELECT	DISTINCT CASE WHEN ISNULL(EventType_Category,'')='' THEN 'NA' ELSE EventType_Category END EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			--FROM    #raw_data
			--WHERE	EventType_Category_ID IS NOT NULL
			;WITH Devices AS (SELECT value device_id FROM	dbo.uf_SplitInt(@Device_IDs))
			INSERT INTO @header
			SELECT CASE WHEN ISNULL(EventType_Category,'')='' THEN 'NA' ELSE EventType_Category END EventType_Category,
				EventType_Category_ID, 
				NULL,
				 EventType_Category_Sort
			FROM dbo.tbl_DeviceConfigDetectors g (NOLOCK)
					INNER JOIN dbo.tbl_DeviceInfo d (NOLOCK) ON g.Device_ID = d.Device_ID
					INNER JOIN dbo.tbl_EventType f (NOLOCK) ON f.EventType_ID = g.Detector_EventType_ID
					INNER JOIN Devices dd ON dd.device_id = d.Device_ID
					WHERE f.EventType_ID > 0
			AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
			AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
			AND		f.EventType_ID NOT IN (1001)  -- exclude Lane Queue 2 for the moment
			AND EventType_Category_ID IS NOT NULL

			SET @EventNames = NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @sum_query = '
				SELECT	''Total Day''  StoreNo,
					NULL Store_Name,
					NULL Device_UID,
					d.StoreDate,
					NULL Device_ID,
					NULL Store_ID,
					EventType_Category Category,
					AVG(DetectorTime) AVG_DetectorTime,
					COUNT(CarDataRecord_ID) Total_Car
				FROM	#raw_data d 
				GROUP BY d.StoreDate, EventType_Category'
		END
	ELSE
		BEGIN	-- this is single store
			--INSERT INTO @header
			--SELECT	DISTINCT CASE WHEN ISNULL(EventType_Name,'') ='' THEN 'NA' ELSE EventType_Name END EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			--FROM    #raw_data
			--WHERE	Detector_ID IS NOT NULL 
			;WITH Devices AS (SELECT value device_id FROM	dbo.uf_SplitInt(@Device_IDs))
			INSERT INTO @header
			SELECT CASE WHEN ISNULL(EventType_Name,'')='' THEN 'NA' ELSE EventType_Name END EventType_Name,
				EventType_ID, 
				g.Detector_ID,
				 EventType_Category_Sort
			FROM dbo.tbl_DeviceConfigDetectors g (NOLOCK)
					INNER JOIN dbo.tbl_DeviceInfo d (NOLOCK) ON g.Device_ID = d.Device_ID
					INNER JOIN dbo.tbl_EventType f (NOLOCK) ON f.EventType_ID = g.Detector_EventType_ID
					INNER JOIN Devices dd ON dd.device_id = d.Device_ID
					WHERE f.EventType_ID > 0
			AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
			AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
			AND		f.EventType_ID NOT IN (1001)  -- exclude Lane Queue 2 for the moment
			AND Detector_ID IS NOT NULL
			
			SET @EventNames =NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Name'
			SET @sum_query = '
			;WITH TotalCar AS (SELECT COUNT(CarDataRecord_ID) Total_Car,EventType_Name  FROM	#raw_data GROUP BY EventType_Name)
				SELECT	NULL StoreNo,
					NULL Store_Name,
					NULL Device_UID,
					''Total Day'' StoreDate,
					NULL Device_ID,
					NULL Store_ID,
					EventType_Name Category,
					AVG(DetectorTime) AVG_DetectorTime,
					(SELECT MAX(Total_Car) FROM TotalCar) Total_Car
				FROM	#raw_data d 
				--WHERE DetectorTime IS NOT NULL
				GROUP BY  EventType_Name'
		
		END

	-- roll up records into each store date
	-- for single stores, generate a single summary row for all dates
	-- for multip stores, generate a summary row for each date
		
	SET @query = N'
		INSERT INTO	#rollup_data(StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, Store_ID, Category, AVG_DetectorTime , Total_Car )
		SELECT	d.Store_Number,
				s.Store_Name,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				d.Store_ID,' +
				@headerSourceCol + ',
				AVG(d.DetectorTime),
				COUNT(d.CarDataRecord_ID)
		FROM	#raw_data d 
		LEFT JOIN tbl_Stores s ON d.Store_ID = s.Store_ID	
		GROUP BY d.StoreDate,' +
				@headerSourceCol + ',
				d.Store_Number,
				s.Store_Name,
				d.Device_UID,
				d.Device_ID,
				d.Store_ID
		ORDER BY d.StoreDate,' +
				@headerSourceCol + ',
				d.Store_Number,
				d.Device_UID,
				d.Device_ID,
				d.Store_ID
		' 

	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';
	
	INSERT INTO #rollup_data (StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, Store_ID, Category, AVG_DetectorTime , Total_Car)
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

	--IF NOT EXISTS(SELECT 1 FROM #rollup_data)
	--BEGIN
	--	DECLARE @tmpDate DateTime
	--	CREATE TABLE #tmpDateRange
	--	(StoreDate datetime)
	--	SET @tmpDate =@StoreStartDate
	--	WHILE (@tmpDate <= @StoreEndDate)
	--	BEGIN
	--		INSERT INTO #tmpDateRange
	--		SELECT @tmpDate
	--		SET @tmpDate = DATEADD(dd,1,@tmpDate)
	--	END
		
	--	INSERT INTO #rollup_data (ID, StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, Store_ID, Category, AVG_DetectorTime , Total_Car)
	--	SELECT  ROW_NUMBER()OVER(ORDER BY StoreDate) ID , NULL StoreNo, NULL Store_Name, NULL Device_UID, CONVERT(Date, StoreDate), NULL Device_ID, NULL Store_ID, NULL Category, NULL AVG_DetectorTime , NULL Total_Car
	--	FROM #tmpDateRange
	--	UNION ALL
	--	SELECT 10000 ID, 'Total Day' StoreNo, NULL Store_Name, NULL Device_UID, NULL StoreDate, NULL Device_ID, NULL Store_ID, NULL Category, NULL AVG_DetectorTime , NULL Total_Car
		
	--END;
	-- below is a hack!!
	-- when a single store has change of config (for instanc: menu board, service... to pre loop, menu board, service...) 
	-- or when multi store don't have the same config for each store
	-- it would generate multiple summary rows because the Total_Car number could vary. 
	-- Using below fix, it will update Total_Car to be the same value, enable rollup to a single summary row
	;WITH	Max_TotalCar_By_Day
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
		SELECT	ID , StoreNo, Store_Name, Device_UID, StoreDate, Device_ID, Store_ID, Total_Car
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

	-- Goal time
	--EXEC usp_HME_Cloud_Get_Device_Goals_Details @Device_IDs
	
	-- Changes for System Statistics
	--IF (@isMultiStore = 0)
	--BEGIN
	--			-- Device SystemStatistics Lane
	--	CREATE TABLE #tmpSystemStatisticsLane
	--		(
	--			Device_ID int,
	--			Lane tinyint,
	--			AvgCarsInLane int,
	--			Pullouts int,
	--			Pullins int,
	--			DeleteOverMax int
	--		);
	--	INSERT INTO #tmpSystemStatisticsLane(Device_ID, Lane, AvgCarsInLane, Pullouts, Pullins, DeleteOverMax)
	--	EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins 
	--	IF EXISTS(SELECT 1 FROM #tmpSystemStatisticsLane)
	--		SELECT * FROM #tmpSystemStatisticsLane
	--	ELSE
	--		SELECT NULL Device_ID, NULL Lane, NULL AvgCarsInLane, NULL Pullouts, NULL Pullins, NULL DeleteOverMax

		SELECT @EventGoalNames EventGoalNames
	--END
	SELECT @EventNames EventNames
	END
GO