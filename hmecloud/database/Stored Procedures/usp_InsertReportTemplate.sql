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
	--	2.		16-APRIL-2018	Swathi KUmar Validation included
	-- ===========================================================
	-- EXEC [dbo].[usp_InsertReportTemplate] @AccountId = 100
	-- ===========================================================

	CREATE PROCEDURE [dbo].[usp_InsertReportTemplate]
	@Uid				VARCHAR(32),
	@TemplateName		VARCHAR(MAX),
	@SessionUid			VARCHAR(32),
	@UserUid			VARCHAR(32),
	@Devices			VARCHAR(MAX),
	@TimeMeasure		VARCHAR(50),
	@FromDate			DATE,
	@OpenTime			TIME(7),
	@ToDate				DATE,
	@CloseTime			TIME(7),
	@Open				TINYINT,
	@Close				TINYINT,
	@Type				VARCHAR(50),
	@AdvancedOption		TINYINT,
	@IncludeStats		TINYINT,
	@IncludeLongs		TINYINT,
	@Format				VARCHAR(50),
	@CreatedDateTime	DATETIME,
	@CreatedBy			VARCHAR(50)
AS 
BEGIN
DECLARE @IsTemplateExist int = 0

IF EXISTS ( SELECT 1
		FROM 
			[dbo].[stbl_ReportTemplates] 
		WHERE 
			ReportTemplate_Name = @TemplateName 
		AND 
			ReportTemplate_CreatedBy = @CreatedBy
		)
	BEGIN
		SET @IsTemplateExist =1 
	END
Else
	BEGIN

	 INSERT INTO [dbo].[stbl_ReportTemplates] (
	
		ReportTemplate_UID
		,ReportTemplate_Name
		,ReportTemplate_Session_UID
		,ReportTemplate_Session_User_UID 
		,ReportTemplate_Device_UID 
		,ReportTemplate_Time_Measure 
		,ReportTemplate_From_Date 
		,ReportTemplate_From_Time 
		,ReportTemplate_To_Date 
		,ReportTemplate_To_Time 
		,ReportTemplate_Open 
		,ReportTemplate_Close 
		,ReportTemplate_Type 
		,ReportTemplate_Advanced_Op 
		,ReportTemplate_Include_Stats 
		,ReportTemplate_Include_Longs 
		,ReportTemplate_Format 
		,ReportTemplate_Created_DTS 
		,ReportTemplate_CreatedBy

		) 
		 VALUES 
		 (
			@Uid,
			@TemplateName,
			@SessionUid,
			@UserUid,
			@Devices,
			@TimeMeasure,
			@FromDate,
			@OpenTime,
			@ToDate,	
			@CloseTime,
			@Open,
			@Close,
			@Type,
			@AdvancedOption,
			@IncludeStats,
			@IncludeLongs,
			@Format,	
			@CreatedDateTime,
			@CreatedBy
		 )
		 SET @IsTemplateExist = @@IDENTITY
	END
	SElECT @IsTemplateExist IsRecordInserted 
END
GO


