--TODO: This has to be  removed because the table exists in 
-- application. This is a temporary table
-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	ReportTemplates
-- Author		:	Swathi Kumar
-- Created		:	12-April-2018
-- Tables		:	ReportTemplates
-- Purpose		:	To update a one of the existing Group
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.       12-April-2018   Swathi Kumar    Table Created
-- ===========================================================
-- 
-- ===========================================================
CREATE TABLE [dbo].[ReportTemplates]
(
    [Id]				INT				NOT NULL IDENTITY(1,1),
    [AccountId]			INT				NOT NULL,
    [Stores]			VARCHAR(MAX)	NOT NULL,
    [TimeMeasure]		INT				NOT NULL,
    [FromDate]			DATE			NOT NULL,
    [ToDate]			DATE			NOT NULL,
    [OpenTime]			VARCHAR(50)		NULL,
    [CloseTime]			VARCHAR(50)		NULL,
    [Type]				INT				NULL,
    [Open]				BIT				NULL,
    [Close]				BIT				NULL,
    [Include]			VARCHAR(MAX)	NULL,
    [Format]			INT				NULL,
    [TemplateName]		VARCHAR(50)		NULL,
    [CreatedBy]			INT				NOT NULL,
    [UpdatedBy]			INT				NULL,
    [CreatedDateTime]	DATETIME		NOT NULL,
    [UpdatedDateTime]	DATETIME		NULL,
    CONSTRAINT [PK_ReportTemplates] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
