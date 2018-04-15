-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportTemplateByID
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Get Report Templates By Id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V		Procedure created
--	2.		13-April-2018	Selvendran K	modified to actual correct table 		
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_GetReportTemplateByID] @Id
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetReportTemplateByID]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT distinct 
			ReportTemplate_ID AS [id]
		  ,ReportTemplate_UID AS [uid]
		  ,ReportTemplate_Time_Measure AS [timeMeasure]
		  ,ReportTemplate_From_Date AS [fromDate]
		  ,ReportTemplate_To_Date AS [toDate]
		  ,ReportTemplate_From_Time AS [openTime]
		  ,ReportTemplate_To_Time AS [closeTime]
		  ,ReportTemplate_Type AS [type]
		  ,ReportTemplate_Open AS [open]
		  ,ReportTemplate_Close AS [close]
		  ,ReportTemplate_Include_Stats AS [systemStatistics]
		  ,ReportTemplate_Format AS [format]
		  ,ReportTemplate_Name AS [templateName]
		  ,ReportTemplate_CreatedBy AS [createdBy]
		  ,ReportTemplate_Session_UID AS sessionUid
		  ,ReportTemplate_Session_User_UID  AS userUid
		  ,ReportTemplate_Device_UID AS devices
		  ,ReportTemplate_Advanced_Op AS advancedOption
		  ,ReportTemplate_Include_Longs AS longestTime
		  ,ReportTemplate_Created_DTS AS createdDateTime
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_ID = @Id
END

