
/****** Dropping the StoredProcedure [dbo].[usp_GetBrands] if already exists *****/
IF (EXISTS(SELECT *
FROM sys.objects
WHERE [name] = 'usp_GetBrands' AND [type] ='P'))
	DROP PROCEDURE [dbo].[usp_GetBrands]
GO

-- ===========================================================
--      Copyright © 2018, HME, All Rights Reserved
-- ===========================================================
-- Name			:	usp_GetBrands
-- Author		:	Selvendran K
-- Created		:	20-APRIL-2018
-- Tables		:	ltbl_Brands
-- Purpose		:	Get Brands
-- ===========================================================
--				Modification History
-- -----------------------------------------------------------
-- Sl.No.	Date			Developer		Descriptopn
-- -----------------------------------------------------------
--  1.  	17-MAY-2018	Selvendran K	Procedure created

-- ===========================================================
-- EXEC [dbo].[usp_GetBrands] 
-- ===========================================================

CREATE PROCEDURE [dbo].[usp_GetBrands]
AS
BEGIN

    SELECT DISTINCT 
	Brand_ID Id,
	Brand_UID  [Uid],
	Brand_Name [Name],
	Brand_Letter [Letter]
    FROM
        ltbl_Brands        
    ORDER BY Brand_Name
END
