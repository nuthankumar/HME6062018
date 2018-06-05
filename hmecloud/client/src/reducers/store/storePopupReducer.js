import * as storePopupDetails from '../../actionTypes/StoreDetailsPopup/storeDetailsPopup'

const initialState = {
  storePopupDetails:
    {
      'storeDetails': {
        'Brand_Name': '',
        'Store_Number': '',
        'Store_Name': null,
        'Store_AddressLine1': '',
        'Store_AddressLine2': '',
        'Store_AddressLine3': '',
        'Store_AddressLine4': '',
        'Store_PhoneNumber': '',
        'Store_FaxNumber': '',
        'Store_Locality': '',
        'Store_Region': '',
        'Store_PostCode': '',
        'Country_ID': 1,
        'Country_Name': '',
        'Group_ID': null,
        'Group_Name': '',
        'GroupName': null,
        'User_EmailAddress': ''
      },
      'Device_Details': [
        {
          'Device_Name': '',
          'Device_UID': '',
          'Device_IsActive': 0,
          'Device_SettingVersion': '',
          'Device_SerialNumber': '',
          'Device_MainVersion': '',
          'Store_Number': '',
          'Brand_Name': ''
        }
      ],
      'status': true
    }

}

export default function StorePopupDetails (state = initialState, action) {
  switch (action.type) {
    case storePopupDetails.INIT_STORE_POPUP:
      return {
        ...state,
        storePopupDetails: action.payload
      }
      break
    case 'OPEN_POPUP':
      if (action.payload) {
        state.storePopUpAdmin = true
        state.storePopUpDetailisAdmin = action.payload
      } else {
        state.storePopUpClient = true
        state.storePopUpDetailisAdmin = action.payload
      }

      return {
        ...state
      }
      break
    case 'CLOSE_POPUP':
      state.storePopUpAdmin = false
      state.storePopUpClient = false
      return {
        ...state

      }
    case 'MERGE_OPEN_POPUP':
      state.mergePopUp = true
      return {
        ...state
      }
      break
    case 'MERGE_CLOSE_POPUP':
      state.mergePopUp = false
      return {
        ...state
      }
      break
    default:
      return state
  }
}
