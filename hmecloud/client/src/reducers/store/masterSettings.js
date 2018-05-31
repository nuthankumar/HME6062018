import * as masterSettings from '../../actionTypes/MasterSettings/masterSettings'

const masterSettings = {
}
export default function (state = masterSettings, action) {
  switch (action.type) {
    case masterSettings.GET_SETTINGS:
      state.masterSettings = action.masterSettings
      return {
        ...state
      }
  }
  return state
}
