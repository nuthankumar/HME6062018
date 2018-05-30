import * as systems from '../../actionTypes/Systems/Systems'

const initialState = {
  systemDetails: {
    'deviceList': [
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '12J3456C',
        'Device_SettingVersion': 'A.2.30',
        'Device_UID': 'CEA1B9AB-838A-495C-86B8-D9B7A8FC5A4C',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Y Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.31.7'
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
