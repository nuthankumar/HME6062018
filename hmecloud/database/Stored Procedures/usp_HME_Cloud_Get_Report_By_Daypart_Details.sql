-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Daypart_Details
-- Author		:	Jaffer Sherif
-- Created		:	12-March-2018
-- Purpose		:	To Generate a Day part report
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- exec usp_HME_Cloud_Get_Report_By_Daypart_Details @StoreIDs='3,4', @StoreStartDate='2015-01-13', @StoreEndDate='2015-01-13', @CarDataRecordType_ID = '11'--, 'TC'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Daypart_Details](
	@StoreIDs varchar(500),
	@StoreStartDate date,
	@StoreEndDate date,
	@StartDateTime datetime = '1900-01-01 00:00:00',  -- 2018-04-09 20:00:00
	@EndDateTime datetime = '3000-01-01 23:59:59',
	@CarDataRecordType_ID varchar(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID tinyint = 1
)
AS
BEGIN
	/*
		Copyright (c) 2014 HME, Inc.

		Author:
			Wells Wang (2014-08-10)

		Description:
			This proc is used for Cloud Reporting of daypart report.
			It calculates avg time (seconds) at each detector.

		Parameters:
			@Device_IDs: required. a list of device id's separated by comma
			@StoreStartDate: required. 
			@StoreEndDate: required. 
			@StartDateTime: optional. default to '1900-01-01 00:00:00'
			@EndDateTime: optional. default to '3000-01-01 23:59:59'
			@CarDataRecordType_ID: required. default to '11'. it can also be '11,4'
			@ReportType: optional. default to 'AC'. AC: cumulative  TC: Time Slice
			@LaneConfig_ID optional. default to 1

		Usage:
			EXECUTE dbo.usp_HME_Cloud_Get_Report_By_Daypart @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType, @LaneConfig_ID

		Documentation:
			This report is used for both single and multiple stores. The logic is slightly different with each type.
			For single store, the final result is pivoted by event type of the store. There's only one summary row for the entire period.
			For multi store, the final result is pivoted by event category. There's one summary row for every store date for combined stores.

		Based on:
			New
		Depends on:
			dbo.usp_HME_Cloud_Get_Report_Raw_Data
		Depends on me:
			/hmecloud/_tmp_login_create.cfm
	*/

	/******************************
	 step 1. initialization
	******************************/

	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	SET NOCOUNT ON
	DECLARE @Device_IDs varchar(500)
	DECLARE @cols NVARCHAR(2000)
	DECLARE @query NVARCHAR(4000)
	DECLARE @sum_query NVARCHAR(2000)
	DECLARE @header TABLE(headerName varchar(25), headerID smallint, Detector_ID smallint, sort smallint)
	DECLARE @headerSourceCol varchar(50)
	DECLARE @TheDevice_ID int
	DECLARE @isMultiStore bit = 0

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
		DayPartIndex smallint,
		StartTime time,
		EndTime time,
		StoreNo varchar(50),
		Device_UID uniqueidentifier,
		StoreDate varchar(25),
		Device_ID int,
		GroupName varchar(50), 
		Store_ID int,
		Category varchar(50),
		AVG_DetectorTime int,
		Total_Car int,
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
		EndTime time
	)
	CREATE TABLE #GroupDetails
	(
		GroupName varchar(200),
		Store_ID int
	)
	SET @Device_IDs = ''
	SELECT @Device_IDs = CONVERT(varchar,dinf.Device_ID) + ',' + @Device_IDs 
	 FROM tbl_DeviceInfo AS dinf INNER JOIN tbl_Stores strs ON dinf.Device_Store_ID = strs.Store_ID 
	 WHERE dinf.Device_Store_ID IN (Select cValue FROM dbo.split(@StoreIDs,','))

	 --SELECT dinf.Device_ID
	 --FROM tbl_DeviceInfo AS dinf INNER JOIN tbl_Stores strs ON dinf.Device_Store_ID = strs.Store_ID 
	 --WHERE dinf.Device_Store_ID IN (3,4)

	IF LEN(@Device_IDs)>0 
		SET @Device_IDs = LEFT(@Device_IDs, LEN(@Device_IDs)-1)
		
	/*************************************
	 step 2. populate, then roll up data
	*************************************/

	-- pull in raw data from proc
	INSERT INTO #raw_data
	EXECUTE dbo.usp_HME_Cloud_Get_Report_Raw_Data @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType, @LaneConfig_ID

	INSERT INTO #GroupDetails(GroupName, Store_ID)
	SELECT DISTINCT g.GroupName,ts.Store_ID 
	FROM [Group] g INNER JOIN GroupStore gs ON g.ID = gs.GroupID
	INNER JOIN  tbl_Stores ts ON gs.StoreID = ts.Store_ID 
	WHERE gs.StoreID in (SELECT cValue FROM dbo.split(@StoreIDs,','))
	
	-- determine whether it's multi store or single store
	-- for single stores, the column names would be its event name
	-- for multi stores, the column names would be category name
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
		BEGIN	-- this is a multi store
			SET @isMultiStore = 1

			INSERT INTO @header
			SELECT	DISTINCT EventType_Category, EventType_Category_ID, NULL, EventType_Sort
			FROM    #raw_data
			WHERE	EventType_Category_ID IS NOT NULL

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Category'
			SET @TheDevice_ID = (SELECT TOP 1 Device_ID FROM #raw_data GROUP BY Device_ID ORDER BY MAX(Daypart_ID) DESC)
		
			SET @sum_query = '
				SELECT	d.DayPartIndex,
						d.StartTime,
						d.EndTime,
						''Total Daypart'',
						NULL,
						CAST(d.StoreDate AS varchar(25)),
						NULL,
						ts.GroupName,
						ts.Store_ID,
						EventType_Category,
						AVG(r.DetectorTime),
						COUNT(r.CarDataRecord_ID)
				FROM	StoreWithDatePart d
						INNER JOIN #GroupDetails ts ON d.Store_id = ts.Store_ID
						LEFT JOIN #raw_data r ON d.DayPartIndex = r.Daypart_ID 
							AND d.Store_id = r.Store_id
							AND d.StoreDate = r.StoreDate
				GROUP BY d.DayPartIndex,
						d.StartTime,
						d.EndTime,
						CAST(d.StoreDate AS varchar(25)),
						ts.GroupName,
						ts.Store_ID,
						EventType_Category'
		END
	ELSE
		BEGIN	-- this is a single store
			INSERT INTO @header
			SELECT	DISTINCT EventType_Name, EventType_ID, Detector_ID, EventType_Sort
			FROM    #raw_data
			WHERE	Detector_ID IS NOT NULL

			-- 
			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
			ORDER BY sort

			SET @headerSourceCol = 'EventType_Name'
			SET @TheDevice_ID = CAST(@Device_IDs AS int)
			SET @sum_query = '
				SELECT	NULL, NULL, NULL, NULL, NULL,
						''Total Daypart'',
						NULL,
						NULL,
						NULL,
						EventType_Name,
						AVG(DetectorTime),
						COUNT(CarDataRecord_ID)
				FROM	#raw_data
				GROUP BY EventType_Name'
		END


	-- get daypart records from the proc
	INSERT INTO #DayPart(Device_ID, DayPartIndex, StartTime, EndTime)
	SELECT  [Device_ID], [Daypart_ID], dbo.uf_ConvertNumberToTime([Daypart_Start]), dbo.uf_ConvertNumberToTime([Daypart_End])
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

		INSERT INTO #DayPartWithDate(StoreDate, DayPartIndex, StartTime, EndTime)
		SELECT	d.ThisDate, dp.DayPartIndex, dp.StartTime, dp.EndTime
		FROM	dbo.uf_GetDatesByRange(CAST(@StoreStartDate AS varchar(25)), CAST(@StoreEndDate AS varchar(25))) d
				CROSS JOIN #DayPart dp
	END 
	-- for cumulative reports, remove the dayparts for the first and last day that fall out of the range
	ELSE
	BEGIN
		INSERT INTO #DayPartWithDate(StoreDate, DayPartIndex, StartTime, EndTime)
		SELECT	d.ThisDate, dp.DayPartIndex, dp.StartTime, dp.EndTime
		FROM	dbo.uf_GetDatesByRange(CAST(@StoreStartDate AS varchar(25)), CAST(@StoreEndDate AS varchar(25))) d
				CROSS JOIN #DayPart dp

		DELETE FROM #DayPartWithDate 
		WHERE	StoreDate = @StoreStartDate
		AND		EndTime < CAST(@StartDateTime AS time)

		DELETE FROM #DayPartWithDate 
		WHERE	StoreDate = @StoreEndDate
		AND		StartTime > CAST(@EndDateTime AS time)
	END

	
	-- roll up records into each store date and daypart
	-- for single stores, generate a single summary row for all dayparts
	-- for multip stores, generate a summary row for each daypart
	SET @query = N'
		WITH	StoreWithDatePart(StoreDate, DayPartIndex, StartTime, EndTime, Store_Number, Device_UID, Device_ID, Store_ID)
		AS
		(
			SELECT	dp.StoreDate,
					dp.DayPartIndex,
					dp.StartTime,
					dp.EndTime,
					e.Store_Number,
					d.Device_UID,
					d.Device_ID,
					e.Store_id
			FROM	tbl_DeviceInfo d
					INNER JOIN tbl_Stores e ON d.Device_Store_ID = e.Store_ID
					CROSS JOIN #DayPartWithDate dp
			WHERE	EXISTS(SELECT 1 FROM dbo.Split(''' + @Device_IDs + ''', '','') AS Devices WHERE CAST(Devices.cValue AS int) = d.Device_ID)
		)
		
		INSERT INTO	#rollup_data
		SELECT	d.DayPartIndex,
				d.StartTime,
				d.EndTime,
				d.Store_Number,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				ts.GroupName, 
				ts.Store_ID,' +
				@headerSourceCol + ',
				AVG(r.DetectorTime),
				COUNT(r.CarDataRecord_ID)
		FROM	StoreWithDatePart d
				INNER JOIN #GroupDetails ts ON d.Store_ID = ts.Store_ID
				LEFT JOIN #raw_data r ON d.Store_id = r.Store_id
					AND	d.DayPartIndex = r.Daypart_ID 
					AND d.StoreDate = r.StoreDate
		GROUP BY d.DayPartIndex,
				d.StartTime,
				d.EndTime,
				d.Store_Number,
				d.Device_UID,
				CAST(d.StoreDate AS varchar(25)),
				d.Device_ID,
				ts.GroupName, 
				ts.Store_ID,' +
				@headerSourceCol + '
			
		UNION ALL ' + @sum_query
	
	PRINT @query
	-- execute above query to populate #rollup_data table
	EXECUTE(@query);
	SET @query = '';
	
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
	SET @query = N'
	SELECT	*
	FROM	#rollup_data
	PIVOT(
		AVG(AVG_DetectorTime)
		FOR Category IN (' + @cols + ')
	) AS p
	ORDER BY StoreDate, DayPartIndex, StoreNo;'


	/***********************************
		step 3. return result sets
	***********************************/

	-- return avg time report
	EXECUTE(@query)


	-- return top 3 longest times
	IF (@isMultiStore = 0)
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

			-- get Gaols time in seconds
			EXEC usp_HME_Cloud_Get_Device_Goals @Device_IDs

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
						
		END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it

	RETURN(0)
END

-- exec usp_HME_Cloud_Get_Report_By_Daypart '2979,2977', '2015-01-13', '2015-01-13',  /*NULL, NULL, '11'--, 'TC'*/ '2014-07-09 11:00:00', '2014-07-09 16:00:00', '11', 'TC'
-- exec usp_HME_Cloud_Get_Report_By_Daypart '2955', '2015-01-27', '2015-01-27', NULL, NULL, '11'--, 'TC'
-- exec usp_HME_Cloud_Get_Report_By_Daypart_Details @StoreIDs='3,4', @StoreStartDate='2015-01-13', @StoreEndDate='2015-01-13', @CarDataRecordType_ID = '11'--, 'TC'
-- 	EXECUTE dbo.usp_HME_Cloud_Get_Report_Raw_Data '15', '2015-01-13', '2015-01-13',  /*NULL, NULL, '11'--, 'TC'*/ '2014-07-09 11:00:00', '2014-07-09 16:00:00', '11', 'TC'