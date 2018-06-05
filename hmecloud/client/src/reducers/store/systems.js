import * as systems from '../../actionTypes/Systems/Systems'

const initialState = {
  systemDetails: {
    'deviceList': [
      {
        'Device_Name': '',
        'Store_Number': null,
        'Device_SerialNumber': '',
        'Device_SettingVersion': '',
        'Device_UID': '',
        'DeviceType_ID': 1,
        'LaneConfig_Name': '',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': '',
        'Device_MainVersion': ''
      }
    ],
    'status': true
  },
  sortParams: {sortBy: 'Company_Name', sortType: 'ASC'},
  searchParams: {filter: null, criteria: null}
}

export default function systemDetails (state = initialState, action) {
  switch (action.type) {
    case systems.GET_SYSTEMS:
      state.systemDetails = action.systemDetails
      return {
        ...state
        // storeDetails: action.storeDetails
      }
    case systems.SET_SORT_PARAMS_SYSTEMS:
      state.sortParams = action.sortParams
      return {
        ...state
        // storeDetails: action.storeDetails
      }
    case systems.SET_PAGINATION_PARAMS:
      state.paginationParams = action.paginationParams
      return {
        ...state
        // storeDetails: action.storeDetails
      }

    case systems.SET_SEARCH_PARAMS_SYSTEMS:
      state.searchParams = action.searchParams
      return {
        ...state
        // storeDetails: action.storeDetails
      }
    default:
      return state
  }
}
