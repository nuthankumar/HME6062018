const repository = require('./Repository')
const sqlQuery = require('../Common/DataBaseQueries')

const sql = require('mssql')

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

const saveMasterSettings = (input, callback) => {
  repository.executeProcedure(sqlQuery.MasterSetting.saveStatus, request => {
    return request
      .input(sqlQuery.MasterSettingsSave.Parameters.SourceDevice_UID, sql.VarChar(36), input.duid)
      .input(sqlQuery.MasterSettingsSave.Parameters.DestinationDevice_IDS, sql.VarChar(4000), input.destinationList)
      .input(sqlQuery.MasterSettingsSave.Parameters.Group_IDS, sql.VarChar(36), input.settingsList)
      .input(sqlQuery.MasterSettingsSave.Parameters.CreatedBy, sql.VarChar(36), input.userEmailId)
  }, callback)
}

const checkMergeDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.merge.getStatus, request => {
    return request
      .input(sqlQuery.merge.Parameters.StoreUid, sql.VarChar(36), input.suids)
      .input(sqlQuery.merge.Parameters.DeviceUid, sql.VarChar(36), input.duid)
  }, callback)
}

const mergeDevicesInfo = (input, callback) => {
  repository.executeProcedure(sqlQuery.merge.getStatus, request => {
    return request
      .input(sqlQuery.merge.Parameters.StoreUid, sql.VarChar(36), input.suids)
      .input(sqlQuery.merge.Parameters.DeviceUid, sql.VarChar(36), input.duid)
  }, callback)
}

// Todo: saveMergeDevices Store Procedure
const saveMergeDevices = (input, callback) => {
  repository.executeProcedure(sqlQuery.DeviceStatus.getStatus, request => {
    return request
      .input(sqlQuery.DeviceIds.Parameters.Device_IDs, sql.VarChar(36), input.duid)
  }, callback)
}

// Todo: unRegisterDevicesSearch Store Procedure
const unRegisterDevicesSearch = (input, callback) => {
  repository.executeProcedure(sqlQuery.Device.getunRegisterDevices, request => {
    return request
      .input(sqlQuery.util.Parameters.criteria, sql.VarChar(100), input.criteria)
      .input(sqlQuery.util.Parameters.filter, sql.VarChar(50), input.filter)
      .input(sqlQuery.util.Parameters.SortingColumnName, sql.VarChar(100), input.SortingColumnName)
      .input(sqlQuery.util.Parameters.SortingType, sql.VarChar(5), input.SortingType)
      .input(sqlQuery.util.Parameters.RecordPerPage, sql.SmallInt, input.RecordPerPage)
      .input(sqlQuery.util.Parameters.PageNumber, sql.SmallInt, input.PageNumber)
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
    return request
      .input(sqlQuery.Device.Parameters.Device_UIDs, sql.VarChar(500), input.suid)
  }, callback)
}

/**
 *
 * @param {*} input
 * @param {*} callback
 */
const saveStoreDetails = (input, callback) => {

  repository.executeProcedure(sqlQuery.Stores.saveStoreDetails, request => {
  
    return request
      .input(sqlQuery.Stores.Parameters.isAdmin, sql.Int, input.isAdmin)
      .input(sqlQuery.Stores.Parameters.Store_UID, sql.VarChar(32), input.suid)
      .input(sqlQuery.Stores.Parameters.Company_ID, sql.Int, input.companyId)
      // .input(sqlQuery.Stores.Parameters.AzureData, sql.VarChar(1000), input.AzureData)
      .input(sqlQuery.Stores.Parameters.Store_ID, sql.Int, input.storeID)
      .input(sqlQuery.Stores.Parameters.timeZone, sql.NVarChar(200), input.timeZone)
  }, callback)
}

module.exports = {
  settingsDevices,
  settingsStores,
  getMasterSettings,
  saveMasterSettings,
  saveMergeDevices,
  getStores,
  getStoreByUid,
  removeDeviceById,
  checkMergeDevices,
  mergeDevicesInfo,
  unRegisterDevicesSearch,
  saveStoreDetails
}
