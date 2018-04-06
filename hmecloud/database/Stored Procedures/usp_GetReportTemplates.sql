-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetReportTemplates
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Create a Report Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V	Procedure created
--	2.
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

	SELECT [Id]
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
	WHERE AccountId = @AccountId and  CreatedBy = @CreatedBy
END