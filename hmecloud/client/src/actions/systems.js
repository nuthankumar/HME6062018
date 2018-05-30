import * as systems from '../actionTypes/Systems/Systems'
import Api from '../Api'
import { Config } from '../Config'
import { CommonConstants } from '../Constants'
// import AuthenticationService from '../components/Security/AuthenticationService'

function getSystemsSuccess (stores) {
  return {
    type: systems.GET_SYSTEMS,
    systemDetails: stores
  }
}

export const getSystems = () => {
  this.api = new Api()
  let url = Config.apiBaseUrl + CommonConstants.apiUrls.getStores + '?isAdmin=1&psize=10&pno=1'
  return (dispatch, getState) => {
    const state = getState()
    if (state.systems.searchParams) {
      url = url + '&criteria=' + state.systems.searchParams.criteria + '&filter=' + state.systems.searchParams.filter
    }
    if (state.systems.sortParams) {
      url = url + '&Sortby=' + state.systems.sortParams.sortBy + '&sortType=' + state.systems.sortParams.sortType
    }
    console.log(url)
    this.api.getData(url, data => {
      let systems = {
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
            'Store_Number': 1231231,
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
        'totalRecordCount': {
          'NoOfPage': 1,
          'TotalRecord': 2
        },
        'status': true
      }
      dispatch(getSystemsSuccess(systems))
    })
  }
}

export const sortSystems = (sortParams) => {
  return {
    type: systems.SET_SORT_PARAMS_SYSTEMS,
    sortParams: sortParams
  }
}
export const paginationSystems = (paginationParams) => {
  return {
    type: systems.SET_PAGINATION_PARAMS,
    paginationParams: paginationParams
  }
}

export const setSearchParams = (searchParams) => {
  return {
    type: systems.SET_SEARCH_PARAMS_SYSTEMS,
    searchParams: searchParams
  }
}
