import * as masterSettings from '../../actionTypes/MasterSettings/masterSettings'

const masterSettingsData = {
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
