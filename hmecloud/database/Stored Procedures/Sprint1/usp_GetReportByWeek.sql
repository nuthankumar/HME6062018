GO
/****** Dropping the StoredProcedure [dbo].[usp_GetReportByWeek] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetReportByWeek' AND [type] ='P'))
	DROP PROCEDURE [dbo].usp_GetReportByWeek
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportByWeek
-- Author		:	Ramesh
-- Created		:	01-June-2018
-- Tables		:	Group,Stores
-- Purpose		:	To get Weekly report details for the given StoreIds
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[usp_GetReportByWeek] '106651', '2017-09-25','2017-10-05', '2017-09-25 05:10','2017-10-05 17:11','11','AC',1,N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
-- ===========================================================

-- use the below UserUid for testing in local data base
-- --,@UserUID=N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
CREATE PROCEDURE [dbo].[usp_GetReportByWeek](
	@Device_IDs VARCHAR(MAX),
	@StoreStartDate DATE,
	@StoreEndDate DATE,
	@InputStartDateTime NVARCHAR(50) = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@InputEndDateTime NVARCHAR(50) = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType CHAR(2) = 'AC',   -- AC: cumulative  TC: Time Slice
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



	/*************************************
	 step 2. populate, then roll up data
	*************************************/
	--SELECT @CarDataRecordType_ID = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
	--	User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=9

	--SET @CarDataRecordType_ID = CASE WHEN ISNULL(@CarDataRecordType_ID,'') ='' THEN '11' ELSE @CarDataRecordType_ID END

	-- pull in raw data from proc
	--SET @query ='INSERT INTO #raw_data
	--EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data_Test '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	--+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_ID+''', '''+ @ReportType+''''

	--EXEC(@query)
	--SET @query =''
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

			--INSERT INTO @header
			--SELECT	DISTINCT EventType_Category, EventType_Category_ID, NULL, EventType_Sort
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
					WHERE 
			
							f.EventType_ID > 0
			AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
			AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
			AND		f.EventType_ID NOT IN (1001)  -- exclude Lane Queue 2 for the moment
			AND EventType_Category_ID IS NOT NULL
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']'),
			@EventNames = COALESCE(@EventNames + '|$|' + headerName , headerName )
			FROM (SELECT DISTINCT headerName, MIN(Sort) Sort FROM @header GROUP BY headerName) header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @TheDevice_ID = (SELECT TOP 1 Device_ID FROM #raw_data
				WHERE Device_ID IN(SELECT Device_ID FROM #rollup_data) GROUP BY Device_ID
						ORDER BY MAX(Daypart_ID) DESC)

			SET @sum_query = '
				SELECT WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID,  StoreID, Category, AVG_DetectorTime, Total_Car
				FROM (
					SELECT	w.WeekIndex,
							w.WeekStartDate,
							w.WeekEndDate,
							''Total Week'' StoreNo,
							NULL Store_Name,
							NULL Device_UID,
							NULL Device_ID,
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
			--INSERT INTO @header
			--SELECT	DISTINCT EventType_Name, EventType_ID, Detector_ID, EventType_Sort
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
		INSERT INTO	#rollup_data(WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, StoreID, Category, AVG_DetectorTime, Total_Car)
		SELECT	w.WeekIndex,
				CAST(w.WeekStartDate AS char(10)),
				CAST(w.WeekEndDate AS char(10)),
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				s.Store_ID,' +
				@headerSourceCol + ',
				AVG(DetectorTime),
				COUNT(CarDataRecord_ID)
		FROM	#raw_data r
				LEFT JOIN #week w ON w.StoreDate = r.StoreDate
				LEFT JOIN tbl_Stores s ON r.Store_ID = s.Store_ID
		GROUP BY w.WeekIndex,
				w.WeekStartDate,
				w.WeekEndDate,' +
				@headerSourceCol + ',
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				s.Store_ID
		ORDER BY w.WeekIndex,
				w.WeekStartDate,
				w.WeekEndDate,' +
				@headerSourceCol + ',
				r.Store_Number,
				s.Store_Name,
				r.Device_UID,
				r.Device_ID,
				s.Store_ID
		'

	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';


	INSERT INTO #rollup_data (WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, StoreID, Category, AVG_DetectorTime, Total_Car)
	EXEC (@sum_query);

	IF NOT EXISTS(SELECT 1 FROM #rollup_data)
	BEGIN
		INSERT INTO #rollup_data (WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, StoreID, Category, AVG_DetectorTime, Total_Car)
		SELECT DISTINCT WeekIndex, WeekStartDate, WeekEndDate, NULL StoreNo, NULL Store_Name, NULL Device_UID, NULL Device_ID, NULL StoreID, NULL Category, NULL AVG_DetectorTime, NULL Total_Car
		FROM #Week
		UNION ALL
		SELECT 10000 WeekIndex, NULL WeekStartDate, NULL WeekEndDate,'Total Week' StoreNo, NULL Store_Name, NULL Device_UID, NULL Device_ID, 
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
		SELECT	WeekIndex, WeekStartDate, WeekEndDate, StoreNo, Store_Name, Device_UID, Device_ID, StoreID, Total_Car
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
		--SET @Preferences_Preference_Value =''
		--SELECT @Preferences_Preference_Value = User_Preferences_Preference_Value FROM itbl_User_Preferences WHERE
		--	User_Preferences_User_ID =(SELECT USER_ID FROM  tbl_Users WHERE User_UID = @UserUID ) AND User_Preferences_Preference_ID=5

		--IF(ISNULL(@Preferences_Preference_Value,'') ='')
		--	SET @Preferences_Preference_Value = '#00b04c|#dcba00|#b40000'

		--SELECT @Preferences_Preference_Value AS ColourCode

		---- get Gaols time in seconds
		--	EXEC usp_HME_Cloud_Get_Device_Goals @Device_IDs

		--	EXECUTE(@query);
			-- Changes for System Statistics
	IF (@isMultiStore = 0)
	BEGIN
		-- Device SystemStatistics General
		--EXEC GetDeviceSystemStatisticsGeneral @Device_IDs,@StoreEndDate,@StoreStartDate

		---- include pullins
		--DECLARE @IncludePullins bit
		--SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
		--	FROM tbl_DeviceSetting WITH (NOLOCK)
		--	WHERE DeviceSetting_Device_ID = @Device_IDs
		--	AND DeviceSetting_Setting_ID = '6002'

		--CREATE TABLE #tmpSystemStatisticsLane
		--	(
		--		Device_ID int,
		--		Lane tinyint,
		--		AvgCarsInLane int,
		--		Pullouts int,
		--		Pullins int,
		--		DeleteOverMax int
		--	);
		--	-- Device SystemStatistics Lane
		--INSERT INTO #tmpSystemStatisticsLane(Device_ID, Lane, AvgCarsInLane, Pullouts, Pullins, DeleteOverMax)
		--EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins
		--IF EXISTS(SELECT 1 FROM #tmpSystemStatisticsLane)
		--	SELECT * FROM #tmpSystemStatisticsLane
		--ELSE
		--	SELECT NULL Device_ID, NULL Lane, NULL AvgCarsInLane, NULL Pullouts, NULL Pullins, NULL DeleteOverMax
		SELECT @EventGoalNames EventGoalNames
	END
	SELECT @EventNames EventNames
	RETURN(0)
END
GO