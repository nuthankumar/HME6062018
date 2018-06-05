
/**
 * get all validate method to validate the arguments which has been passed
 * to controller is valida or not
 * @param  {endpoint} getAll webservice name
 * @param  {request} request  from  user request
 * @param  {response} callback Function will be called once the request executed.
 * @public
 */

const validateDevice = (input, callback) => {
  if (!input.duid) {
    let output = {}
    output.key = 'requiredDuid'
    output.status = false
    callback(output)
  }
  if (input.duid) {
    callback()
  }
}

const validateMasterSettings = (input, callback) => {
  if (!input.deviceId && !input.Device_LaneConfig_ID && !input.Device_MainVersion && !input.Store_Company_ID && !input.Store_Brand_ID) {
    let output = {}
    if (!input.deviceId) {
      output.key = 'requiredDeviceId'
    }
    if (input.deviceId && !input.Device_LaneConfig_ID) {
      output.key = 'requiredLaneConfigId'
    }
    if (input.deviceId && input.Device_LaneConfig_ID && !input.Device_MainVersion) {
      output.key = 'requiredMainVersion'
    }
    if (input.deviceId && input.Device_LaneConfig_ID && input.Device_MainVersion && !input.Store_Company_ID) {
      output.key = 'requiredComponyId'
    }
    if (input.deviceId && input.Device_LaneConfig_ID && input.Device_MainVersion && input.Store_Company_ID && !input.Store_Brand_ID) {
      output.key = 'requiredBrandId'
    }
    output.status = false
    callback(output)
  } else {
    callback()
  }
}

const saveMasterSettings = (input, callback) => {
  if (!input.Task_UID && !input.duid && !input.settingsList && !input.destinationList) {
    let output = {}
    if (!input.userEmailId) {
      output.key = 'requiredEmailId'
    }
    if (input.userEmailId && !input.duid) {
      output.key = 'requiredDuid'
    }
    if (input.userEmailId && input.duid && !input.settingsList) {
      output.key = 'requiredSettingsList'
    }
    if (input.userEmailId && input.duid && input.settingsList && !input.destinationList) {
      output.key = 'requiredDestinationList'
    }
    output.status = false
    callback(output)
  } else {
    callback()
  }
}

const mergePreValidator = (input, callback) => {
  console.lo
  if (!input.suids && !input.duid) {
    let output = {}
    output.key = !input.suids ? 'requiredStoreId' : 'requiredDeviceUid'
    output.status = false
    callback(output)
  }
  if (input.suids || input.duid) {
    callback()
  }
}

const unRegisterDevicesSearch = (input, callback) => {
  let output = {}
  if (!input.PageNumber && !input.RecordPerPage && !input.filter) {
    if (!input.PageNumber) {
      output.key = 'requiredPageNumber'
    }
    if (input.RecordPerPage && !input.RecordPerPage) {
      output.key = 'requiredPerPageItems'
    }
    if (input.page && input.perPage && !input.filter) {
      output.key = 'requiredFilter'
    }
    output.status = false
    callback(output)
  }
  callback()
}

module.exports = {
  validateDevice,
  validateMasterSettings,
  saveMasterSettings,
  mergePreValidator,
  unRegisterDevicesSearch
}
