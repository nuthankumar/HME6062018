// export function getDetails(name) {

//     return {
//         type: 'STORE_DETAILS',
//         payload: {

//         }

//     }
// }
import * as storeDetails from "../actionTypes/StoreDetails/storeDetails";
// import {User} from "../components/User/User"
export const initStoresDetails = () => {
    return {
        type: storeDetails.INIT_STORESDETAILS,        
        storeDetails:[
            {
                Brand_Name: "Store6 Sample Description",
                Store_Number: "1110119",
                Store_Name: "Store10",
                Store_UID: "F4E32725A81D45EBB82C1F551A493BE7",
                Store_Locality: "",
                Store_Region: "",
                Store_AddressLine1: "14110 Stowe Dr20",
                Device_Name: null,
                Device_MainVersion: null,
                Device_IsActive: null,
                Device_UID: null,
                Device_EmailAccount: null
            },
            {
                Brand_Name: "Store6 Sample Description",
                Store_Number: "1110119",
                Store_Name: "Store10",
                Store_UID: "F4E32725A81D45EBB82C1F551A493BE7",
                Store_Locality: "",
                Store_Region: "",
                Store_AddressLine1: "14110 Stowe Dr20",
                Device_Name: null,
                Device_MainVersion: null,
                Device_IsActive: null,
                Device_UID: null,
                Device_EmailAccount: null
            }
        ],
        userPermessions: [
            "AddDevice",
            "AddUser",
            "EditStoreAdvanced",
            "EditStoreBasic",
            "EditUser",
            "RemoteConnect",
            "RemoveUser"
        ],
        pageDetails: {
            RecordCount: 79,
            TotalPages: 0
        },
        status: true
    }
};