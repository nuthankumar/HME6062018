import * as masterSettings from '../../actionTypes/MasterSettings/masterSettings'

const masterSettingsData = { settingsList:[],
  destinationList:[],
  masterSettings : {settingsList:[],
    destinationList:[]}
}
export default function MasterSettings (state = masterSettingsData, action) {
  switch (action.type) {
    case masterSettings.GET_SETTINGS:
      state.masterSettings = action.masterSettings
      return {
        ...state
      }
  }
  return state
}
