GO
/****** Dropping the StoredProcedure [dbo].[usp_GetReportRawData] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetReportRawData' AND [type] ='P'))
	DROP PROCEDURE [dbo].usp_GetReportRawData
GO
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name   : usp_GetReportRawData
-- Author  : Ramesh
-- Created  : 01-June-2018
-- Tables  : Group,Stores
-- Purpose  : To get Day report details for the given StoreIds
-- ===========================================================
--    Modification History
-- -----------------------------------------------------------
-- Sl.No.   Date         Developer            Descriptopn
-- -----------------------------------------------------------
-- 1.   
-- ===========================================================
-- exec [usp_GetReportRawData]  '106651', '2017-10-17','2017-10-17',N'2017-10-17 00:00:00',N'2017-10-17 10:30:00', 11, 'TC',1
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_GetReportRawData](
 @Device_IDs varchar(500),
 @StoreStartDate date,
 @StoreEndDate date,
 @StartDateTime datetime = '1900-01-01 00:00:00',
 @EndDateTime datetime = '3000-01-01 23:59:59',
 @CarDataRecordType_IDs varchar(255) = '11',
 @ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
 @LaneConfig_ID smallint = 1
)
AS
BEGIN
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
	EventType_Category_ID int ,
	 EventTypeName Varchar(200)
	)

	SELECT	Value AS Device_ID
		INTO	#Devices
		FROM	dbo.uf_SplitInt(@Device_IDs)


		;WITH StoresDevicesDates AS (
		SELECT	e.Store_id,
				e.Store_Name, 
				e.Store_Number,
				d.Device_UID,
				d.Device_ID

		FROM	tbl_DeviceInfo d (NOLOCK)
				INNER JOIN tbl_Stores e (NOLOCK) ON e.Store_ID = d.Device_Store_ID
				INNER JOIN #Devices dd ON dd.device_id = d.Device_ID
				)
		INSERT INTO #CarDetectorData
		SELECT 
				a.StoreDate,
				a.DepartTimeStamp, 
				e.Store_id,
				[Store_Number] = ISNULL(e.Store_Name, e.Store_Number),
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

		FROM	dbo.tbl_DeviceConfigDetectors g (NOLOCK)
				INNER JOIN dbo.tbl_DeviceInfo d (NOLOCK) ON g.Device_ID = d.Device_ID
				INNER JOIN dbo.tbl_EventType f (NOLOCK) ON f.EventType_ID = g.Detector_EventType_ID
				INNER JOIN StoresDevicesDates e (NOLOCK) ON e.Store_ID = d.Device_Store_ID
				LEFT JOIN[dbo].[tbl_CarDetectorData] a (NOLOCK) ON g.Device_ID=a.Device_ID AND	g.Detector_ID = a.DetectorData_ID
		WHERE	EXISTS(SELECT 1 FROM #Devices dd WHERE dd.Device_ID = g.Device_ID)
		AND		f.EventType_ID > 0
		AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
		AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
		AND		f.EventType_ID NOT IN (1001)  -- exclude Lane Queue 2 for the moment
		AND     a.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
		AND		a.CarDataRecordType_ID >= @CarDataRecordType_IDs
		AND (
		(@ReportType = 'TC' AND		a.DepartTimeStampLocal BETWEEN CAST(a.StoreDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14) 
									AND CAST(a.StoreDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)) 
		OR 
		(@ReportType = 'AC' AND a.DepartTimeStampLocal BETWEEN @StartDateTime and @EndDateTime)
		)
	-- report type is "Time Slice", then calculate each store date with the time slice
	--IF @ReportType = 'TC'
	--	 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
	--	 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14), CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)
	--	 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d
	--ELSE
	--BEGIN
	-- -- report is 'Cumulative', apply the start time to the first day, and end time to the last day, any other days in between will be 24h
	--	 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
	--	 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' 00:00:00', CAST(d.ThisDate AS char(10)) + ' 23:59:59'
	--	 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d

	--	 SET @MaxID = SCOPE_IDENTITY()

	--	 UPDATE #DateTimeSlice
	--	 SET StartDateTime = @StartDateTime
	--	 WHERE id = 1

	--	 UPDATE #DateTimeSlice
	--	 SET EndDateTime = @EndDateTime
	--	 WHERE id = @MaxID
	--END


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



	--SET @query ='INSERT INTO #CarDetectorData
	--	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	--	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_IDs+''', '''+ @ReportType+''''
	--	EXEC (@query)

	-- add index to above temp table
	CREATE NONCLUSTERED INDEX [IX_tbl_CarRecordData_Device_ID] ON #CarDetectorData
	(
	 Device_ID,
	 StoreDate,
	 CarDataRecord_ID,
	 Detector_ID
	) ON [PRIMARY]



	SET @query = ''

	SELECT sdd.StoreDate,
	  CAST(b.DepartTimeStamp AS DATETIME) AS DepartTimeStamp,
	  sdd.Store_id,
	  sdd.Store_Number,
	  sdd.Device_UID,
	  sdd.Device_ID,
	  b.CarRecordDataType_Name,
	  b.CarsInQueue,
	  b.EventType_ID,
	  b.EventType_Name,
	  b.EventType_Category,
	  b.DetectorTime,  b.EventType_Category_ID,
	  b.Goal_ID,
	  b.Daypart_ID,
	  b.CarDataRecord_ID,
	  b.Detector_ID,
	  b.EventType_Sort,
	  b.LaneConfig_ID
	FROM #StoresDevicesDates sdd
	 -- LEFT JOIN #DetectorEventType g ON g.Device_ID = sdd.Device_ID
	  LEFT JOIN #CarDetectorData b ON b.Device_ID = sdd.Device_ID
	   AND b.StoreDate = sdd.StoreDate
	   --AND g.Device_ID = b.Device_ID
	   --AND g.Detector_ID = b.Detector_ID   
	   WHERE (b.Detector_ID = 1000 OR b.Goal_ID>0)
	   AND b.DepartTimeStamp is not null
	   --AND EventType_Name='Menu Board'
	   --ORDER BY DetectorTime DESC
	 ORDER BY DepartTimeStamp

	--Test
	INSERT INTO #EventTypeNames
	SELECT 
	  sdd.EventType_Category_ID, sdd.EventType_Name
	FROM #CarDetectorData sdd
	GROUP by sdd.EventType_Category_ID, sdd.EventType_Name
	ORDER BY sdd.EventType_Category_ID asc

	--*****************************************************

	--DECLARE @cols NVARCHAR(MAX)
	--SELECT  @cols = COALESCE(@cols + ',[' + EventTypeName + ']', '[' + EventTypeName + ']')
	--FROM #EventTypeNames ORDER BY EventType_Category_ID

	--	IF(ISNULL(@cols,'')<>'')
	--			SET @query = N'
	--			SELECT
	--				CAST(DepartTimeStamp AS DATETIME) AS departureTime,
	--				CarRecordDataType_Name AS  eventName,
	--				CarsInQueue AS carsInQueue,
	--				' + @cols + '
	--			FROM #CarDetectorData b
	--			PIVOT(
	--							AVG(DetectorTime)
	--							FOR EventType_Name IN (' + @cols + ')
	--						) AS p
	--			WHERE
	--			(Detector_ID = 1000 OR Goal_ID>0)
	--				AND DepartTimeStamp is not null
	--			ORDER BY DepartTimeStamp;'
	--		-- return avg time report
	--		EXECUTE(@query);
	--*****************************************************

	DECLARE @listStr VARCHAR(MAX)
	SELECT  @listStr = COALESCE(@listStr+'|$|' ,'') + EventTypeName
	FROM #EventTypeNames ORDER BY EventType_Category_ID
	SELECT @listStr as 'EventTypeName'
	--Test end

	SET @query = '';
	SELECT a.Device_ID, b.Store_Number, b.Store_Name, c.Brand_Name, a.Device_LaneConfig_ID
	   FROM tbl_DeviceInfo a
		LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
		LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
	   WHERE Device_ID IN (@Device_IDs)
	   AND b.Store_Number <> ''
	   ORDER BY b.Store_Number


	--EXEC[dbo].[GetDeviceDayparts] @Device_ID = @Device_IDs

	RETURN(0)
END
GO
