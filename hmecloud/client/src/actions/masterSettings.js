import * as MasterSettings from '../actionTypes/MasterSettings/masterSettings'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getMasterSettingsSuccess (device) {
  return {
    type: MasterSettings.GET_SETTINGS,
    masterSettings: device
  }
}

export const getMasterSettings = (params) => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getMasterSettings
  return (dispatch, getState) => {
    // const state = getState()
    let params = {
      'Device_ID': 4498,
      'Device_LaneConfig_ID': 1,
      'Device_MainVersion': '2.01.17',
      'Store_Company_ID': 1353,
      'Store_Brand_ID': 17
    }
    this.api.postData(url, params, data => {
      let device = data
      dispatch(getMasterSettingsSuccess(device))
    })  
  }
}
