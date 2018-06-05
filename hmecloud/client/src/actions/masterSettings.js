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

export const getMasterSettings = (duid) => {
  this.api = new Api()
  return (dispatch, getState) => {
    let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSettingsDevices + '?duid=' + duid
    this.api.getData(url, data => {
      let url = Config.apiBaseUrl + CommonConstants.apiUrls.getMasterSettings
      let storeViewDetails = data
      let systemStatus = data.systemStatus[0]
      let params = {
        'Device_ID': systemStatus.Device_ID,
        'Device_LaneConfig_ID': systemStatus.Device_LaneConfig_ID,
        'Device_MainVersion': systemStatus.Device_MainVersion,
        'Store_Company_ID': systemStatus.Store_Company_ID,
        'Store_Brand_ID': systemStatus.Store_Brand_ID
      }
      this.api.postData(url, params, data => {
        let settings = data
        let settingsList = []
        settings.settingsList.map(function (setting, index) {
          settingsList.push({id: setting.group_id, label: setting.group_name, checked: false})
        })
        let destinationList = []
        settings.destinationList.map(function (setting, index) {
          destinationList.push({DestinationId: setting.Device_ID, label: setting.Store_Number, checked: false})
        })

        let masterSettings = {settingsList: settingsList, destinationList: destinationList, storeViewDetails: storeViewDetails}
        dispatch(getMasterSettingsSuccess(masterSettings))
      })
    })
  }
}
