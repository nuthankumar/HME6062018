
/****** Dropping the Table [dbo].[Group] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'Group' AND [type] ='U'))
	DROP TABLE [dbo].[Group]
GO

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
-- 1.		13/04/2018		Swathi Kumar	Added Subtotal calculation
-- ===========================================================
-- 
-- ===========================================================

CREATE TABLE [dbo].[Group](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupName] [varchar](50) NOT NULL,
	[Description] [varchar](250) NULL,
	[AccountId] [int] NOT NULL,
	[CreatedBy] [varchar](50) NOT NULL,
	[UpdatedBy] [varchar](50) NOT NULL,
	[CreatedDateTime] [date] NOT NULL,
	[UpdatedDateTime] [date] NOT NULL,
	[ParentGroup] [int] NULL,
 CONSTRAINT [PK_Group] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[Group]  WITH CHECK ADD  CONSTRAINT [FK_Group_Parent_Group] FOREIGN KEY([ParentGroup])
REFERENCES [dbo].[Group] ([Id])
GO

ALTER TABLE [dbo].[Group] CHECK CONSTRAINT [FK_Group_Parent_Group]
GO