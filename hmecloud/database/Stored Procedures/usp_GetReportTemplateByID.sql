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
			ReportTemplate_ID AS [Id]
		  ,ReportTemplate_UID AS [Uid]
		  ,ReportTemplate_Time_Measure AS [TimeMeasure]
		  ,ReportTemplate_From_Date AS [FromDate]
		  ,ReportTemplate_To_Date AS [ToDate]
		  ,ReportTemplate_From_Time AS [OpenTime]
		  ,ReportTemplate_To_Time AS [CloseTime]
		  ,ReportTemplate_Type AS [Type]
		  ,ReportTemplate_Open AS [Open]
		  ,ReportTemplate_Close AS [Close]
		  ,ReportTemplate_Include_Stats AS [Include]
		  ,ReportTemplate_Format AS [Format]
		  ,ReportTemplate_Name AS [TemplateName]
		  ,ReportTemplate_CreatedBy AS [CreatedBy]
		  ,ReportTemplate_Session_UID AS SessionUid
		  ,ReportTemplate_Session_User_UID  AS UserUid
		  ,ReportTemplate_Device_UID AS Devices
		  ,ReportTemplate_Advanced_Op AS AdvancedOption
		  ,ReportTemplate_Include_Longs AS IncludeLongs
		  ,ReportTemplate_Created_DTS AS CreatedDateTime
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_ID = @Id
END

