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
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '00N9915C',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': 'A8182192-9249-4CC8-8C33-9EEEC0FAD82A',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.338'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '28R05064',
        'Device_SettingVersion': 'N.2.00',
        'Device_UID': '77C30C3E-33A0-4798-BBAE-FCF069296E76',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.325'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '46N03279',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': 'A90071BF-DFD1-4372-BF80-E71807C1E545',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.332'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '28R05063',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': '2BFCA70C-67D5-4319-AD3A-D847125162CD',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.325'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': 'RACKV200',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': '5971995A-7894-42BC-A854-7A1A1C5868AE',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.338'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '48L0009C',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': 'D65DB02B-50FC-4C5C-ADE4-1125917175D6',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.332'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': 'F42N0005',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': '39CED401-6F05-4154-8462-F8B7279E67B8',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Y Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.338'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': 'E22PA924',
        'Device_SettingVersion': 'N.2.00',
        'Device_UID': 'A8F52766-F713-4427-AC2D-9790A6FE9B7A',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.00.319'
      },
      {
        'Device_Name': 'ZOOM',
        'Store_Number': null,
        'Device_SerialNumber': '4T000499',
        'Device_SettingVersion': 'A.2.00',
        'Device_UID': 'D69775F3-B0AE-4FFF-80F9-0F280D3953BC',
        'DeviceType_ID': 1,
        'LaneConfig_Name': 'Single Lane',
        'Brand_Name': null,
        'Device_IsActive': 0,
        'Device_ModelName': 'CU40',
        'Device_MainVersion': '2.10.11'
      }
    ],
    'status': true
  },  
  sortParams: {sortBy: 'Company_Name', sortType: 'ASC'},
  searchParams: {filter: null, criteria: 'ASC'}
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
