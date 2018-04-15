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
-- EXEC [dbo].[dbo].[usp_GetReportTemplates] @AccountId and
-- @createdBy
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_GetReportTemplates]
	 @UserUid VARCHAR(32)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT
		ReportTemplate_ID [Id]
		,ReportTemplate_UID AS [Uid]
		,ReportTemplate_Name AS [TemplateName]
	FROM [dbo].[stbl_ReportTemplates]
	WHERE ReportTemplate_Session_User_UID = @UserUid
END