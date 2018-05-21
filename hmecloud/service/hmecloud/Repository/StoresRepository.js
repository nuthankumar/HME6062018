import { max } from 'moment';

const repository = require('./Repository')
const dataBase = require('../DataBaseConnection/Configuration').db
const dataBaseSql = require('../DataBaseConnection/Configuration').sqlConfig
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')

/**
 *
 * @param {*} JSON input template for calling Procedure
 * @param {*} callback
 */
const getRawCarDataReport = (template, callback) => {
  repository.execute(sqlQuery.SummarizedReport.getRawData, {
    replacements: template,
    type: dataBase.QueryTypes.SELECT
  }, result => callback(result))
}

const getDayDataReport = (input, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }

    sqlPool.request()
      .input('Device_IDs', sql.VarChar(500), input.ReportTemplate_DeviceIds.toString())
      .input('StoreStartDate', sql.Date, input.ReportTemplate_From_Date)
      .input('StoreEndDate', sql.Date, input.ReportTemplate_To_Date)
      .input('InputStartDateTime', sql.NVarChar(50), input.FromDateTime)
      .input('InputEndDateTime', sql.NVarChar(50), input.ToDateTime)
      // .input('CarDataRecordType_ID', sql.SmallInt, input.CarDataRecordType_ID)
      .input('ReportType', sql.Char, input.ReportTemplate_Type)
      .input('UserUID', sql.NVarChar(50), input.userUid)
      .execute('usp_HME_Cloud_Get_Report_By_Date_Details', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          callback(output)
        }
        if (result && result.recordsets) {
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}
/**
 * The method can be used to execute get Report Template
 * @param  {template} template input from controller
 * @param  {funct} callback Function will be called once the input executed.
 * @public
 */
const getWeekReport = (template, callback) => {
  const output = {}
  const sqlPool = new sql.ConnectionPool(dataBaseSql, err => {
    if (err) {
      output.data = err
      output.status = false
      callback(output)
    }
    sqlPool.request()
      .input('Device_IDs', sql.VarChar(500), template.Device_IDs)
      .input('StoreStartDate', sql.Date, template.StoreStartDate)
      .input('StoreEndDate', sql.Date, template.StoreEndDate)
      .input('InputStartDateTime', sql.NVarChar(50), template.StartDateTime)
      .input('InputEndDateTime', sql.NVarChar(50), template.EndDateTime)
      // .input('CarDataRecordType_ID', sql.SmallInt, template.CarDataRecordType_ID)
      .input('ReportType', sql.Char, template.ReportType)
      .input('LaneConfig_ID', sql.TinyInt, template.LaneConfig_ID)
      .input('UserUID', sql.NVarChar(50), template.UserUID)
      .execute('usp_HME_Cloud_Get_Report_By_Week_Details', (err, result) => {
        if (err) {
          output.data = err
          output.status = false
          console.log(err)
          callback(output)
        }
        if (result && result.recordsets) {
          //  console.log("result.recordsets",result.recordsets)
          output.data = result.recordsets
          output.status = true
          callback(output)
        }
      })
  })

  sqlPool.on('error', err => {
    if (err) {
      callback(err)
    }
  })
}

const settingsDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceUid.Parameters.DeviceUid, sql.VarChar(36), input.duid)
  }, callback)
}

// Todo: SettingStores Store Procedure
const settingsStores = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(36), input.duid)
  }, callback)
}

// Todo: getMasterSettings Store Procedure
const getMasterSettings = (input, callback) => {
  repository.executeProcedure(sqlQuery.MasterSetting.getStatus, request => {
    return request
      .input(sqlQuery.MasterSettingsIds.Parameters.Device_ID, sql.VarChar(36), input.Device_ID)
      .input(sqlQuery.MasterSettingsIds.Parameters.Device_LaneConfig_ID, sql.TinyInt, input.Device_LaneConfig_ID)
      .input(sqlQuery.MasterSettingsIds.Parameters.Device_MainVersion, sql.VarChar(36), input.Device_MainVersion)
      .input(sqlQuery.MasterSettingsIds.Parameters.Store_Company_ID, sql.Int, input.Store_Company_ID)
      .input(sqlQuery.MasterSettingsIds.Parameters.Store_Brand_ID, sql.Int, input.Store_Brand_ID)
  }, callback)
}

// Todo: saveMasterSettings Store Procedure
const saveMasterSettings = (input, callback) => {
  repository.executeProcedure(sqlQuery.MasterSetting.saveStatus, request => {
    return request
      .input(sqlQuery.MasterSettingsSave.Parameters.Task_UID, sql.VarChar(36), input.Task_UID)
      .input(sqlQuery.MasterSettingsSave.Parameters.DestinationDevice_IDS, sql.VarChar(max), input.destinationList)
      .input(sqlQuery.MasterSettingsSave.Parameters.SourceDevice_UID, sql.VarChar(36), input.settingsList)
  }, callback)
}

// Todo: saveMergeDevices Store Procedure
const saveMergeDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(36), input.duid)
  }, callback)
}

const getStores = (input, callback) => {
  repository.executeProcedure(sqlQuery.Stores.getAllStores, request => {
    return request
      .input(sqlQuery.Stores.Parameters.User_UID, sql.VarChar(32), input.userUid)
      .input(sqlQuery.Stores.Parameters.isAdmin, sql.Int, input.isAdmin)
      .input(sqlQuery.Stores.Parameters.criteria, sql.VarChar(100), input.criteria)
      .input(sqlQuery.Stores.Parameters.filter, sql.VarChar(100), input.filter)
      .input(sqlQuery.Stores.Parameters.SortingColumnName, sql.VarChar(50), input.column)
      .input(sqlQuery.Stores.Parameters.SortingType, sql.VarChar(5), input.sortType)
      .input(sqlQuery.Stores.Parameters.RecordPerPage, sql.Int, input.per)
      .input(sqlQuery.Stores.Parameters.PageNumber, sql.Int, input.pno)
  }, callback)
}

/**
 *
 * @param {*} input
 * @param {*} callback
 */
const getStoreByUid = (input, callback) => {
  repository.executeProcedure(sqlQuery.Stores.getStoreDetailsByUID, request => {
    return request
      .input(sqlQuery.Stores.Parameters.Store_UID, sql.VarChar(32), input.suid)
  }, callback)
}

/**
 *
 * @param {*} input
 * @param {*} callback
 */
const removeDeviceById = (input, callback) => {
  repository.executeProcedure(sqlQuery.Device.removeByDUID, request => {
    console.log(input)
    return request
      .input(sqlQuery.Device.Parameters.Device_UIDs, sql.VarChar(500), input.suid)
  }, callback)
}

module.exports = {
  getRawCarDataReport,
  getDayDataReport,
  getWeekReport,
  settingsDevices,
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  saveMergeDevices,
  getStores,
  getStoreByUid,
  removeDeviceById
}
