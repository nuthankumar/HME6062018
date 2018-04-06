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
--  1.  	06-APRIL-2018	JAYARAM V	Procedure created
--	2.
-- ===========================================================
-- EXEC [dbo].[dbo].[usp_GetReportTemplateByID] @Id
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetReportTemplateByID]
	@Id INT
AS
BEGIN
	SET NOCOUNT ON;

	SELECT distinct [Id]
		  ,[AccountId]
		  ,[Stores]
		  ,[TimeMeasure]
		  ,[FromDate]
		  ,[ToDate]
		  ,[OpenTime]
		  ,[CloseTime]
		  ,[Type]
		  ,[Open]
		  ,[Close]
		  ,[Include]
		  ,[Format]
		  ,[TemplateName]
		  ,[CreatedBy]
		  ,[UpdatedBy]
		  ,[CreatedDateTime]
		  ,[UpdatedDateTime]  from [dbo].[ReportTemplates]
	WHERE @Id = Id
END