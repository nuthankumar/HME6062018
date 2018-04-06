-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_InsertReportTemplate
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
-- EXEC [dbo].[usp_InsertReportTemplate] values @AccountId ...
-- ===========================================================

ALTER PROCEDURE [dbo].[usp_InsertReportTemplate]
	@AccountId			INT,
	@Stores				VARCHAR(MAX),
	@TimeMeasure		INT,
	@FromDate			DATE,
	@ToDate				DATE,
	@OpenTime			VARCHAR(50),
	@CloseTime			VARCHAR(50),
	@Type				INT,
	@Open				BIT,
	@Close				BIT,
	@Include			VARCHAR(MAX),
	@Format				INT,
	@TemplateName		VARCHAR(50),
	@CreatedBy			INT,
	@UpdatedBy			INT,
	@CreatedDateTime	DATETIME,
	@UpdatedDateTime	DATETIME
AS

 INSERT INTO [dbo].[ReportTemplates] (
	AccountId ,
	Stores,
	TimeMeasure,
	FromDate,
	ToDate ,
	OpenTime ,
	CloseTime,
	[Type],
	[Open],
	[Close],
	[Include],
	[Format],
	TemplateName,
	CreatedBy,
	UpdatedBy,
	CreatedDateTime,
	UpdatedDateTime)
	 VALUES
	 (
	@AccountId ,
	@Stores,
	@TimeMeasure,
	@FromDate,
	@ToDate ,
	@OpenTime ,
	@CloseTime,
	@Type,
	@Open,
	@Close,
	@Include,
	@Format,
	@TemplateName,
	@CreatedBy,
	@UpdatedBy,
	@CreatedDateTime,
	@UpdatedDateTime
	 )
