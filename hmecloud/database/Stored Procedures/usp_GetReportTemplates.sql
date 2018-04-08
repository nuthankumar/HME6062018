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
--  1.  	06-APRIL-2018	JAYARAM V	Procedure created
--	2.      08-APRIL-2018   JAYARAM V	Changed the Query
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_GetReportTemplates] @AccountId and
-- @createdBy
-- ===========================================================


CREATE PROCEDURE [dbo].[usp_GetReportTemplates]
	@AccountId INT,
	@CreatedBy INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT DISTINCT[Id]
		  ,[TemplateName]
		   from [dbo].[ReportTemplates]
	WHERE AccountId = @AccountId and  CreatedBy = @CreatedBy
END