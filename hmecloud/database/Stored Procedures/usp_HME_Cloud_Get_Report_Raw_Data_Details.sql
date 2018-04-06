-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_Raw_Data_Details
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,GroupStore
-- Purpose		:	To get the Raw Car Data for the given Store, 
--					StoreStartDate, StoreEndDate, StartDateTime and EndDateTime
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details] @GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details](
	@StoreId int,
	@StoreStartDate date,
	@StoreEndDate date,
	@StartDateTime datetime = '1900-01-01 00:00:00',
	@EndDateTime datetime = '3000-01-01 23:59:59',
	@CarDataRecordType_IDs varchar(255) = '11',
	@ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
	@LaneConfig_ID smallint = 1
)
AS

SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
SET NOCOUNT ON

DECLARE @MaxID int
DECLARE @Device_IDs varchar(500)
DECLARE @query NVARCHAR(3000)
DECLARE @Device_UID varchar(500)

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
		Device_ID int,
		Daypart_ID tinyint,
		StoreDate date,
		DepartTimeStamp datetime, 
		Detector_ID int,
		DetectorTime smallint, 
		CarDataRecord_ID bigint,
		Goal_ID smallint,
		CarRecordDataType_Name varchar(20), 
		CarsInQueue tinyint
)
-- Getting the DeviceIds for the given StoreId
SET @Device_IDs = (select dinf.Device_ID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));
SET @Device_UID = (select dinf.Device_UID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));

-- report type is "Time Slice", then calculate each store date with the time slice
IF @ReportType = 'TC'
	INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
	SELECT	d.ThisDate, CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14), CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)
	FROM	dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d
ELSE	
BEGIN
	-- report is 'Cumulative', apply the start time to the first day, and end time to the last day, any other days in between will be 24h
	INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
	SELECT	d.ThisDate, CAST(d.ThisDate AS char(10)) + ' 00:00:00', CAST(d.ThisDate AS char(10)) + ' 23:59:59'
	FROM	dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d

	SET @MaxID = SCOPE_IDENTITY()

	UPDATE #DateTimeSlice
	SET	StartDateTime = @StartDateTime
	WHERE id = 1

	UPDATE #DateTimeSlice
	SET	EndDateTime = @EndDateTime
	WHERE id = @MaxID
END


-- populate this table for later join in order to reduce logical reads
INSERT INTO #DetectorEventType
SELECT	g.Device_ID,
		g.Detector_ID,
		f.EventType_ID,
		f.EventType_Name,
		f.EventType_Category_ID, 
		f.EventType_Category,
		f.EventType_Category_Sort,
		f.LaneConfig_ID
FROM	tbl_DeviceConfigDetectors g
		INNER JOIN [dbo].[tbl_DeviceInfo] d ON g.Device_ID = d.Device_ID
		INNER JOIN tbl_EventType f ON f.EventType_ID = g.Detector_EventType_ID
WHERE	EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = g.Device_ID)
AND		f.EventType_ID > 0
AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors


-- pull records for all events
INSERT INTO	#StoresDevicesDates
SELECT	e.Store_id,
		e.Store_Number,
		d.Device_UID,
		dt.ThisDate,
		d.Device_ID
FROM	tbl_DeviceInfo d
		INNER JOIN tbl_Stores e ON e.Store_ID = d.Device_Store_ID
		CROSS JOIN dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) dt
WHERE	EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = d.Device_ID)


INSERT INTO	#CarDetectorData
SELECT	b.Device_ID ,
		b.Daypart_ID,
		b.StoreDate,
		CAST(b.DepartTimeStamp AS DATETIME) AS DepartTimeStamp, 
		a.DetectorData_ID AS Detector_ID,
		a.DetectorTime, 
		a.CarDataRecord_ID,
		a.Goal_ID,
		[CarRecordDataType_Name] = CASE b.CarDataRecordType_ID WHEN 11 THEN 'Car_Departure' WHEN 4 THEN 'Car_Pull_In' ELSE 'Other' END, 
		b.CarsInQueue
FROM	tbl_DetectorData a 
		INNER JOIN tbl_CarRecordData b ON b.CarDataRecord_ID = a.CarDataRecord_ID
		--INNER JOIN ltbl_CarDataRecordType c ON c.CarRecordDataType_ID = b.CarDataRecordType_ID
WHERE	1 = 1
AND		b.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
AND		EXISTS(SELECT 1 FROM #DateTimeSlice AS dts WHERE dts.StoreDate = b.StoreDate AND CAST(b.DepartTimeStamp AS DATETIME) BETWEEN dts.StartDateTime AND dts.EndDateTime)
AND		EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') AS Devices WHERE Devices.cValue = b.Device_ID)
AND		EXISTS(SELECT 1 FROM dbo.Split(@CarDataRecordType_IDs, ',') AS drt WHERE drt.cValue = b.CarDataRecordType_ID)
AND		(a.Goal_ID > 0 OR a.DetectorData_ID = 1000)  -- except land queue, do not include records with Goal_id = 0


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
SELECT	sdd.StoreDate,
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
FROM	#StoresDevicesDates sdd
		LEFT JOIN #DetectorEventType g ON g.Device_ID = sdd.Device_ID 
		LEFT JOIN #CarDetectorData b ON b.Device_ID = sdd.Device_ID 
			AND b.StoreDate = sdd.StoreDate 
			AND g.Device_ID = b.Device_ID
			AND	g.Detector_ID = b.Detector_ID 
			

UNION ALL

-- add records for any events that do not have detecter data
SELECT	sdd.StoreDate, 
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
FROM	#StoresDevicesDates sdd
		INNER JOIN #DetectorEventType et ON et.Device_ID = sdd.Device_ID 
		INNER JOIN #CarDetectorData cdd ON sdd.Device_ID = cdd.Device_ID AND cdd.Detector_ID = 2000 AND sdd.StoreDate = cdd.StoreDate 
WHERE	NOT EXISTS(
		SELECT	1
		FROM	#CarDetectorData d
		WHERE	et.Detector_ID = d.Detector_ID
		AND		cdd.CarDataRecord_ID = d.CarDataRecord_ID
		
		
)
) A
ORDER BY DepartTimeStamp


EXECUTE(@query);

SET @query = '';
SELECT a.Device_ID, b.Store_Number, b.Store_Name, c.Brand_Name, a.Device_LaneConfig_ID
			FROM tbl_DeviceInfo a
				LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
				LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
			WHERE Device_UID IN (@Device_UID)
			AND b.Store_Number <> ''
			ORDER BY b.Store_Number


EXECUTE(@query);

SET @query = '';

EXEC[dbo].[GetDeviceDayparts] @Device_ID = @Device_IDs
EXECUTE(@query);


RETURN(0)



-- exec usp_HME_Cloud_Get_Report_Raw_Data '2955', '2015-01-28', '2015-01-28', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'
-- exec usp_HME_Cloud_Get_Report_Raw_Data '2979', '2015-01-13', '2015-01-13', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'
-- exec usp_HME_Cloud_Get_Report_Raw_Data '1354,1382', '2014-07-11', '2014-07-11', '2014-08-11 10:00:00', '2014-08-11 10:01:00', '11', 'AC'

-- exec usp_HME_Cloud_Get_Report_Raw_Data '1382', '2015-02-10', '2015-02-10', NULL, NULL, '11' --'2014-07-09 10:00:00', '2014-07-09 12:02:00', '11', 'AC'
GO


