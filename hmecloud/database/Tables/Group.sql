-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	Group
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group
-- Purpose		:	To update a one of the existing Group
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- 
-- ===========================================================

CREATE TABLE [dbo].[Group]
(
    [Id]                INT				NOT NULL IDENTITY(1,1),
    [GroupName]         VARCHAR(50)		NOT NULL,
    [Description]       VARCHAR(250)	NULL,
    [AccountId]         INT				NOT NULL,
    [CreatedBy]         VARCHAR(50)		NOT NULL,
    [UpdatedBy]         VARCHAR(50)		NOT NULL,
    [CreatedDateTime]   DATE			NOT NULL,
    [UpdatedDateTime]   DATE			NOT NULL,
    [ParentGroup]       INT				NULL,
    CONSTRAINT [PK_Group] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO