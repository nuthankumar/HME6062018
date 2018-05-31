import * as storeDetails from '../../actionTypes/StoreDetails/storeDetails'

const viewDetails = {
  storeViewDetails: {
    systemStatus: [
      {
        'Store_ID': null,
        'Store_UID': '',
        Store_Type_ID: null,
        Store_Company_ID: null,
        Store_Account_ID: null,
        Store_Brand_ID: null,
        Store_IsOptedIn: null,
        Store_Name: null,
        Store_Number: null,
        Store_PhoneNumber: null,
        Store_FaxNumber: null,
        Store_IsActive: null,
        Store_AddressLine1: null,
        Store_AddressLine2: null,
        Store_AddressLine3: null,
        Store_AddressLine4: null,
        Store_Locality: null,
        Store_Region: null,
        Store_PostCode: null,
        Store_Country_ID: null,
        Store_LastMod_DTS: null,
        Store_Created_DTS: null,
        Store_CreatedBy: null,
        Store_IsDeleted: null,
        Device_ID: null,
        Device_UID: null,
        Device_Store_ID: null,
        Device_DeviceType_ID: null,
        Device_IsActive: null,
        Device_IsPaired: null,
        Device_Client_ID: null,
        Device_EmailAccount: null,
        Device_SerialNumber: null,
        Device_MacAddress: null,
        Device_InstallDate: null,
        Device_LicenseExpirationDate: null,
        Device_ProductionBuildDate: null,
        Device_LaneConfig_ID: null,
        Device_Activation_Code: null,
        Device_MainVersion: null,
        Device_SettingVersion: null,
        Device_LastMod_DTS: null,
        Device_Created_DTS: null,
        Device_CreatedBy: null,
        Device_OSVersion: null,
        Device_ParentDevice_ID: null,
        Device_Unit_ID: null,
        Device_Timezone_ID: null,
        Device_ServerInstance: null
      }
    ],
    systemSettings: [
      {
        name: 'Dashboard Settings Group',
        value: [
          {
            SettingInfo_Setting_ID: null,
            DeviceSetting_Device_ID: null,
            SettingInfo_Name: null,
            Device_Store_ID: null,
            DeviceSetting_SettingValue: null,
            SettingsGroup_ID: null,
            SettingsGroup_Name: null
          }]}]
  }
}
export default function (state = viewDetails, action) {
  console.log("inside viewDetails ", state, action);
  switch (action.type) {
    
    case storeDetails.INIT_STORES_VIEW_DETAILS:
      state.storeViewDetails = action.storeViewDetails
      return {
        ...state
      }
  }
  return state
}
