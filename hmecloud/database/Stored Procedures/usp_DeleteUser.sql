
/****** Dropping the StoredProcedure [dbo].[usp_DeleteUser] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_DeleteUser' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_DeleteUser]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_DeleteUser
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Delete user by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_DeleteUser] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_DeleteUser]
    @Uid				VARCHAR(32)
AS
BEGIN

DELETE FROM tbl_Users WHERE User_UID=@Uid

END



