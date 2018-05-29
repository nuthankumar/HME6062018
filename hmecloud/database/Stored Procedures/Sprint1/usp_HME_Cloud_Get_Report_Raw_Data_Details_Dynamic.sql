GO
/****** Dropping the StoredProcedure [dbo].[V] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic]
GO


-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name   : usp_HME_Cloud_Get_Report_Raw_Data_Details
-- Author  : Swathi Kumar
-- Created  : 12-April-2018
-- Tables  : Group,Stores
-- Purpose  : To get Day report details for the given StoreIds
-- ===========================================================
--    Modification History
-- -----------------------------------------------------------
-- Sl.No.   Date         Developer            Descriptopn
-- -----------------------------------------------------------
-- 1.     22/05/2018     Ramesh              Add (LinkedServerName,DatabaseName)
-- ===========================================================
-- exec [usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic] '15', '2018-03-24', '2018-03-24', '2018-03-24 00:00:00' , '2018-03-24 12:00:00', 11, 'TC',1
-- exec [usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic] '108037','2018-05-15','2018-05-15',N'2018-05-15 00:00:00',N'2018-05-15 23:30:00','11','AC',1
-- ===========================================================



CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Report_Raw_Data_Details_Dynamic](
 @Device_IDs varchar(500),
 @StoreStartDate date,
 @StoreEndDate date,
 @StartDateTime datetime = '1900-01-01 00:00:00',
 @EndDateTime datetime = '3000-01-01 23:59:59',
 @CarDataRecordType_IDs varchar(255) = '11',
 @ReportType char(2) = 'AC',   -- AC: cumulative  TC: Time Slice
 @LaneConfig_ID smallint = 1,
 @LinkedServerName VARCHAR(100) = 'POWCLOUDBI_UAT_R',
 @DatabaseName VARCHAR(100) ='db_qsrdrivethrucloud_ods_engdev'
)
AS

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
-- Getting the DeviceIds for the given StoreId
--SET @Device_IDs = (select dinf.Device_ID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));
--SET @Device_UID = (select dinf.Device_UID from tbl_DeviceInfo as dinf inner join tbl_Stores strs on dinf.Device_Store_ID = strs.Store_ID where dinf.Device_Store_ID IN (@StoreId));


-- report type is "Time Slice", then calculate each store date with the time slice
IF @ReportType = 'TC'
 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @StartDateTime, 14), CAST(d.ThisDate AS char(10)) + ' ' + CONVERT(varchar(15), @EndDateTime, 14)
 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d
ELSE
BEGIN
 -- report is 'Cumulative', apply the start time to the first day, and end time to the last day, any other days in between will be 24h
 INSERT INTO #DateTimeSlice(StoreDate, StartDateTime, EndDateTime)
 SELECT d.ThisDate, CAST(d.ThisDate AS char(10)) + ' 00:00:00', CAST(d.ThisDate AS char(10)) + ' 23:59:59'
 FROM dbo.uf_GetDatesByRange(@StoreStartDate, @StoreEndDate) d

 SET @MaxID = SCOPE_IDENTITY()

 UPDATE #DateTimeSlice
 SET StartDateTime = @StartDateTime
 WHERE id = 1

 UPDATE #DateTimeSlice
 SET EndDateTime = @EndDateTime
 WHERE id = @MaxID
END


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



SET @query ='INSERT INTO #CarDetectorData
	EXECUTE ['+@LinkedServerName+'].['+@DatabaseName+'].dbo.usp_HME_Cloud_Get_Report_Raw_Data_Test '''+@Device_IDs +''', '''+CONVERT(VARCHAR(20), @StoreStartDate,23) +''', '
	+ ''''+CONVERT(VARCHAR(20),@StoreEndDate,23) +''', ''' + CONVERT(VARCHAR(30),@StartDateTime, 21)+''', '''+ CONVERT(VARCHAR(30),@EndDateTime, 21) +''', '''+@CarDataRecordType_IDs+''', '''+ @ReportType+''''
	EXEC (@query)

-- add index to above temp table
CREATE NONCLUSTERED INDEX [IX_tbl_CarRecordData_Device_ID] ON #CarDetectorData
(
 Device_ID,
 StoreDate,
 CarDataRecord_ID,
 Detector_ID
) ON [PRIMARY]


SET @query = ''

-- SELECT *, RANK () OVER (ORDER BY Storedate,DepartTimeStamp) RawDataID FROM (
SELECT sdd.StoreDate,
  CAST(b.DepartTimeStamp AS DATETIME) AS DepartTimeStamp,
  sdd.Store_id,
  sdd.Store_Number,
  sdd.Device_UID,
  sdd.Device_ID,
  b.CarRecordDataType_Name,
  b.CarsInQueue,
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
   ORDER BY DepartTimeStamp
 
--Test
INSERT INTO #EventTypeNames 
SELECT 
  sdd.EventType_Category_ID, sdd.EventType_Name
FROM #CarDetectorData sdd
GROUP by sdd.EventType_Category_ID, sdd.EventType_Name
ORDER BY sdd.EventType_Category_ID asc


DECLARE @listStr VARCHAR(MAX)
SELECT  @listStr = COALESCE(@listStr+'|$|' ,'') + EventTypeName
FROM #EventTypeNames ORDER BY EventType_Category_ID
SELECT @listStr as 'EventTypeName'
--Test end

EXECUTE(@query);

SET @query = '';
SELECT a.Device_ID, b.Store_Number, b.Store_Name, c.Brand_Name, a.Device_LaneConfig_ID
   FROM tbl_DeviceInfo a
    LEFT JOIN tbl_Stores b WITH (NOLOCK) ON a.Device_Store_ID = b.Store_ID
    LEFT JOIN ltbl_Brands c WITH (NOLOCK) ON b.Store_Brand_ID = c.Brand_ID
   WHERE Device_ID IN (@Device_IDs)
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
