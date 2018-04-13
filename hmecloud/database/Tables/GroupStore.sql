-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	GroupStore
-- Author		:	Swathi Kumar
-- Created		:	12-April-2018
-- Tables		:	GroupStore
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

CREATE TABLE [dbo].[GroupStore](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GroupId] [int] NOT NULL,
	[StoreId] [int] NULL,
 CONSTRAINT [PK_GroupStore] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[GroupStore]  WITH CHECK ADD  CONSTRAINT [FK_Group_GroupStore] FOREIGN KEY([GroupId])
REFERENCES [dbo].[Group] ([Id])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[GroupStore] CHECK CONSTRAINT [FK_Group_GroupStore]
GO

ALTER TABLE [dbo].[GroupStore]  WITH CHECK ADD  CONSTRAINT [FK_GroupStore_Store] FOREIGN KEY([StoreId])
REFERENCES [dbo].[tbl_Stores] ([Store_ID])
ON DELETE CASCADE
GO

ALTER TABLE [dbo].[GroupStore] CHECK CONSTRAINT [FK_GroupStore_Store]
GO


