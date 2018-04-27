
/****** Dropping the StoredProcedure [dbo].[usp_HME_Cloud_Get_Device_Goals_Details] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_HME_Cloud_Get_Device_Goals_Details' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_HME_Cloud_Get_Device_Goals_Details]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_HME_Cloud_Get_Report_By_Daypart_Details
-- Author		:	Ramesh Kumar
-- Created		:	26-March-2018
-- Purpose		:	To Generate a Day part report
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------

-- ===========================================================
--EXEC usp_HME_Cloud_Get_Device_Goals '14'
-- ===========================================================
CREATE PROCEDURE [dbo].[usp_HME_Cloud_Get_Device_Goals_Details](
	@Device_IDs varchar(500)
)
AS
BEGIN
	/*
		Copyright (c) 2015 HME, Inc.

		Author:
			Wells Wang (2015-01-30)

		Description:
			This proc is used for pull device master goals then pivots the results by event-goal combo

		Parameters:
			@Device_IDs: required. a list of device id's separated by comma

		Usage:
			EXECUTE dbo.usp_HME_Cloud_Get_Device_Goals @Device_IDs

		Documentation:
			The proc uses UDF uf_GetDeviceGoals to pull master goals then pivots the results

		Based on:
			New
		Depends on:
			dbo.uf_GetDeviceGoals 
		Depends on me:
			/hmecloud/_dat_reports_prep.cfm
	*/

	SET TRANSACTION ISOLATION LEVEL READ UNCOMMITTED
	SET NOCOUNT ON

	DECLARE @cols NVARCHAR(2000)
	DECLARE @query NVARCHAR(3000)
	DECLARE @header TABLE(headerName varchar(25), sort smallint)
	DECLARE @goals TABLE(goalName varchar(25))
	DECLARE @headerSourceCol varchar(50)

	-- populate goals
	INSERT INTO @goals
	SELECT	'GoalA'
	UNION
	SELECT	'GoalB'
	UNION 
	SELECT	'GoalC'
	UNION
	SELECT	'GoalD'

	-- single device: using event name as header
	-- multi device: using category name as header
	IF EXISTS(SELECT 1 FROM dbo.Split(@Device_IDs, ',') HAVING MAX(id) > 1)
	BEGIN
		INSERT INTO @header
		SELECT	DISTINCT Category_Name, Sort
		FROM	dbo.uf_GetDeviceGoals(@Device_IDs)

		SET @headerSourceCol = 'Category_Name'
	END
	ELSE
	BEGIN
		INSERT INTO @header
		SELECT	EventType_Name, Sort
		FROM	dbo.uf_GetDeviceGoals(@Device_IDs)

		SET @headerSourceCol = 'EventType_Name'
	END
	-- construct column names
	SELECT  @cols = COALESCE(@cols + ',[' + headerName + ' - ' + goalName + ']', '[' + headerName + ' - ' + goalName + ']')
	FROM    @header
			CROSS JOIN @goals
	ORDER BY Sort;

	IF (ISNULL(@cols,'') <>'')
	BEGIN
		SET @query = N'

		WITH	DeviceGoalUnpivot
		AS
		(
			SELECT Device_ID,' + @headerSourceCol + ', GoalType, GoalValue
			FROM
			(
				SELECT	Device_ID,' + @headerSourceCol + ', GoalA, GoalB, GoalC, GoalD
				FROM	dbo.uf_GetDeviceGoals(''' + @Device_IDs + ''')
			) AS up
			UNPIVOT
			(
				GoalValue
				FOR GoalType IN (GoalA, GoalB, GoalC, GoalD)
			) AS unpvt
		)
		SELECT	* INTO #tmp
		FROM	
		(
			SELECT	Device_ID,' +
					@headerSourceCol + ' + '' - '' + GoalType AS EventGoal,
					GoalValue
			FROM	DeviceGoalUnpivot
		) AS Event_Goal
		PIVOT(
			MAX(GoalValue)
			FOR EventGoal IN (' + @cols + ')
		) AS p
		IF EXISTS(SELECT * FROM #tmp)
			SELECT * FROM #tmp
		ELSE
			SELECT	NULL Device_ID, NULL GoalType, NULL GoalValue
		'
		END
	ELSE
	BEGIN
		SET @query = N'SELECT	NULL Device_ID, NULL GoalType, NULL GoalValue'
	END

	EXECUTE(@query)
	PRINT @query
	RETURN(0)
END