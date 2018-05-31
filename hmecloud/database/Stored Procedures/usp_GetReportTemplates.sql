
/****** Dropping the StoredProcedure [dbo].[usp_GetReportTemplates] if already exists *****/
IF (EXISTS(SELECT * FROM sys.objects WHERE [name] = 'usp_GetReportTemplates' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetReportTemplates]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportTemplates
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Get all Report Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V		Procedure created
--	2.      08-APRIL-2018   JAYARAM V		Changed the Query
--	3.		13-April-2018	Selvendran K	modified to actual correct table
-- ===========================================================
-- EXEC [dbo].[usp_GetReportTemplates] @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetReportTemplates]
	 @UserUid VARCHAR(32)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		ReportTemplate_ID [id]
		,ReportTemplate_UID AS [uid]
		,ReportTemplate_Name AS [templateName]
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_Session_User_UID = @UserUid 
	AND ReportTemplate_Name IS NOT NULL 
	AND ReportTemplate_Name <>''
END
GO