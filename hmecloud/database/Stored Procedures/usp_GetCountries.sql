
/****** Dropping the StoredProcedure [dbo].[usp_GetCountries] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetCountries' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetCountries]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetCountries
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	ltbl_Countries
-- Purpose		:	Get Countries
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	17-MAY-2018	Selvendran K	Procedure created

-- ===========================================================
-- EXEC [dbo].[usp_GetCountries] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetCountries]    
AS
BEGIN


    SELECT DISTINCT Country_ID Id, Country_Name [Name], Country_Abbr Abbreviation
    FROM
        ltbl_Countries        
    ORDER BY Country_Name
END
