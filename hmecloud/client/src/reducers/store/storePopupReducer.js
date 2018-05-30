import * as storePopupDetails from '../../actionTypes/StoreDetailsPopup/storeDetailsPopup'

const initialState = {
  storePopupDetails:
    {
      'storeDetails': {
        'Brand_Name': "McDonald's",
        'Store_Number': '303',
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
        'Country_Name': 'United States',
        'Group_ID': null,
        'Group_Name': 'Drive-thru',
        'GroupName': null,
        'User_EmailAddress': 'tpstorytester+303@gmail.com'
      },
      'Device_Details': [
        {
          'Device_Name': 'EOS',
          'Device_UID': '60A980CE-3038-4B3F-9495-BB3F61EEEC88',
          'Device_IsActive': 0,
          'Device_SettingVersion': 'A.2.01',
          'Device_SerialNumber': '',
          'Device_MainVersion': '2.01.17',
          'Store_Number': '303',
          'Brand_Name': "McDonald's"
        },
        {
          'Device_Name': 'EOS',
          'Device_UID': 'D8B1E421-C70A-4A8D-ABD7-7E32F2BA2D2A',
          'Device_IsActive': 1,
          'Device_SettingVersion': 'A.2.01',
          'Device_SerialNumber': '',
          'Device_MainVersion': '2.01.17',
          'Store_Number': '303',
          'Brand_Name': "McDonald's"
        },
        {
          'Device_Name': 'CIB',
          'Device_UID': 'C21D60C3-C63A-43C7-A5A6-D56048B8AAE4',
          'Device_IsActive': 1,
          'Device_SettingVersion': 'A2.12.2',
          'Device_SerialNumber': 'AZUREUAT2',
          'Device_MainVersion': '2.12.12',
          'Store_Number': '303',
          'Brand_Name': "McDonald's"
        },
        {
          'Device_Name': 'ZOOM',
          'Device_UID': 'F141D470-960D-4B99-A52A-7001700820F6',
          'Device_IsActive': 1,
          'Device_SettingVersion': 'A.2.00',
          'Device_SerialNumber': '00000304',
          'Device_MainVersion': '2.31.7.999',
          'Store_Number': '303',
          'Brand_Name': "McDonald's"
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
