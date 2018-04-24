
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
DECLARE @IsUserDeleted INT = 0
DECLARE @UserId INT = 0

SET @UserId = 
	(SELECT [User_ID] 
	FROM 
		tbl_Users 
	WHERE  User_UID=@Uid)

IF(@UserId IS NOT NULL)
	BEGIN

    DELETE urol
FROM itbl_User_Role urol
        INNER JOIN tbl_Users usrs ON usrs.[User_ID] = urol.[User_ID]
        LEFT JOIN tbl_Roles lrol ON lrol.Role_ID = urol.Role_ID
WHERE usrs.User_UID =@Uid

    DELETE urol
	FROM
        tbl_Users usrs
        INNER JOIN itbl_User_Store urol ON usrs.[User_ID] = urol.[User_ID]
    WHERE usrs.User_UID=@Uid

    DELETE FROM tbl_Users WHERE User_UID=@Uid
	SET @IsUserDeleted = @UserId

	SELECT @IsUserDeleted IsUserDeleted
	END
	ELSE
	SELECT @IsUserDeleted IsUserDeleted

END
GO