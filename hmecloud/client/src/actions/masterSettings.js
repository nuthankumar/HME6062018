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
    const state = getState()
  


    // let url = Config.apiBaseUrl + CommonConstants.apiUrls.getSettingsDevices + '?duid=' + duid
    // return (dispatch) => {
    //   this.api.getData(url, data => {
    //     dispatch(getStoreSuccess(data))
    //   })
    // }
    console.log(getState().viewDetails.storeViewDetails)
    let params = {
      'Device_ID': 4498,
      'Device_LaneConfig_ID': 1,
      'Device_MainVersion': '2.01.17',
      'Store_Company_ID': 1353,
      'Store_Brand_ID': 17
    }
    this.api.postData(url, params, data => {
      let settings = data
      console.log(settings)

      let settingsList = []
      settings.settingsList.map(function (setting, index) {
        settingsList.push({id: setting.group_id, label: setting.group_name, checked: false})
      })
      let destinationList = []
      settings.destinationList.map(function (setting, index) {
        destinationList.push({DestinationId: setting.Device_ID, label: setting.Store_Number, checked: false})
      })

      let masterSettings = {settingsList: settingsList, destinationList: destinationList}
      dispatch(getMasterSettingsSuccess(masterSettings))
    })
  }
}
