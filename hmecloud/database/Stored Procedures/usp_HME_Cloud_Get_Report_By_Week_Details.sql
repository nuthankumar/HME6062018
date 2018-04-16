-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Week_Details
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
-- ===========================================================
-- EXEC [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details] '15','2018-03-24','2018-03-26',N'2018-03-24 00:00:00',N'2018-03-26 10:30:00','11','AC',1,N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
-- ===========================================================

-- use the below UserUid for testing in local data base
-- --,@UserUID=N'68LKBP85C1SKH1FI3M7X40CJHKGU07FZ'
CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_By_Week_Details](
	@Device_IDs varchar(500),
	@StoreStartDate date,
	@StoreEndDate date,
	@StartDateTime datetime = '1900-01-01 00:00:00',
	@EndDateTime datetime = '3000-01-01 23:59:59',
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
	DECLARE @query NVARCHAR(4000)
	DECLARE @sum_query NVARCHAR(4000)
	DECLARE @header TABLE(headerName varchar(25), headerID smallint, Detector_ID smallint, sort smallint)
	DECLARE @headerSourceCol varchar(50)
	DECLARE @TheDevice_ID int
	DECLARE @isMultiStore bit = 0
	--DECLARE @Device_IDs varchar(500)

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

	-- pull in raw data from proc
	INSERT INTO #raw_data
	EXECUTE dbo.usp_HME_Cloud_Get_Report_Raw_Data @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType, @LaneConfig_ID

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

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
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

			SELECT  @cols = COALESCE(@cols + ',[' + headerName + ']', '[' + headerName + ']')
			FROM    @header
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
	SET @query = N'
	SELECT	*
	FROM	#rollup_data
	PIVOT(
		AVG(AVG_DetectorTime)
		FOR Category IN (' + @cols + ')
	) AS p
	ORDER BY WeekIndex, StoreNo;'

	
	/***********************************
		step 3. return result sets
	***********************************/

	-- return avg time report
	EXECUTE(@query)
		
	-- EXECUTE dbo.usp_HME_Cloud_Get_Device_Goals @Device_IDs

	-- return top 3 longest times
	IF (@isMultiStore = 0 )
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
		END
	ELSE
		SELECT 1	-- fake resultset in case the application expecting it

		SET @query = '';

		SELECT Preferences_Preference_Value as ColourCode FROM itbl_Leaderboard_Preferences WHERE 
			Preferences_Company_ID=(select User_Company_ID  
			from  tbl_Users where User_UID = @UserUID ) AND Preferences_Preference_ID=5

	EXECUTE(@query);

		SET @query = '';	
			--INSERT INTO @getGoalTime  VALUES(15,30,60,90,120,5,10,15,20,30,60,90,120,30,60,90,120,30,30,120,180,90,150,300,420)
			--SELECT * 
			--FROM 
		--	@getGoalTime;
		-- get Gaols time in seconds
			EXEC usp_HME_Cloud_Get_Device_Goals @Device_IDs

			EXECUTE(@query);
			-- Changes for System Statistics
	IF (@isMultiStore = 0)
	BEGIN
		SET @query = '';
			-- Device SystemStatistics General
				EXEC GetDeviceSystemStatisticsGeneral @Device_IDs,@StoreEndDate,@StoreStartDate
		EXECUTE(@query);
		-- include pullins
				DECLARE @IncludePullins bit
				SELECT @IncludePullins = CASE WHEN DeviceSetting_SettingValue = 1 THEN 0 ELSE 1 End
					FROM tbl_DeviceSetting WITH (NOLOCK)
					WHERE DeviceSetting_Device_ID = @Device_IDs
					AND DeviceSetting_Setting_ID = '6002'
			SET @query = ''
				-- Device SystemStatistics Lane
		EXEC GetDeviceSystemStatisticsLane  @Device_IDs,@StoreEndDate,@StoreStartDate, @includePullins 
		EXECUTE(@query);
		END
	
	RETURN(0)
END

GO


