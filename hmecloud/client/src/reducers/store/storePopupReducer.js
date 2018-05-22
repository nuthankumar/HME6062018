import * as storePopupDetails from "../../actionTypes/StoreDetailsPopup/storeDetailsPopup";

const initialState = {
    storePopupDetails : {
        "storeDetails": {
            "Brand_Name": "",
            "Store_Number": "",
            "Store_Name": null,
            "Store_AddressLine1": "",
            "Store_AddressLine2": "",
            "Store_AddressLine3": "",
            "Store_AddressLine4": "",
            "Store_PhoneNumber": "",
            "Store_FaxNumber": "",
            "Store_Locality": "",
            "Store_Region": "",
            "Store_PostCode": "",
            "Country_ID": null,
            "Country_Name": "",
            "Group_ID": null,
            "Group_Name": "",
            "GroupName": null,
            "User_EmailAddress": "",
            "timeZone" : []
        },
        "deviceDetails": {
            "EOS": [
                {
                    "Device_Name": "",
                    "Device_UID": "",
                    "Device_IsActive": null,
                    "Device_SettingVersion": "",
                    "Device_SerialNumber": "",
                    "Device_MainVersion": "",
                    "Store_Number": "",
                    "Brand_Name": ""
                },
                {
                    "Device_Name": "",
                    "Device_UID": "",
                    "Device_IsActive": null,
                    "Device_SettingVersion": "",
                    "Device_SerialNumber": "",
                    "Device_MainVersion": "",
                    "Store_Number": "",
                    "Brand_Name": ""
                }
            ],
            "CIB": [
                {
                    "Device_Name": "",
                    "Device_UID": "",
                    "Device_IsActive": null,
                    "Device_SettingVersion": "",
                    "Device_SerialNumber": "",
                    "Device_MainVersion": "",
                    "Store_Number": "",
                    "Brand_Name": "",
                    "Email": ""
                }
            ],
            "ZOOM": [
                {
                    "Device_Name": "",
                    "Device_UID": "",
                    "Device_IsActive": null,
                    "Device_SettingVersion": "",
                   "Device_SerialNumber": "",
                    "Device_MainVersion": "",
                    "Store_Number": "",
                    "Brand_Name": ""
                }
            ]
        },
        "status": true
    }
    
}




export default function StorePopupDetails(state = initialState, action) {
    switch (action.type) {
        case storePopupDetails.INIT_STORE_POPUP:
            return {
                ...state,
                storePopupDetails: action.payload
            };
        default:
            return state;
    }

}



