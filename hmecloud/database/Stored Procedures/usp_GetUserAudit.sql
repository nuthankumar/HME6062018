
/****** Dropping the StoredProcedure [dbo].[usp_GetUserAudit] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetUserAudit' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetUserAudit]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetUserByEmail
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	tbl_Users
-- Purpose		:	Get user audit by id
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn   
-- -----------------------------------------------------------
--  1.  	20-APRIL-2018	Selvendran K	Procedure created
--	
-- ===========================================================
-- EXEC [dbo].[usp_GetUserAudit] @UserUid='CEO7JK0VUSRJZFXXC0J1WW0I0E4CHD2M'
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetUserAudit]
    @UserUid				VARCHAR(32), 
	@PageNumber				INT = 1,  
	@PageSize				INT = 1000
AS
BEGIN

   WITH Get_User_Audit
    AS
    (
        SELECT	--TOP 1000 
        		au.Audit_LastLogin,
                au.Audit_Action,
                [action_pos] = CHARINDEX('st=', au.Audit_Action),
                [action_len] = CHARINDEX('&', au.Audit_Action, CHARINDEX('st=', au.Audit_Action)) - CHARINDEX('st=', au.Audit_Action) - 3,
                [first_&_pos] = CHARINDEX('&', au.Audit_Action)
        FROM 	dbo.dtbl_Audit_User au WITH (NOLOCK)
        INNER JOIN tbl_Users u ON u.[User_ID] = au.Audit_User_ID
		WHERE u.User_UID=@UserUid
        AND		au.Audit_LastLogin > DateAdd(month, -3, GetDate())
		ORDER BY Audit_LastLogin
		OFFSET @PageSize * (@PageNumber - 1) ROWS
		FETCH NEXT @PageSize ROWS ONLY
    )
    SELECT	Audit_LastLogin,
            Audit_Action,
            [audit_page] = CASE LEFT(Audit_Action, 3) WHEN 'pg=' THEN SUBSTRING(Audit_Action, 4, IIF([first_&_pos]>0, [first_&_pos]-4, LEN(Audit_Action))) ELSE '' END,
            [page_action] = CASE [action_pos] WHEN 0 THEN '' ELSE IIF(PATINDEX('%&st=%&%', Audit_Action)=0, RIGHT(Audit_Action, (LEN(Audit_Action)-[action_pos]-2)), SUBSTRING(Audit_Action, [action_pos]+3, [action_len])) END
    FROM	Get_User_Audit
    ORDER BY Audit_LastLogin DESC


END

