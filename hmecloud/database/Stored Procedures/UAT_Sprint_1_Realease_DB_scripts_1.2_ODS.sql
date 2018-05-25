
GO
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Dynamic_ODS] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_Raw_Data_Dynamic_ODS' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Dynamic_ODS]
GO


--exec [usp_HME_Cloud_Get_Report_Raw_Data] '119913, 119961, 119905, 119748', '2018-05-1', '2018-05-15', '2018-05-1 00:00:00' , '2018-05-15 23:30:00', 11, 'TC'
CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Dynamic_ODS](
	@Device_IDs varchar(MAX),
	@StoreStartDate date,
	@StoreEndDate date,
	@StartDateTime datetime = '2007-01-01 00:00:00',
	@EndDateTime datetime = '2020-01-01 23:59:59',
	@CarDataRecordType_IDs smallint = 11,
	@ReportType char(2) = 'AC'   -- AC: cumulative  TC: Time Slice
)
AS

/*
	Copyright (c) 2015 HME, Inc.

	Author:
		Wells Wang (2015-11-10)

	Description:
		This report is used for pulling raw drive thru data.
		
	Parameters:
		@Device_IDs: required. a list of device id's separated by comma
		@StoreStartDate: required. 
		@StoreEndDate: required. 
		@StartDateTime: optional. default to '1900-01-01 00:00:00'
		@EndDateTime: optional. default to '3000-01-01 23:59:59'
		@CarDataRecordType_ID: required. default to '11'. it can also be '11,4'
		@ReportType: optional. default to 'AC'. AC: cumulative  TC: Time Slice

	Usage:
		EXECUTE dbo.usp_HME_Cloud_Get_Report_Raw_Data @Device_IDs, @StoreStartDate, @StoreEndDate, @StartDateTime, @EndDateTime, @CarDataRecordType_ID, @ReportType
		
	Documentation:
		
	Based on:
		_qry_select_raw_car_data.cfm
	Depends on:
		N/A
	Depends on me:
		usp_HME_Cloud_Get_Report_By_Date
		usp_HME_Cloud_Get_Report_By_Daypart
		usp_HME_Cloud_Get_Report_By_Week
		/hmecloud/security/_tmp_login_create.cfm
*/

SET TRANSACTION ISOLATION LEVEL READ COMMITTED;
SET NOCOUNT ON;

DECLARE @MaxID int;

IF @StartDateTime IS NULL 
	SET @StartDateTime = '2007-01-01 00:00:00';

IF @EndDateTime IS NULL
	SET @EndDateTime = '2020-01-01 23:59:59';


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
);


-- get all device_id's into a temp table
SELECT	Value AS Device_ID
INTO	#Devices
FROM	dbo.uf_SplitInt(@Device_IDs);


-- populate this table for later join in order to reduce logical reads
SELECT	g.Device_ID,
		g.Detector_ID,
		f.EventType_ID,
		f.EventType_Name,
		f.EventType_Category_ID, 
		f.EventType_Category,
		f.EventType_Category_Sort AS EventType_Sort,
		f.LaneConfig_ID
INTO	#DetectorEventType
FROM	dbo.tbl_DeviceConfigDetectors g (Readpast)
		INNER JOIN dbo.tbl_DeviceInfo d (nolock) ON g.Device_ID = d.Device_ID
		INNER JOIN dbo.tbl_EventType f (nolock) ON f.EventType_ID = g.Detector_EventType_ID
WHERE	EXISTS(SELECT 1 FROM #Devices dd WHERE dd.Device_ID = g.Device_ID)
AND		f.EventType_ID > 0
AND		f.LaneConfig_ID = d.Device_LaneConfig_ID
AND		g.Detector_Type_ID IN (1, 2, 3, 5, 6)  -- exclude 0, 4, 255 (off, independent, none) types of detectors
AND		f.EventType_ID NOT IN (1001);  -- exclude Lane Queue 2, Lane Total 2 for the moment


-- pull records for all events
SELECT	e.Store_id,
		[Store_Number] = IsNull(e.Store_Name, e.Store_Number),
		d.Device_UID,
		dt.ThisDate AS StoreDate,
		d.Device_ID
INTO	#StoresDevicesDates
FROM	tbl_DeviceInfo d (nolock)
		INNER JOIN tbl_Stores e (nolock) ON e.Store_ID = d.Device_Store_ID
		INNER JOIN #Devices dd ON dd.device_id = d.Device_ID
		CROSS JOIN dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) dt;


-- pull car record data
IF @ReportType = 'TC'
BEGIN
	-- report type is "Time Slice"
	SELECT	[StoreDate] = d.ThisDate, 
			[StartDateTime] = CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14), 
			[EndDateTime] = CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)
	INTO	#DateTimeSlice
	FROM	dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d;


	INSERT INTO	#CarDetectorData
	SELECT	a.Device_ID ,
			a.Daypart_ID,
			a.StoreDate,
			a.DepartTimeStampLocal AS DepartTimeStamp, 
			a.DetectorData_ID AS Detector_ID,
			a.DetectorTime, 
			a.CarDataRecord_ID,
			a.Goal_ID,
			[CarRecordDataType_Name] = CASE a.CarDataRecordType_ID WHEN 11 THEN 'Car_Departure' WHEN 4 THEN 'Car_Pull_In' ELSE 'Other' END, 
			a.CarsInQueue
	FROM	[dbo].[tbl_CarDetectorData] a (nolock)
	WHERE	1 = 1 
	AND		EXISTS(SELECT 1 FROM #Devices d WHERE d.Device_ID = a.Device_ID)
	AND		a.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
	--AND		a.DepartTimeStampLocal BETWEEN @StartDateTime AND @EndDateTime
	AND		EXISTS(SELECT 1 FROM #DateTimeSlice dts WHERE dts.StoreDate = a.StoreDate AND a.DepartTimeStampLocal BETWEEN dts.StartDateTime AND dts.EndDateTime)
	AND		a.CarDataRecordType_ID >= @CarDataRecordType_IDs;
END
ELSE
	-- report type is "Cumulative"
	INSERT INTO	#CarDetectorData
	SELECT	a.Device_ID ,
			a.Daypart_ID,
			a.StoreDate,
			a.DepartTimeStampLocal AS DepartTimeStamp, 
			a.DetectorData_ID AS Detector_ID,
			a.DetectorTime, 
			a.CarDataRecord_ID,
			a.Goal_ID,
			[CarRecordDataType_Name] = CASE a.CarDataRecordType_ID WHEN 11 THEN 'Car_Departure' WHEN 4 THEN 'Car_Pull_In' ELSE 'Other' END, 
			a.CarsInQueue
	FROM	[dbo].[tbl_CarDetectorData] a (nolock)
			INNER JOIN #Devices d ON d.Device_ID = a.Device_ID
	WHERE	1 = 1 
	--AND		EXISTS(SELECT 1 FROM #Devices d WHERE d.Device_ID = a.Device_ID)
	AND		a.StoreDate BETWEEN @StoreStartDate AND @StoreEndDate
	AND		a.DepartTimeStampLocal BETWEEN @StartDateTime AND @EndDateTime
	--AND		EXISTS(SELECT 1 FROM #DateTimeSlice dts WHERE dts.StoreDate = a.StoreDate AND a.DepartTimeStampLocal BETWEEN dts.StartDateTime AND dts.EndDateTime)
	AND		a.CarDataRecordType_ID >= @CarDataRecordType_IDs;

/*
CREATE CLUSTERED INDEX IX_CarDetectorData_Device_StoreDate
ON #CarDetectorData
(
	Device_ID,
	Detector_ID,
	StoreDate
);


CREATE NONCLUSTERED INDEX IX_CarDetectorData_CarDataRecord_ID
ON #CarDetectorData
(
	CarDataRecord_ID,
	Detector_ID
);
*/
CREATE NONCLUSTERED INDEX [IX_CarDetectorData]
ON [dbo].[#CarDetectorData] ([Detector_ID])
INCLUDE ([Device_ID],[Daypart_ID],[StoreDate],[DepartTimeStamp],[CarDataRecord_ID],[CarRecordDataType_Name],[CarsInQueue])

-- pull car record with store info
SELECT	sdd.StoreDate,
		b.DepartTimeStamp, 
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
		cdd.DepartTimeStamp, 
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
		WHERE	cdd.CarDataRecord_ID = d.CarDataRecord_ID
		AND		et.Detector_ID = d.Detector_ID
		);




-- exec usp_HME_Cloud_Get_Report_Raw_Data '1382,2955,1385,997', '2015-11-01', '2015-11-01', '2015-11-01 00:00:00', '2015-11-01 23:59:00', 11, 'AC'
-- exec usp_HME_Cloud_Get_Report_Raw_Data '1959', '2016-02-11', '2016-02-11', '2016-02-11 00:00:00', '2016-02-11 23:59:00', 11, 'AC'