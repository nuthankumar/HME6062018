-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteGroupByGroupId
-- Author		:	Swathi Kumar
-- Created		:	6-April-2018
-- Tables		:	Group,GroupStore
-- Purpose		:	To Delte the Group and GroupStore records
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
-- 1.
-- ===========================================================
-- EXEC [dbo].[usp_DeleteGroupByGroupId] @@GroupId = 126
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteGroupByGroupId]
	@GroupId INT
AS 
BEGIN
 DECLARE @NumOfRecordsDeleted AS int;
SET @NumOfRecordsDeleted = 0;

update [Group] SET ParentGroup=NULL WHERE ParentGroup = @GroupId;

DELETE FROM GroupStore WHERE GroupId=@GroupId;

DELETE FROM [Group] WHERE Id = @GroupId;

SELECT @NumOfRecordsDeleted = @@ROWCOUNT;
SELECT @NumOfRecordsDeleted AS deletedRecords;
END
GO


