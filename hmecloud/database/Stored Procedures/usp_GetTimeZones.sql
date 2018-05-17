
/****** Dropping the StoredProcedure [dbo].[usp_GetTimeZones] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetTimeZones' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetTimeZones]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	Azure_TimeZones
-- Author		:	Selvendran K
-- Created		:	17-MAY-2018
-- Tables		:	ltbl_Brands
-- Purpose		:	Get TimeZones
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	17-MAY-2018	Selvendran K	Procedure created

-- ===========================================================
-- EXEC [dbo].[usp_GetTimeZones] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetTimeZones]
AS
BEGIN


    SELECT DISTINCT 

	TZ_ID Id,
	Name,
	Windows_TZ_Name
    FROM
        Azure_TimeZones        
    ORDER BY Name
END
