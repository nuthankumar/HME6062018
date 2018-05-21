const validator = require('validator')
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
      if(!input.deviceId) {
        output.key = 'requiredDeviceId'
      }
      if(input.deviceId && !input.Device_LaneConfig_ID) {
        output.key = 'requiredLaneConfigId'
      }
      if(input.deviceId && input.Device_LaneConfig_ID && !input.Device_MainVersion ) {
        output.key = 'requiredMainVersion'
      }
      if(input.deviceId && input.Device_LaneConfig_ID && input.Device_MainVersion && !input.Store_Company_ID) {
        output.key = 'requiredComponyId'
      }
      if(input.deviceId && input.Device_LaneConfig_ID && input.Device_MainVersion && input.Store_Company_ID  && !input.Store_Brand_ID) {
        output.key = 'requiredBrandId'
      }
      output.status = false
      callback(output)
    } else {
      callback()
    }
}

module.exports = {
    validateDevice,
    validateMasterSettings
}
