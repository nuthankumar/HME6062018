-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteReportTemplate
-- Author		:	JAYARAM V
-- Created		:	06-APRIL-2018
-- Tables		:	ReportTemplates
-- Purpose		:	Create a Delete Template
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	06-APRIL-2018	JAYARAM V	Procedure created
--	2.
-- ===========================================================
-- EXEC [dbo].[usp_DeleteReportTemplate] @Id = 1
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteReportTemplates]
	@Id INT
AS

DELETE FROM [dbo].[ReportTemplates]
      WHERE @Id = Id
