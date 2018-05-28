
GO
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_By_Daypart_Details_Dynamic] if already exists *****/
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
-- 2.		24/05/2018		Ramesh			Add Total Daypart in single result
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
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data_Test '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
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
					HAVING COUNT(d.Device_ID)>0
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
					HAVING COUNT(d.Device_ID)>0
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