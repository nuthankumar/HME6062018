import * as storeDetails from '../../actionTypes/StoreDetails/storeDetails'

const initialState = {
  storeDetails: {
    'storeList': [
      {
        'ID': null,
        'Brand_Name': null,
        'Store_UID': null,
        'Store_Number': null,
        'Store_Name': null,
        'Store_AddressLine1': null,
        'Store_Locality': null,
        'Store_Region': null,
        'Store_ID': null,
        'Store_Company_ID': null,
        'Group_Name': '',
        'Device_Details': [
          {
            'Device_Name': null,
            'Device_MainVersion': null,
            'Device_IsActive': null,
            'Device_ID': null,
            'Device_UID': null,
            'Device_DeviceType_ID': null,
            'Device_LaneConfig_ID': null,
            'Device_EmailAccount': null,
            'Device_Timezone_ID': null
          }
        ]
      }
    ],
    'userPermessions': [
    ],
    'status': null
  },
  adminStoreDetails: {
    'storeList': [
      {
        'ID': null,
        'Brand_Name': null,
        'Store_UID': null,
        'Store_Number': null,
        'Store_Name': null,
        'Store_AddressLine1': null,
        'Store_Locality': null,
        'Store_Region': null,
        'Store_ID': null,
        'Store_Company_ID': null,
        'Group_Name': '',
        'Device_Details': [
          {
            'Device_Name': null,
            'Device_MainVersion': null,
            'Device_IsActive': null,
            'Device_ID': null,
            'Device_UID': null,
            'Device_DeviceType_ID': null,
            'Device_LaneConfig_ID': null,
            'Device_EmailAccount': null,
            'Device_Timezone_ID': null
          }
        ]
      }
    ],
    'userPermessions': [
    ],
    'status': null
  }
}

export default function StoreDetails(state = initialState, action) {
  switch (action.type) {
    case storeDetails.INIT_STORESDETAILS:
      state.storeDetails = action.storeDetails
      return {
        ...state
        // storeDetails: action.storeDetails
      }
    case storeDetails.SET_SORT_PARAMS:
      return {
        ...state,
        sortParams: action.sortParams
      }
    case storeDetails.ADMIN_STORESDETAILS:
      state.adminStoreDetails = action.adminStoreDetails
      return {
        ...state
      }
    case storeDetails.PAGINATION_STORESDETAILS:
      return {
        ...state,
        paginationParams: action.paginationParams
      }
    default:
      return state
  }
}
